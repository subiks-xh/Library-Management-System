// Test API Connectivity
// This file helps test if frontend can connect to backend APIs

import { libraryAPI } from "../services/api";

export const testAPIConnectivity = async () => {
  const results = {
    health: { status: "pending", message: "", data: null },
    dashboard: { status: "pending", message: "", data: null },
    books: { status: "pending", message: "", data: null },
    categories: { status: "pending", message: "", data: null },
    students: { status: "pending", message: "", data: null },
  };

  // Test Health Endpoint
  try {
    const healthResponse = await fetch("http://localhost:5000/health");
    const healthData = await healthResponse.json();
    results.health = {
      status: healthResponse.ok ? "success" : "error",
      message: healthData.message || "Health check completed",
      data: healthData,
    };
  } catch (error) {
    results.health = {
      status: "error",
      message: `Health check failed: ${error.message}`,
      data: null,
    };
  }

  // Test Dashboard API
  try {
    const dashboardResponse = await libraryAPI.getDashboardStats();
    results.dashboard = {
      status: "success",
      message: "Dashboard API connected successfully",
      data: dashboardResponse.data,
    };
  } catch (error) {
    results.dashboard = {
      status: "error",
      message: `Dashboard API failed: ${error.message}`,
      data: null,
    };
  }

  // Test Books API
  try {
    const booksResponse = await libraryAPI.getBooks();
    results.books = {
      status: "success",
      message: `Found ${booksResponse.data?.data?.length || 0} books`,
      data: booksResponse.data,
    };
  } catch (error) {
    results.books = {
      status: "error",
      message: `Books API failed: ${error.message}`,
      data: null,
    };
  }

  // Test Categories API
  try {
    const categoriesResponse = await libraryAPI.getCategories();
    results.categories = {
      status: "success",
      message: `Found ${categoriesResponse.data?.data?.length || 0} categories`,
      data: categoriesResponse.data,
    };
  } catch (error) {
    results.categories = {
      status: "error",
      message: `Categories API failed: ${error.message}`,
      data: null,
    };
  }

  // Test Students API
  try {
    const studentsResponse = await libraryAPI.getStudents();
    results.students = {
      status: "success",
      message: `Found ${studentsResponse.data?.data?.length || 0} students`,
      data: studentsResponse.data,
    };
  } catch (error) {
    results.students = {
      status: "error",
      message: `Students API failed: ${error.message}`,
      data: null,
    };
  }

  return results;
};

// Console test function
export const runConnectivityTest = async () => {
  console.log("🧪 Starting API Connectivity Test...");
  console.log("Backend: http://localhost:5000");
  console.log("Frontend: http://localhost:3000");
  console.log("=".repeat(50));

  const results = await testAPIConnectivity();

  Object.entries(results).forEach(([endpoint, result]) => {
    const icon =
      result.status === "success"
        ? "✅"
        : result.status === "error"
        ? "❌"
        : "⏳";
    console.log(`${icon} ${endpoint.toUpperCase()}: ${result.message}`);
    if (result.data && result.status === "success") {
      console.log(`   Data preview:`, Object.keys(result.data));
    }
  });

  console.log("=".repeat(50));

  const successCount = Object.values(results).filter(
    (r) => r.status === "success"
  ).length;
  const totalCount = Object.keys(results).length;

  console.log(`🎯 Results: ${successCount}/${totalCount} endpoints working`);

  if (successCount === totalCount) {
    console.log(
      "🎉 ALL TESTS PASSED! Frontend ↔️ Backend communication is working perfectly!"
    );
  } else {
    console.log(
      "⚠️  Some endpoints failed. Check backend server and database connection."
    );
  }

  return results;
};
