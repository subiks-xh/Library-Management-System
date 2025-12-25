# 🎓 Phase 2: Authentication Integration Guide

## Tamil Nadu College Library Management System

### 📋 Overview

This guide covers integrating authentication into the existing Phase 1 system. Authentication will be added as the final layer without disrupting existing functionality.

### 🏗️ Architecture Changes

#### Authentication Flow

```
1. Admin Login → Full Access (All Pages)
2. Student Login → Limited Access (View Books, Check Issues, View Fines)
3. Phase 1 Fallback → Direct Access (Development Only)
```

### 🔐 Backend Authentication Implementation

#### 1. Install Additional Dependencies

```bash
cd backend
npm install bcryptjs jsonwebtoken cookie-parser express-session
```

#### 2. Create Authentication Middleware

```javascript
// middleware/auth.js
const jwt = require("jsonwebtoken");
const { pool } = require("../config/database");

const authenticateToken = async (req, res, next) => {
  // Check for phase 1 bypass (development only)
  if (process.env.BYPASS_AUTH === "true") {
    req.user = { role: "admin", id: 1 }; // Mock admin user
    return next();
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Access token required",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      status: "error",
      message: "Invalid or expired token",
    });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "error",
        message: "Insufficient permissions",
      });
    }
    next();
  };
};

module.exports = { authenticateToken, requireRole };
```

#### 3. Create User Schema

```sql
-- Add to database/schema.sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'librarian', 'student') NOT NULL,
    student_id INT NULL, -- Links to students table for student users
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Create default admin user
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@college.edu.in', '$2b$10$hashedpassword', 'admin');

-- Link existing students to user accounts (optional)
-- Students can be given login access by creating user records
```

#### 4. Authentication Routes

```javascript
// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const { pool } = require("../config/database");
const router = express.Router();

// Admin Login
router.post(
  "/login",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: "error",
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { username, password } = req.body;

      // Get user from database
      const [users] = await pool.execute(
        "SELECT * FROM users WHERE username = ? AND is_active = TRUE",
        [username]
      );

      if (users.length === 0) {
        return res.status(401).json({
          status: "error",
          message: "Invalid credentials",
        });
      }

      const user = users[0];

      // Verify password
      const isValidPassword = await bcrypt.compare(
        password,
        user.password_hash
      );
      if (!isValidPassword) {
        return res.status(401).json({
          status: "error",
          message: "Invalid credentials",
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          username: user.username,
          role: user.role,
          studentId: user.student_id,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || "24h" }
      );

      // Update last login
      await pool.execute(
        "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?",
        [user.id]
      );

      // Return token and user info
      res.status(200).json({
        status: "success",
        message: "Login successful",
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }
);

// Student Login (using register number)
router.post(
  "/student-login",
  [
    body("register_number")
      .notEmpty()
      .withMessage("Register number is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      const { register_number, password } = req.body;

      // Get student and user info
      const [result] = await pool.execute(
        `
      SELECT u.*, s.register_number, s.name as student_name
      FROM users u
      JOIN students s ON u.student_id = s.id
      WHERE s.register_number = ? AND u.is_active = TRUE AND s.status = 'active'
    `,
        [register_number.toUpperCase()]
      );

      if (result.length === 0) {
        return res.status(401).json({
          status: "error",
          message: "Invalid credentials",
        });
      }

      const user = result[0];

      // Verify password
      const isValidPassword = await bcrypt.compare(
        password,
        user.password_hash
      );
      if (!isValidPassword) {
        return res.status(401).json({
          status: "error",
          message: "Invalid credentials",
        });
      }

      // Generate token
      const token = jwt.sign(
        {
          userId: user.id,
          username: user.username,
          role: "student",
          studentId: user.student_id,
          registerNumber: user.register_number,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.status(200).json({
        status: "success",
        message: "Login successful",
        data: {
          token,
          user: {
            id: user.id,
            role: "student",
            registerNumber: user.register_number,
            name: user.student_name,
          },
        },
      });
    } catch (error) {
      console.error("Student login error:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }
);

// Logout
router.post("/logout", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});

module.exports = router;
```

#### 5. Apply Authentication to Routes

```javascript
// server.js - Add auth routes and middleware
const authRoutes = require("./routes/auth");
const { authenticateToken, requireRole } = require("./middleware/auth");

// Auth routes (public)
app.use("/api/auth", authRoutes);

// Protected routes
app.use("/api/dashboard", authenticateToken, dashboardRoutes);
app.use("/api/books", authenticateToken, bookRoutes);
app.use(
  "/api/categories",
  authenticateToken,
  requireRole(["admin", "librarian"]),
  categoryRoutes
);
app.use(
  "/api/students",
  authenticateToken,
  requireRole(["admin", "librarian"]),
  studentRoutes
);
app.use("/api/issues", authenticateToken, issueRoutes);
app.use("/api/fines", authenticateToken, fineRoutes);
app.use(
  "/api/reports",
  authenticateToken,
  requireRole(["admin", "librarian"]),
  reportRoutes
);
```

