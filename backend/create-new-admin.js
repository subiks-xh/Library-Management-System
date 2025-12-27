const bcrypt = require("bcrypt");
const mysql = require("mysql2/promise");

async function createNewAdmin() {
  let connection;

  try {
    console.log("🔧 Creating new admin user...");

    // Database connection
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "782457426@Eren",
      database: "tn_college_library",
    });

    console.log("✅ Connected to database");

    // New admin credentials
    const newAdminData = {
      firstName: "System",
      lastName: "Administrator",
      email: "superadmin@library.edu.in",
      phone: "9876543210",
      password: "LibraryAdmin2025!",
      role: "admin",
      department: "Administration",
      institution: "Tamil Nadu College Library System",
      isActive: true,
    };

    console.log("📋 New Admin Details:");
    console.log("Email:", newAdminData.email);
    console.log("Password:", newAdminData.password);

    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newAdminData.password, saltRounds);
    console.log("🔒 Password hashed successfully");

    // Check if user already exists
    const [existingUsers] = await connection.execute(
      "SELECT id FROM users WHERE email = ?",
      [newAdminData.email]
    );

    if (existingUsers.length > 0) {
      console.log("⚠️  User already exists, updating...");
      await connection.execute(
        "UPDATE users SET password_hash = ?, is_active = true WHERE email = ?",
        [hashedPassword, newAdminData.email]
      );
    } else {
      console.log("➕ Creating new user...");
      await connection.execute(
        `INSERT INTO users (first_name, last_name, email, phone, password_hash, role, department, institution, is_active, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          newAdminData.firstName,
          newAdminData.lastName,
          newAdminData.email,
          newAdminData.phone,
          hashedPassword,
          newAdminData.role,
          newAdminData.department,
          newAdminData.institution,
          newAdminData.isActive,
        ]
      );
    }

    // Verify the user was created/updated
    const [users] = await connection.execute(
      "SELECT id, first_name, last_name, email, role FROM users WHERE email = ?",
      [newAdminData.email]
    );

    if (users.length > 0) {
      console.log("✅ Admin user ready:", users[0]);
      console.log("");
      console.log("🎉 SUCCESS! Use these credentials to login:");
      console.log("📧 Email: " + newAdminData.email);
      console.log("🔑 Password: " + newAdminData.password);
      console.log("");
    }
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
    process.exit(0);
  }
}

createNewAdmin();
