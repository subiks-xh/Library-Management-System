const express = require("express");
const router = express.Router();
const { pool } = require("../config/database");
const { body, validationResult, query } = require("express-validator");
const logger = require("../utils/logger");

/**
 * @desc    Get all students with pagination and search
 * @route   GET /api/students
 * @access  Public (Phase 1)
 */
router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    query("search").optional().isLength({ max: 255 }),
    query("department").optional().isLength({ max: 100 }),
    query("year").optional().isInt({ min: 1, max: 4 }),
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
      const departmentFilter = req.query.department || "";
      const yearFilter = req.query.year || "";

      // Build dynamic query
      let whereClause = "WHERE 1=1";
      let queryParams = [];

      if (search) {
        whereClause +=
          " AND (s.register_number LIKE ? OR s.name LIKE ? OR s.email LIKE ?)";
        queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      if (departmentFilter) {
        whereClause += " AND s.department LIKE ?";
        queryParams.push(`%${departmentFilter}%`);
      }

      if (yearFilter) {
        whereClause += " AND s.year = ?";
        queryParams.push(yearFilter);
      }

      // Get total count
      const countQuery = `SELECT COUNT(*) as total FROM students s ${whereClause}`;
      const [countResult] = await pool.execute(countQuery, queryParams);
      const totalStudents = countResult[0].total;

      // Get students with issue statistics
      const studentsQuery = `
      SELECT 
        s.*,
        COUNT(DISTINCT CASE WHEN ib.status = 'issued' THEN ib.id END) as books_issued,
        COUNT(DISTINCT CASE WHEN ib.status = 'issued' AND ib.due_date < CURDATE() THEN ib.id END) as overdue_books,
        COALESCE(SUM(CASE WHEN f.status = 'pending' THEN f.fine_amount ELSE 0 END), 0) as pending_fines
      FROM students s
      LEFT JOIN issued_books ib ON s.id = ib.student_id
      LEFT JOIN fines f ON s.id = f.student_id
      ${whereClause}
      GROUP BY s.id
      ORDER BY s.register_number
      LIMIT ? OFFSET ?
    `;

      queryParams.push(limit, offset);
      const [students] = await pool.execute(studentsQuery, queryParams);

      const pagination = {
        currentPage: page,
        totalPages: Math.ceil(totalStudents / limit),
        totalStudents,
        limit,
        hasNext: page < Math.ceil(totalStudents / limit),
        hasPrev: page > 1,
      };

      res.status(200).json({
        status: "success",
        data: {
          students,
          pagination,
        },
      });
    } catch (error) {
      logger.error("Error fetching students:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }
);

/**
 * @desc    Get single student by register number
 * @route   GET /api/students/register/:registerNumber
 * @access  Public (Phase 1)
 */
router.get("/register/:registerNumber", async (req, res) => {
  try {
    const registerNumber = req.params.registerNumber.toUpperCase();

    // Get student details with statistics
    const [students] = await pool.execute(
      `
      SELECT 
        s.*,
        COUNT(DISTINCT CASE WHEN ib.status = 'issued' THEN ib.id END) as books_issued,
        COUNT(DISTINCT CASE WHEN ib.status = 'issued' AND ib.due_date < CURDATE() THEN ib.id END) as overdue_books,
        COALESCE(SUM(CASE WHEN f.status = 'pending' THEN f.fine_amount ELSE 0 END), 0) as pending_fines,
        COALESCE(SUM(CASE WHEN f.status = 'paid' THEN f.paid_amount ELSE 0 END), 0) as total_fines_paid
      FROM students s
      LEFT JOIN issued_books ib ON s.id = ib.student_id
      LEFT JOIN fines f ON s.id = f.student_id
      WHERE s.register_number = ?
      GROUP BY s.id
    `,
      [registerNumber]
    );

    if (students.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Student not found",
      });
    }

    // Get current issued books
    const [currentIssues] = await pool.execute(
      `
      SELECT 
        ib.*,
        b.accession_number,
        b.title,
        b.author,
        b.department as book_department,
        DATEDIFF(CURDATE(), ib.due_date) as days_overdue,
        CASE 
          WHEN ib.due_date < CURDATE() THEN DATEDIFF(CURDATE(), ib.due_date) * 1.00
          ELSE 0.00
        END as fine_amount
      FROM issued_books ib
      JOIN books b ON ib.book_id = b.id
      WHERE ib.student_id = ? AND ib.status = 'issued'
      ORDER BY ib.issue_date DESC
    `,
      [students[0].id]
    );

    // Get issue history
    const [issueHistory] = await pool.execute(
      `
      SELECT 
        ib.*,
        b.accession_number,
        b.title,
        b.author
      FROM issued_books ib
      JOIN books b ON ib.book_id = b.id
      WHERE ib.student_id = ?
      ORDER BY ib.issue_date DESC
      LIMIT 20
    `,
      [students[0].id]
    );

    res.status(200).json({
      status: "success",
      data: {
        student: students[0],
        currentIssues,
        issueHistory,
      },
    });
  } catch (error) {
    logger.error("Error fetching student details:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

/**
 * @desc    Add new student
 * @route   POST /api/students
 * @access  Public (Phase 1)
 */
router.post(
  "/",
  [
    body("register_number")
      .notEmpty()
      .isLength({ max: 20 })
      .withMessage("Register number is required"),
    body("name")
      .notEmpty()
      .isLength({ max: 255 })
      .withMessage("Name is required"),
    body("department")
      .notEmpty()
      .isLength({ max: 100 })
      .withMessage("Department is required"),
    body("year")
      .isInt({ min: 1, max: 4 })
      .withMessage("Year must be between 1 and 4"),
    body("email").optional().isEmail().withMessage("Valid email is required"),
    body("phone")
      .optional()
      .isMobilePhone("en-IN")
      .withMessage("Valid Indian phone number is required"),
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

      const { register_number, name, department, year, email, phone, address } =
        req.body;

      // Convert register number to uppercase
      const upperRegisterNumber = register_number.toUpperCase();

      // Check if register number already exists
      const [existingStudent] = await pool.execute(
        "SELECT id FROM students WHERE register_number = ?",
        [upperRegisterNumber]
      );

      if (existingStudent.length > 0) {
        return res.status(400).json({
          status: "error",
          message: "Student with this register number already exists",
        });
      }

      // Insert new student
      const [result] = await pool.execute(
        `
      INSERT INTO students (register_number, name, department, year, email, phone, address, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'active')
    `,
        [upperRegisterNumber, name, department, year, email, phone, address]
      );

      // Get the created student
      const [newStudent] = await pool.execute(
        "SELECT * FROM students WHERE id = ?",
        [result.insertId]
      );

      res.status(201).json({
        status: "success",
        message: "Student added successfully",
        data: newStudent[0],
      });

      logger.info(`New student added: ${upperRegisterNumber} - ${name}`);
    } catch (error) {
      logger.error("Error adding student:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }
);

/**
 * @desc    Update student
 * @route   PUT /api/students/:id
 * @access  Public (Phase 1)
 */
router.put(
  "/:id",
  [
    body("name").optional().isLength({ max: 255 }),
    body("department").optional().isLength({ max: 100 }),
    body("year").optional().isInt({ min: 1, max: 4 }),
    body("email").optional().isEmail(),
    body("phone").optional().isMobilePhone("en-IN"),
    body("status").optional().isIn(["active", "inactive", "graduated"]),
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

      const studentId = req.params.id;
      const updateFields = req.body;

      // Check if student exists
      const [existingStudent] = await pool.execute(
        "SELECT * FROM students WHERE id = ?",
        [studentId]
      );

      if (existingStudent.length === 0) {
        return res.status(404).json({
          status: "error",
          message: "Student not found",
        });
      }

      // If deactivating student, check for active issues
      if (
        updateFields.status === "inactive" ||
        updateFields.status === "graduated"
      ) {
        const [activeIssues] = await pool.execute(
          'SELECT COUNT(*) as count FROM issued_books WHERE student_id = ? AND status = "issued"',
          [studentId]
        );

        if (activeIssues[0].count > 0) {
          return res.status(400).json({
            status: "error",
            message: "Cannot deactivate student with active book issues",
          });
        }
      }

      // Build update query
      const updateKeys = Object.keys(updateFields);
      if (updateKeys.length === 0) {
        return res.status(400).json({
          status: "error",
          message: "No fields to update",
        });
      }

      const updateValues = Object.values(updateFields);
      const setClause = updateKeys.map((key) => `${key} = ?`).join(", ");

      await pool.execute(
        `UPDATE students SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [...updateValues, studentId]
      );

      // Get updated student
      const [updatedStudent] = await pool.execute(
        "SELECT * FROM students WHERE id = ?",
        [studentId]
      );

      res.status(200).json({
        status: "success",
        message: "Student updated successfully",
        data: updatedStudent[0],
      });

      logger.info(`Student updated: ID ${studentId}`);
    } catch (error) {
      logger.error("Error updating student:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }
);

/**
 * @desc    Get departments list
 * @route   GET /api/students/departments
 * @access  Public (Phase 1)
 */
router.get("/meta/departments", async (req, res) => {
  try {
    const [departments] = await pool.execute(`
      SELECT 
        department,
        COUNT(*) as student_count,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_students
      FROM students 
      GROUP BY department 
      ORDER BY student_count DESC
    `);

    res.status(200).json({
      status: "success",
      data: departments,
    });
  } catch (error) {
    logger.error("Error fetching departments:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

module.exports = router;
