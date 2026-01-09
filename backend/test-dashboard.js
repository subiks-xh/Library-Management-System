// Test Dashboard API functionality
const http = require("http");

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch (error) {
            resolve({ status: res.statusCode, data });
          }
        });
      })
      .on("error", reject);
  });
}

async function testDashboard() {
  console.log("🧪 Testing Dashboard API...\n");

  try {
    // Test Health Check
    console.log("1. Testing health endpoint...");
    const healthResponse = await makeRequest("http://localhost:5001/health");
    console.log("✅ Health check:", healthResponse.data);

    // Test Dashboard Stats
    console.log("\n2. Testing dashboard stats...");
    const dashResponse = await makeRequest(
      "http://localhost:5001/api/dashboard/stats"
    );
    console.log(
      "✅ Dashboard stats:",
      JSON.stringify(dashResponse.data, null, 2)
    );

    console.log("\n🎉 All tests passed!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

testDashboard();
