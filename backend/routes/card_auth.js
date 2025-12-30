const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/database");
const logger = require("../utils/logger");
const { OAuth2Client } = require("google-auth-library");

const router = express.Router();

// JWT and Google OAuth configuration
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secure-jwt-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";
const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID || "your-google-client-id";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      department: user.department,
      card_id: user.card_id,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Helper function to log entry/exit
const logEntry = async (
  userId,
  cardId,
  method = "id_card",
  purpose = "study"
) => {
  try {
    await pool.execute(
      `INSERT INTO entry_exit_logs (user_id, card_id, entry_method, purpose) 
       VALUES (?, ?, ?, ?)`,
      [userId, cardId, method, purpose]
    );

    // Update user status
    await pool.execute(
      `UPDATE users SET is_inside_library = TRUE, entry_count = entry_count + 1 
       WHERE id = ?`,
      [userId]
    );

    // Update real-time library status
    await pool.execute(
      `UPDATE library_status SET 
       current_occupancy = current_occupancy + 1,
       available_seats = available_seats - 1,
       last_updated = CURRENT_TIMESTAMP`
    );

    logger.info(`User ${userId} entered library via ${method}`);
  } catch (error) {
    logger.error(`Error logging entry for user ${userId}:`, error);
  }
};

const logExit = async (userId) => {
  try {
    // Update the latest entry log
    const [result] = await pool.execute(
      `UPDATE entry_exit_logs 
       SET exit_time = CURRENT_TIMESTAMP, is_active = FALSE 
       WHERE user_id = ? AND is_active = TRUE 
       ORDER BY entry_time DESC LIMIT 1`,
      [userId]
    );

    // Calculate study hours
    await pool.execute(
      `UPDATE users u 
       SET is_inside_library = FALSE,
           study_hours = study_hours + COALESCE((
             SELECT TIME_TO_SEC(TIMEDIFF(exit_time, entry_time)) / 3600
             FROM entry_exit_logs 
             WHERE user_id = u.id AND exit_time IS NOT NULL 
             ORDER BY exit_time DESC LIMIT 1
           ), 0)
       WHERE id = ?`,
      [userId]
    );

    // Update real-time library status
    await pool.execute(
      `UPDATE library_status SET 
       current_occupancy = GREATEST(0, current_occupancy - 1),
       available_seats = LEAST(total_capacity, available_seats + 1),
       last_updated = CURRENT_TIMESTAMP`
    );

    logger.info(`User ${userId} exited library`);
  } catch (error) {
    logger.error(`Error logging exit for user ${userId}:`, error);
  }
};

