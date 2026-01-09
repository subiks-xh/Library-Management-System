const { pool } = require("./config/database");
const bcrypt = require("bcrypt");

async function setLibrarianPassword() {
  try {
    console.log("🔧 Setting up Librarian Account Password...\n");

    // Set a standard password for the librarian
    const librarianPassword = "Librarian2025!";

    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(librarianPassword, saltRounds);

    // Update the librarian account
    const [result] = await pool.execute(
      "UPDATE users SET password_hash = ? WHERE email = ? AND role = ?",
      [hashedPassword, "librarian@library.edu.in", "librarian"]
    );

    if (result.affectedRows > 0) {
      console.log("✅ Librarian password updated successfully!");
      console.log("\n📋 LIBRARIAN LOGIN CREDENTIALS:");
      console.log("================================");
      console.log("📧 Email: librarian@library.edu.in");
      console.log("🔒 Password: Librarian2025!");
      console.log("👤 Role: Librarian");
      console.log("\n🎯 Use these credentials to login as a librarian.");
    } else {
      console.log("❌ No librarian account found or no changes made");
    }

    // Also show all account credentials for reference
    console.log("\n\n📋 ALL SYSTEM ACCOUNTS:");
    console.log("========================");

    const [users] = await pool.execute(
      "SELECT first_name, last_name, email, role FROM users ORDER BY role"
    );

    console.log("\n👑 ADMIN ACCOUNTS:");
    console.log("• Email: admin@library.edu.in (Demo login available)");
    console.log(
      "• Email: superadmin@library.edu.in | Password: LibraryAdmin2025!"
    );

    console.log("\n👨‍💼 LIBRARIAN ACCOUNTS:");
    console.log("• Email: librarian@library.edu.in | Password: Librarian2025!");

    console.log("\n👨‍🎓 STUDENT ACCOUNTS:");
    console.log("• Email: student@college.edu.in (Demo login available)");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

setLibrarianPassword();
