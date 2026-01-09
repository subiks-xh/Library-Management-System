const http = require("http");

async function testAllAPIs() {
  console.log("🧪 Testing All Library Management APIs...\n");

  // Test 1: Health Check
  console.log("1. 🏥 Testing Health Check...");
  await testEndpoint("http://localhost:5001/health", "Health Check");

  // Test 2: Dashboard Stats
  console.log("\n2. 📊 Testing Dashboard Stats...");
  await testEndpoint(
    "http://localhost:5001/api/dashboard/stats",
    "Dashboard Stats"
  );

  // Test 3: Books API
  console.log("\n3. 📚 Testing Books API...");
  await testEndpoint("http://localhost:5001/api/books", "Books");

  // Test 4: Categories API
  console.log("\n4. 🏷️ Testing Categories API...");
  await testEndpoint("http://localhost:5001/api/categories", "Categories");

  // Test 5: Students API
  console.log("\n5. 👥 Testing Students API...");
  await testEndpoint("http://localhost:5001/api/students", "Students");

  console.log("\n🎉 API Testing Complete!");
}

function testEndpoint(url, name) {
  return new Promise((resolve) => {
    http
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const result = JSON.parse(data);
            console.log(
              `   ✅ ${name}: Status ${res.statusCode} - ${
                result.status || "success"
              }`
            );
            if (result.data) {
              if (Array.isArray(result.data.data)) {
                console.log(`      📦 Records: ${result.data.data.length}`);
              } else if (result.data.stats) {
                console.log(
                  `      📊 Stats: Books=${result.data.stats.totalBooks}, Students=${result.data.stats.totalStudents}`
                );
              } else {
                console.log(
                  `      📄 Data available: ${Object.keys(result.data).join(
                    ", "
                  )}`
                );
              }
            }
          } catch (error) {
            console.log(`   ❌ ${name}: Invalid JSON response`);
            console.log(`      📄 Response: ${data.substring(0, 100)}...`);
          }
          resolve();
        });
      })
      .on("error", (error) => {
        console.log(`   ❌ ${name}: Connection failed - ${error.message}`);
        resolve();
      });
  });
}

testAllAPIs();
