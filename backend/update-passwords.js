const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");

const config = {
  host: "localhost",
  user: "root",
  password: "", // Enter your MySQL password here
  database: "tn_college_library",
};

async function updatePasswords() {
  try {
    const connection = await mysql.createConnection(config);

    // Hash the passwords
    const adminHash = await bcrypt.hash("admin123", 12);
    const studentHash = await bcrypt.hash("student123", 12);
    const librarianHash = await bcrypt.hash("lib123", 12);

    console.log("Generated hashes:");
    console.log("Admin:", adminHash);
    console.log("Student:", studentHash);
    console.log("Librarian:", librarianHash);

    // Update the passwords
    await connection.execute(
      "UPDATE users SET password_hash = ? WHERE email = ?",
      [adminHash, "admin@library.edu.in"]
    );
    await connection.execute(
      "UPDATE users SET password_hash = ? WHERE email = ?",
      [studentHash, "student@college.edu.in"]
    );
    await connection.execute(
      "UPDATE users SET password_hash = ? WHERE email = ?",
      [librarianHash, "librarian@library.edu.in"]
    );

    console.log("✅ Password hashes updated successfully");

    // Verify the update
    const [users] = await connection.execute(
      "SELECT email, password_hash FROM users ORDER BY email"
    );
    console.log("\nUpdated users:");
    users.forEach((user) => {
      console.log(`${user.email}: ${user.password_hash.substring(0, 20)}...`);
    });

    await connection.end();
  } catch (error) {
    console.error("Error:", error);
  }
}

updatePasswords();
