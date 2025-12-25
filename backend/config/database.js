const mysql = require("mysql2");
const logger = require("../utils/logger");

// Create connection pool for better performance
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "college_library",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 60000,
  idleTimeout: 300000,
});

// Get promise-based pool
const promisePool = pool.promise();

// Test connection
const testConnection = async () => {
  try {
    const connection = await promisePool.getConnection();
    logger.info("✅ MySQL Database connected successfully");
    connection.release();
    return true;
  } catch (error) {
    logger.error("❌ Database connection failed:", error.message);
    return false;
  }
};

// Initialize database connection
testConnection();

module.exports = {
  pool: promisePool,
  testConnection,
};
