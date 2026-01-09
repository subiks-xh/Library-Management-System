const { pool } = require("./config/database");

async function addSampleIssues() {
  try {
    console.log("� Checking available books and students...");

    const [books] = await pool.execute("SELECT id, title FROM books LIMIT 10");
    console.log("Available books:");
    books.forEach((book) => console.log(`  ${book.id}: ${book.title}`));

    const [students] = await pool.execute(
      "SELECT id, name FROM students LIMIT 10"
    );
    console.log("\nAvailable students:");
    students.forEach((student) =>
      console.log(`  ${student.id}: ${student.name}`)
    );

    if (books.length === 0 || students.length === 0) {
      console.log("❌ Need both books and students to create issued books");
      process.exit(1);
    }

    console.log("\n📖 Adding sample issued books...");

    // Use actual IDs from the database
    const bookIds = books.map((b) => b.id);
    const studentIds = students.map((s) => s.id);

    // Add some issued books using existing IDs
    await pool.execute(`
      INSERT INTO issued_books (book_id, student_id, issue_date, due_date, status, fine_amount) VALUES
      (${bookIds[0]}, ${
      studentIds[0]
    }, CURDATE() - INTERVAL 5 DAY, CURDATE() + INTERVAL 9 DAY, 'issued', 0.00),
      (${bookIds[1] || bookIds[0]}, ${
      studentIds[1] || studentIds[0]
    }, CURDATE() - INTERVAL 10 DAY, CURDATE() + INTERVAL 4 DAY, 'issued', 0.00),
      (${bookIds[2] || bookIds[0]}, ${
      studentIds[2] || studentIds[0]
    }, CURDATE() - INTERVAL 20 DAY, CURDATE() - INTERVAL 6 DAY, 'overdue', 12.00)
    `);

    console.log("✅ Sample issued books added");

    // Get the IDs of the issued books we just created
    const [issuedBooks] = await pool.execute(
      "SELECT id FROM issued_books ORDER BY id DESC LIMIT 3"
    );

    if (issuedBooks.length > 0) {
      // Add some fines for overdue books using actual issued book ID
      await pool.execute(`
        INSERT INTO fines (student_id, issued_book_id, fine_type, amount, reason, status, fine_date, paid_amount) VALUES
        (${studentIds[2] || studentIds[0]}, ${
        issuedBooks[0].id
      }, 'overdue', 12.00, 'Book returned 6 days late', 'pending', CURDATE() - INTERVAL 6 DAY, 0.00)
      `);

      console.log("✅ Sample fines added");
    }

    // Verify data was added
    const [issued] = await pool.execute(
      "SELECT COUNT(*) as count FROM issued_books"
    );
    const [fines] = await pool.execute("SELECT COUNT(*) as count FROM fines");

    console.log(
      `📊 Current data: ${issued[0].count} issued books, ${fines[0].count} fines`
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

addSampleIssues();
