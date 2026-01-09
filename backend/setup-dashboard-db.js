const mysql = require("mysql2/promise");
require("dotenv").config();

async function checkDashboardRequirements() {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "college_library",
    });

    console.log("🔍 CHECKING DATABASE FOR DASHBOARD REQUIREMENTS\n");

    // 1. Check available tables
    const [tables] = await connection.execute("SHOW TABLES");
    const tableNames = tables.map((t) => Object.values(t)[0]);
    console.log("📋 Available Tables:", tableNames);

    // 2. Check specific tables needed for dashboard
    const requiredTables = [
      "books",
      "categories",
      "users",
      "students",
      "issues",
      "returns",
    ];

    for (const table of requiredTables) {
      try {
        const [columns] = await connection.execute(`DESCRIBE ${table}`);
        console.log(`\n✅ ${table.toUpperCase()} TABLE COLUMNS:`);
        columns.forEach((col) => console.log(`   - ${col.Field}: ${col.Type}`));
      } catch (error) {
        console.log(`\n❌ ${table.toUpperCase()} TABLE: MISSING`);

        // Create missing tables
        if (table === "books") {
          await connection.execute(`
            CREATE TABLE books (
              id INT PRIMARY KEY AUTO_INCREMENT,
              title VARCHAR(255) NOT NULL,
              author VARCHAR(255) NOT NULL,
              isbn VARCHAR(50),
              accession_number VARCHAR(100) UNIQUE,
              category_id INT,
              department VARCHAR(100),
              publisher VARCHAR(255),
              publication_year YEAR,
              pages INT,
              price DECIMAL(10,2),
              copies_total INT DEFAULT 1,
              available_copies INT DEFAULT 1,
              location VARCHAR(100),
              description TEXT,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
          `);
          console.log(`   ✅ Created ${table} table`);
        }

        if (table === "categories") {
          await connection.execute(`
            CREATE TABLE categories (
              id INT PRIMARY KEY AUTO_INCREMENT,
              name VARCHAR(255) NOT NULL,
              description TEXT,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
          `);
          console.log(`   ✅ Created ${table} table`);
        }

        if (table === "students") {
          await connection.execute(`
            CREATE TABLE students (
              id INT PRIMARY KEY AUTO_INCREMENT,
              user_id INT,
              student_id VARCHAR(50) UNIQUE,
              course VARCHAR(100),
              semester INT,
              year INT,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (user_id) REFERENCES users(id)
            )
          `);
          console.log(`   ✅ Created ${table} table`);
        }

        if (table === "issues") {
          await connection.execute(`
            CREATE TABLE issues (
              id INT PRIMARY KEY AUTO_INCREMENT,
              book_id INT,
              user_id INT,
              issue_date DATE,
              due_date DATE,
              returned_date DATE NULL,
              status ENUM('issued', 'returned', 'overdue') DEFAULT 'issued',
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (book_id) REFERENCES books(id),
              FOREIGN KEY (user_id) REFERENCES users(id)
            )
          `);
          console.log(`   ✅ Created ${table} table`);
        }

        if (table === "returns") {
          await connection.execute(`
            CREATE TABLE returns (
              id INT PRIMARY KEY AUTO_INCREMENT,
              issue_id INT,
              return_date DATE,
              fine_amount DECIMAL(10,2) DEFAULT 0,
              condition_notes TEXT,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (issue_id) REFERENCES issues(id)
            )
          `);
          console.log(`   ✅ Created ${table} table`);
        }
      }
    }

    // 3. Add sample data if tables are empty
    const [bookCount] = await connection.execute(
      "SELECT COUNT(*) as count FROM books"
    );
    if (bookCount[0].count === 0) {
      console.log("\n📚 ADDING SAMPLE DATA...");

      // Add sample categories
      await connection.execute(`
        INSERT INTO categories (name, description) VALUES
        ('Computer Science', 'Programming, algorithms, data structures'),
        ('Electronics', 'Circuit design, digital electronics'),
        ('Mechanical', 'Thermodynamics, mechanics, design'),
        ('Civil', 'Structural engineering, construction'),
        ('Mathematics', 'Calculus, algebra, statistics'),
        ('Physics', 'Quantum mechanics, thermodynamics')
      `);

      // Add sample books
      await connection.execute(`
        INSERT INTO books (title, author, isbn, accession_number, category_id, department, publisher, published_year, pages, price, total_copies, available_copies) VALUES
        ('Data Structures and Algorithms', 'Thomas H. Cormen', '9780262033848', 'CSE001', 1, 'CSE', 'MIT Press', 2009, 1312, 85.99, 5, 5),
        ('Computer Networks', 'Andrew Tanenbaum', '9780132126953', 'CSE002', 1, 'CSE', 'Pearson', 2011, 960, 75.50, 3, 3),
        ('Digital Electronics', 'Morris Mano', '9780131725621', 'ECE001', 2, 'ECE', 'Pearson', 2013, 512, 65.00, 4, 4),
        ('Thermodynamics', 'Yunus Cengel', '9780073398174', 'MECH001', 3, 'MECH', 'McGraw Hill', 2015, 896, 95.00, 2, 2),
        ('Structural Analysis', 'Russell Hibbeler', '9780134610672', 'CIVIL001', 4, 'CIVIL', 'Pearson', 2017, 736, 89.99, 3, 3)
      `);

      // Add sample students
      await connection.execute(`
        INSERT INTO students (user_id, student_id, course, semester, year)
        SELECT id, register_number, 'B.E.', 6, 2024 
        FROM users WHERE role = 'student' LIMIT 5
      `);

      console.log("   ✅ Sample data added successfully");
    }

    console.log("\n🎉 DATABASE SETUP COMPLETE FOR DASHBOARD");
  } catch (error) {
    console.error("❌ Database Error:", error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkDashboardRequirements();
