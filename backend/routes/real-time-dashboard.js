const express = require("express");
const router = express.Router();
const { pool } = require("../config/database");
const logger = require("../utils/logger");

// Real-time library occupancy
router.get("/occupancy", async (req, res) => {
  try {
    // Current time
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];
    const currentTime = now.toTimeString().slice(0, 5);

    // Get current occupancy for different resources
    const [seatOccupancy] = await pool.execute(
      `
      SELECT 
        COUNT(shs.id) as total_seats,
        COUNT(CASE WHEN b.id IS NOT NULL THEN 1 END) as occupied_seats,
        COUNT(CASE WHEN shs.status = 'available' AND b.id IS NULL THEN 1 END) as available_seats
      FROM study_hall_seats shs
      LEFT JOIN bookings b ON shs.id = b.resource_id 
        AND b.resource_type = 'seat' 
        AND b.booking_date = ? 
        AND b.start_time <= ? 
        AND b.end_time > ?
        AND b.status = 'confirmed'
    `,
      [currentDate, currentTime, currentTime]
    );

    const [computerOccupancy] = await pool.execute(
      `
      SELECT 
        COUNT(cs.id) as total_computers,
        COUNT(CASE WHEN b.id IS NOT NULL THEN 1 END) as occupied_computers,
        COUNT(CASE WHEN cs.status = 'available' AND b.id IS NULL THEN 1 END) as available_computers
      FROM computer_systems cs
      LEFT JOIN bookings b ON cs.id = b.resource_id 
        AND b.resource_type = 'computer' 
        AND b.booking_date = ? 
        AND b.start_time <= ? 
        AND b.end_time > ?
        AND b.status = 'confirmed'
    `,
      [currentDate, currentTime, currentTime]
    );

    const [studyRoomOccupancy] = await pool.execute(
      `
      SELECT 
        COUNT(sr.id) as total_rooms,
        COUNT(CASE WHEN b.id IS NOT NULL THEN 1 END) as occupied_rooms,
        COUNT(CASE WHEN sr.status = 'available' AND b.id IS NULL THEN 1 END) as available_rooms
      FROM study_rooms sr
      LEFT JOIN bookings b ON sr.id = b.resource_id 
        AND b.resource_type = 'study_room' 
        AND b.booking_date = ? 
        AND b.start_time <= ? 
        AND b.end_time > ?
        AND b.status = 'confirmed'
    `,
      [currentDate, currentTime, currentTime]
    );

    // Get active users (logged in within last 4 hours)
    const [activeUsers] = await pool.execute(`
      SELECT COUNT(*) as count 
      FROM user_activity 
      WHERE activity_type = 'login' 
      AND timestamp >= DATE_SUB(NOW(), INTERVAL 4 HOUR)
    `);

    // Calculate occupancy percentages
    const seatData = seatOccupancy[0];
    const computerData = computerOccupancy[0];
    const roomData = studyRoomOccupancy[0];

    const occupancyData = {
      timestamp: now.toISOString(),
      seats: {
        total: seatData.total_seats,
        occupied: seatData.occupied_seats,
        available: seatData.available_seats,
        occupancy_rate:
          seatData.total_seats > 0
            ? Math.round((seatData.occupied_seats / seatData.total_seats) * 100)
            : 0,
      },
      computers: {
        total: computerData.total_computers,
        occupied: computerData.occupied_computers,
        available: computerData.available_computers,
        occupancy_rate:
          computerData.total_computers > 0
            ? Math.round(
                (computerData.occupied_computers /
                  computerData.total_computers) *
                  100
              )
            : 0,
      },
      study_rooms: {
        total: roomData.total_rooms,
        occupied: roomData.occupied_rooms,
        available: roomData.available_rooms,
        occupancy_rate:
          roomData.total_rooms > 0
            ? Math.round((roomData.occupied_rooms / roomData.total_rooms) * 100)
            : 0,
      },
      active_users: activeUsers[0].count,
    };

    res.status(200).json({
      success: true,
      data: occupancyData,
    });
  } catch (error) {
    logger.error("Real-time occupancy error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get real-time occupancy",
    });
  }
});

