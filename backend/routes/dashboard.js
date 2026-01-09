const express = require("express");
const router = express.Router();
const { pool } = require("../config/database");
const logger = require("../utils/logger");

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/dashboard/stats
 * @access  Public (Phase 1)
 */
router.get("/stats", async (req, res) => {
  try {
    console.log("📊 Dashboard stats request received");

    // Get all dashboard statistics in parallel
    const [
      totalBooksResult,
      totalStudentsResult,
      issuedBooksResult,
      overdueBooksResult,
      finesCollectedResult,
      recentActivitiesResult,
    ] = await Promise.all([
      // Total books count
      pool
        .execute(
          "SELECT COUNT(*) as count, SUM(total_copies) as total_copies FROM books"
        )
        .catch((err) => {
          console.error("❌ Books query error:", err.message);
          throw err;
        }),

      // Total active students
      pool
        .execute(
          'SELECT COUNT(*) as count FROM students WHERE status = "active"'
        )
        .catch((err) => {
          console.error("❌ Students query error:", err.message);
          throw err;
        }),

      // Currently issued books
      pool
        .execute(
          'SELECT COUNT(*) as count FROM issued_books WHERE status = "issued"'
        )
        .catch((err) => {
          console.error("❌ Issued books query error:", err.message);
          throw err;
        }),

      // Overdue books
      pool
        .execute(
          `
        SELECT COUNT(*) as count, 
               COALESCE(SUM(DATEDIFF(CURDATE(), due_date) * 1.00), 0) as total_overdue_fines
        FROM issued_books 
        WHERE status = "issued" AND due_date < CURDATE()
      `
        )
        .catch((err) => {
          console.error("❌ Overdue books query error:", err.message);
          throw err;
        }),

      // Total fines collected
      pool
        .execute(
          'SELECT COALESCE(SUM(paid_amount), 0) as total FROM fines WHERE status = "paid"'
        )
        .catch((err) => {
          console.error("❌ Fines query error:", err.message);
          throw err;
        }),

      // Recent activities (last 10 transactions)
      pool
        .execute(
          `
        SELECT 
          ib.id,
          s.register_number,
          s.name as student_name,
          b.title as book_title,
          ib.issue_date,
          ib.return_date,
          ib.status,
          ib.fine_amount
        FROM issued_books ib
        JOIN students s ON ib.student_id = s.id
        JOIN books b ON ib.book_id = b.id
        ORDER BY ib.created_at DESC
        LIMIT 10
      `
        )
        .catch((err) => {
          console.error("❌ Recent activities query error:", err.message);
          throw err;
        }),
    ]);

    console.log("✅ All queries completed successfully");

    const stats = {
      totalBooks: totalBooksResult[0][0].count,
      totalCopies: totalBooksResult[0][0].total_copies || 0,
      totalStudents: totalStudentsResult[0][0].count,
      issuedBooks: issuedBooksResult[0][0].count,
      overdueBooks: overdueBooksResult[0][0].count,
      pendingFines: overdueBooksResult[0][0].total_overdue_fines || 0,
      finesCollected: finesCollectedResult[0][0].total || 0,
      availableBooks:
        (totalBooksResult[0][0].total_copies || 0) -
        issuedBooksResult[0][0].count,
    };

    const recentActivities = recentActivitiesResult[0].map((activity) => ({
      id: activity.id,
      type: activity.return_date ? "returned" : "issued",
      student: {
        registerNumber: activity.register_number,
        name: activity.student_name,
      },
      book: {
        title: activity.book_title,
      },
      date: activity.return_date || activity.issue_date,
      status: activity.status,
      fineAmount: activity.fine_amount || 0,
    }));

    console.log("📊 Dashboard stats prepared:", stats);

    res.status(200).json({
      status: "success",
      data: {
        stats,
        recentActivities,
      },
    });

    logger.info("Dashboard statistics fetched successfully");
  } catch (error) {
    logger.error("Error fetching dashboard statistics:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

/**
 * @desc    Get books by category for dashboard chart
 * @route   GET /api/dashboard/books-by-category
 * @access  Public (Phase 1)
 */
router.get("/books-by-category", async (req, res) => {
  try {
    const [results] = await pool.execute(`
      SELECT 
        c.name as category,
        COUNT(b.id) as book_count,
        SUM(b.total_copies) as total_copies,
        SUM(b.available_copies) as available_copies
      FROM categories c
      LEFT JOIN books b ON c.id = b.category_id
      GROUP BY c.id, c.name
      ORDER BY book_count DESC
    `);

    const categoryStats = results.map((row) => ({
      category: row.category,
      bookCount: row.book_count || 0,
      totalCopies: row.total_copies || 0,
      availableCopies: row.available_copies || 0,
      issuedCopies: (row.total_copies || 0) - (row.available_copies || 0),
    }));

    res.status(200).json({
      status: "success",
      data: categoryStats,
    });
  } catch (error) {
    logger.error("Error fetching books by category:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

/**
 * @desc    Get department-wise statistics
 * @route   GET /api/dashboard/department-stats
 * @access  Public (Phase 1)
 */
router.get("/department-stats", async (req, res) => {
  try {
    const [results] = await pool.execute(`
      SELECT 
        s.department,
        COUNT(DISTINCT s.id) as student_count,
        COUNT(DISTINCT CASE WHEN ib.status = 'issued' THEN ib.id END) as books_issued,
        COALESCE(SUM(CASE WHEN ib.status = 'issued' AND ib.due_date < CURDATE() 
                     THEN DATEDIFF(CURDATE(), ib.due_date) * 1.00 ELSE 0 END), 0) as pending_fines
      FROM students s
      LEFT JOIN issued_books ib ON s.id = ib.student_id
      WHERE s.status = 'active'
      GROUP BY s.department
      ORDER BY student_count DESC
    `);

    res.status(200).json({
      status: "success",
      data: results,
    });
  } catch (error) {
    logger.error("Error fetching department statistics:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

module.exports = router;
