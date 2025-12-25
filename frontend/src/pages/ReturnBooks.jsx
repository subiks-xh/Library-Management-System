import { useState } from "react";
import {
  ArrowLeftOnRectangleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

function ReturnBooks() {
  const [selectedIssue, setSelectedIssue] = useState(null);

  // Mock data for current issues
  const currentIssues = [
    {
      id: 1,
      studentName: "Arjun Kumar",
      registerNumber: "20IT001",
      bookTitle: "Web Development Fundamentals",
      accessionNumber: "IT001",
      issueDate: "2024-12-10",
      dueDate: "2024-12-24",
      daysOverdue: 1,
      fineAmount: 1.0,
      status: "overdue",
    },
    {
      id: 2,
      studentName: "Priya Sharma",
      registerNumber: "21CS022",
      bookTitle: "Data Structures",
      accessionNumber: "CS002",
      issueDate: "2024-12-15",
      dueDate: "2024-12-29",
      daysOverdue: 0,
      fineAmount: 0,
      status: "active",
    },
    {
      id: 3,
      studentName: "Rajesh Kumar",
      registerNumber: "22EC025",
      bookTitle: "Digital Electronics",
      accessionNumber: "EC001",
      issueDate: "2024-12-05",
      dueDate: "2024-12-19",
      daysOverdue: 6,
      fineAmount: 6.0,
      status: "overdue",
    },
  ];

  const handleReturn = (issue) => {
    console.log("Return book:", issue);
    // Handle book return logic
  };

  const getStatusBadge = (status, daysOverdue) => {
    if (status === "overdue") {
      return (
        <span className="badge badge-danger">Overdue ({daysOverdue} days)</span>
      );
    } else if (daysOverdue === 0) {
      const today = new Date();
      const dueDate = new Date(issue.dueDate);
      const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

      if (daysUntilDue <= 2) {
        return <span className="badge badge-warning">Due Soon</span>;
      }
      return <span className="badge badge-success">Active</span>;
    }
    return <span className="badge badge-success">Active</span>;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">📥 Return Books</h1>
        <p className="page-subtitle">
          Process book returns and calculate fines
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="stats-card text-center">
          <div className="text-2xl font-bold text-primary-600">
            {currentIssues.length}
          </div>
          <div className="text-sm text-gray-600">Current Issues</div>
        </div>
        <div className="stats-card text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {currentIssues.filter((issue) => issue.status === "active").length}
          </div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="stats-card text-center">
          <div className="text-2xl font-bold text-red-600">
            {currentIssues.filter((issue) => issue.status === "overdue").length}
          </div>
          <div className="text-sm text-gray-600">Overdue</div>
        </div>
        <div className="stats-card text-center">
          <div className="text-2xl font-bold text-green-600">
            ₹
            {currentIssues
              .reduce((sum, issue) => sum + issue.fineAmount, 0)
              .toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">Total Fines</div>
        </div>
      </div>

      {/* Return Form */}
      {selectedIssue && (
        <div className="card border-primary-200 bg-primary-50">
          <div className="card-header border-primary-200">
            <h3 className="card-title text-primary-900">
              Return Book Confirmation
            </h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Student</p>
                <p className="font-medium text-gray-900">
                  {selectedIssue.studentName} ({selectedIssue.registerNumber})
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Book</p>
                <p className="font-medium text-gray-900">
                  {selectedIssue.bookTitle} ({selectedIssue.accessionNumber})
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Issue Date</p>
                <p className="font-medium text-gray-900">
                  {selectedIssue.issueDate}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Due Date</p>
                <p className="font-medium text-gray-900">
                  {selectedIssue.dueDate}
                </p>
              </div>
            </div>

            {selectedIssue.fineAmount > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-red-800">
                      Late Return Fine
                    </p>
                    <p className="text-sm text-red-600">
                      {selectedIssue.daysOverdue} days overdue × ₹1 = ₹
                      {selectedIssue.fineAmount}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => handleReturn(selectedIssue)}
                className="btn-primary flex-1"
              >
                <ArrowLeftOnRectangleIcon className="w-4 h-4 mr-2" />
                Confirm Return
              </button>
              <button
                onClick={() => setSelectedIssue(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Current Issues Table */}
      <div className="table-container">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Books Due for Return
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Register No.</th>
                <th>Book</th>
                <th>Accession No.</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Fine</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentIssues.map((issue) => (
                <tr key={issue.id}>
                  <td className="font-medium">{issue.studentName}</td>
                  <td>{issue.registerNumber}</td>
                  <td>{issue.bookTitle}</td>
                  <td className="font-medium">{issue.accessionNumber}</td>
                  <td>{issue.issueDate}</td>
                  <td>{issue.dueDate}</td>
                  <td>
                    {issue.status === "overdue" ? (
                      <span className="badge badge-danger">
                        Overdue ({issue.daysOverdue} days)
                      </span>
                    ) : (
                      <span className="badge badge-success">Active</span>
                    )}
                  </td>
                  <td>
                    {issue.fineAmount > 0 ? (
                      <span className="text-red-600 font-medium">
                        ₹{issue.fineAmount}
                      </span>
                    ) : (
                      <span className="text-green-600">₹0</span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => setSelectedIssue(issue)}
                      className="btn-primary btn-sm"
                    >
                      Return
                    </button>
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

export default ReturnBooks;