// Usage statistics by department
router.get("/usage/departments", async (req, res) => {
  try {
    const { timeRange = "7d" } = req.query;

    let dateFilter = "";
    switch (timeRange) {
      case "24h":
        dateFilter = "WHERE DATE(b.booking_date) = CURDATE()";
        break;
      case "7d":
        dateFilter =
          "WHERE b.booking_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)";
        break;
      case "30d":
        dateFilter =
          "WHERE b.booking_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)";
        break;
      case "90d":
        dateFilter =
          "WHERE b.booking_date >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)";
        break;
    }

    const [departmentUsage] = await pool.execute(`
      SELECT 
        u.department,
        COUNT(b.id) as total_bookings,
        COUNT(CASE WHEN b.status = 'completed' THEN 1 END) as completed_bookings,
        COUNT(CASE WHEN b.resource_type = 'seat' THEN 1 END) as seat_bookings,
        COUNT(CASE WHEN b.resource_type = 'computer' THEN 1 END) as computer_bookings,
        COUNT(CASE WHEN b.resource_type = 'study_room' THEN 1 END) as room_bookings,
        AVG(TIME_TO_SEC(TIMEDIFF(b.end_time, b.start_time))/3600) as avg_duration_hours
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      ${dateFilter}
      GROUP BY u.department
      ORDER BY total_bookings DESC
    `);

    res.status(200).json({
      success: true,
      data: {
        time_range: timeRange,
        departments: departmentUsage,
      },
    });
  } catch (error) {
    logger.error("Department usage error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get department usage statistics",
    });
  }
});

// Peak hours analysis
router.get("/usage/peak-hours", async (req, res) => {
  try {
    const { days = 7 } = req.query;

    const [peakHours] = await pool.execute(
      `
      SELECT 
        HOUR(b.start_time) as hour,
        COUNT(b.id) as booking_count,
        COUNT(CASE WHEN b.resource_type = 'seat' THEN 1 END) as seat_bookings,
        COUNT(CASE WHEN b.resource_type = 'computer' THEN 1 END) as computer_bookings,
        COUNT(CASE WHEN b.resource_type = 'study_room' THEN 1 END) as room_bookings
      FROM bookings b
      WHERE b.booking_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
        AND b.status IN ('confirmed', 'completed')
      GROUP BY HOUR(b.start_time)
      ORDER BY hour
    `,
      [days]
    );

    // Format hours for better readability
    const formattedPeakHours = peakHours.map((hour) => ({
      ...hour,
      time_slot: `${String(hour.hour).padStart(2, "0")}:00 - ${String(
        hour.hour + 1
      ).padStart(2, "0")}:00`,
    }));

    res.status(200).json({
      success: true,
      data: {
        days_analyzed: days,
        peak_hours: formattedPeakHours,
      },
    });
  } catch (error) {
    logger.error("Peak hours error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get peak hours analysis",
    });
  }
});

// Resource utilization trends
router.get("/trends/utilization", async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const [utilizationTrends] = await pool.execute(
      `
      SELECT 
        DATE(b.booking_date) as date,
        COUNT(b.id) as total_bookings,
        COUNT(CASE WHEN b.resource_type = 'seat' THEN 1 END) as seat_bookings,
        COUNT(CASE WHEN b.resource_type = 'computer' THEN 1 END) as computer_bookings,
        COUNT(CASE WHEN b.resource_type = 'study_room' THEN 1 END) as room_bookings,
        AVG(TIME_TO_SEC(TIMEDIFF(b.end_time, b.start_time))/3600) as avg_duration
      FROM bookings b
      WHERE b.booking_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
        AND b.status IN ('confirmed', 'completed')
      GROUP BY DATE(b.booking_date)
      ORDER BY date DESC
    `,
      [days]
    );

    res.status(200).json({
      success: true,
      data: {
        days_analyzed: days,
        trends: utilizationTrends,
      },
    });
  } catch (error) {
    logger.error("Utilization trends error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get utilization trends",
    });
  }
});

