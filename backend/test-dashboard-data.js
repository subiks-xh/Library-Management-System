const { pool } = require("./config/database");

async function testDashboardData() {
  try {
    console.log("🧪 Testing Dashboard Data Completeness...\n");

    // Test 1: Check books data
    console.log("1. 📚 Testing Books Data:");
    const [books] = await pool.execute(`
      SELECT COUNT(*) as total_books, 
             SUM(total_copies) as total_copies,
             SUM(available_copies) as available_copies
      FROM books
    `);
    console.log(
      `   ✅ Books: ${books[0].total_books} titles, ${books[0].total_copies} total copies, ${books[0].available_copies} available`
    );

    // Test 2: Check students data
    console.log("\n2. 👥 Testing Students Data:");
    const [students] = await pool.execute(
      'SELECT COUNT(*) as count FROM students WHERE status = "active"'
    );
    console.log(`   ✅ Active Students: ${students[0].count}`);

    // Test 3: Check issued books
    console.log("\n3. 📖 Testing Issued Books Data:");
    const [issued] = await pool.execute(
      'SELECT COUNT(*) as count FROM issued_books WHERE status = "issued"'
    );
    console.log(`   ✅ Currently Issued Books: ${issued[0].count}`);

    // Test 4: Check overdue books
    console.log("\n4. ⚠️ Testing Overdue Books:");
    const [overdue] = await pool.execute(`
      SELECT COUNT(*) as count, 
             COALESCE(SUM(DATEDIFF(CURDATE(), due_date) * 1.00), 0) as total_overdue_fines
      FROM issued_books 
      WHERE status = "issued" AND due_date < CURDATE()
    `);
    console.log(
      `   ✅ Overdue Books: ${overdue[0].count}, Potential fines: ₹${overdue[0].total_overdue_fines}`
    );

    // Test 5: Check fines collected
    console.log("\n5. 💰 Testing Fines Data:");
    const [fines] = await pool.execute(
      'SELECT COALESCE(SUM(paid_amount), 0) as total FROM fines WHERE status = "paid"'
    );
    console.log(`   ✅ Total Fines Collected: ₹${fines[0].total}`);

    // Test 6: Check recent activities
    console.log("\n6. 📋 Testing Recent Activities:");
    const [activities] = await pool.execute(`
      SELECT 
        ib.id,
        s.register_number,
        s.name as student_name,
        b.title as book_title,
        ib.issue_date,
        ib.return_date,
        ib.status,
        ib.fine_amount
      FROM issued_books ib
      JOIN students s ON ib.student_id = s.id
      JOIN books b ON ib.book_id = b.id
      ORDER BY ib.created_at DESC
      LIMIT 5
    `);
    console.log(`   ✅ Recent Activities: ${activities.length} records`);
    activities.forEach((activity, index) => {
      console.log(
        `      ${index + 1}. ${activity.student_name} - "${
          activity.book_title
        }" - ${activity.status}`
      );
    });

    console.log("\n🎉 All Dashboard Data Tests Passed!");
    console.log("\n📊 Dashboard should show:");
    console.log(`   • Total Books: ${books[0].total_books}`);
    console.log(`   • Total Students: ${students[0].count}`);
    console.log(`   • Books Issued: ${issued[0].count}`);
    console.log(`   • Overdue Books: ${overdue[0].count}`);
    console.log(`   • Fines Collected: ₹${fines[0].total}`);
    console.log(`   • Available Books: ${books[0].available_copies}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Dashboard test failed:", error.message);
    process.exit(1);
  }
}

testDashboardData();
