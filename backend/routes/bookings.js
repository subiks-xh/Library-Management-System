const express = require("express");
const router = express.Router();
const { pool } = require("../config/database");
const logger = require("../utils/logger");
const { body, validationResult } = require("express-validator");

// Helper function to check availability
const checkResourceAvailability = async (
  resourceType,
  resourceId,
  date,
  startTime,
  endTime,
  excludeBookingId = null
) => {
  let table, idColumn;

  switch (resourceType) {
    case "seat":
      table = "study_hall_seats";
      idColumn = "id";
      break;
    case "computer":
      table = "computer_systems";
      idColumn = "id";
      break;
    case "study_room":
      table = "study_rooms";
      idColumn = "id";
      break;
    default:
      throw new Error("Invalid resource type");
  }

  // Check if resource exists and is available
  const [resource] = await pool.execute(
    `SELECT id, status FROM ${table} WHERE id = ?`,
    [resourceId]
  );

  if (resource.length === 0) {
    return { available: false, reason: "Resource not found" };
  }

  if (resource[0].status !== "available") {
    return { available: false, reason: `Resource is ${resource[0].status}` };
  }

  // Check for conflicting bookings
  let query = `
    SELECT COUNT(*) as conflicts 
    FROM bookings 
    WHERE resource_type = ? AND resource_id = ? 
    AND booking_date = ? 
    AND status IN ('confirmed', 'pending')
    AND (
      (start_time <= ? AND end_time > ?) OR
      (start_time < ? AND end_time >= ?) OR
      (start_time >= ? AND start_time < ?)
    )
  `;

  let params = [
    resourceType,
    resourceId,
    date,
    startTime,
    startTime,
    endTime,
    endTime,
    startTime,
    endTime,
  ];

  if (excludeBookingId) {
    query += " AND id != ?";
    params.push(excludeBookingId);
  }

  const [conflicts] = await pool.execute(query, params);

  return {
    available: conflicts[0].conflicts === 0,
    reason: conflicts[0].conflicts > 0 ? "Time slot already booked" : null,
  };
};

// Create new booking
router.post(
  "/",
  [
    body("resourceType")
      .isIn(["seat", "computer", "study_room"])
      .withMessage("Invalid resource type"),
    body("resourceId")
      .isInt({ min: 1 })
      .withMessage("Valid resource ID is required"),
    body("bookingDate").isDate().withMessage("Valid booking date is required"),
    body("startTime")
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage("Valid start time is required (HH:MM format)"),
    body("endTime")
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage("Valid end time is required (HH:MM format)"),
    body("userId").isInt({ min: 1 }).withMessage("Valid user ID is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const {
        userId,
        resourceType,
        resourceId,
        bookingDate,
        startTime,
        endTime,
        bookingNotes = null,
      } = req.body;

      // Validate booking date (not in the past)
      const today = new Date().toISOString().split("T")[0];
      if (bookingDate < today) {
        return res.status(400).json({
          success: false,
          message: "Cannot book for past dates",
        });
      }

      // Validate time range
      if (startTime >= endTime) {
        return res.status(400).json({
          success: false,
          message: "End time must be after start time",
        });
      }

      // Check availability
      const availability = await checkResourceAvailability(
        resourceType,
        resourceId,
        bookingDate,
        startTime,
        endTime
      );

      if (!availability.available) {
        return res.status(409).json({
          success: false,
          message: availability.reason,
        });
      }

      // Create booking
      const [result] = await pool.execute(
        `INSERT INTO bookings 
         (user_id, resource_type, resource_id, booking_date, start_time, end_time, booking_notes, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed')`,
        [
          userId,
          resourceType,
          resourceId,
          bookingDate,
          startTime,
          endTime,
          bookingNotes,
        ]
      );

      // Get booking details with user and resource info
      const [bookingDetails] = await pool.execute(
        `SELECT b.*, u.first_name, u.last_name, u.email,
                CASE 
                  WHEN b.resource_type = 'seat' THEN s.seat_number
                  WHEN b.resource_type = 'computer' THEN c.system_id
                  WHEN b.resource_type = 'study_room' THEN r.room_number
                END as resource_identifier
         FROM bookings b
         JOIN users u ON b.user_id = u.id
         LEFT JOIN study_hall_seats s ON b.resource_type = 'seat' AND b.resource_id = s.id
         LEFT JOIN computer_systems c ON b.resource_type = 'computer' AND b.resource_id = c.id
         LEFT JOIN study_rooms r ON b.resource_type = 'study_room' AND b.resource_id = r.id
         WHERE b.id = ?`,
        [result.insertId]
      );

      logger.info(
        `Booking created: ${resourceType} ${resourceId} for user ${userId}`
      );

      res.status(201).json({
        success: true,
        message: "Booking created successfully",
        data: bookingDetails[0],
      });
    } catch (error) {
      logger.error("Booking creation error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create booking",
      });
    }
  }
);

// Get user's bookings
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { status = "all", limit = 10, offset = 0 } = req.query;

    let whereClause = "WHERE b.user_id = ?";
    let params = [userId];

    if (status !== "all") {
      whereClause += " AND b.status = ?";
      params.push(status);
    }

    params.push(parseInt(limit), parseInt(offset));

    const [bookings] = await pool.execute(
      `SELECT b.*, 
              CASE 
                WHEN b.resource_type = 'seat' THEN s.seat_number
                WHEN b.resource_type = 'computer' THEN c.system_id
                WHEN b.resource_type = 'study_room' THEN r.room_number
              END as resource_identifier,
              CASE 
                WHEN b.resource_type = 'seat' THEN s.section
                WHEN b.resource_type = 'computer' THEN c.location
                WHEN b.resource_type = 'study_room' THEN r.floor
              END as resource_location
       FROM bookings b
       LEFT JOIN study_hall_seats s ON b.resource_type = 'seat' AND b.resource_id = s.id
       LEFT JOIN computer_systems c ON b.resource_type = 'computer' AND b.resource_id = c.id
       LEFT JOIN study_rooms r ON b.resource_type = 'study_room' AND b.resource_id = r.id
       ${whereClause}
       ORDER BY b.booking_date DESC, b.start_time DESC
       LIMIT ? OFFSET ?`,
      params
    );

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    logger.error("Get user bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user bookings",
    });
  }
});