// Book circulation statistics
router.get("/books/circulation", async (req, res) => {
  try {
    const { timeRange = "30d" } = req.query;

    let dateFilter = "";
    switch (timeRange) {
      case "7d":
        dateFilter =
          "WHERE DATE(bt.transaction_date) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)";
        break;
      case "30d":
        dateFilter =
          "WHERE DATE(bt.transaction_date) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)";
        break;
      case "90d":
        dateFilter =
          "WHERE DATE(bt.transaction_date) >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)";
        break;
    }

    // Book transaction statistics
    const [bookStats] = await pool.execute(`
      SELECT 
        COUNT(CASE WHEN bt.transaction_type = 'issue' THEN 1 END) as total_issued,
        COUNT(CASE WHEN bt.transaction_type = 'return' THEN 1 END) as total_returned,
        COUNT(CASE WHEN bt.transaction_type = 'renew' THEN 1 END) as total_renewed,
        COUNT(CASE WHEN bt.transaction_type = 'reserve' THEN 1 END) as total_reserved
      FROM book_transactions bt
      ${dateFilter}
    `);

    // Most popular books
    const [popularBooks] = await pool.execute(`
      SELECT 
        b.title,
        b.author,
        b.department,
        COUNT(bt.id) as transaction_count,
        COUNT(CASE WHEN bt.transaction_type = 'issue' THEN 1 END) as issue_count
      FROM book_transactions bt
      JOIN books b ON bt.book_id = b.id
      ${dateFilter}
      GROUP BY b.id, b.title, b.author, b.department
      ORDER BY transaction_count DESC
      LIMIT 10
    `);

    // Department-wise circulation
    const [departmentCirculation] = await pool.execute(`
      SELECT 
        b.department,
        COUNT(bt.id) as transaction_count,
        COUNT(CASE WHEN bt.transaction_type = 'issue' THEN 1 END) as issues,
        COUNT(CASE WHEN bt.transaction_type = 'return' THEN 1 END) as returns
      FROM book_transactions bt
      JOIN books b ON bt.book_id = b.id
      ${dateFilter}
      GROUP BY b.department
      ORDER BY transaction_count DESC
    `);

    res.status(200).json({
      success: true,
      data: {
        time_range: timeRange,
        overall_stats: bookStats[0],
        popular_books: popularBooks,
        department_circulation: departmentCirculation,
      },
    });
  } catch (error) {
    logger.error("Book circulation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get book circulation statistics",
    });
  }
});

// User activity overview
router.get("/users/activity", async (req, res) => {
  try {
    const { timeRange = "7d" } = req.query;

    let dateFilter = "";
    switch (timeRange) {
      case "24h":
        dateFilter = "WHERE DATE(ua.timestamp) = CURDATE()";
        break;
      case "7d":
        dateFilter =
          "WHERE DATE(ua.timestamp) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)";
        break;
      case "30d":
        dateFilter =
          "WHERE DATE(ua.timestamp) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)";
        break;
    }

    // User activity statistics
    const [activityStats] = await pool.execute(`
      SELECT 
        COUNT(CASE WHEN ua.activity_type = 'login' THEN 1 END) as total_logins,
        COUNT(CASE WHEN ua.activity_type = 'logout' THEN 1 END) as total_logouts,
        COUNT(CASE WHEN ua.activity_type = 'card_entry' THEN 1 END) as card_entries,
        COUNT(CASE WHEN ua.activity_type = 'card_exit' THEN 1 END) as card_exits,
        COUNT(DISTINCT ua.user_id) as unique_users
      FROM user_activity ua
      ${dateFilter}
    `);

    // Most active users
    const [activeUsers] = await pool.execute(`
      SELECT 
        u.first_name,
        u.last_name,
        u.register_number,
        u.department,
        COUNT(ua.id) as activity_count,
        COUNT(CASE WHEN ua.activity_type = 'login' THEN 1 END) as logins
      FROM user_activity ua
      JOIN users u ON ua.user_id = u.id
      ${dateFilter}
      GROUP BY u.id, u.first_name, u.last_name, u.register_number, u.department
      ORDER BY activity_count DESC
      LIMIT 10
    `);

    // Daily activity trend
    const [dailyActivity] = await pool.execute(`
      SELECT 
        DATE(ua.timestamp) as date,
        COUNT(ua.id) as total_activities,
        COUNT(CASE WHEN ua.activity_type = 'login' THEN 1 END) as logins,
        COUNT(DISTINCT ua.user_id) as unique_users
      FROM user_activity ua
      ${dateFilter}
      GROUP BY DATE(ua.timestamp)
      ORDER BY date DESC
      LIMIT 30
    `);

    res.status(200).json({
      success: true,
      data: {
        time_range: timeRange,
        overall_stats: activityStats[0],
        most_active_users: activeUsers,
        daily_activity: dailyActivity,
      },
    });
  } catch (error) {
    logger.error("User activity error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user activity statistics",
    });
  }
});

