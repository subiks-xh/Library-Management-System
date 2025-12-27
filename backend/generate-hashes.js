const bcrypt = require("bcrypt");

async function generateHashes() {
  try {
    const saltRounds = 12;

    const adminHash = await bcrypt.hash("admin123", saltRounds);
    const studentHash = await bcrypt.hash("student123", saltRounds);
    const librarianHash = await bcrypt.hash("librarian123", saltRounds);

    console.log("-- MySQL commands to update passwords:");
    console.log(
      `UPDATE users SET password_hash = '${adminHash}' WHERE email = 'admin@library.edu.in';`
    );
    console.log(
      `UPDATE users SET password_hash = '${studentHash}' WHERE email = 'student@college.edu.in';`
    );
    console.log(
      `UPDATE users SET password_hash = '${librarianHash}' WHERE email = 'librarian@library.edu.in';`
    );
  } catch (error) {
    console.error("Error:", error);
  }
}

generateHashes();
