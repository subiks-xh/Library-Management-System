const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { pool } = require("../config/database");
const logger = require("../utils/logger");
const { body, validationResult } = require("express-validator");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "..", "uploads", "question-papers");

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    const fileName = file.fieldname + "-" + uniqueSuffix + fileExtension;
    cb(null, fileName);
  },
});

// File filter for PDFs only
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Upload question paper
router.post(
  "/upload",
  upload.single("questionPaper"),
  [
    body("title").trim().isLength({ min: 1 }).withMessage("Title is required"),
    body("subject")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Subject is required"),
    body("department")
      .isIn(["MECH", "CIVIL", "CSE", "IT", "ECE", "EEE", "SH"])
      .withMessage("Invalid department"),
    body("semester")
      .isInt({ min: 1, max: 8 })
      .withMessage("Semester must be between 1 and 8"),
    body("examType")
      .isIn(["internal", "external", "model"])
      .withMessage("Invalid exam type"),
    body("year")
      .isInt({ min: 2000, max: new Date().getFullYear() + 1 })
      .withMessage("Invalid year"),
    body("uploadedBy")
      .isInt({ min: 1 })
      .withMessage("Valid uploader ID is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Delete uploaded file if validation fails
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "PDF file is required",
        });
      }

      const {
        title,
        subject,
        department,
        semester,
        examType,
        year,
        uploadedBy,
        description = null,
      } = req.body;

      // Check if question paper already exists
      const [existingPaper] = await pool.execute(
        `SELECT id FROM question_papers 
         WHERE title = ? AND subject = ? AND department = ? AND semester = ? AND exam_type = ? AND year = ?`,
        [title, subject, department, semester, examType, year]
      );

      if (existingPaper.length > 0) {
        // Delete uploaded file
        fs.unlinkSync(req.file.path);
        return res.status(409).json({
          success: false,
          message: "Question paper with same details already exists",
        });
      }

      // Save to database
      const [result] = await pool.execute(
        `INSERT INTO question_papers 
         (title, subject, department, semester, exam_type, year, file_name, file_path, file_size, uploaded_by, description) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title,
          subject,
          department,
          semester,
          examType,
          year,
          req.file.filename,
          req.file.path,
          req.file.size,
          uploadedBy,
          description,
        ]
      );

      logger.info(`Question paper uploaded: ${title} by user ${uploadedBy}`);

      res.status(201).json({
        success: true,
        message: "Question paper uploaded successfully",
        data: {
          id: result.insertId,
          title,
          subject,
          department,
          semester,
          examType,
          year,
          fileName: req.file.filename,
          fileSize: req.file.size,
        },
      });
    } catch (error) {
      // Delete uploaded file on error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      logger.error("Question paper upload error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to upload question paper",
      });
    }
  }
);

// Get question papers with filters
router.get("/", async (req, res) => {
  try {
    const {
      department,
      semester,
      subject,
      examType,
      year,
      search,
      sortBy = "created_at",
      sortOrder = "DESC",
      limit = 20,
      offset = 0,
    } = req.query;

    let whereClause = "WHERE 1=1";
    let params = [];

    // Apply filters
    if (department) {
      whereClause += " AND department = ?";
      params.push(department);
    }

    if (semester) {
      whereClause += " AND semester = ?";
      params.push(parseInt(semester));
    }

    if (subject) {
      whereClause += " AND subject LIKE ?";
      params.push(`%${subject}%`);
    }

    if (examType) {
      whereClause += " AND exam_type = ?";
      params.push(examType);
    }

    if (year) {
      whereClause += " AND year = ?";
      params.push(parseInt(year));
    }

    if (search) {
      whereClause +=
        " AND (title LIKE ? OR subject LIKE ? OR description LIKE ?)";
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Add sorting and pagination
    const validSortFields = [
      "title",
      "subject",
      "department",
      "semester",
      "year",
      "created_at",
      "download_count",
    ];
    const sortField = validSortFields.includes(sortBy) ? sortBy : "created_at";
    const order = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

    params.push(parseInt(limit), parseInt(offset));

    const [questionPapers] = await pool.execute(
      `SELECT qp.*, u.first_name, u.last_name, u.email as uploader_email
       FROM question_papers qp
       JOIN users u ON qp.uploaded_by = u.id
       ${whereClause}
       ORDER BY qp.${sortField} ${order}
       LIMIT ? OFFSET ?`,
      params
    );

    // Get total count for pagination
    const [totalCount] = await pool.execute(
      `SELECT COUNT(*) as count FROM question_papers qp ${whereClause}`,
      params.slice(0, -2) // Remove limit and offset params
    );

    res.status(200).json({
      success: true,
      data: {
        questionPapers,
        pagination: {
          total: totalCount[0].count,
          limit: parseInt(limit),
          offset: parseInt(offset),
          totalPages: Math.ceil(totalCount[0].count / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    logger.error("Get question papers error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get question papers",
    });
  }
});

// Get question paper by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [questionPaper] = await pool.execute(
      `SELECT qp.*, u.first_name, u.last_name, u.email as uploader_email
       FROM question_papers qp
       JOIN users u ON qp.uploaded_by = u.id
       WHERE qp.id = ?`,
      [id]
    );

    if (questionPaper.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Question paper not found",
      });
    }

    res.status(200).json({
      success: true,
      data: questionPaper[0],
    });
  } catch (error) {
    logger.error("Get question paper error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get question paper",
    });
  }
});

// Download question paper
router.get("/:id/download", async (req, res) => {
  try {
    const { id } = req.params;

    const [questionPaper] = await pool.execute(
      `SELECT * FROM question_papers WHERE id = ?`,
      [id]
    );

    if (questionPaper.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Question paper not found",
      });
    }

    const paper = questionPaper[0];
    const filePath = paper.file_path;

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found on server",
      });
    }

    // Increment download count
    await pool.execute(
      `UPDATE question_papers SET download_count = download_count + 1 WHERE id = ?`,
      [id]
    );

    // Set response headers for file download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${paper.title}.pdf"`
    );
    res.setHeader("Content-Length", paper.file_size);

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    logger.info(`Question paper downloaded: ${paper.title} (ID: ${id})`);
  } catch (error) {
    logger.error("Download question paper error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to download question paper",
    });
  }
});