// System health metrics
router.get("/system/health", async (req, res) => {
  try {
    // Database connection test
    const [dbTest] = await pool.execute("SELECT 1 as test");

    // Get system statistics
    const [systemStats] = await pool.execute(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE role = 'student') as total_students,
        (SELECT COUNT(*) FROM books) as total_books,
        (SELECT COUNT(*) FROM study_hall_seats) as total_seats,
        (SELECT COUNT(*) FROM computer_systems) as total_computers,
        (SELECT COUNT(*) FROM study_rooms) as total_study_rooms,
        (SELECT COUNT(*) FROM question_papers) as total_question_papers,
        (SELECT COUNT(*) FROM bookings WHERE booking_date = CURDATE()) as todays_bookings,
        (SELECT COUNT(*) FROM user_activity WHERE DATE(timestamp) = CURDATE()) as todays_activities
    `);

    // Resource status
    const [resourceStatus] = await pool.execute(`
      SELECT 
        'seats' as resource_type,
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'available' THEN 1 END) as available,
        COUNT(CASE WHEN status = 'maintenance' THEN 1 END) as maintenance,
        COUNT(CASE WHEN status = 'occupied' THEN 1 END) as occupied
      FROM study_hall_seats
      UNION ALL
      SELECT 
        'computers' as resource_type,
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'available' THEN 1 END) as available,
        COUNT(CASE WHEN status = 'maintenance' THEN 1 END) as maintenance,
        COUNT(CASE WHEN status = 'occupied' THEN 1 END) as occupied
      FROM computer_systems
      UNION ALL
      SELECT 
        'study_rooms' as resource_type,
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'available' THEN 1 END) as available,
        COUNT(CASE WHEN status = 'maintenance' THEN 1 END) as maintenance,
        COUNT(CASE WHEN status = 'occupied' THEN 1 END) as occupied
      FROM study_rooms
    `);

    res.status(200).json({
      success: true,
      data: {
        database_status: dbTest.length > 0 ? "connected" : "error",
        system_stats: systemStats[0],
        resource_status: resourceStatus,
        last_updated: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error("System health error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get system health metrics",
    });
  }
});

// Live events feed (recent activities)
router.get("/live/events", async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const [recentEvents] = await pool.execute(
      `
      SELECT 
        'booking' as event_type,
        b.id as event_id,
        CONCAT(u.first_name, ' ', u.last_name) as user_name,
        u.department,
        CONCAT(b.resource_type, ' booking created') as event_description,
        b.created_at as timestamp
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      WHERE DATE(b.created_at) = CURDATE()
      
      UNION ALL
      
      SELECT 
        'user_activity' as event_type,
        ua.id as event_id,
        CONCAT(u.first_name, ' ', u.last_name) as user_name,
        u.department,
        ua.activity_type as event_description,
        ua.timestamp
      FROM user_activity ua
      JOIN users u ON ua.user_id = u.id
      WHERE DATE(ua.timestamp) = CURDATE()
      
      UNION ALL
      
      SELECT 
        'book_transaction' as event_type,
        bt.id as event_id,
        CONCAT(u.first_name, ' ', u.last_name) as user_name,
        u.department,
        CONCAT('Book ', bt.transaction_type) as event_description,
        bt.transaction_date as timestamp
      FROM book_transactions bt
      JOIN users u ON bt.user_id = u.id
      WHERE DATE(bt.transaction_date) = CURDATE()
      
      ORDER BY timestamp DESC
      LIMIT ?
    `,
      [parseInt(limit)]
    );

    res.status(200).json({
      success: true,
      data: {
        events: recentEvents,
        last_updated: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error("Live events error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get live events",
    });
  }
});

module.exports = router;
