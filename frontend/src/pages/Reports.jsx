import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { libraryAPI } from "../services/api";
import {
  DocumentChartBarIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  FunnelIcon,
  ChartBarIcon,
  TableCellsIcon,
  PresentationChartLineIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  UserGroupIcon,
  BookOpenIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

function Reports() {
  const [selectedReport, setSelectedReport] = useState("overview");
  const [dateRange, setDateRange] = useState("last30days");
  const [department, setDepartment] = useState("all");
  const [exportFormat, setExportFormat] = useState("pdf");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Mock comprehensive data for reports
  const overviewData = {
    totalBooks: 2547,
    totalStudents: 1247,
    booksIssued: 342,
    booksReturned: 298,
    overdueBooks: 23,
    finesCollected: 2750.0,
    pendingFines: 450.0,
    newRegistrations: 45,
    booksAdded: 23,
    popularCategories: [
      "Computer Science",
      "Information Technology",
      "Electronics",
    ],
    trendsThisMonth: {
      issuesVsLastMonth: +12.5,
      returnsVsLastMonth: +8.3,
      finesVsLastMonth: -15.2,
      newStudentsVsLastMonth: +25.0,
    },
  };

  const monthlyData = [
    { month: "Jul", issued: 120, returned: 115, fines: 450, newStudents: 35 },
    { month: "Aug", issued: 135, returned: 128, fines: 320, newStudents: 28 },
    { month: "Sep", issued: 150, returned: 142, fines: 280, newStudents: 42 },
    { month: "Oct", issued: 128, returned: 135, fines: 380, newStudents: 31 },
    { month: "Nov", issued: 145, returned: 140, fines: 420, newStudents: 39 },
    { month: "Dec", issued: 342, returned: 298, fines: 450, newStudents: 45 },
  ];

  const departmentData = [
    {
      department: "Computer Science",
      students: 320,
      booksIssued: 145,
      overdue: 8,
      fines: 120,
      avgBooksPerStudent: 2.3,
      utilizationRate: 78,
    },
    {
      department: "Information Technology",
      students: 280,
      booksIssued: 98,
      overdue: 5,
      fines: 85,
      avgBooksPerStudent: 1.8,
      utilizationRate: 65,
    },
    {
      department: "Electronics",
      students: 250,
      booksIssued: 67,
      overdue: 7,
      fines: 135,
      avgBooksPerStudent: 1.4,
      utilizationRate: 52,
    },
    {
      department: "Mechanical Engineering",
      students: 220,
      booksIssued: 32,
      overdue: 3,
      fines: 45,
      avgBooksPerStudent: 0.8,
      utilizationRate: 28,
    },
    {
      department: "Civil Engineering",
      students: 177,
      booksIssued: 28,
      overdue: 2,
      fines: 30,
      avgBooksPerStudent: 0.6,
      utilizationRate: 22,
    },
  ];

  const categoryData = [
    { name: "Computer Science", value: 145, color: "#3b82f6" },
    { name: "Information Technology", value: 98, color: "#10b981" },
    { name: "Electronics", value: 67, color: "#f59e0b" },
    { name: "Engineering", value: 60, color: "#8b5cf6" },
    { name: "Mathematics", value: 45, color: "#ef4444" },
    { name: "Others", value: 35, color: "#6b7280" },
  ];

  const defaultersList = [
    {
      id: 1,
      registerNumber: "20IT015",
      name: "Kumar Raj",
      department: "Information Technology",
      year: 3,
      email: "kumar.r@college.edu.in",
      phone: "9876543210",
      photo_url:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      overdueBooks: 3,
      daysOverdue: 15,
      fineAmount: 45.0,
      totalBooksIssued: 23,
      overdueBooksDetails: [
        "Web Development",
        "Database Systems",
        "Software Engineering",
      ],
    },
    {
      id: 2,
      registerNumber: "21CS022",
      name: "Priya Lakshmi",
      department: "Computer Science",
      year: 3,
      email: "priya.l@college.edu.in",
      phone: "9876543211",
      photo_url:
        "https://images.unsplash.com/photo-1494790108755-2616b612b829?w=150&h=150&fit=crop&crop=face",
      overdueBooks: 2,
      daysOverdue: 8,
      fineAmount: 16.0,
      totalBooksIssued: 15,
      overdueBooksDetails: ["Data Structures", "Computer Networks"],
    },
    {
      id: 3,
      registerNumber: "19EC010",
      name: "Rajesh Kumar",
      department: "Electronics",
      year: 4,
      email: "rajesh.k@college.edu.in",
      phone: "9876543212",
      photo_url:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      overdueBooks: 1,
      daysOverdue: 22,
      fineAmount: 44.0,
      totalBooksIssued: 31,
      overdueBooksDetails: ["Digital Signal Processing"],
    },
  ];

  const popularBooksData = [
    {
      title: "Data Structures and Algorithms",
      author: "Thomas H. Cormen",
      category: "Computer Science",
      totalIssues: 45,
      currentlyIssued: 8,
      averageRating: 4.5,
      isbn: "978-0262033848",
    },
    {
      title: "Web Development with React",
      author: "Mark Tielens Thomas",
      category: "Information Technology",
      totalIssues: 38,
      currentlyIssued: 6,
      averageRating: 4.3,
      isbn: "978-1491954058",
    },
    {
      title: "Digital Signal Processing",
      author: "Alan V. Oppenheim",
      category: "Electronics",
      totalIssues: 32,
      currentlyIssued: 5,
      averageRating: 4.2,
      isbn: "978-0131988422",
    },
    {
      title: "Engineering Mechanics",
      author: "R.S. Khurmi",
      category: "Mechanical Engineering",
      totalIssues: 28,
      currentlyIssued: 4,
      averageRating: 4.0,
      isbn: "978-8121926171",
    },
  ];

  const weeklyActivityData = [
    { day: "Mon", issues: 45, returns: 38, visitors: 120 },
    { day: "Tue", issues: 52, returns: 41, visitors: 145 },
    { day: "Wed", issues: 38, returns: 48, visitors: 98 },
    { day: "Thu", issues: 61, returns: 35, visitors: 167 },
    { day: "Fri", issues: 48, returns: 52, visitors: 189 },
    { day: "Sat", issues: 23, returns: 28, visitors: 76 },
    { day: "Sun", issues: 12, returns: 18, visitors: 45 },
  ];

  const reportTypes = [
    { id: "overview", name: "Library Overview", icon: ChartBarIcon },
    { id: "circulation", name: "Circulation Report", icon: BookOpenIcon },
    { id: "students", name: "Student Analytics", icon: UserGroupIcon },
    {
      id: "defaulters",
      name: "Defaulters Report",
      icon: ExclamationTriangleIcon,
    },
    { id: "popular", name: "Popular Books", icon: ArrowTrendingUpIcon },
    { id: "financial", name: "Financial Report", icon: CurrencyRupeeIcon },
  ];

  const departments = [
    "all",
    "Computer Science",
    "Information Technology",
    "Electronics",
    "Mechanical Engineering",
    "Civil Engineering",
  ];

  // Export functionality
  const handleExport = async () => {
    setIsGeneratingReport(true);
    // Simulate report generation
    setTimeout(() => {
      const reportData = generateReportData();
      downloadReport(reportData, exportFormat);
      setIsGeneratingReport(false);
    }, 2000);
  };

  const generateReportData = () => {
    // Generate report based on selected type and filters
    return {
      type: selectedReport,
      dateRange,
      department,
      generatedAt: new Date().toISOString(),
      data: getCurrentReportData(),
    };
  };

  const downloadReport = (data, format) => {
    const filename = `library_report_${selectedReport}_${new Date().getTime()}.${format}`;
    // Simulate file download
    console.log(`Downloading ${filename}`, data);
    alert(`Report "${filename}" has been generated and downloaded!`);
  };

  const getCurrentReportData = () => {
    switch (selectedReport) {
      case "overview":
        return overviewData;
      case "circulation":
        return monthlyData;
      case "students":
        return departmentData;
      case "defaulters":
        return defaultersList;
      case "popular":
        return popularBooksData;
      case "financial":
        return {
          finesCollected: overviewData.finesCollected,
          pendingFines: overviewData.pendingFines,
        };
      default:
        return overviewData;
    }
  };

  const getTrendIcon = (trend) => {
    return trend > 0 ? (
      <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
    ) : (
      <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />
    );
  };

  const renderOverviewReport = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Books</p>
              <p className="text-2xl font-bold">
                {overviewData.totalBooks.toLocaleString()}
              </p>
            </div>
            <BookOpenIcon className="w-8 h-8 text-blue-200" />
          </div>
          <div className="flex items-center mt-2 text-blue-100 text-sm">
            {getTrendIcon(overviewData.trendsThisMonth.issuesVsLastMonth)}
            <span className="ml-1">+23 this month</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Students</p>
              <p className="text-2xl font-bold">
                {overviewData.totalStudents.toLocaleString()}
              </p>
            </div>
            <UserGroupIcon className="w-8 h-8 text-green-200" />
          </div>
          <div className="flex items-center mt-2 text-green-100 text-sm">
            {getTrendIcon(overviewData.trendsThisMonth.newStudentsVsLastMonth)}
            <span className="ml-1">
              {overviewData.trendsThisMonth.newStudentsVsLastMonth.toFixed(1)}%
              vs last month
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Books Issued</p>
              <p className="text-2xl font-bold">
                {overviewData.booksIssued.toLocaleString()}
              </p>
            </div>
            <ArrowDownTrayIcon className="w-8 h-8 text-orange-200" />
          </div>
          <div className="flex items-center mt-2 text-orange-100 text-sm">
            {getTrendIcon(overviewData.trendsThisMonth.issuesVsLastMonth)}
            <span className="ml-1">
              {overviewData.trendsThisMonth.issuesVsLastMonth.toFixed(1)}% vs
              last month
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Overdue Books</p>
              <p className="text-2xl font-bold">{overviewData.overdueBooks}</p>
            </div>
            <ExclamationTriangleIcon className="w-8 h-8 text-red-200" />
          </div>
          <div className="flex items-center mt-2 text-red-100 text-sm">
            <ClockIcon className="w-4 h-4" />
            <span className="ml-1">₹{overviewData.pendingFines} in fines</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Monthly Activity Trends</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="issued"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="returned"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Books by Category</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDefaultersReport = () => (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
          <h3 className="text-lg font-semibold text-red-800">
            Defaulters Summary
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {defaultersList.length}
            </div>
            <div className="text-sm text-red-700">Total Defaulters</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {defaultersList.reduce((sum, item) => sum + item.overdueBooks, 0)}
            </div>
            <div className="text-sm text-red-700">Overdue Books</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              ₹
              {defaultersList
                .reduce((sum, item) => sum + item.fineAmount, 0)
                .toFixed(2)}
            </div>
            <div className="text-sm text-red-700">Total Fines</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold">Defaulters List</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Overdue Books
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Days Overdue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fine Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Contact
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {defaultersList.map((defaulter) => (
                <tr key={defaulter.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={defaulter.photo_url}
                        alt={defaulter.name}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {defaulter.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {defaulter.registerNumber}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {defaulter.department}
                    </div>
                    <div className="text-sm text-gray-500">
                      Year {defaulter.year}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                      {defaulter.overdueBooks} books
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-red-600 font-medium">
                      {defaulter.daysOverdue} days
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-red-600 font-medium">
                      ₹{defaulter.fineAmount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {defaulter.email}
                    </div>
                    <div className="text-sm text-gray-500">
                      {defaulter.phone}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCurrentReport = () => {
    switch (selectedReport) {
      case "overview":
        return renderOverviewReport();
      case "defaulters":
        return renderDefaultersReport();
      case "circulation":
        return (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold">Circulation Trends</h3>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="issued"
                    stroke="#3b82f6"
                    strokeWidth={3}
                  />
                  <Line
                    type="monotone"
                    dataKey="returned"
                    stroke="#10b981"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      case "students":
        return (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold">
                Department-wise Analytics
              </h3>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="department"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="students" fill="#3b82f6" />
                  <Bar dataKey="booksIssued" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      default:
        return renderOverviewReport();
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">📊 Library Reports</h1>
        <p className="page-subtitle">
          Generate comprehensive reports and analytics
        </p>
      </div>

      {/* Report Controls */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {reportTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="today">Today</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="last3months">Last 3 Months</option>
              <option value="last6months">Last 6 Months</option>
              <option value="lastyear">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === "all" ? "All Departments" : dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Format
            </label>
            <div className="flex space-x-2">
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
              </select>
              <button
                onClick={handleExport}
                disabled={isGeneratingReport}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center"
              >
                {isGeneratingReport ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <ArrowDownTrayIcon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Navigation */}
      <div className="bg-white border border-gray-200 rounded-lg p-2">
        <div className="flex flex-wrap gap-2">
          {reportTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedReport(type.id)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedReport === type.id
                    ? "bg-primary-100 text-primary-700 border border-primary-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {type.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Report Content */}
      <div className="min-h-96">{renderCurrentReport()}</div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <PrinterIcon className="w-5 h-5 mr-2" />
            Print Report
          </button>
          <button
            onClick={handleExport}
            className="flex items-center justify-center px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
          >
            <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
            Download Report
          </button>
          <button
            onClick={() => {
              setSelectedReport("overview");
              setDateRange("last30days");
              setDepartment("all");
            }}
            className="flex items-center justify-center px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FunnelIcon className="w-5 h-5 mr-2" />
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}

export default Reports;
