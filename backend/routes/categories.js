const express = require("express");
const router = express.Router();
const { pool } = require("../config/database");
const { body, validationResult } = require("express-validator");
const logger = require("../utils/logger");

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public (Phase 1)
 */
router.get("/", async (req, res) => {
  try {
    const [categories] = await pool.execute(`
      SELECT 
        c.*,
        COUNT(b.id) as book_count,
        SUM(b.total_copies) as total_copies,
        SUM(b.available_copies) as available_copies
      FROM categories c
      LEFT JOIN books b ON c.id = b.category_id
      GROUP BY c.id
      ORDER BY c.name
    `);

    const categoriesWithStats = categories.map((cat) => ({
      ...cat,
      book_count: cat.book_count || 0,
      total_copies: cat.total_copies || 0,
      available_copies: cat.available_copies || 0,
      issued_copies: (cat.total_copies || 0) - (cat.available_copies || 0),
    }));

    res.status(200).json({
      status: "success",
      data: categoriesWithStats,
    });
  } catch (error) {
    logger.error("Error fetching categories:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

/**
 * @desc    Get single category
 * @route   GET /api/categories/:id
 * @access  Public (Phase 1)
 */
router.get("/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;

    const [categories] = await pool.execute(
      "SELECT * FROM categories WHERE id = ?",
      [categoryId]
    );

    if (categories.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Category not found",
      });
    }

    // Get books in this category
    const [books] = await pool.execute(
      `
      SELECT 
        id, accession_number, title, author, department,
        total_copies, available_copies, shelf_number
      FROM books 
      WHERE category_id = ?
      ORDER BY accession_number
    `,
      [categoryId]
    );

    res.status(200).json({
      status: "success",
      data: {
        category: categories[0],
        books,
      },
    });
  } catch (error) {
    logger.error("Error fetching category details:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

/**
 * @desc    Add new category
 * @route   POST /api/categories
 * @access  Public (Phase 1)
 */
router.post(
  "/",
  [
    body("name")
      .notEmpty()
      .isLength({ max: 100 })
      .withMessage("Category name is required and must be max 100 characters"),
    body("description")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Description must be max 500 characters"),
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

      const { name, description } = req.body;

      // Check if category name already exists
      const [existingCategory] = await pool.execute(
        "SELECT id FROM categories WHERE name = ?",
        [name]
      );

      if (existingCategory.length > 0) {
        return res.status(400).json({
          status: "error",
          message: "Category with this name already exists",
        });
      }

      // Insert new category
      const [result] = await pool.execute(
        "INSERT INTO categories (name, description) VALUES (?, ?)",
        [name, description || null]
      );

      // Get the created category
      const [newCategory] = await pool.execute(
        "SELECT * FROM categories WHERE id = ?",
        [result.insertId]
      );

      res.status(201).json({
        status: "success",
        message: "Category added successfully",
        data: newCategory[0],
      });

      logger.info(`New category added: ${name}`);
    } catch (error) {
      logger.error("Error adding category:", error);

      if (error.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          status: "error",
          message: "Category with this name already exists",
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
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Public (Phase 1)
 */
router.put(
  "/:id",
  [
    body("name")
      .optional()
      .isLength({ max: 100 })
      .withMessage("Category name must be max 100 characters"),
    body("description")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Description must be max 500 characters"),
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

      const categoryId = req.params.id;
      const { name, description } = req.body;

      // Check if category exists
      const [existingCategory] = await pool.execute(
        "SELECT * FROM categories WHERE id = ?",
        [categoryId]
      );

      if (existingCategory.length === 0) {
        return res.status(404).json({
          status: "error",
          message: "Category not found",
        });
      }

      // Check if new name already exists (if name is being updated)
      if (name && name !== existingCategory[0].name) {
        const [duplicateName] = await pool.execute(
          "SELECT id FROM categories WHERE name = ? AND id != ?",
          [name, categoryId]
        );

        if (duplicateName.length > 0) {
          return res.status(400).json({
            status: "error",
            message: "Category with this name already exists",
          });
        }
      }

      // Build update query dynamically
      const updateFields = {};
      if (name !== undefined) updateFields.name = name;
      if (description !== undefined) updateFields.description = description;

      if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({
          status: "error",
          message: "No fields to update",
        });
      }

      const updateKeys = Object.keys(updateFields);
      const updateValues = Object.values(updateFields);
      const setClause = updateKeys.map((key) => `${key} = ?`).join(", ");

      await pool.execute(
        `UPDATE categories SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [...updateValues, categoryId]
      );

      // Get updated category
      const [updatedCategory] = await pool.execute(
        "SELECT * FROM categories WHERE id = ?",
        [categoryId]
      );

      res.status(200).json({
        status: "success",
        message: "Category updated successfully",
        data: updatedCategory[0],
      });

      logger.info(
        `Category updated: ID ${categoryId} - ${
          name || existingCategory[0].name
        }`
      );
    } catch (error) {
      logger.error("Error updating category:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }
);

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Public (Phase 1)
 */
router.delete("/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Check if category exists
    const [existingCategory] = await pool.execute(
      "SELECT * FROM categories WHERE id = ?",
      [categoryId]
    );

    if (existingCategory.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Category not found",
      });
    }

    // Check if category has books
    const [booksInCategory] = await pool.execute(
      "SELECT COUNT(*) as count FROM books WHERE category_id = ?",
      [categoryId]
    );

    if (booksInCategory[0].count > 0) {
      return res.status(400).json({
        status: "error",
        message: `Cannot delete category. It contains ${booksInCategory[0].count} books. Please move books to another category first.`,
      });
    }

    await pool.execute("DELETE FROM categories WHERE id = ?", [categoryId]);

    res.status(200).json({
      status: "success",
      message: "Category deleted successfully",
    });

    logger.info(
      `Category deleted: ID ${categoryId} - ${existingCategory[0].name}`
    );
  } catch (error) {
    logger.error("Error deleting category:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

module.exports = router;
