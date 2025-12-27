import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bars3Icon,
  BellIcon,
  UserCircleIcon,
  ChevronDownIcon,
  BookOpenIcon,
  HomeIcon,
  AcademicCapIcon,
  UsersIcon,
  DocumentTextIcon,
  CogIcon,
  ComputerDesktopIcon,
  SparklesIcon,
  QrCodeIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  TagIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

function Navbar({ user, onLogout }) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [booksDropdownOpen, setBooksDropdownOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    setProfileDropdownOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      {/* Main Navbar */}
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 px-4 sm:gap-x-6 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center space-x-3">
          <div className="p-2 bg-green-500 rounded-lg">
            <BookOpenIcon className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-xl font-bold text-gray-900">LibMS</h1>
            <p className="text-xs text-gray-600">Tamil Nadu College</p>
          </div>
        </Link>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden -m-2.5 p-2.5 text-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="sr-only">Open main menu</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>

        {/* Navigation Menu */}
        <nav className="hidden md:flex flex-1 items-center space-x-6 ml-8">
          <Link
            to="/dashboard"
            className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-green-600 px-3 py-2 rounded-md hover:bg-gray-50"
          >
            <HomeIcon className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>

          {/* Books Dropdown */}
          <div className="relative">
            <button
              onMouseEnter={() => setBooksDropdownOpen(true)}
              onMouseLeave={() => setBooksDropdownOpen(false)}
              className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-green-600 px-3 py-2 rounded-md hover:bg-gray-50"
            >
              <BookOpenIcon className="w-4 h-4" />
              <span>Books</span>
              <ChevronDownIcon className="w-3 h-3" />
            </button>
            
            {booksDropdownOpen && (
              <div 
                className="absolute left-0 z-20 mt-1 w-48 origin-top-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
                onMouseEnter={() => setBooksDropdownOpen(true)}
                onMouseLeave={() => setBooksDropdownOpen(false)}
              >
                <Link
                  to="/books"
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <BookOpenIcon className="w-4 h-4" />
                  <span>All Books</span>
                </Link>
                <Link
                  to="/digital-library"
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <ComputerDesktopIcon className="w-4 h-4" />
                  <span>Digital Library</span>
                </Link>
                <Link
                  to="/categories"
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <TagIcon className="w-4 h-4" />
                  <span>Categories</span>
                </Link>
                <Link
                  to="/reservations"
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <CalendarDaysIcon className="w-4 h-4" />
                  <span>Reservations</span>
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/students"
            className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-green-600 px-3 py-2 rounded-md hover:bg-gray-50"
          >
            <UsersIcon className="w-4 h-4" />
            <span>Students</span>
          </Link>

          <Link
            to="/issue"
            className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-green-600 px-3 py-2 rounded-md hover:bg-gray-50"
          >
            <DocumentTextIcon className="w-4 h-4" />
            <span>Issue Books</span>
          </Link>

          <Link
            to="/return"
            className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-green-600 px-3 py-2 rounded-md hover:bg-gray-50"
          >
            <ClipboardDocumentListIcon className="w-4 h-4" />
            <span>Return Books</span>
          </Link>

          {/* Tools Dropdown */}
          <div className="relative">
            <button
              onMouseEnter={() => setToolsDropdownOpen(true)}
              onMouseLeave={() => setToolsDropdownOpen(false)}
              className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-green-600 px-3 py-2 rounded-md hover:bg-gray-50"
            >
              <SparklesIcon className="w-4 h-4" />
              <span>Tools</span>
              <ChevronDownIcon className="w-3 h-3" />
            </button>
            
            {toolsDropdownOpen && (
              <div 
                className="absolute left-0 z-20 mt-1 w-48 origin-top-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
                onMouseEnter={() => setToolsDropdownOpen(true)}
                onMouseLeave={() => setToolsDropdownOpen(false)}
              >
                <Link
                  to="/ai-features"
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <SparklesIcon className="w-4 h-4" />
                  <span>AI Assistant</span>
                </Link>
                <Link
                  to="/qr-generator"
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <QrCodeIcon className="w-4 h-4" />
                  <span>QR Generator</span>
                </Link>
                <Link
                  to="/reports"
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <ChartBarIcon className="w-4 h-4" />
                  <span>Reports</span>
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <CogIcon className="w-4 h-4" />
                  <span>Settings</span>
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Search form */}
        <form onSubmit={handleSearch} className="relative flex items-center max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="search"
            placeholder="Search books, students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 sm:text-sm"
          />
          {searchQuery && (
            <button
              type="submit"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg
                className="h-4 w-4 text-gray-400 hover:text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          )}
        </form>

        {/* Right side */}
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              className="relative -m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
              onClick={() =>
                setNotificationDropdownOpen(!notificationDropdownOpen)
              }
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
              {/* Notification badge */}
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Notification Dropdown */}
            {notificationDropdownOpen && (
              <div className="absolute right-0 z-20 mt-2 w-80 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Notifications
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-900 font-medium">
                          Book return reminder
                        </p>
                        <p className="text-xs text-gray-500">
                          "Introduction to Computer Science" is due tomorrow
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          2 hours ago
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-900 font-medium">
                          New book available
                        </p>
                        <p className="text-xs text-gray-500">
                          "Advanced Mathematics" has been added to library
                        </p>
                        <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-2 w-2 bg-yellow-500 rounded-full mt-2"></div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-900 font-medium">
                          Library maintenance
                        </p>
                        <p className="text-xs text-gray-500">
                          System maintenance scheduled for this weekend
                        </p>
                        <p className="text-xs text-gray-400 mt-1">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setNotificationDropdownOpen(false);
                      navigate("/notifications");
                    }}
                    className="text-sm text-green-600 hover:text-green-800 font-medium"
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Library Status */}
          <div
            className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
            aria-hidden="true"
          />
          <div className="hidden lg:flex lg:items-center lg:gap-x-2">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700 font-medium">
                Library Open
              </span>
            </div>
            <span className="text-sm text-gray-500">9:00 AM - 5:00 PM</span>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-x-2 text-sm text-gray-700 hover:text-gray-900"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            >
              <UserCircleIcon className="h-8 w-8 text-gray-400" />
              <div className="hidden sm:block text-left">
                <div className="font-medium">
                  {user ? `${user.first_name} ${user.last_name}` : "User"}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {user?.role || "Student"}
                  {user?.register_number && ` - ${user.register_number}`}
                </div>
              </div>
              <ChevronDownIcon className="h-4 w-4 text-gray-400" />
            </button>

            {/* Dropdown menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">
                    {user ? `${user.first_name} ${user.last_name}` : "User"}
                  </p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    navigate("/profile");
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Profile Settings
                </button>
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    navigate("/library-history");
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  My Library History
                </button>
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Click outside to close dropdowns */}
        {(profileDropdownOpen || notificationDropdownOpen || booksDropdownOpen || toolsDropdownOpen) && (
          <div
            className="fixed inset-0 z-0"
            onClick={() => {
              setProfileDropdownOpen(false);
              setNotificationDropdownOpen(false);
              setBooksDropdownOpen(false);
              setToolsDropdownOpen(false);
            }}
          />
        )}
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            <Link
              to="/dashboard"
              className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <HomeIcon className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            
            {/* Books Section */}
            <div className="border-l-2 border-gray-200 pl-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Books & Library
              </p>
              <Link
                to="/books"
                className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <BookOpenIcon className="w-5 h-5" />
                <span>All Books</span>
              </Link>
              <Link
                to="/digital-library"
                className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ComputerDesktopIcon className="w-5 h-5" />
                <span>Digital Library</span>
              </Link>
              <Link
                to="/categories"
                className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <TagIcon className="w-5 h-5" />
                <span>Categories</span>
              </Link>
              <Link
                to="/reservations"
                className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <CalendarDaysIcon className="w-5 h-5" />
                <span>Reservations</span>
              </Link>
            </div>

            <Link
              to="/students"
              className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <UsersIcon className="w-5 h-5" />
              <span>Students</span>
            </Link>
            
            <Link
              to="/issue"
              className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <DocumentTextIcon className="w-5 h-5" />
              <span>Issue Books</span>
            </Link>
            
            <Link
              to="/return"
              className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ClipboardDocumentListIcon className="w-5 h-5" />
              <span>Return Books</span>
            </Link>

            {/* Tools Section */}
            <div className="border-l-2 border-gray-200 pl-4 mt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Tools & Features
              </p>
              <Link
                to="/ai-features"
                className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <SparklesIcon className="w-5 h-5" />
                <span>AI Assistant</span>
              </Link>
              <Link
                to="/qr-generator"
                className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <QrCodeIcon className="w-5 h-5" />
                <span>QR Generator</span>
              </Link>
              <Link
                to="/reports"
                className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ChartBarIcon className="w-5 h-5" />
                <span>Reports</span>
              </Link>
              <Link
                to="/settings"
                className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <CogIcon className="w-5 h-5" />
                <span>Settings</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
