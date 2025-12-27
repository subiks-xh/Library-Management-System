import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
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
import { BookOpenIcon } from "@heroicons/react/24/outline";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="flex-1">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
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
              <Route path="/notifications" element={<NotificationCenter />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
      </div>
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
