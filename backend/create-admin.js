const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
require("dotenv").config();

async function createAdminUser() {
  let connection;

  try {
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "college_library",
    });

    console.log("Connected to database successfully");

    // Hash the password
    const adminPassword = "LibraryAdmin2025!";
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Check if admin user already exists
    const [existingUsers] = await connection.execute(
      "SELECT id, email FROM users WHERE email = ?",
      ["superadmin@library.edu.in"]
    );

    if (existingUsers.length > 0) {
      // Update existing admin user
      await connection.execute(
        `UPDATE users SET 
         password_hash = ?, 
         role = 'admin', 
         is_active = 1,
         updated_at = NOW()
         WHERE email = ?`,
        [hashedPassword, "superadmin@library.edu.in"]
      );
      console.log("✅ Admin user updated successfully");
    } else {
      // Create new admin user with unique register number
      const timestamp = Date.now().toString().slice(-6);
      await connection.execute(
        `INSERT INTO users (
          first_name, last_name, email, password_hash, role, department, 
          register_number, phone, is_active, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          "Super",
          "Admin",
          "superadmin@library.edu.in",
          hashedPassword,
          "admin",
          "ADMIN",
          `ADMIN${timestamp}`,
          "+91-9876543210",
          1,
        ]
      );
      console.log("✅ Admin user created successfully");
    }

    // Also create alternative admin accounts
    const altAdminPassword = await bcrypt.hash("admin123", 12);

    // Check and create/update alternative admin
    const [existingAlt] = await connection.execute(
      "SELECT id FROM users WHERE email = ?",
      ["admin@library.edu.in"]
    );

    if (existingAlt.length > 0) {
      await connection.execute(
        'UPDATE users SET password_hash = ?, role = "admin", is_active = 1 WHERE email = ?',
        [altAdminPassword, "admin@library.edu.in"]
      );
    } else {
      await connection.execute(
        `INSERT INTO users (
          first_name, last_name, email, password_hash, role, department, 
          register_number, phone, is_active, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          "Admin",
          "User",
          "admin@library.edu.in",
          altAdminPassword,
          "admin",
          "ADMIN",
          "ADMIN002",
          "+91-9876543211",
          1,
        ]
      );
    }

    console.log("✅ Alternative admin user ready");

    // Test login credentials
    const [testUser] = await connection.execute(
      "SELECT id, email, password_hash, role FROM users WHERE email = ?",
      ["superadmin@library.edu.in"]
    );

    if (testUser.length > 0) {
      const isPasswordValid = await bcrypt.compare(
        "LibraryAdmin2025!",
        testUser[0].password_hash
      );
      console.log(
        "🔐 Password verification:",
        isPasswordValid ? "✅ VALID" : "❌ INVALID"
      );
      console.log("👤 User details:", {
        id: testUser[0].id,
        email: testUser[0].email,
        role: testUser[0].role,
      });
    }

    console.log("\n🎉 Admin setup completed successfully!");
    console.log("\n📋 Login Credentials:");
    console.log("Email: superadmin@library.edu.in");
    console.log("Password: LibraryAdmin2025!");
    console.log("\n📋 Alternative Credentials:");
    console.log("Email: admin@library.edu.in");
    console.log("Password: admin123");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createAdminUser();
