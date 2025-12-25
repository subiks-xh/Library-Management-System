const express = require("express");
const router = express.Router();
const { pool } = require("../config/database");
const logger = require("../utils/logger");

/**
 * @desc    Get all pending fines
 * @route   GET /api/fines/pending
 * @access  Public (Phase 1)
 */
router.get("/pending", async (req, res) => {
  try {
    const [fines] = await pool.execute(`
      SELECT 
        f.*,
        s.register_number,
        s.name as student_name,
        s.department,
        s.year,
        s.phone,
        b.accession_number,
        b.title,
        b.author
      FROM fines f
      JOIN students s ON f.student_id = s.id
      JOIN issued_books ib ON f.issued_book_id = ib.id
      JOIN books b ON ib.book_id = b.id
      WHERE f.status = 'pending'
      ORDER BY f.created_at DESC
    `);

    res.status(200).json({
      status: "success",
      data: fines,
    });
  } catch (error) {
    logger.error("Error fetching pending fines:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

/**
 * @desc    Pay fine
 * @route   PUT /api/fines/:id/pay
 * @access  Public (Phase 1)
 */
router.put("/:id/pay", async (req, res) => {
  try {
    const fineId = req.params.id;
    const { paid_amount } = req.body;

    if (!paid_amount || paid_amount <= 0) {
      return res.status(400).json({
        status: "error",
        message: "Valid paid amount is required",
      });
    }

    // Get fine details
    const [fines] = await pool.execute(
      'SELECT * FROM fines WHERE id = ? AND status = "pending"',
      [fineId]
    );

    if (fines.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Pending fine not found",
      });
    }

    const fine = fines[0];

    if (parseFloat(paid_amount) > fine.fine_amount) {
      return res.status(400).json({
        status: "error",
        message: "Paid amount cannot exceed fine amount",
      });
    }

    // Update fine record
    const status =
      parseFloat(paid_amount) >= fine.fine_amount ? "paid" : "pending";

    await pool.execute(
      `
      UPDATE fines 
      SET paid_amount = paid_amount + ?, 
          paid_date = CASE WHEN ? >= fine_amount THEN CURDATE() ELSE paid_date END,
          status = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
      [paid_amount, parseFloat(paid_amount) + fine.paid_amount, status, fineId]
    );

    // Get updated fine
    const [updatedFine] = await pool.execute(
      `
      SELECT 
        f.*,
        s.register_number,
        s.name as student_name
      FROM fines f
      JOIN students s ON f.student_id = s.id
      WHERE f.id = ?
    `,
      [fineId]
    );

    res.status(200).json({
      status: "success",
      message:
        status === "paid"
          ? "Fine paid successfully"
          : "Partial payment recorded",
      data: updatedFine[0],
    });

    logger.info(`Fine payment: ₹${paid_amount} for fine ID ${fineId}`);
  } catch (error) {
    logger.error("Error processing fine payment:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

module.exports = router;
