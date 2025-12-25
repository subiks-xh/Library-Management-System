import { useState } from "react";
import {
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

function IssueBooks() {
  const [formData, setFormData] = useState({
    registerNumber: "",
    bookId: "",
    issueDays: 14,
  });

  // Mock data for available books
  const availableBooks = [
    {
      id: 1,
      accessionNumber: "CS001",
      title: "Programming in C",
      author: "E. Balagurusamy",
    },
    {
      id: 2,
      accessionNumber: "IT001",
      title: "Web Technology",
      author: "Uttam K. Roy",
    },
    {
      id: 3,
      accessionNumber: "ME001",
      title: "Engineering Mechanics",
      author: "R.S. Khurmi",
    },
  ];

  // Mock data for recent issues
  const recentIssues = [
    {
      id: 1,
      studentName: "Arjun Kumar",
      registerNumber: "20IT001",
      bookTitle: "Web Development",
      issueDate: "2024-12-25",
      dueDate: "2025-01-08",
    },
    {
      id: 2,
      studentName: "Priya Sharma",
      registerNumber: "21CS022",
      bookTitle: "Data Structures",
      issueDate: "2024-12-24",
      dueDate: "2025-01-07",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Issue book:", formData);
    // Reset form
    setFormData({ registerNumber: "", bookId: "", issueDays: 14 });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">📤 Issue Books</h1>
        <p className="page-subtitle">Issue books to students</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Issue Form */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Issue New Book</h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student Register Number */}
            <div className="form-group">
              <label className="form-label">Student Register Number</label>
              <input
                type="text"
                name="registerNumber"
                value={formData.registerNumber}
                onChange={handleInputChange}
                placeholder="Enter register number (e.g., 20IT001)"
                className="form-input"
                required
              />
            </div>

            {/* Book Selection */}
            <div className="form-group">
              <label className="form-label">Select Book</label>
              <select
                name="bookId"
                value={formData.bookId}
                onChange={handleInputChange}
                className="form-input"
                required
              >
                <option value="">Choose a book</option>
                {availableBooks.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.accessionNumber} - {book.title} by {book.author}
                  </option>
                ))}
              </select>
            </div>

            {/* Issue Duration */}
            <div className="form-group">
              <label className="form-label">Issue Duration (Days)</label>
              <select
                name="issueDays"
                value={formData.issueDays}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value={7}>7 Days</option>
                <option value={14}>14 Days (Standard)</option>
                <option value={21}>21 Days</option>
                <option value={30}>30 Days</option>
              </select>
            </div>

            {/* Due Date Display */}
            {formData.issueDays && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Due Date:</span>{" "}
                  {new Date(
                    Date.now() + formData.issueDays * 24 * 60 * 60 * 1000
                  ).toDateString()}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button type="submit" className="btn-primary w-full">
              <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
              Issue Book
            </button>
          </form>
        </div>

        {/* Available Books */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Available Books</h3>
          </div>
          <div className="space-y-3">
            {availableBooks.map((book) => (
              <div
                key={book.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{book.title}</p>
                    <p className="text-sm text-gray-500">by {book.author}</p>
                    <p className="text-sm text-primary-600">
                      {book.accessionNumber}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, bookId: book.id }))
                    }
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Issues */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Issues</h3>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Register No.</th>
                <th>Book</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentIssues.map((issue) => (
                <tr key={issue.id}>
                  <td className="font-medium">{issue.studentName}</td>
                  <td>{issue.registerNumber}</td>
                  <td>{issue.bookTitle}</td>
                  <td>{issue.issueDate}</td>
                  <td>{issue.dueDate}</td>
                  <td>
                    <span className="badge badge-success">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default IssueBooks;
