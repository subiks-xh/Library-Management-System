const { pool } = require("./config/database");

async function createGPSTrackingTables() {
  try {
    console.log("🛰️ Setting up GPS-Based Library Entry Tracking System...\n");

    // 1. Library Geofence Configuration Table
    console.log("📍 Creating library_geofence table...");
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS library_geofence (
        id INT AUTO_INCREMENT PRIMARY KEY,
        location_name VARCHAR(100) NOT NULL DEFAULT 'Main Library',
        center_latitude DECIMAL(10, 8) NOT NULL,
        center_longitude DECIMAL(11, 8) NOT NULL,
        radius_meters INT NOT NULL DEFAULT 50,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB
    `);

    // 2. Student Location Permissions Table
    console.log("🔐 Creating student_location_permissions table...");
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS student_location_permissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        permission_granted BOOLEAN DEFAULT FALSE,
        permission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        device_info TEXT,
        ip_address VARCHAR(45),
        user_agent TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
        UNIQUE KEY unique_student (student_id)
      ) ENGINE=InnoDB
    `);

    // 3. Library Entry/Exit Logs Table
    console.log("📋 Creating library_entry_logs table...");
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS library_entry_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        entry_type ENUM('entry', 'exit') NOT NULL,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        accuracy_meters INT,
        entry_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        device_info TEXT,
        ip_address VARCHAR(45),
        is_valid_location BOOLEAN DEFAULT TRUE,
        duration_minutes INT,
        notes TEXT,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
        INDEX idx_student_time (student_id, entry_time),
        INDEX idx_entry_type (entry_type),
        INDEX idx_entry_time (entry_time)
      ) ENGINE=InnoDB
    `);

    // 4. Current Library Occupancy Table
    console.log("🏛️ Creating current_library_occupancy table...");
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS current_library_occupancy (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        entry_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        current_latitude DECIMAL(10, 8),
        current_longitude DECIMAL(11, 8),
        study_area VARCHAR(50),
        status ENUM('inside', 'outside') DEFAULT 'inside',
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
        UNIQUE KEY unique_occupancy (student_id)
      ) ENGINE=InnoDB
    `);

    // Insert default library geofence (Tamil Nadu College coordinates as example)
    console.log("🎯 Setting up default library geofence...");
    await pool.execute(`
      INSERT INTO library_geofence 
      (location_name, center_latitude, center_longitude, radius_meters, is_active) 
      VALUES 
      ('Tamil Nadu College Library', 13.0827, 80.2707, 100, TRUE)
      ON DUPLICATE KEY UPDATE 
      center_latitude = VALUES(center_latitude),
      center_longitude = VALUES(center_longitude),
      radius_meters = VALUES(radius_meters)
    `);

    console.log("✅ GPS tracking tables created successfully!\n");

    // Show summary
    console.log("📊 GPS TRACKING SYSTEM SUMMARY:");
    console.log("=====================================");
    console.log("✅ library_geofence - Library boundary configuration");
    console.log("✅ student_location_permissions - Student consent management");
    console.log("✅ library_entry_logs - Complete entry/exit history");
    console.log("✅ current_library_occupancy - Real-time occupancy tracking");
    console.log(
      "\n🎯 Default Library Location: Tamil Nadu College (13.0827°N, 80.2707°E)"
    );
    console.log("📏 Detection Radius: 100 meters");
    console.log("\n🚀 Ready to implement GPS-based student tracking!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating GPS tracking tables:", error.message);
    process.exit(1);
  }
}

createGPSTrackingTables();
