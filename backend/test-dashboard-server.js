const express = require("express");
const cors = require("cors");
const { pool } = require("./config/database");
const dashboardRoutes = require("./routes/dashboard");

// Create a simple test server just for dashboard
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "success", message: "Test Dashboard Server Running!" });
});

// Dashboard routes
app.use("/api/dashboard", dashboardRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({
    status: "error",
    message: "Internal server error",
    details: err.message,
  });
});

const PORT = 5003;

app.listen(PORT, () => {
  console.log(`🚀 Test Dashboard Server running on http://localhost:${PORT}`);
  console.log(
    `📊 Dashboard stats: http://localhost:${PORT}/api/dashboard/stats`
  );
  console.log(`❤️ Health check: http://localhost:${PORT}/health`);
});

// Test the route after starting
setTimeout(async () => {
  console.log("\n🧪 Testing dashboard route...");
  try {
    const response = await fetch(
      `http://localhost:${PORT}/api/dashboard/stats`
    );
    const data = await response.json();
    console.log("✅ Dashboard API Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("❌ Dashboard API Test Failed:", error.message);
  }
}, 1000);
