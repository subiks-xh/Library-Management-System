const bcrypt = require("bcrypt");
const { pool } = require("./config/database");

async function fixAdminPassword() {
  try {
    console.log("🔧 Fixing admin password...");

    // Hash the correct password
    const password = "admin123";
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log("✅ Generated hash:", hashedPassword);

    // Update the admin user
    const [result] = await pool.execute(
      "UPDATE users SET password_hash = ? WHERE email = ?",
      [hashedPassword, "admin@library.edu.in"]
    );

    console.log("✅ Password updated for admin@library.edu.in");
    console.log("Affected rows:", result.affectedRows);

    // Test the password
    const [users] = await pool.execute(
      "SELECT email, password_hash FROM users WHERE email = ?",
      ["admin@library.edu.in"]
    );

    if (users.length > 0) {
      const isValid = await bcrypt.compare(password, users[0].password_hash);
      console.log("✅ Password verification:", isValid ? "SUCCESS" : "FAILED");
    }

    console.log("🎉 Admin password fix completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error fixing admin password:", error);
    process.exit(1);
  }
}

fixAdminPassword();
