const bcrypt = require("bcrypt");
const { pool } = require("./config/database");

async function testLogin() {
  try {
    console.log("🔍 Testing login for admin@library.edu.in...");

    // Get user from database
    const [users] = await pool.execute(
      "SELECT email, password_hash FROM users WHERE email = ? AND is_active = true",
      ["admin@library.edu.in"]
    );

    if (users.length === 0) {
      console.log("❌ User not found or not active");
      return;
    }

    const user = users[0];
    console.log("✅ User found:", user.email);
    console.log("🔑 Stored hash:", user.password_hash.substring(0, 20) + "...");

    // Test password comparison
    const testPassword = "admin123";
    console.log("🔒 Testing password:", testPassword);

    const isValid = await bcrypt.compare(testPassword, user.password_hash);
    console.log("✅ Password valid:", isValid);

    // Test with different variations
    const variations = ["admin123", "Admin123", "ADMIN123"];
    for (const pwd of variations) {
      const result = await bcrypt.compare(pwd, user.password_hash);
      console.log(`Password "${pwd}": ${result}`);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    process.exit(0);
  }
}

testLogin();
