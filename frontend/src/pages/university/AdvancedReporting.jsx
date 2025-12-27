import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ChartBarIcon,
  DocumentChartBarIcon,
  PresentationChartBarIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserGroupIcon,
  BookOpenIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  ShareIcon,
  EyeIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

function AdvancedReporting() {
  const [selectedReport, setSelectedReport] = useState("circulation");
  const [dateRange, setDateRange] = useState("month");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [customDateStart, setCustomDateStart] = useState("");
  const [customDateEnd, setCustomDateEnd] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const queryClient = useQueryClient();

  // Fetch report data based on selected report type
  const { data: reportData, isLoading } = useQuery({
    queryKey: [
      "advanced-reports",
      { type: selectedReport, range: dateRange, branch: selectedBranch },
    ],
    queryFn: () =>
      fetchReportData({
        type: selectedReport,
        range: dateRange,
        branch: selectedBranch,
      }),
    refetchOnWindowFocus: false,
  });

  const reports = reportData?.data || mockReportData[selectedReport] || {};

  // Report categories
  const reportCategories = {
    circulation: {
      title: "Circulation Analytics",
      icon: BookOpenIcon,
      color: "blue",
      description: "Book loans, returns, and circulation trends",
    },
    users: {
      title: "User Analytics",
      icon: UserGroupIcon,
      color: "green",
      description: "Student and faculty usage patterns",
    },
    inventory: {
      title: "Inventory Reports",
      icon: DocumentChartBarIcon,
      color: "purple",
      description: "Collection analysis and book statistics",
    },
    financial: {
      title: "Financial Reports",
      icon: PresentationChartBarIcon,
      color: "orange",
      description: "Budget, costs, and financial analytics",
    },
    digital: {
      title: "Digital Resources",
      icon: ChartBarIcon,
      color: "indigo",
      description: "E-resources usage and subscription analytics",
    },
    overdue: {
      title: "Overdue Analysis",
      icon: ExclamationTriangleIcon,
      color: "red",
      description: "Late returns and penalty analysis",
    },
  };

  const COLORS = {
    blue: "#3B82F6",
    green: "#10B981",
    purple: "#8B5CF6",
    orange: "#F59E0B",
    indigo: "#6366F1",
    red: "#EF4444",
    pink: "#EC4899",
    teal: "#14B8A6",
  };

  // Quick stats calculation
  const calculateQuickStats = () => {
    const today = new Date();
    return {
      totalCirculations:
        reports.circulation_trend?.reduce(
          (sum, item) => sum + item.checkouts,
          0
        ) || 0,
      activeUsers: reports.user_activity?.length || 0,
      overdueItems: reports.overdue_summary?.total_overdue || 0,
      digitalAccess:
        reports.digital_usage?.reduce(
          (sum, item) => sum + item.access_count,
          0
        ) || 0,
    };
  };

  const stats = calculateQuickStats();

  // Export functionality
  const handleExportReport = (format) => {
    console.log(`Exporting ${selectedReport} report as ${format}`);
  };

  const renderChart = () => {
    switch (selectedReport) {
      case "circulation":
        return (
          <div className="space-y-8">
            {/* Circulation Trend */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Circulation Trends</h3>
                <p className="card-description">
                  Daily book checkouts and returns
                </p>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reports.circulation_trend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="checkouts"
                      stroke={COLORS.blue}
                      strokeWidth={2}
                      name="Checkouts"
                    />
                    <Line
                      type="monotone"
                      dataKey="returns"
                      stroke={COLORS.green}
                      strokeWidth={2}
                      name="Returns"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Popular Books */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Most Popular Books</h3>
                <p className="card-description">Top 10 most borrowed books</p>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reports.popular_books} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="title" type="category" width={150} />
                    <Tooltip />
                    <Bar dataKey="checkout_count" fill={COLORS.blue} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case "users":
        return (
          <div className="space-y-8">
            {/* User Activity */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">User Activity Distribution</h3>
                <p className="card-description">
                  Activity levels across user types
                </p>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reports.user_activity}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="count"
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {reports.user_activity?.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            Object.values(COLORS)[
                              index % Object.keys(COLORS).length
                            ]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Registration Trends */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">New User Registrations</h3>
                <p className="card-description">Monthly registration trends</p>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={reports.registration_trend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="registrations"
                      stroke={COLORS.green}
                      fill={COLORS.green}
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case "inventory":
        return (
          <div className="space-y-8">
            {/* Category Distribution */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Collection by Category</h3>
                <p className="card-description">
                  Book distribution across categories
                </p>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reports.category_distribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill={COLORS.purple} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Acquisition Trends */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Book Acquisitions</h3>
                <p className="card-description">
                  Monthly book additions to collection
                </p>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reports.acquisition_trend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="acquisitions"
                      stroke={COLORS.purple}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case "financial":
        return (
          <div className="space-y-8">
            {/* Budget Analysis */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Budget Utilization</h3>
                <p className="card-description">Spending across categories</p>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reports.budget_analysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [
                        `$${value.toLocaleString()}`,
                        "Amount",
                      ]}
                    />
                    <Bar dataKey="spent" fill={COLORS.orange} name="Spent" />
                    <Bar dataKey="budget" fill={COLORS.red} name="Budget" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Fine Collection */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Fine Collection Trends</h3>
                <p className="card-description">
                  Monthly fine collection statistics
                </p>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={reports.fine_collection}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [
                        `$${value.toLocaleString()}`,
                        "Amount",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="collected"
                      stroke={COLORS.orange}
                      fill={COLORS.orange}
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case "digital":
        return (
          <div className="space-y-8">
            {/* Digital Usage */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Digital Resource Usage</h3>
                <p className="card-description">
                  Access patterns for e-resources
                </p>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reports.digital_usage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="access_count"
                      stroke={COLORS.indigo}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Resource Type Distribution */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Resource Type Usage</h3>
                <p className="card-description">Usage by resource type</p>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reports.resource_type_usage}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      dataKey="usage"
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {reports.resource_type_usage?.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            Object.values(COLORS)[
                              index % Object.keys(COLORS).length
                            ]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case "overdue":
        return (
          <div className="space-y-8">
            {/* Overdue Trends */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Overdue Items Trend</h3>
                <p className="card-description">
                  Daily overdue book statistics
                </p>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={reports.overdue_trend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="overdue_count"
                      stroke={COLORS.red}
                      fill={COLORS.red}
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Overdue by Department */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Overdue Items by Department</h3>
                <p className="card-description">
                  Department-wise overdue analysis
                </p>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reports.overdue_by_department}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="overdue_count" fill={COLORS.red} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title flex items-center">
              <ChartBarIcon className="h-8 w-8 mr-3 text-primary-600" />
              Advanced Reporting & Analytics
            </h1>
            <p className="page-subtitle">
              Comprehensive insights and data-driven reports
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => handleExportReport("pdf")}
              className="btn-secondary flex items-center"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Export PDF
            </button>
            <button
              onClick={() => handleExportReport("excel")}
              className="btn-secondary flex items-center"
            >
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              Export Excel
            </button>
            <button className="btn-primary flex items-center">
              <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
              Custom Report
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Total Circulations</h3>
            <BookOpenIcon className="stat-card-icon text-blue-600" />
          </div>
          <p className="stat-card-value">
            {stats.totalCirculations.toLocaleString()}
          </p>
          <div className="flex items-center mt-2">
            <TrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+12% from last month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Active Users</h3>
            <UserGroupIcon className="stat-card-icon text-green-600" />
          </div>
          <p className="stat-card-value">
            {stats.activeUsers.toLocaleString()}
          </p>
          <div className="flex items-center mt-2">
            <TrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+8% from last month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Overdue Items</h3>
            <ExclamationTriangleIcon className="stat-card-icon text-red-600" />
          </div>
          <p className="stat-card-value">
            {stats.overdueItems.toLocaleString()}
          </p>
          <div className="flex items-center mt-2">
            <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
            <span className="text-sm text-red-600">-5% from last month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Digital Access</h3>
            <ChartBarIcon className="stat-card-icon text-indigo-600" />
          </div>
          <p className="stat-card-value">
            {stats.digitalAccess.toLocaleString()}
          </p>
          <div className="flex items-center mt-2">
            <TrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+25% from last month</span>
          </div>
        </div>
      </div>

      {/* Report Selection and Filters */}
      <div className="card">
        <div className="space-y-6">
          {/* Report Categories */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Report Categories
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(reportCategories).map(([key, category]) => {
                const Icon = category.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedReport(key)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedReport === key
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <Icon
                        className={`h-6 w-6 mr-3 text-${category.color}-600`}
                      />
                      <span className="font-semibold text-gray-900">
                        {category.title}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {category.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filters */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Report Filters
              </h3>
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="btn-secondary btn-sm flex items-center"
              >
                <FunnelIcon className="h-4 w-4 mr-2" />
                {showAdvancedFilters ? "Hide" : "Show"} Advanced Filters
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="form-label">Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="form-select"
                >
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="quarter">Last Quarter</option>
                  <option value="year">Last Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              <div>
                <label className="form-label">Library Branch</label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="form-select"
                >
                  <option value="">All Branches</option>
                  <option value="main">Main Library</option>
                  <option value="science">Science Library</option>
                  <option value="engineering">Engineering Library</option>
                  <option value="medical">Medical Library</option>
                  <option value="law">Law Library</option>
                </select>
              </div>

              {dateRange === "custom" && (
                <>
                  <div>
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      value={customDateStart}
                      onChange={(e) => setCustomDateStart(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">End Date</label>
                    <input
                      type="date"
                      value={customDateEnd}
                      onChange={(e) => setCustomDateEnd(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </>
              )}
            </div>

            {showAdvancedFilters && (
              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">User Type</label>
                    <select className="form-select">
                      <option value="">All Users</option>
                      <option value="student">Students</option>
                      <option value="faculty">Faculty</option>
                      <option value="staff">Staff</option>
                      <option value="guest">Guests</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Department</label>
                    <select className="form-select">
                      <option value="">All Departments</option>
                      <option value="cse">Computer Science</option>
                      <option value="ece">Electronics</option>
                      <option value="mech">Mechanical</option>
                      <option value="civil">Civil</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Book Category</label>
                    <select className="form-select">
                      <option value="">All Categories</option>
                      <option value="textbook">Textbooks</option>
                      <option value="reference">Reference</option>
                      <option value="fiction">Fiction</option>
                      <option value="research">Research</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Charts */}
      {isLoading ? (
        <div className="card">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-80 bg-gray-200 rounded"></div>
          </div>
        </div>
      ) : (
        renderChart()
      )}
    </div>
  );
}

// Mock data for different report types
const mockReportData = {
  circulation: {
    circulation_trend: [
      { date: "2024-01-01", checkouts: 145, returns: 132 },
      { date: "2024-01-02", checkouts: 167, returns: 145 },
      { date: "2024-01-03", checkouts: 134, returns: 156 },
      { date: "2024-01-04", checkouts: 189, returns: 167 },
      { date: "2024-01-05", checkouts: 156, returns: 134 },
      { date: "2024-01-06", checkouts: 198, returns: 189 },
      { date: "2024-01-07", checkouts: 123, returns: 156 },
    ],
    popular_books: [
      {
        title: "Data Structures and Algorithms",
        checkout_count: 89,
        author: "Cormen",
      },
      {
        title: "Operating System Concepts",
        checkout_count: 76,
        author: "Silberschatz",
      },
      { title: "Computer Networks", checkout_count: 68, author: "Tanenbaum" },
      {
        title: "Database System Concepts",
        checkout_count: 62,
        author: "Korth",
      },
      { title: "Software Engineering", checkout_count: 58, author: "Pressman" },
    ],
  },
  users: {
    user_activity: [
      { name: "Students", count: 2847 },
      { name: "Faculty", count: 234 },
      { name: "Staff", count: 89 },
      { name: "Guests", count: 45 },
    ],
    registration_trend: [
      { month: "Jan", registrations: 234 },
      { month: "Feb", registrations: 189 },
      { month: "Mar", registrations: 278 },
      { month: "Apr", registrations: 345 },
      { month: "May", registrations: 298 },
      { month: "Jun", registrations: 156 },
    ],
  },
  inventory: {
    category_distribution: [
      { category: "Computer Science", count: 1245 },
      { category: "Electronics", count: 987 },
      { category: "Mechanical", count: 876 },
      { category: "Civil", count: 654 },
      { category: "Mathematics", count: 543 },
      { category: "Physics", count: 432 },
    ],
    acquisition_trend: [
      { month: "Jan", acquisitions: 145 },
      { month: "Feb", acquisitions: 167 },
      { month: "Mar", acquisitions: 189 },
      { month: "Apr", acquisitions: 123 },
      { month: "May", acquisitions: 198 },
      { month: "Jun", acquisitions: 234 },
    ],
  },
  financial: {
    budget_analysis: [
      { category: "Books", spent: 45000, budget: 50000 },
      { category: "Digital Resources", spent: 28000, budget: 30000 },
      { category: "Equipment", spent: 15000, budget: 20000 },
      { category: "Staff", spent: 85000, budget: 90000 },
      { category: "Maintenance", spent: 12000, budget: 15000 },
    ],
    fine_collection: [
      { month: "Jan", collected: 1250 },
      { month: "Feb", collected: 1456 },
      { month: "Mar", collected: 1789 },
      { month: "Apr", collected: 1234 },
      { month: "May", collected: 1567 },
      { month: "Jun", collected: 1890 },
    ],
  },
  digital: {
    digital_usage: [
      { date: "2024-01-01", access_count: 234 },
      { date: "2024-01-02", access_count: 267 },
      { date: "2024-01-03", access_count: 189 },
      { date: "2024-01-04", access_count: 345 },
      { date: "2024-01-05", access_count: 298 },
      { date: "2024-01-06", access_count: 423 },
      { date: "2024-01-07", access_count: 356 },
    ],
    resource_type_usage: [
      { name: "E-Books", usage: 1245 },
      { name: "Journals", usage: 987 },
      { name: "Databases", usage: 654 },
      { name: "Videos", usage: 321 },
      { name: "Audio", usage: 123 },
    ],
  },
  overdue: {
    overdue_trend: [
      { date: "2024-01-01", overdue_count: 45 },
      { date: "2024-01-02", overdue_count: 52 },
      { date: "2024-01-03", overdue_count: 38 },
      { date: "2024-01-04", overdue_count: 67 },
      { date: "2024-01-05", overdue_count: 43 },
      { date: "2024-01-06", overdue_count: 58 },
      { date: "2024-01-07", overdue_count: 41 },
    ],
    overdue_by_department: [
      { department: "Computer Science", overdue_count: 28 },
      { department: "Electronics", overdue_count: 22 },
      { department: "Mechanical", overdue_count: 18 },
      { department: "Civil", overdue_count: 15 },
      { department: "Mathematics", overdue_count: 12 },
    ],
  },
};

async function fetchReportData(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: "success",
        data: mockReportData[params.type] || {},
      });
    }, 1000);
  });
}

export default AdvancedReporting;