// Get available resources
router.get("/available", async (req, res) => {
  try {
    const { resourceType, date, startTime, endTime } = req.query;

    if (!resourceType || !date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Resource type, date, start time, and end time are required",
      });
    }

    let table, columns;
    switch (resourceType) {
      case "seat":
        table = "study_hall_seats";
        columns = "id, seat_number as identifier, section as location, floor";
        break;
      case "computer":
        table = "computer_systems";
        columns = "id, system_id as identifier, location, specifications";
        break;
      case "study_room":
        table = "study_rooms";
        columns =
          "id, room_number as identifier, floor as location, capacity, has_projector";
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid resource type",
        });
    }

    // Get all resources of the specified type
    const [allResources] = await pool.execute(
      `SELECT ${columns} FROM ${table} WHERE status = 'available'`
    );

    // Check availability for each resource
    const availableResources = [];
    for (const resource of allResources) {
      const availability = await checkResourceAvailability(
        resourceType,
        resource.id,
        date,
        startTime,
        endTime
      );

      if (availability.available) {
        availableResources.push(resource);
      }
    }

    res.status(200).json({
      success: true,
      data: {
        resourceType,
        date,
        timeSlot: `${startTime} - ${endTime}`,
        available: availableResources.length,
        total: allResources.length,
        resources: availableResources,
      },
    });
  } catch (error) {
    logger.error("Get available resources error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get available resources",
    });
  }
});

// Update booking
router.put("/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { startTime, endTime, bookingNotes, status } = req.body;

    // Get current booking details
    const [currentBooking] = await pool.execute(
      `SELECT * FROM bookings WHERE id = ?`,
      [bookingId]
    );

    if (currentBooking.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const booking = currentBooking[0];

    // If updating time, check availability
    if (startTime && endTime) {
      const availability = await checkResourceAvailability(
        booking.resource_type,
        booking.resource_id,
        booking.booking_date,
        startTime,
        endTime,
        bookingId
      );

      if (!availability.available) {
        return res.status(409).json({
          success: false,
          message: availability.reason,
        });
      }
    }

    // Update booking
    const updateFields = [];
    const updateValues = [];

    if (startTime) {
      updateFields.push("start_time = ?");
      updateValues.push(startTime);
    }
    if (endTime) {
      updateFields.push("end_time = ?");
      updateValues.push(endTime);
    }
    if (bookingNotes !== undefined) {
      updateFields.push("booking_notes = ?");
      updateValues.push(bookingNotes);
    }
    if (status) {
      updateFields.push("status = ?");
      updateValues.push(status);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields to update",
      });
    }

    updateValues.push(bookingId);

    await pool.execute(
      `UPDATE bookings SET ${updateFields.join(", ")} WHERE id = ?`,
      updateValues
    );

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
    });
  } catch (error) {
    logger.error("Update booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update booking",
    });
  }
});

// Cancel booking
router.delete("/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { userId } = req.body;

    // Verify booking exists and belongs to user (or user is admin)
    const [booking] = await pool.execute(
      `SELECT b.*, u.role FROM bookings b 
       JOIN users u ON u.id = ? 
       WHERE b.id = ?`,
      [userId, bookingId]
    );

    if (booking.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const bookingData = booking[0];

    // Check if user owns the booking or is admin/librarian
    if (
      bookingData.user_id !== userId &&
      !["admin", "librarian"].includes(bookingData.role)
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Cancel the booking
    await pool.execute(
      `UPDATE bookings SET status = 'cancelled' WHERE id = ?`,
      [bookingId]
    );

    logger.info(`Booking ${bookingId} cancelled by user ${userId}`);

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    logger.error("Cancel booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
    });
  }
});

// Get booking statistics
router.get("/stats/overview", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let dateFilter = "";
    let params = [];

    if (startDate && endDate) {
      dateFilter = "WHERE booking_date BETWEEN ? AND ?";
      params = [startDate, endDate];
    }

    const [stats] = await pool.execute(
      `SELECT 
         COUNT(*) as total_bookings,
         COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed,
         COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
         COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled,
         COUNT(CASE WHEN status = 'no_show' THEN 1 END) as no_shows,
         AVG(TIME_TO_SEC(TIMEDIFF(end_time, start_time))/3600) as avg_duration_hours
       FROM bookings ${dateFilter}`,
      params
    );

    const [byResource] = await pool.execute(
      `SELECT resource_type, COUNT(*) as count
       FROM bookings ${dateFilter}
       GROUP BY resource_type`,
      params
    );

    const [byDate] = await pool.execute(
      `SELECT DATE(booking_date) as date, COUNT(*) as bookings
       FROM bookings ${dateFilter}
       GROUP BY DATE(booking_date)
       ORDER BY date DESC
       LIMIT 30`,
      params
    );

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0],
        by_resource: byResource,
        recent_dates: byDate,
      },
    });
  } catch (error) {
    logger.error("Booking stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get booking statistics",
    });
  }
});

module.exports = router;
