const express = require("express");
const router = express.Router();
const { pool } = require("../config/database");
const logger = require("../utils/logger");

/**
 * GPS-Based Library Entry Tracking System
 * Automatically tracks student entry/exit using geolocation
 */

// Haversine formula to calculate distance between two GPS points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

/**
 * @desc    Get library geofence configuration
 * @route   GET /api/gps-tracking/geofence
 * @access  Public
 */
router.get("/geofence", async (req, res) => {
  try {
    const [geofences] = await pool.execute(
      "SELECT * FROM library_geofence WHERE is_active = TRUE ORDER BY id DESC LIMIT 1"
    );

    if (geofences.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No active library geofence found",
      });
    }

    res.json({
      status: "success",
      data: geofences[0],
    });
  } catch (error) {
    logger.error("Error fetching geofence:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

/**
 * @desc    Update student location and check library entry/exit
 * @route   POST /api/gps-tracking/update-location
 * @access  Public (Phase 1)
 */
router.post("/update-location", async (req, res) => {
  try {
    const {
      studentId,
      latitude,
      longitude,
      accuracy,
      deviceInfo,
      registerNumber,
    } = req.body;

    // Validate required fields
    if (!studentId && !registerNumber) {
      return res.status(400).json({
        status: "error",
        message: "Student ID or register number is required",
      });
    }

    if (!latitude || !longitude) {
      return res.status(400).json({
        status: "error",
        message: "Latitude and longitude are required",
      });
    }

    // Get student ID if register number provided
    let actualStudentId = studentId;
    if (!studentId && registerNumber) {
      const [students] = await pool.execute(
        "SELECT id FROM students WHERE register_number = ?",
        [registerNumber]
      );

      if (students.length === 0) {
        return res.status(404).json({
          status: "error",
          message: "Student not found",
        });
      }
      actualStudentId = students[0].id;
    }

    // Check if student has granted location permissions
    const [permissions] = await pool.execute(
      "SELECT permission_granted FROM student_location_permissions WHERE student_id = ? AND is_active = TRUE",
      [actualStudentId]
    );

    if (permissions.length === 0 || !permissions[0].permission_granted) {
      return res.status(403).json({
        status: "error",
        message: "Location permission not granted",
      });
    }

    // Get active library geofence
    const [geofences] = await pool.execute(
      "SELECT * FROM library_geofence WHERE is_active = TRUE ORDER BY id DESC LIMIT 1"
    );

    if (geofences.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No active library geofence configured",
      });
    }

    const geofence = geofences[0];

    // Calculate distance from library center
    const distanceFromLibrary = calculateDistance(
      latitude,
      longitude,
      geofence.center_latitude,
      geofence.center_longitude
    );

    const isInsideLibrary = distanceFromLibrary <= geofence.radius_meters;

    // Check current occupancy status
    const [currentOccupancy] = await pool.execute(
      "SELECT * FROM current_library_occupancy WHERE student_id = ?",
      [actualStudentId]
    );

    const wasInside =
      currentOccupancy.length > 0 && currentOccupancy[0].status === "inside";
    let entryType = null;
    let statusChange = false;

    // Determine if this is an entry or exit
    if (isInsideLibrary && !wasInside) {
      // Student entered library
      entryType = "entry";
      statusChange = true;

      // Add to current occupancy
      await pool.execute(
        `
        INSERT INTO current_library_occupancy 
        (student_id, entry_time, current_latitude, current_longitude, status)
        VALUES (?, NOW(), ?, ?, 'inside')
        ON DUPLICATE KEY UPDATE
        entry_time = NOW(),
        current_latitude = VALUES(current_latitude),
        current_longitude = VALUES(current_longitude),
        status = 'inside',
        last_seen = NOW()
      `,
        [actualStudentId, latitude, longitude]
      );
    } else if (!isInsideLibrary && wasInside) {
      // Student exited library
      entryType = "exit";
      statusChange = true;

      // Calculate duration
      const entryTime = currentOccupancy[0].entry_time;
      const duration = Math.floor(
        (Date.now() - new Date(entryTime).getTime()) / (1000 * 60)
      );

      // Update exit in the entry log
      await pool.execute(
        "UPDATE library_entry_logs SET duration_minutes = ? WHERE student_id = ? AND entry_type = 'entry' AND duration_minutes IS NULL ORDER BY entry_time DESC LIMIT 1",
        [duration, actualStudentId]
      );

      // Remove from current occupancy
      await pool.execute(
        "DELETE FROM current_library_occupancy WHERE student_id = ?",
        [actualStudentId]
      );
    } else if (isInsideLibrary && wasInside) {
      // Student still inside, update location
      await pool.execute(
        "UPDATE current_library_occupancy SET current_latitude = ?, current_longitude = ?, last_seen = NOW() WHERE student_id = ?",
        [latitude, longitude, actualStudentId]
      );
    }

    // Log the location update if there's a status change
    if (statusChange) {
      await pool.execute(
        `
        INSERT INTO library_entry_logs 
        (student_id, entry_type, latitude, longitude, accuracy_meters, device_info, is_valid_location)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
        [
          actualStudentId,
          entryType,
          latitude,
          longitude,
          accuracy || 0,
          JSON.stringify(deviceInfo || {}),
          isInsideLibrary,
        ]
      );
    }

    res.json({
      status: "success",
      data: {
        isInsideLibrary,
        distanceFromLibrary: Math.round(distanceFromLibrary),
        entryType,
        statusChange,
        message: statusChange
          ? `Student ${
              entryType === "entry" ? "entered" : "exited"
            } the library`
          : `Student location updated${
              isInsideLibrary ? " (inside library)" : " (outside library)"
            }`,
      },
    });

    logger.info(
      `GPS Update: Student ${actualStudentId} - ${
        isInsideLibrary ? "INSIDE" : "OUTSIDE"
      } library (${Math.round(distanceFromLibrary)}m away)`
    );
  } catch (error) {
    logger.error("Error updating student location:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

/**
 * @desc    Grant location permission for student
 * @route   POST /api/gps-tracking/grant-permission
 * @access  Public (Phase 1)
 */
router.post("/grant-permission", async (req, res) => {
  try {
    const { studentId, registerNumber, deviceInfo } = req.body;
    const ipAddress = req.ip;
    const userAgent = req.headers["user-agent"];

    if (!studentId && !registerNumber) {
      return res.status(400).json({
        status: "error",
        message: "Student ID or register number is required",
      });
    }

    // Get student ID if register number provided
    let actualStudentId = studentId;
    if (!studentId && registerNumber) {
      const [students] = await pool.execute(
        "SELECT id FROM students WHERE register_number = ?",
        [registerNumber]
      );

      if (students.length === 0) {
        return res.status(404).json({
          status: "error",
          message: "Student not found",
        });
      }
      actualStudentId = students[0].id;
    }

    // Grant permission
    await pool.execute(
      `
      INSERT INTO student_location_permissions 
      (student_id, permission_granted, device_info, ip_address, user_agent, is_active)
      VALUES (?, TRUE, ?, ?, ?, TRUE)
      ON DUPLICATE KEY UPDATE
      permission_granted = TRUE,
      permission_date = CURRENT_TIMESTAMP,
      device_info = VALUES(device_info),
      ip_address = VALUES(ip_address),
      user_agent = VALUES(user_agent),
      is_active = TRUE
    `,
      [actualStudentId, JSON.stringify(deviceInfo || {}), ipAddress, userAgent]
    );

    res.json({
      status: "success",
      message: "Location permission granted successfully",
    });

    logger.info(`Location permission granted for student ${actualStudentId}`);
  } catch (error) {
    logger.error("Error granting location permission:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

/**
 * @desc    Get current library occupancy
 * @route   GET /api/gps-tracking/current-occupancy
 * @access  Librarian/Admin
 */
router.get("/current-occupancy", async (req, res) => {
  try {
    const [occupancy] = await pool.execute(`
      SELECT 
        co.*,
        s.name,
        s.register_number,
        s.department,
        s.year_of_study,
        TIMESTAMPDIFF(MINUTE, co.entry_time, NOW()) as minutes_inside
      FROM current_library_occupancy co
      JOIN students s ON co.student_id = s.id
      WHERE co.status = 'inside'
      ORDER BY co.entry_time DESC
    `);

    const totalCount = occupancy.length;

    res.json({
      status: "success",
      data: {
        totalCount,
        students: occupancy,
      },
    });
  } catch (error) {
    logger.error("Error fetching current occupancy:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

/**
 * @desc    Get entry/exit logs
 * @route   GET /api/gps-tracking/entry-logs
 * @access  Librarian/Admin
 */
router.get("/entry-logs", async (req, res) => {
  try {
    const { page = 1, limit = 50, date, studentId } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = "WHERE 1=1";
    let params = [];

    if (date) {
      whereClause += " AND DATE(el.entry_time) = ?";
      params.push(date);
    }

    if (studentId) {
      whereClause += " AND el.student_id = ?";
      params.push(studentId);
    }

    const [logs] = await pool.execute(
      `
      SELECT 
        el.*,
        s.name,
        s.register_number,
        s.department
      FROM library_entry_logs el
      JOIN students s ON el.student_id = s.id
      ${whereClause}
      ORDER BY el.entry_time DESC
      LIMIT ${limit} OFFSET ${offset}
    `,
      params
    );

    // Get total count
    const [countResult] = await pool.execute(
      `
      SELECT COUNT(*) as total
      FROM library_entry_logs el
      JOIN students s ON el.student_id = s.id
      ${whereClause}
    `,
      params
    );

    res.json({
      status: "success",
      data: {
        logs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult[0].total,
          totalPages: Math.ceil(countResult[0].total / limit),
        },
      },
    });
  } catch (error) {
    logger.error("Error fetching entry logs:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

/**
 * @desc    Get GPS tracking analytics
 * @route   GET /api/gps-tracking/analytics
 * @access  Librarian/Admin
 */
router.get("/analytics", async (req, res) => {
  try {
    // Today's stats
    const [todayStats] = await pool.execute(`
      SELECT 
        COUNT(CASE WHEN entry_type = 'entry' THEN 1 END) as entries_today,
        COUNT(CASE WHEN entry_type = 'exit' THEN 1 END) as exits_today,
        COUNT(DISTINCT student_id) as unique_visitors_today
      FROM library_entry_logs 
      WHERE DATE(entry_time) = CURDATE()
    `);

    // Current occupancy count
    const [occupancyCount] = await pool.execute(
      "SELECT COUNT(*) as current_count FROM current_library_occupancy WHERE status = 'inside'"
    );

    // Most active hours today
    const [hourlyStats] = await pool.execute(`
      SELECT 
        HOUR(entry_time) as hour,
        COUNT(*) as activities
      FROM library_entry_logs 
      WHERE DATE(entry_time) = CURDATE() AND entry_type = 'entry'
      GROUP BY HOUR(entry_time)
      ORDER BY hour
    `);

    // Department-wise visitors today
    const [departmentStats] = await pool.execute(`
      SELECT 
        s.department,
        COUNT(DISTINCT el.student_id) as unique_visitors
      FROM library_entry_logs el
      JOIN students s ON el.student_id = s.id
      WHERE DATE(el.entry_time) = CURDATE() AND el.entry_type = 'entry'
      GROUP BY s.department
      ORDER BY unique_visitors DESC
    `);

    res.json({
      status: "success",
      data: {
        todayStats: todayStats[0],
        currentOccupancy: occupancyCount[0].current_count,
        hourlyActivity: hourlyStats,
        departmentStats,
      },
    });
  } catch (error) {
    logger.error("Error fetching GPS analytics:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

module.exports = router;
