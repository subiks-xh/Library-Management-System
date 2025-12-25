import { useState } from "react";
import {
  DocumentChartBarIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

function Reports() {
  const [selectedReport, setSelectedReport] = useState("overview");
  const [dateRange, setDateRange] = useState("last30days");

  // Mock data for reports
  const overviewData = {
    totalBooks: 2547,
    totalStudents: 1247,
    booksIssued: 342,
    overdueBooks: 23,
    finesCollected: 2750.0,
    pendingFines: 450.0,
  };

  const monthlyData = [
    { month: "Jul", issued: 120, returned: 115, fines: 450 },
    { month: "Aug", issued: 135, returned: 128, fines: 320 },
    { month: "Sep", issued: 150, returned: 142, fines: 280 },
    { month: "Oct", issued: 128, returned: 135, fines: 380 },
    { month: "Nov", issued: 145, returned: 140, fines: 420 },
    { month: "Dec", issued: 342, returned: 298, fines: 450 },
  ];

  const departmentData = [
    {
      department: "Computer Science",
      students: 320,
      booksIssued: 145,
      overdue: 8,
      fines: 120,
    },
    {
      department: "Information Technology",
      students: 280,
      booksIssued: 98,
      overdue: 5,
      fines: 85,
    },
    {
      department: "Electronics",
      students: 250,
      booksIssued: 67,
      overdue: 7,
      fines: 135,
    },
    {
      department: "Mechanical",
      students: 220,
      booksIssued: 32,
      overdue: 3,
      fines: 45,
    },
    {
      department: "Civil",
      students: 177,
      booksIssued: 28,
      overdue: 2,
      fines: 30,
    },
  ];

  const defaultersList = [
    {
      registerNumber: "20IT015",
      name: "Kumar Raj",
      department: "Information Technology",
      overdueBooks: 3,
      daysOverdue: 15,
      fineAmount: 45.0,
    },
    {
      registerNumber: "21CS022",
      name: "Priya Sharma",
      department: "Computer Science",
      overdueBooks: 2,
      daysOverdue: 8,
      fineAmount: 16.0,
    },
    {
      registerNumber: "19EC010",
      name: "Rajesh Kumar",
      department: "Electronics",
      overdueBooks: 1,
      daysOverdue: 22,
      fineAmount: 22.0,
    },
  ];

  const popularBooks = [
    {
      title: "Programming in C",
      author: "E. Balagurusamy",
      accessionNumber: "CS001",
      issueCount: 45,
      category: "Textbooks",
    },
    {
      title: "Web Technology",
      author: "Uttam K. Roy",
      accessionNumber: "IT001",
      issueCount: 38,
      category: "Textbooks",
    },
    {
      title: "Digital Electronics",
      author: "Morris Mano",
      accessionNumber: "EC001",
      issueCount: 32,
      category: "Textbooks",
    },
  ];

  const reports = [
    { id: "overview", name: "Library Overview", icon: DocumentChartBarIcon },
    { id: "monthly", name: "Monthly Trends", icon: DocumentChartBarIcon },
    {
      id: "department",
      name: "Department Analysis",
      icon: DocumentChartBarIcon,
    },
    { id: "defaulters", name: "Defaulters Report", icon: DocumentChartBarIcon },
    { id: "popular", name: "Popular Books", icon: DocumentChartBarIcon },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">📊 Reports & Analytics</h1>
        <p className="page-subtitle">Library performance and usage reports</p>
      </div>

      {/* Report Selection */}
      <div className="flex flex-wrap gap-2">
        {reports.map((report) => (
          <button
            key={report.id}
            onClick={() => setSelectedReport(report.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedReport === report.id
                ? "bg-primary-100 text-primary-700 border border-primary-300"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            <report.icon className="w-4 h-4 inline mr-2" />
            {report.name}
          </button>
        ))}
      </div>

      {/* Date Range Filter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="form-input w-auto"
          >
            <option value="last7days">Last 7 Days</option>
            <option value="last30days">Last 30 Days</option>
            <option value="last3months">Last 3 Months</option>
            <option value="last6months">Last 6 Months</option>
            <option value="lastyear">Last Year</option>
          </select>
        </div>
        <div className="flex space-x-2">
          <button className="btn-secondary btn-sm">
            <PrinterIcon className="w-4 h-4 mr-2" />
            Print
          </button>
          <button className="btn-secondary btn-sm">
            <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Report Content */}
      {selectedReport === "overview" && (
        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="stats-card text-center">
              <div className="text-3xl font-bold text-primary-600">
                {overviewData.totalBooks}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Books</div>
            </div>
            <div className="stats-card text-center">
              <div className="text-3xl font-bold text-blue-600">
                {overviewData.totalStudents}
              </div>
              <div className="text-sm text-gray-600 mt-1">Active Students</div>
            </div>
            <div className="stats-card text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {overviewData.booksIssued}
              </div>
              <div className="text-sm text-gray-600 mt-1">Books Issued</div>
            </div>
            <div className="stats-card text-center">
              <div className="text-3xl font-bold text-red-600">
                {overviewData.overdueBooks}
              </div>
              <div className="text-sm text-gray-600 mt-1">Overdue Books</div>
            </div>
            <div className="stats-card text-center">
              <div className="text-3xl font-bold text-green-600">
                ₹{overviewData.finesCollected}
              </div>
              <div className="text-sm text-gray-600 mt-1">Fines Collected</div>
            </div>
            <div className="stats-card text-center">
              <div className="text-3xl font-bold text-orange-600">
                ₹{overviewData.pendingFines}
              </div>
              <div className="text-sm text-gray-600 mt-1">Pending Fines</div>
            </div>
          </div>
        </div>
      )}

      {selectedReport === "monthly" && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Monthly Library Activity</h3>
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="issued"
                  stroke="#22c55e"
                  strokeWidth={2}
                  name="Books Issued"
                />
                <Line
                  type="monotone"
                  dataKey="returned"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Books Returned"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {selectedReport === "department" && (
        <div className="table-container">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Department-wise Usage Analysis
            </h3>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Students</th>
                <th>Books Issued</th>
                <th>Overdue Books</th>
                <th>Pending Fines</th>
                <th>Usage Rate</th>
              </tr>
            </thead>
            <tbody>
              {departmentData.map((dept, index) => (
                <tr key={index}>
                  <td className="font-medium">{dept.department}</td>
                  <td>{dept.students}</td>
                  <td>{dept.booksIssued}</td>
                  <td>
                    <span
                      className={`badge ${
                        dept.overdue > 0 ? "badge-danger" : "badge-success"
                      }`}
                    >
                      {dept.overdue}
                    </span>
                  </td>
                  <td>₹{dept.fines}</td>
                  <td>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{
                          width: `${(dept.booksIssued / dept.students) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {Math.round((dept.booksIssued / dept.students) * 100)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedReport === "defaulters" && (
        <div className="table-container">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Defaulters List
            </h3>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Register No.</th>
                <th>Name</th>
                <th>Department</th>
                <th>Overdue Books</th>
                <th>Days Overdue</th>
                <th>Fine Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {defaultersList.map((defaulter, index) => (
                <tr key={index}>
                  <td className="font-medium">{defaulter.registerNumber}</td>
                  <td>{defaulter.name}</td>
                  <td>{defaulter.department}</td>
                  <td>
                    <span className="badge badge-danger">
                      {defaulter.overdueBooks}
                    </span>
                  </td>
                  <td>{defaulter.daysOverdue} days</td>
                  <td className="font-medium text-red-600">
                    ₹{defaulter.fineAmount}
                  </td>
                  <td>
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      Send Notice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedReport === "popular" && (
        <div className="table-container">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Most Popular Books
            </h3>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Title</th>
                <th>Author</th>
                <th>Accession No.</th>
                <th>Category</th>
                <th>Issue Count</th>
              </tr>
            </thead>
            <tbody>
              {popularBooks.map((book, index) => (
                <tr key={index}>
                  <td>
                    <span className="badge badge-info">#{index + 1}</span>
                  </td>
                  <td className="font-medium">{book.title}</td>
                  <td>{book.author}</td>
                  <td className="font-medium">{book.accessionNumber}</td>
                  <td>
                    <span className="badge badge-secondary">
                      {book.category}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-success">
                      {book.issueCount}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Reports;
