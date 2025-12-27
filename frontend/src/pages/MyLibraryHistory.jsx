import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  BookOpenIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

function MyLibraryHistory() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("current");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - In real app, this would come from API
  const currentBooks = [
    {
      id: 1,
      title: "Introduction to Computer Science",
      author: "John Smith",
      isbn: "978-0123456789",
      issueDate: "2025-12-15",
      dueDate: "2026-01-15",
      status: "issued",
      renewalCount: 1,
      maxRenewals: 2,
    },
    {
      id: 2,
      title: "Advanced Mathematics",
      author: "Jane Doe",
      isbn: "978-0987654321",
      issueDate: "2025-12-20",
      dueDate: "2026-01-20",
      status: "issued",
      renewalCount: 0,
      maxRenewals: 2,
    },
  ];

  const historyBooks = [
    {
      id: 3,
      title: "Data Structures and Algorithms",
      author: "Robert Martin",
      isbn: "978-0111222333",
      issueDate: "2025-11-01",
      returnDate: "2025-11-28",
      status: "returned",
      fine: 0,
    },
    {
      id: 4,
      title: "Web Development Basics",
      author: "Sarah Johnson",
      isbn: "978-0444555666",
      issueDate: "2025-10-15",
      returnDate: "2025-11-20",
      status: "returned",
      fine: 5,
    },
    {
      id: 5,
      title: "Database Management Systems",
      author: "Mike Wilson",
      isbn: "978-0777888999",
      issueDate: "2025-09-01",
      returnDate: "2025-09-25",
      status: "returned",
      fine: 0,
    },
  ];

  const reservedBooks = [
    {
      id: 6,
      title: "Machine Learning Fundamentals",
      author: "Alice Brown",
      isbn: "978-0123987654",
      reservedDate: "2025-12-25",
      expectedAvailable: "2026-01-05",
      status: "reserved",
      position: 2,
    },
  ];

  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (status, dueDate = null) => {
    if (status === "returned") return "text-green-600 bg-green-50";
    if (status === "reserved") return "text-blue-600 bg-blue-50";
    if (status === "issued") {
      const daysLeft = getDaysRemaining(dueDate);
      if (daysLeft < 0) return "text-red-600 bg-red-50";
      if (daysLeft <= 3) return "text-yellow-600 bg-yellow-50";
      return "text-green-600 bg-green-50";
    }
    return "text-gray-600 bg-gray-50";
  };

  const getStatusText = (status, dueDate = null) => {
    if (status === "returned") return "Returned";
    if (status === "reserved") return "Reserved";
    if (status === "issued") {
      const daysLeft = getDaysRemaining(dueDate);
      if (daysLeft < 0) return `Overdue by ${Math.abs(daysLeft)} days`;
      if (daysLeft === 0) return "Due Today";
      if (daysLeft === 1) return "Due Tomorrow";
      return `${daysLeft} days left`;
    }
    return status;
  };

  const filteredCurrentBooks = currentBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredHistoryBooks = historyBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredReservedBooks = reservedBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                My Library History
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Track your borrowed books and library activity
              </p>
            </div>
            
            {/* Search */}
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {currentBooks.length}
              </div>
              <div className="text-sm text-gray-600">Currently Borrowed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {reservedBooks.length}
              </div>
              <div className="text-sm text-gray-600">Reserved Books</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {historyBooks.length}
              </div>
              <div className="text-sm text-gray-600">Books Returned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                ₹{historyBooks.reduce((total, book) => total + (book.fine || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Fines Paid</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("current")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "current"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Current Books ({currentBooks.length})
              </button>
              <button
                onClick={() => setActiveTab("reserved")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "reserved"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Reserved ({reservedBooks.length})
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "history"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                History ({historyBooks.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-6 py-4">
          {activeTab === "current" && (
            <div className="space-y-4">
              {filteredCurrentBooks.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No current books
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You haven't borrowed any books yet.
                  </p>
                </div>
              ) : (
                filteredCurrentBooks.map((book) => (
                  <div
                    key={book.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {book.title}
                        </h3>
                        <p className="text-sm text-gray-600">by {book.author}</p>
                        <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <span>Issued: {new Date(book.issueDate).toLocaleDateString()}</span>
                          <span>Due: {new Date(book.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            book.status,
                            book.dueDate
                          )}`}
                        >
                          {getStatusText(book.status, book.dueDate)}
                        </span>
                        {book.renewalCount < book.maxRenewals && getDaysRemaining(book.dueDate) > 0 && (
                          <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                            Renew Book
                          </button>
                        )}
                        <p className="text-xs text-gray-500">
                          Renewed: {book.renewalCount}/{book.maxRenewals}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "reserved" && (
            <div className="space-y-4">
              {filteredReservedBooks.length === 0 ? (
                <div className="text-center py-8">
                  <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No reserved books
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You haven't reserved any books yet.
                  </p>
                </div>
              ) : (
                filteredReservedBooks.map((book) => (
                  <div
                    key={book.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {book.title}
                        </h3>
                        <p className="text-sm text-gray-600">by {book.author}</p>
                        <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <span>Reserved: {new Date(book.reservedDate).toLocaleDateString()}</span>
                          <span>Expected: {new Date(book.expectedAvailable).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(book.status)}`}>
                          Position #{book.position}
                        </span>
                        <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                          Cancel Reservation
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-4">
              {filteredHistoryBooks.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No history yet
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Your returned books will appear here.
                  </p>
                </div>
              ) : (
                filteredHistoryBooks.map((book) => (
                  <div
                    key={book.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {book.title}
                        </h3>
                        <p className="text-sm text-gray-600">by {book.author}</p>
                        <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <span>Issued: {new Date(book.issueDate).toLocaleDateString()}</span>
                          <span>Returned: {new Date(book.returnDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(book.status)}`}>
                          {getStatusText(book.status)}
                        </span>
                        {book.fine > 0 && (
                          <span className="text-sm text-red-600 font-medium">
                            Fine: ₹{book.fine}
                          </span>
                        )}
                        <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                          Borrow Again
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyLibraryHistory;