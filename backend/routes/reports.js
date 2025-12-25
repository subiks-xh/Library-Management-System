const express = require("express");
const router = express.Router();
const { pool } = require("../config/database");
const logger = require("../utils/logger");

/**
 * @desc    Get issue/return summary report
 * @route   GET /api/reports/issue-return
 * @access  Public (Phase 1)
 */
router.get("/issue-return", async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    let dateFilter = "";
    let queryParams = [];

    if (start_date && end_date) {
      dateFilter = "WHERE ib.issue_date BETWEEN ? AND ?";
      queryParams = [start_date, end_date];
    } else {
      // Default to last 30 days
      dateFilter =
        "WHERE ib.issue_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)";
    }

    const [issueReturnData] = await pool.execute(
      `
      SELECT 
        DATE(ib.issue_date) as date,
        COUNT(ib.id) as books_issued,
        COUNT(CASE WHEN ib.return_date IS NOT NULL THEN 1 END) as books_returned,
        AVG(CASE WHEN ib.return_date IS NOT NULL 
            THEN DATEDIFF(ib.return_date, ib.issue_date) END) as avg_days_kept
      FROM issued_books ib
      ${dateFilter}
      GROUP BY DATE(ib.issue_date)
      ORDER BY date DESC
    `,
      queryParams
    );

    res.status(200).json({
      status: "success",
      data: issueReturnData,
    });
  } catch (error) {
    logger.error("Error fetching issue-return report:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

/**
 * @desc    Get defaulters report
 * @route   GET /api/reports/defaulters
 * @access  Public (Phase 1)
 */
router.get("/defaulters", async (req, res) => {
  try {
    const [defaulters] = await pool.execute(`
      SELECT 
        s.register_number,
        s.name,
        s.department,
        s.year,
        s.phone,
        COUNT(ib.id) as overdue_books,
        SUM(DATEDIFF(CURDATE(), ib.due_date)) as total_overdue_days,
        SUM(DATEDIFF(CURDATE(), ib.due_date) * 1.00) as total_fine_amount,
        MIN(ib.due_date) as oldest_due_date
      FROM students s
      JOIN issued_books ib ON s.id = ib.student_id
      WHERE ib.status = 'issued' AND ib.due_date < CURDATE()
      GROUP BY s.id
      ORDER BY total_fine_amount DESC
    `);

    res.status(200).json({
      status: "success",
      data: defaulters,
    });
  } catch (error) {
    logger.error("Error fetching defaulters report:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

/**
 * @desc    Get fine collection report
 * @route   GET /api/reports/fines
 * @access  Public (Phase 1)
 */
router.get("/fines", async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    let dateFilter = "";
    let queryParams = [];

    if (start_date && end_date) {
      dateFilter = "WHERE f.paid_date BETWEEN ? AND ?";
      queryParams = [start_date, end_date];
    } else {
      dateFilter = "WHERE f.paid_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)";
    }

    // Fine collection summary
    const [finesSummary] = await pool.execute(
      `
      SELECT 
        DATE(f.paid_date) as date,
        SUM(f.paid_amount) as daily_collection,
        COUNT(f.id) as fines_paid
      FROM fines f
      ${dateFilter} AND f.status = 'paid'
      GROUP BY DATE(f.paid_date)
      ORDER BY date DESC
    `,
      queryParams
    );

    // Overall fine statistics
    const [overallStats] = await pool.execute(`
      SELECT 
        SUM(CASE WHEN status = 'paid' THEN paid_amount ELSE 0 END) as total_collected,
        SUM(CASE WHEN status = 'pending' THEN fine_amount - paid_amount ELSE 0 END) as pending_amount,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_fines,
        COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_fines
      FROM fines
    `);

    res.status(200).json({
      status: "success",
      data: {
        dailyCollection: finesSummary,
        summary: overallStats[0],
      },
    });
  } catch (error) {
    logger.error("Error fetching fines report:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

/**
 * @desc    Get popular books report
 * @route   GET /api/reports/popular-books
 * @access  Public (Phase 1)
 */
router.get("/popular-books", async (req, res) => {
  try {
    const [popularBooks] = await pool.execute(`
      SELECT 
        b.accession_number,
        b.title,
        b.author,
        b.department,
        c.name as category,
        COUNT(ib.id) as total_issues,
        COUNT(CASE WHEN ib.issue_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 1 END) as recent_issues,
        AVG(CASE WHEN ib.return_date IS NOT NULL 
            THEN DATEDIFF(ib.return_date, ib.issue_date) END) as avg_days_kept
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      LEFT JOIN issued_books ib ON b.id = ib.book_id
      GROUP BY b.id
      HAVING total_issues > 0
      ORDER BY total_issues DESC, recent_issues DESC
      LIMIT 20
    `);

    res.status(200).json({
      status: "success",
      data: popularBooks,
    });
  } catch (error) {
    logger.error("Error fetching popular books report:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

/**
 * @desc    Get department-wise usage report
 * @route   GET /api/reports/department-usage
 * @access  Public (Phase 1)
 */
router.get("/department-usage", async (req, res) => {
  try {
    const [departmentUsage] = await pool.execute(`
      SELECT 
        s.department,
        COUNT(DISTINCT s.id) as total_students,
        COUNT(DISTINCT CASE WHEN s.status = 'active' THEN s.id END) as active_students,
        COUNT(ib.id) as total_issues,
        COUNT(CASE WHEN ib.status = 'issued' THEN ib.id END) as current_issues,
        COUNT(CASE WHEN ib.status = 'issued' AND ib.due_date < CURDATE() THEN ib.id END) as overdue_issues,
        COALESCE(SUM(CASE WHEN f.status = 'pending' THEN f.fine_amount - f.paid_amount ELSE 0 END), 0) as pending_fines,
        COALESCE(SUM(CASE WHEN f.status = 'paid' THEN f.paid_amount ELSE 0 END), 0) as fines_collected
      FROM students s
      LEFT JOIN issued_books ib ON s.id = ib.student_id
      LEFT JOIN fines f ON s.id = f.student_id
      GROUP BY s.department
      ORDER BY total_issues DESC
    `);

    res.status(200).json({
      status: "success",
      data: departmentUsage,
    });
  } catch (error) {
    logger.error("Error fetching department usage report:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

module.exports = router;