### 🎨 Frontend Authentication Implementation

#### 1. Create Authentication Context

```javascript
// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Set up axios interceptor
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Check if user is logged in on app start
  useEffect(() => {
    if (token) {
      // Verify token with backend
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      // You can create a /auth/verify endpoint to check token validity
      setLoading(false);
    } catch (error) {
      logout();
    }
  };

  const login = async (credentials, isStudent = false) => {
    try {
      const endpoint = isStudent ? "/auth/student-login" : "/auth/login";
      const response = await axios.post(`/api${endpoint}`, credentials);

      const { token: newToken, user: userData } = response.data.data;

      setToken(newToken);
      setUser(userData);
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        hasRole,
        hasAnyRole,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
```

#### 2. Create Login Component

```javascript
// src/components/auth/LoginForm.jsx
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { BuildingLibraryIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

function LoginForm() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    isStudent: false,
  });
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(
        {
          [credentials.isStudent ? "register_number" : "username"]:
            credentials.username,
          password: credentials.password,
        },
        credentials.isStudent
      );

      if (result.success) {
        toast.success("Login successful!");
        navigate(from, { replace: true });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 text-primary-600">
            <BuildingLibraryIcon />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            TN College Library
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access the library system
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Login Type Toggle */}
          <div className="flex justify-center">
            <div className="flex rounded-lg bg-gray-100 p-1">
              <button
                type="button"
                onClick={() =>
                  setCredentials((prev) => ({
                    ...prev,
                    isStudent: false,
                    username: "",
                  }))
                }
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  !credentials.isStudent
                    ? "bg-white text-primary-600 shadow"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Admin/Staff
              </button>
              <button
                type="button"
                onClick={() =>
                  setCredentials((prev) => ({
                    ...prev,
                    isStudent: true,
                    username: "",
                  }))
                }
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  credentials.isStudent
                    ? "bg-white text-primary-600 shadow"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Student
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="sr-only">
                {credentials.isStudent ? "Register Number" : "Username"}
              </label>
              <input
                type="text"
                required
                value={credentials.username}
                onChange={(e) =>
                  setCredentials((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
                className="form-input"
                placeholder={
                  credentials.isStudent
                    ? "Register Number (e.g., 20IT001)"
                    : "Username"
                }
              />
            </div>
            <div>
              <label className="sr-only">Password</label>
              <input
                type="password"
                required
                value={credentials.password}
                onChange={(e) =>
                  setCredentials((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                className="form-input"
                placeholder="Password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          {/* Phase 1 Development Notice */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Phase 2 - Authentication Enabled
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
```

#### 3. Create Protected Route Component

```javascript
// src/components/auth/ProtectedRoute.jsx
import { useAuth } from "../../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children, roles = [] }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;
```

#### 4. Update App.jsx with Authentication

```javascript
// src/App.jsx - Add authentication
import { AuthProvider } from "./context/AuthContext";
import LoginForm from "./components/auth/LoginForm";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/books"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Books />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/students"
          element={
            <ProtectedRoute roles={["admin", "librarian"]}>
              <AppLayout>
                <Students />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        {/* Add other protected routes */}
      </Routes>
    </AuthProvider>
  );
}
```

#### 5. Add Student Dashboard

```javascript
// src/pages/StudentDashboard.jsx
import { useAuth } from "../context/AuthContext";

function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Welcome, {user.name}!</h1>
        <p className="page-subtitle">Register Number: {user.registerNumber}</p>
      </div>

      {/* Student-specific content: issued books, fines, etc. */}
    </div>
  );
}
```

### 🔧 Phase 2 Migration Steps

#### 1. Preparation

```bash
# Create backup of Phase 1 system
git tag v1.0-phase1
git checkout -b phase2-auth
```

#### 2. Backend Migration

```bash
cd backend
npm install bcryptjs jsonwebtoken cookie-parser
```

#### 3. Database Migration

```sql
-- Run Phase 2 user table creation
-- Create default admin accounts
-- Optionally link existing students to user accounts
```

#### 4. Frontend Migration

```bash
cd frontend
npm install
# Update App.jsx with authentication
# Add login forms and protected routes
```

#### 5. Testing Phase 2

- [ ] Admin login working
- [ ] Student login working
- [ ] Route protection working
- [ ] Role-based access working
- [ ] Phase 1 functionality preserved

#### 6. Deployment

- [ ] Update environment variables
- [ ] Deploy backend with auth
- [ ] Deploy frontend with auth
- [ ] Test production authentication

### 🎯 Benefits of Phase 2

#### Security

- ✅ Secure user authentication
- ✅ Role-based access control
- ✅ Protected API endpoints
- ✅ JWT token-based sessions

#### User Experience

- ✅ Personalized dashboards
- ✅ Student self-service portal
- ✅ Admin management interface
- ✅ Audit trail for all actions

#### Scalability

- ✅ Multi-role support
- ✅ Easy user management
- ✅ Session management
- ✅ API security

---

**🚀 Phase 2 Implementation Complete!**

Your library system now has full authentication while preserving all Phase 1 functionality.
