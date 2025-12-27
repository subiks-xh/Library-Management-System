import { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import DigitalLibrary from "./pages/DigitalLibrary";
import Categories from "./pages/Categories";
import Students from "./pages/Students";
import IssueBooks from "./pages/IssueBooks";
import ReturnBooks from "./pages/ReturnBooks";
import Reservations from "./pages/Reservations";
import AIFeatures from "./pages/AIFeatures";
import QRCodeGenerator from "./pages/QRCodeGenerator";
import NotificationCenter from "./pages/NotificationCenter";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import ProfileSettings from "./pages/ProfileSettings";
import MyLibraryHistory from "./pages/MyLibraryHistory";
import SearchResults from "./pages/SearchResults";
import { BookOpenIcon } from "@heroicons/react/24/outline";

function App() {
  const { isAuthenticated, user, loading, logout } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Check if current route is public (no auth required)
  const publicRoutes = ["/", "/login", "/register"];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  // If not authenticated and trying to access protected route, redirect to login
  if (!isAuthenticated && !isPublicRoute) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated and trying to access login/register, redirect to dashboard
  if (
    isAuthenticated &&
    (location.pathname === "/login" || location.pathname === "/register")
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Public Routes (Home, Login, Register) */}
      {isPublicRoute ? (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      ) : (
        // Protected Routes (Dashboard and all other pages)
        <>
          {/* Horizontal Navigation */}
          <Navbar user={user} onLogout={logout} />

          {/* Main Content */}
          <div className="min-h-screen">
            <main className="flex-1">
              <div className="px-4 sm:px-6 lg:px-8 py-8">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/books" element={<Books />} />
                  <Route path="/digital-library" element={<DigitalLibrary />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/students" element={<Students />} />
                  <Route path="/issue" element={<IssueBooks />} />
                  <Route path="/return" element={<ReturnBooks />} />
                  <Route path="/reservations" element={<Reservations />} />
                  <Route path="/ai-features" element={<AIFeatures />} />
                  <Route path="/qr-generator" element={<QRCodeGenerator />} />
                  <Route
                    path="/notifications"
                    element={<NotificationCenter />}
                  />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/profile" element={<ProfileSettings />} />
                  <Route path="/library-history" element={<MyLibraryHistory />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </main>
          </div>
        </>
      )}
    </div>
  );
}

// 404 Component
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-96">
      <BookOpenIcon className="w-24 h-24 text-gray-300 mb-4" />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
      <p className="text-gray-600 mb-4">
        The page you're looking for doesn't exist.
      </p>
      <a href="/dashboard" className="btn-primary">
        Go to Dashboard
      </a>
    </div>
  );
}

export default App;