// ID Card Scanning Authentication
router.post("/scan-card", async (req, res) => {
  try {
    const { cardId, scannerId, purpose = "study" } = req.body;

    if (!cardId) {
      return res.status(400).json({
        success: false,
        message: "Card ID is required",
      });
    }

    // Find user by card ID
    const [users] = await pool.execute(
      `SELECT id, first_name, last_name, email, role, department, 
              card_id, is_active, is_inside_library, profile_picture
       FROM users WHERE card_id = ? AND is_active = TRUE`,
      [cardId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Invalid card ID or user not found",
      });
    }

    const user = users[0];

    // Check if user is entering or exiting
    if (!user.is_inside_library) {
      // ENTRY - User is entering the library
      await logEntry(user.id, cardId, "id_card", purpose);

      // Generate access token
      const token = generateToken(user);

      res.status(200).json({
        success: true,
        action: "entry",
        message: `Welcome ${user.first_name}! You have successfully checked in.`,
        user: {
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          role: user.role,
          department: user.department,
          profile_picture: user.profile_picture,
        },
        token,
        entry_time: new Date().toISOString(),
      });
    } else {
      // EXIT - User is leaving the library
      await logExit(user.id);

      res.status(200).json({
        success: true,
        action: "exit",
        message: `Goodbye ${user.first_name}! You have successfully checked out.`,
        user: {
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          department: user.department,
        },
        exit_time: new Date().toISOString(),
      });
    }
  } catch (error) {
    logger.error("Card scan error:", error);
    res.status(500).json({
      success: false,
      message: "Card scanning failed. Please try again or contact support.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Google OAuth Authentication
router.post("/google-auth", async (req, res) => {
  try {
    const { credential, purpose = "study" } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleId = payload.sub;
    const email = payload.email;
    const firstName = payload.given_name;
    const lastName = payload.family_name;
    const picture = payload.picture;

    // Check if user exists with this Google ID
    let [users] = await pool.execute(
      `SELECT id, first_name, last_name, email, role, department, 
              google_id, is_active, is_inside_library, profile_picture
       FROM users WHERE google_id = ? OR email = ?`,
      [googleId, email]
    );

    let user;

    if (users.length === 0) {
      // New user - create account
      const registerNumber = `GU${Date.now().toString().slice(-6)}`;

      const [result] = await pool.execute(
        `INSERT INTO users 
         (first_name, last_name, email, password_hash, role, register_number, 
          department, google_id, profile_picture, is_active) 
         VALUES (?, ?, ?, ?, 'student', ?, 'General', ?, ?, TRUE)`,
        [
          firstName,
          lastName,
          email,
          "GOOGLE_AUTH",
          registerNumber,
          googleId,
          picture,
        ]
      );

      user = {
        id: result.insertId,
        first_name: firstName,
        last_name: lastName,
        email: email,
        role: "student",
        department: "General",
        google_id: googleId,
        is_inside_library: false,
        profile_picture: picture,
      };

      logger.info(`New Google user created: ${email}`);
    } else {
      user = users[0];

      // Update Google ID and profile picture if not set
      if (!user.google_id) {
        await pool.execute(
          `UPDATE users SET google_id = ?, profile_picture = ? WHERE id = ?`,
          [googleId, picture, user.id]
        );
      }
    }

    // Log entry if user is not inside
    if (!user.is_inside_library) {
      await logEntry(user.id, null, "google_auth", purpose);
    }

    // Generate access token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: `Welcome ${user.first_name}! Successfully authenticated with Google.`,
      user: {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        role: user.role,
        department: user.department,
        profile_picture: user.profile_picture || picture,
      },
      token,
      is_new_user: users.length === 0,
    });
  } catch (error) {
    logger.error("Google auth error:", error);
    res.status(500).json({
      success: false,
      message: "Google authentication failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Link Card ID to existing account
router.post("/link-card", async (req, res) => {
  try {
    const { userId, cardId } = req.body;

    if (!userId || !cardId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Card ID are required",
      });
    }

    // Check if card is already linked
    const [existingCards] = await pool.execute(
      `SELECT id FROM users WHERE card_id = ? AND id != ?`,
      [cardId, userId]
    );

    if (existingCards.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Card ID is already linked to another account",
      });
    }

    // Link card to user
    await pool.execute(`UPDATE users SET card_id = ? WHERE id = ?`, [
      cardId,
      userId,
    ]);

    res.status(200).json({
      success: true,
      message: "Card successfully linked to your account",
    });
  } catch (error) {
    logger.error("Link card error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to link card to account",
    });
  }
});

// Manual entry/exit (for fallback)
router.post("/manual-entry", async (req, res) => {
  try {
    const { userId, purpose = "study", action = "entry" } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Get user details
    const [users] = await pool.execute(
      `SELECT id, first_name, last_name, department, is_inside_library 
       FROM users WHERE id = ? AND is_active = TRUE`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = users[0];

    if (action === "entry" && !user.is_inside_library) {
      await logEntry(user.id, null, "manual", purpose);

      res.status(200).json({
        success: true,
        message: `Manual entry recorded for ${user.first_name}`,
        action: "entry",
      });
    } else if (action === "exit" && user.is_inside_library) {
      await logExit(user.id);

      res.status(200).json({
        success: true,
        message: `Manual exit recorded for ${user.first_name}`,
        action: "exit",
      });
    } else {
      res.status(400).json({
        success: false,
        message: `Invalid action: User is already ${
          user.is_inside_library ? "inside" : "outside"
        } the library`,
      });
    }
  } catch (error) {
    logger.error("Manual entry/exit error:", error);
    res.status(500).json({
      success: false,
      message: "Manual entry/exit failed",
    });
  }
});

// Get user's entry/exit history
router.get("/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const [logs] = await pool.execute(
      `SELECT entry_time, exit_time, entry_method, purpose, scanner_location,
              CASE WHEN exit_time IS NOT NULL 
                   THEN TIME_TO_SEC(TIMEDIFF(exit_time, entry_time))/3600 
                   ELSE NULL END as duration_hours
       FROM entry_exit_logs 
       WHERE user_id = ? 
       ORDER BY entry_time DESC 
       LIMIT ? OFFSET ?`,
      [userId, parseInt(limit), parseInt(offset)]
    );

    res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    logger.error("Get entry history error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get entry history",
    });
  }
});

module.exports = router;
