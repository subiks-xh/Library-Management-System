const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/database");
const logger = require("../utils/logger");

const router = express.Router();

// JWT secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secure-jwt-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

// Register new user
router.post("/register", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      role = "student",
      registerNumber,
      department,
      institution,
    } = req.body;

    logger.info(`Registration attempt for: ${email}`);

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !password ||
      !department ||
      !institution
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // Validate student register number
    if (role === "student" && !registerNumber) {
      return res.status(400).json({
        success: false,
        message: "Register number is required for students",
      });
    }

    // Check if user already exists
    const [existingUsers] = await pool.execute(
      "SELECT id FROM users WHERE email = ? OR (register_number = ? AND register_number IS NOT NULL)",
      [email, registerNumber || null]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User with this email or register number already exists",
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const [result] = await pool.execute(
      `INSERT INTO users (
        first_name, last_name, email, phone, password_hash, role, 
        register_number, department, institution, is_active, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, true, NOW())`,
      [
        firstName,
        lastName,
        email,
        phone,
        hashedPassword,
        role,
        registerNumber || null,
        department,
        institution,
      ]
    );

    const userId = result.insertId;

    // Generate JWT token
    const token = jwt.sign(
      {
        userId,
        email,
        role,
        registerNumber: registerNumber || null,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Get user data (without password)
    const [userData] = await pool.execute(
      "SELECT id, first_name, last_name, email, phone, role, register_number, department, institution, is_active, created_at FROM users WHERE id = ?",
      [userId]
    );

    logger.info(`User registered successfully: ${email} (ID: ${userId})`);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        token,
        user: userData[0],
      },
    });
  } catch (error) {
    logger.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during registration",
    });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password, remember = false } = req.body;

    logger.info(`Login attempt for: ${email}`);

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user by email
    const [users] = await pool.execute(
      "SELECT * FROM users WHERE email = ? AND is_active = true",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const user = users[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const tokenExpiry = remember ? "30d" : JWT_EXPIRES_IN;
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        registerNumber: user.register_number,
      },
      JWT_SECRET,
      { expiresIn: tokenExpiry }
    );

    // Update last login
    await pool.execute("UPDATE users SET last_login = NOW() WHERE id = ?", [
      user.id,
    ]);

    // Remove password from user data
    const { password_hash, ...userData } = user;

    logger.info(`User logged in successfully: ${email} (ID: ${user.id})`);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: userData,
      },
    });
  } catch (error) {
    logger.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during login",
    });
  }
});

// Demo login (for testing purposes)
router.post("/demo-login", async (req, res) => {
  try {
    const { role = "student" } = req.body;

    // Demo users
    const demoUsers = {
      admin: {
        id: 999,
        first_name: "Admin",
        last_name: "User",
        email: "admin@library.edu.in",
        phone: "9876543210",
        role: "admin",
        register_number: null,
        department: "Administration",
        institution: "Tamil Nadu College Library",
        is_active: true,
      },
      librarian: {
        id: 998,
        first_name: "Librarian",
        last_name: "User",
        email: "librarian@library.edu.in",
        phone: "9876543211",
        role: "librarian",
        register_number: null,
        department: "Library Science",
        institution: "Tamil Nadu College Library",
        is_active: true,
      },
      student: {
        id: 997,
        first_name: "Demo",
        last_name: "Student",
        email: "student@college.edu.in",
        phone: "9876543212",
        role: "student",
        register_number: "20IT001",
        department: "Computer Science",
        institution: "Tamil Nadu Engineering College",
        is_active: true,
      },
    };

    const user = demoUsers[role] || demoUsers.student;

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        registerNumber: user.register_number,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    logger.info(`Demo login: ${role} - ${user.email}`);

    res.json({
      success: true,
      message: "Demo login successful",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    logger.error("Demo login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during demo login",
    });
  }
});

// Logout user
router.post("/logout", async (req, res) => {
  try {
    // In a more sophisticated implementation, you might want to:
    // - Add token to blacklist
    // - Update last_logout in database
    // - Clear session data

    logger.info("User logged out successfully");

    res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    logger.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during logout",
    });
  }
});

// Refresh token
router.post("/refresh", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // Verify current token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Generate new token
    const newToken = jwt.sign(
      {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        registerNumber: decoded.registerNumber,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      data: {
        token: newToken,
      },
    });
  } catch (error) {
    logger.error("Token refresh error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
});

// Get current user profile
router.get("/profile", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Get user data
    const [users] = await pool.execute(
      "SELECT id, first_name, last_name, email, phone, role, register_number, department, institution, is_active, created_at, last_login FROM users WHERE id = ? AND is_active = true",
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: {
        user: users[0],
      },
    });
  } catch (error) {
    logger.error("Profile fetch error:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
