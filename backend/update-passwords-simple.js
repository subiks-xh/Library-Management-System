const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function updatePasswords() {
  return new Promise((resolve, reject) => {
    rl.question("Enter MySQL root password: ", async (password) => {
      rl.close();

      const config = {
        host: "localhost",
        user: "root",
        password: password,
        database: "tn_college_library",
      };

      try {
        const connection = await mysql.createConnection(config);

        // Hash the passwords
        const adminHash = await bcrypt.hash("admin123", 12);
        const studentHash = await bcrypt.hash("student123", 12);
        const librarianHash = await bcrypt.hash("lib123", 12);

        console.log("Generated hashes:");
        console.log("Admin hash:", adminHash);
        console.log("Student hash:", studentHash);
        console.log("Librarian hash:", librarianHash);

        // Update admin user
        await connection.execute(
          "UPDATE users SET password_hash = ? WHERE email = 'admin@library.edu.in'",
          [adminHash]
        );

        // Update student user
        await connection.execute(
          "UPDATE users SET password_hash = ? WHERE email = 'student@college.edu.in'",
          [studentHash]
        );

        // Update librarian user
        await connection.execute(
          "UPDATE users SET password_hash = ? WHERE email = 'librarian@library.edu.in'",
          [librarianHash]
        );

        console.log("✅ Passwords updated successfully!");

        // Verify the updates
        const [adminResult] = await connection.execute(
          "SELECT email, password_hash FROM users WHERE email = 'admin@library.edu.in'"
        );
        const [studentResult] = await connection.execute(
          "SELECT email, password_hash FROM users WHERE email = 'student@college.edu.in'"
        );

        console.log("\nVerification:");
        console.log(
          "Admin password hash:",
          adminResult[0]?.password_hash?.substring(0, 30) + "..."
        );
        console.log(
          "Student password hash:",
          studentResult[0]?.password_hash?.substring(0, 30) + "..."
        );

        await connection.end();
        resolve();
      } catch (error) {
        console.error("Error:", error.message);
        reject(error);
      }
    });
  });
}

updatePasswords().catch(console.error);
