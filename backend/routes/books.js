const express = require("express");
const router = express.Router();
const { pool } = require("../config/database");
const { body, validationResult, query } = require("express-validator");
const logger = require("../utils/logger");

/**
 * @desc    Get all books with pagination and search
 * @route   GET /api/books
 * @access  Public (Phase 1)
 */
router.get(
  "/",
  [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
    query("search")
      .optional()
      .isLength({ max: 255 })
      .withMessage("Search term too long"),
    query("category")
      .optional()
      .isInt()
      .withMessage("Category must be a valid ID"),
    query("department")
      .optional()
      .isLength({ max: 100 })
      .withMessage("Department name too long"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: "error",
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const search = req.query.search || "";
      const categoryFilter = req.query.category || "";
      const departmentFilter = req.query.department || "";

      // Build dynamic query
      let whereClause = "WHERE 1=1";
      let queryParams = [];

      if (search) {
        whereClause +=
          " AND (b.title LIKE ? OR b.author LIKE ? OR b.accession_number LIKE ?)";
        queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      if (categoryFilter) {
        whereClause += " AND b.category_id = ?";
        queryParams.push(categoryFilter);
      }

      if (departmentFilter) {
        whereClause += " AND b.department LIKE ?";
        queryParams.push(`%${departmentFilter}%`);
      }

      // Get total count for pagination
      const countQuery = `
      SELECT COUNT(*) as total 
      FROM books b 
      LEFT JOIN categories c ON b.category_id = c.id 
      ${whereClause}
    `;

      const [countResult] = await pool.execute(countQuery, queryParams);
      const totalBooks = countResult[0].total;

      // Get books with pagination
      const booksQuery = `
      SELECT 
        b.id,
        b.accession_number,
        b.title,
        b.author,
        b.isbn,
        b.department,
        b.publisher,
        b.published_year,
        b.edition,
        b.pages,
        b.shelf_number,
        b.total_copies,
        b.available_copies,
        b.price,
        c.name as category_name,
        CASE WHEN b.available_copies > 0 THEN 'Available' ELSE 'Not Available' END as status
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      ${whereClause}
      ORDER BY b.accession_number
      LIMIT ? OFFSET ?
    `;

      queryParams.push(limit, offset);
      const [books] = await pool.execute(booksQuery, queryParams);

      const pagination = {
        currentPage: page,
        totalPages: Math.ceil(totalBooks / limit),
        totalBooks,
        limit,
        hasNext: page < Math.ceil(totalBooks / limit),
        hasPrev: page > 1,
      };

      res.status(200).json({
        status: "success",
        data: {
          books,
          pagination,
        },
      });
    } catch (error) {
      logger.error("Error fetching books:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }
);

/**
 * @desc    Get single book by ID
 * @route   GET /api/books/:id
 * @access  Public (Phase 1)
 */
router.get("/:id", async (req, res) => {
  try {
    const bookId = req.params.id;

    const [books] = await pool.execute(
      `
      SELECT 
        b.*,
        c.name as category_name
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.id = ?
    `,
      [bookId]
    );

    if (books.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Book not found",
      });
    }

    // Get issue history for this book
    const [issueHistory] = await pool.execute(
      `
      SELECT 
        ib.*,
        s.register_number,
        s.name as student_name,
        s.department as student_department
      FROM issued_books ib
      JOIN students s ON ib.student_id = s.id
      WHERE ib.book_id = ?
      ORDER BY ib.issue_date DESC
      LIMIT 10
    `,
      [bookId]
    );

    res.status(200).json({
      status: "success",
      data: {
        book: books[0],
        issueHistory,
      },
    });
  } catch (error) {
    logger.error("Error fetching book details:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

/**
 * @desc    Add new book
 * @route   POST /api/books
 * @access  Public (Phase 1)
 */
router.post(
  "/",
  [
    body("accession_number")
      .notEmpty()
      .isLength({ max: 20 })
      .withMessage(
        "Accession number is required and must be max 20 characters"
      ),
    body("title")
      .notEmpty()
      .isLength({ max: 255 })
      .withMessage("Title is required and must be max 255 characters"),
    body("author")
      .notEmpty()
      .isLength({ max: 255 })
      .withMessage("Author is required and must be max 255 characters"),
    body("isbn")
      .optional()
      .isLength({ max: 13 })
      .withMessage("ISBN must be max 13 characters"),
    body("category_id")
      .optional()
      .isInt()
      .withMessage("Category ID must be a valid integer"),
    body("department")
      .optional()
      .isLength({ max: 100 })
      .withMessage("Department must be max 100 characters"),
    body("publisher")
      .optional()
      .isLength({ max: 255 })
      .withMessage("Publisher must be max 255 characters"),
    body("published_year")
      .optional()
      .isInt({ min: 1900, max: new Date().getFullYear() })
      .withMessage("Published year must be valid"),
    body("edition")
      .optional()
      .isLength({ max: 50 })
      .withMessage("Edition must be max 50 characters"),
    body("pages")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Pages must be a positive integer"),
    body("shelf_number")
      .optional()
      .isLength({ max: 20 })
      .withMessage("Shelf number must be max 20 characters"),
    body("total_copies")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Total copies must be a positive integer"),
    body("price")
      .optional()
      .isDecimal()
      .withMessage("Price must be a valid decimal"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: "error",
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const {
        accession_number,
        title,
        author,
        isbn,
        category_id,
        department,
        publisher,
        published_year,
        edition,
        pages,
        shelf_number,
        total_copies = 1,
        price,
      } = req.body;

      // Check if accession number already exists
      const [existingBook] = await pool.execute(
        "SELECT id FROM books WHERE accession_number = ?",
        [accession_number]
      );

      if (existingBook.length > 0) {
        return res.status(400).json({
          status: "error",
          message: "Book with this accession number already exists",
        });
      }

      // Insert new book
      const [result] = await pool.execute(
        `
      INSERT INTO books (
        accession_number, title, author, isbn, category_id, department,
        publisher, published_year, edition, pages, shelf_number,
        total_copies, available_copies, price
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
        [
          accession_number,
          title,
          author,
          isbn,
          category_id,
          department,
          publisher,
          published_year,
          edition,
          pages,
          shelf_number,
          total_copies,
          total_copies,
          price,
        ]
      );

      // Get the created book
      const [newBook] = await pool.execute(
        `
      SELECT b.*, c.name as category_name
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.id = ?
    `,
        [result.insertId]
      );

      res.status(201).json({
        status: "success",
        message: "Book added successfully",
        data: newBook[0],
      });

      logger.info(`New book added: ${accession_number} - ${title}`);
    } catch (error) {
      logger.error("Error adding book:", error);

      if (error.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          status: "error",
          message: "Book with this accession number already exists",
        });
      }

      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }
);

/**
 * @desc    Update book
 * @route   PUT /api/books/:id
 * @access  Public (Phase 1)
 */
router.put(
  "/:id",
  [
    body("title")
      .optional()
      .isLength({ max: 255 })
      .withMessage("Title must be max 255 characters"),
    body("author")
      .optional()
      .isLength({ max: 255 })
      .withMessage("Author must be max 255 characters"),
    body("isbn")
      .optional()
      .isLength({ max: 13 })
      .withMessage("ISBN must be max 13 characters"),
    body("total_copies")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Total copies must be a positive integer"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: "error",
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const bookId = req.params.id;
      const updateFields = req.body;

      // Check if book exists
      const [existingBook] = await pool.execute(
        "SELECT * FROM books WHERE id = ?",
        [bookId]
      );

      if (existingBook.length === 0) {
        return res.status(404).json({
          status: "error",
          message: "Book not found",
        });
      }

      // If updating total_copies, ensure it's not less than issued copies
      if (updateFields.total_copies) {
        const [issuedCount] = await pool.execute(
          'SELECT COUNT(*) as count FROM issued_books WHERE book_id = ? AND status = "issued"',
          [bookId]
        );

        if (updateFields.total_copies < issuedCount[0].count) {
          return res.status(400).json({
            status: "error",
            message: `Cannot reduce total copies below ${issuedCount[0].count} (currently issued)`,
          });
        }

        // Update available copies accordingly
        updateFields.available_copies =
          updateFields.total_copies - issuedCount[0].count;
      }

      // Build update query dynamically
      const updateKeys = Object.keys(updateFields);
      const updateValues = Object.values(updateFields);

      if (updateKeys.length === 0) {
        return res.status(400).json({
          status: "error",
          message: "No fields to update",
        });
      }

      const setClause = updateKeys.map((key) => `${key} = ?`).join(", ");

      await pool.execute(
        `UPDATE books SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [...updateValues, bookId]
      );

      // Get updated book
      const [updatedBook] = await pool.execute(
        `
      SELECT b.*, c.name as category_name
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.id = ?
    `,
        [bookId]
      );

      res.status(200).json({
        status: "success",
        message: "Book updated successfully",
        data: updatedBook[0],
      });

      logger.info(`Book updated: ID ${bookId}`);
    } catch (error) {
      logger.error("Error updating book:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }
);

/**
 * @desc    Delete book
 * @route   DELETE /api/books/:id
 * @access  Public (Phase 1)
 */
router.delete("/:id", async (req, res) => {
  try {
    const bookId = req.params.id;

    // Check if book exists
    const [existingBook] = await pool.execute(
      "SELECT * FROM books WHERE id = ?",
      [bookId]
    );

    if (existingBook.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Book not found",
      });
    }

    // Check if book has any active issues
    const [activeIssues] = await pool.execute(
      'SELECT COUNT(*) as count FROM issued_books WHERE book_id = ? AND status = "issued"',
      [bookId]
    );

    if (activeIssues[0].count > 0) {
      return res.status(400).json({
        status: "error",
        message: "Cannot delete book with active issues",
      });
    }

    await pool.execute("DELETE FROM books WHERE id = ?", [bookId]);

    res.status(200).json({
      status: "success",
      message: "Book deleted successfully",
    });

    logger.info(`Book deleted: ID ${bookId} - ${existingBook[0].title}`);
  } catch (error) {
    logger.error("Error deleting book:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

/**
 * @desc    Get available books for issue
 * @route   GET /api/books/available
 * @access  Public (Phase 1)
 */
router.get("/status/available", async (req, res) => {
  try {
    const [books] = await pool.execute(`
      SELECT 
        b.id,
        b.accession_number,
        b.title,
        b.author,
        b.department,
        b.shelf_number,
        b.available_copies,
        c.name as category_name
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.available_copies > 0
      ORDER BY b.accession_number
    `);

    res.status(200).json({
      status: "success",
      data: books,
    });
  } catch (error) {
    logger.error("Error fetching available books:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

module.exports = router;