// Update question paper metadata
router.put(
  "/:id",
  [
    body("title")
      .optional()
      .trim()
      .isLength({ min: 1 })
      .withMessage("Title cannot be empty"),
    body("description").optional().trim(),
  ],
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description } = req.body;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      // Check if question paper exists
      const [existing] = await pool.execute(
        `SELECT * FROM question_papers WHERE id = ?`,
        [id]
      );

      if (existing.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Question paper not found",
        });
      }

      // Update fields
      const updateFields = [];
      const updateValues = [];

      if (title !== undefined) {
        updateFields.push("title = ?");
        updateValues.push(title);
      }

      if (description !== undefined) {
        updateFields.push("description = ?");
        updateValues.push(description);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No valid fields to update",
        });
      }

      updateValues.push(id);

      await pool.execute(
        `UPDATE question_papers SET ${updateFields.join(", ")} WHERE id = ?`,
        updateValues
      );

      logger.info(`Question paper updated: ID ${id}`);

      res.status(200).json({
        success: true,
        message: "Question paper updated successfully",
      });
    } catch (error) {
      logger.error("Update question paper error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update question paper",
      });
    }
  }
);

// Delete question paper
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Get question paper details
    const [questionPaper] = await pool.execute(
      `SELECT * FROM question_papers WHERE id = ?`,
      [id]
    );

    if (questionPaper.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Question paper not found",
      });
    }

    const paper = questionPaper[0];

    // Delete from database
    await pool.execute(`DELETE FROM question_papers WHERE id = ?`, [id]);

    // Delete file from filesystem
    if (fs.existsSync(paper.file_path)) {
      fs.unlinkSync(paper.file_path);
    }

    logger.info(`Question paper deleted: ${paper.title} (ID: ${id})`);

    res.status(200).json({
      success: true,
      message: "Question paper deleted successfully",
    });
  } catch (error) {
    logger.error("Delete question paper error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete question paper",
    });
  }
});

// Get statistics
router.get("/stats/overview", async (req, res) => {
  try {
    // Total papers count
    const [totalPapers] = await pool.execute(
      `SELECT COUNT(*) as count FROM question_papers`
    );

    // Papers by department
    const [byDepartment] = await pool.execute(
      `SELECT department, COUNT(*) as count FROM question_papers GROUP BY department`
    );

    // Papers by exam type
    const [byExamType] = await pool.execute(
      `SELECT exam_type, COUNT(*) as count FROM question_papers GROUP BY exam_type`
    );

    // Most downloaded papers
    const [mostDownloaded] = await pool.execute(
      `SELECT title, subject, department, semester, download_count 
       FROM question_papers 
       ORDER BY download_count DESC 
       LIMIT 10`
    );

    // Recent uploads
    const [recentUploads] = await pool.execute(
      `SELECT qp.title, qp.subject, qp.department, qp.created_at, u.first_name, u.last_name
       FROM question_papers qp
       JOIN users u ON qp.uploaded_by = u.id
       ORDER BY qp.created_at DESC
       LIMIT 5`
    );

    // Total downloads
    const [totalDownloads] = await pool.execute(
      `SELECT SUM(download_count) as total_downloads FROM question_papers`
    );

    res.status(200).json({
      success: true,
      data: {
        totalPapers: totalPapers[0].count,
        totalDownloads: totalDownloads[0].total_downloads || 0,
        byDepartment,
        byExamType,
        mostDownloaded,
        recentUploads,
      },
    });
  } catch (error) {
    logger.error("Question papers stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get statistics",
    });
  }
});

// Search suggestions
router.get("/suggestions/search", async (req, res) => {
  try {
    const { query, type = "all" } = req.query;

    if (!query || query.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Query must be at least 2 characters long",
      });
    }

    const suggestions = [];

    if (type === "all" || type === "subjects") {
      const [subjects] = await pool.execute(
        `SELECT DISTINCT subject FROM question_papers WHERE subject LIKE ? LIMIT 5`,
        [`%${query}%`]
      );
      suggestions.push(
        ...subjects.map((s) => ({ type: "subject", value: s.subject }))
      );
    }

    if (type === "all" || type === "titles") {
      const [titles] = await pool.execute(
        `SELECT DISTINCT title FROM question_papers WHERE title LIKE ? LIMIT 5`,
        [`%${query}%`]
      );
      suggestions.push(
        ...titles.map((t) => ({ type: "title", value: t.title }))
      );
    }

    res.status(200).json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    logger.error("Search suggestions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get suggestions",
    });
  }
});

module.exports = router;
