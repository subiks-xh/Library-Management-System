const express = require("express");
const router = express.Router();
const { pool } = require("../config/database");
const { body, validationResult } = require("express-validator");
const logger = require("../utils/logger");

/**
 * @desc    Issue book to student
 * @route   POST /api/issues
 * @access  Public (Phase 1)
 */
router.post(
  "/",
  [
    body("student_register_number")
      .notEmpty()
      .withMessage("Student register number is required"),
    body("book_id").isInt().withMessage("Valid book ID is required"),
    body("issue_days")
      .optional()
      .isInt({ min: 1, max: 30 })
      .withMessage("Issue days must be between 1 and 30"),
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
        student_register_number,
        book_id,
        issue_days = 14,
        notes = "",
      } = req.body;

      const registerNumber = student_register_number.toUpperCase();

      // Start transaction
      const connection = await pool.getConnection();
      await connection.beginTransaction();

      try {
        // Get student details
        const [students] = await connection.execute(
          'SELECT * FROM students WHERE register_number = ? AND status = "active"',
          [registerNumber]
        );

        if (students.length === 0) {
          await connection.rollback();
          return res.status(404).json({
            status: "error",
            message: "Active student not found with this register number",
          });
        }

        const student = students[0];

        // Get book details
        const [books] = await connection.execute(
          "SELECT * FROM books WHERE id = ?",
          [book_id]
        );

        if (books.length === 0) {
          await connection.rollback();
          return res.status(404).json({
            status: "error",
            message: "Book not found",
          });
        }

        const book = books[0];

        // Check if book is available
        if (book.available_copies <= 0) {
          await connection.rollback();
          return res.status(400).json({
            status: "error",
            message: "Book is not available for issue",
          });
        }

        // Check if student already has this book
        const [existingIssue] = await connection.execute(
          'SELECT id FROM issued_books WHERE student_id = ? AND book_id = ? AND status = "issued"',
          [student.id, book_id]
        );

        if (existingIssue.length > 0) {
          await connection.rollback();
          return res.status(400).json({
            status: "error",
            message: "Student already has this book issued",
          });
        }

        // Check student's current issue limit
        const [currentIssues] = await connection.execute(
          'SELECT COUNT(*) as count FROM issued_books WHERE student_id = ? AND status = "issued"',
          [student.id]
        );

        const [settings] = await connection.execute(
          'SELECT setting_value FROM library_settings WHERE setting_key = "max_books_per_student"'
        );

        const maxBooks = parseInt(settings[0]?.setting_value || "3");

        if (currentIssues[0].count >= maxBooks) {
          await connection.rollback();
          return res.status(400).json({
            status: "error",
            message: `Student cannot issue more than ${maxBooks} books at once`,
          });
        }

        // Check for pending fines
        const [pendingFines] = await connection.execute(
          'SELECT SUM(fine_amount - paid_amount) as pending FROM fines WHERE student_id = ? AND status = "pending"',
          [student.id]
        );

        if (pendingFines[0].pending > 0) {
          await connection.rollback();
          return res.status(400).json({
            status: "error",
            message: `Student has pending fines of ₹${pendingFines[0].pending}. Please clear fines before issuing new books.`,
          });
        }

        // Calculate due date
        const issueDate = new Date();
        const dueDate = new Date(issueDate);
        dueDate.setDate(dueDate.getDate() + issue_days);

        // Issue the book
        const [issueResult] = await connection.execute(
          `
        INSERT INTO issued_books (student_id, book_id, issue_date, due_date, status, notes)
        VALUES (?, ?, ?, ?, 'issued', ?)
      `,
          [
            student.id,
            book_id,
            issueDate.toISOString().split("T")[0],
            dueDate.toISOString().split("T")[0],
            notes,
          ]
        );

        // Update book availability
        await connection.execute(
          "UPDATE books SET available_copies = available_copies - 1 WHERE id = ?",
          [book_id]
        );

        await connection.commit();
        connection.release();

        // Get the complete issue details
        const [issueDetails] = await pool.execute(
          `
        SELECT 
          ib.*,
          s.register_number,
          s.name as student_name,
          s.department,
          s.year,
          b.accession_number,
          b.title,
          b.author
        FROM issued_books ib
        JOIN students s ON ib.student_id = s.id
        JOIN books b ON ib.book_id = b.id
        WHERE ib.id = ?
      `,
          [issueResult.insertId]
        );

        res.status(201).json({
          status: "success",
          message: "Book issued successfully",
          data: issueDetails[0],
        });

        logger.info(
          `Book issued: ${book.accession_number} to ${registerNumber}`
        );
      } catch (error) {
        await connection.rollback();
        connection.release();
        throw error;
      }
    } catch (error) {
      logger.error("Error issuing book:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }
);

/**
 * @desc    Return book
 * @route   PUT /api/issues/:id/return
 * @access  Public (Phase 1)
 */
router.put("/:id/return", async (req, res) => {
  try {
    const issueId = req.params.id;
    const { notes = "" } = req.body;

    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Get issue details
      const [issues] = await connection.execute(
        `
        SELECT 
          ib.*,
          s.register_number,
          s.name as student_name,
          b.accession_number,
          b.title,
          b.author
        FROM issued_books ib
        JOIN students s ON ib.student_id = s.id
        JOIN books b ON ib.book_id = b.id
        WHERE ib.id = ? AND ib.status = 'issued'
      `,
        [issueId]
      );

      if (issues.length === 0) {
        await connection.rollback();
        return res.status(404).json({
          status: "error",
          message: "Active issue not found",
        });
      }

      const issue = issues[0];
      const returnDate = new Date();
      const dueDate = new Date(issue.due_date);

      // Calculate fine if overdue
      let fineAmount = 0;
      if (returnDate > dueDate) {
        const overdueDays = Math.ceil(
          (returnDate - dueDate) / (1000 * 60 * 60 * 24)
        );

        // Get fine per day from settings
        const [fineSettings] = await connection.execute(
          'SELECT setting_value FROM library_settings WHERE setting_key = "fine_per_day"'
        );

        const finePerDay = parseFloat(fineSettings[0]?.setting_value || "1.00");
        fineAmount = overdueDays * finePerDay;
      }

      // Update issued book record
      await connection.execute(
        `
        UPDATE issued_books 
        SET return_date = ?, status = 'returned', fine_amount = ?, notes = ?
        WHERE id = ?
      `,
        [returnDate.toISOString().split("T")[0], fineAmount, notes, issueId]
      );

      // Update book availability
      await connection.execute(
        "UPDATE books SET available_copies = available_copies + 1 WHERE id = ?",
        [issue.book_id]
      );

      // Create fine record if applicable
      if (fineAmount > 0) {
        await connection.execute(
          `
          INSERT INTO fines (student_id, issued_book_id, fine_amount, reason, status)
          VALUES (?, ?, ?, ?, 'pending')
        `,
          [
            issue.student_id,
            issueId,
            fineAmount,
            `Late return - ${Math.ceil(
              (returnDate - dueDate) / (1000 * 60 * 60 * 24)
            )} days overdue`,
          ]
        );
      }

      await connection.commit();
      connection.release();

      // Get updated issue details
      const [updatedIssue] = await pool.execute(
        `
        SELECT 
          ib.*,
          s.register_number,
          s.name as student_name,
          s.department,
          b.accession_number,
          b.title,
          b.author
        FROM issued_books ib
        JOIN students s ON ib.student_id = s.id
        JOIN books b ON ib.book_id = b.id
        WHERE ib.id = ?
      `,
        [issueId]
      );

      res.status(200).json({
        status: "success",
        message:
          fineAmount > 0
            ? `Book returned successfully. Fine: ₹${fineAmount}`
            : "Book returned successfully",
        data: {
          issue: updatedIssue[0],
          fineAmount,
        },
      });

      logger.info(
        `Book returned: ${issue.accession_number} by ${issue.register_number}${
          fineAmount > 0 ? ` (Fine: ₹${fineAmount})` : ""
        }`
      );
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    logger.error("Error returning book:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

/**
 * @desc    Get all current issues
 * @route   GET /api/issues/current
 * @access  Public (Phase 1)
 */
router.get("/current", async (req, res) => {
  try {
    const [issues] = await pool.execute(`
      SELECT 
        ib.id,
        ib.issue_date,
        ib.due_date,
        ib.notes,
        s.register_number,
        s.name as student_name,
        s.department,
        s.year,
        b.accession_number,
        b.title,
        b.author,
        b.department as book_department,
        DATEDIFF(CURDATE(), ib.due_date) as days_overdue,
        CASE 
          WHEN ib.due_date < CURDATE() THEN 'overdue'
          WHEN DATEDIFF(ib.due_date, CURDATE()) <= 2 THEN 'due_soon'
          ELSE 'active'
        END as issue_status,
        CASE 
          WHEN ib.due_date < CURDATE() THEN DATEDIFF(CURDATE(), ib.due_date) * 1.00
          ELSE 0.00
        END as potential_fine
      FROM issued_books ib
      JOIN students s ON ib.student_id = s.id
      JOIN books b ON ib.book_id = b.id
      WHERE ib.status = 'issued'
      ORDER BY ib.due_date ASC, s.register_number ASC
    `);

    res.status(200).json({
      status: "success",
      data: issues,
    });
  } catch (error) {
    logger.error("Error fetching current issues:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

/**
 * @desc    Get overdue books
 * @route   GET /api/issues/overdue
 * @access  Public (Phase 1)
 */
router.get("/overdue", async (req, res) => {
  try {
    const [overdueIssues] = await pool.execute(`
      SELECT 
        ib.*,
        s.register_number,
        s.name as student_name,
        s.department,
        s.phone,
        s.email,
        b.accession_number,
        b.title,
        b.author,
        DATEDIFF(CURDATE(), ib.due_date) as days_overdue,
        DATEDIFF(CURDATE(), ib.due_date) * 1.00 as fine_amount
      FROM issued_books ib
      JOIN students s ON ib.student_id = s.id
      JOIN books b ON ib.book_id = b.id
      WHERE ib.status = 'issued' AND ib.due_date < CURDATE()
      ORDER BY ib.due_date ASC
    `);

    res.status(200).json({
      status: "success",
      data: overdueIssues,
    });
  } catch (error) {
    logger.error("Error fetching overdue issues:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

module.exports = router;
