import { useQuery } from "react-query";
import { libraryAPI } from "../services/api";
import { runConnectivityTest } from "../utils/apiTest";
import {
  BookOpenIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  CurrencyRupeeIcon,
  ClockIcon,
  CheckCircleIcon,
  WifiIcon,
} from "@heroicons/react/24/outline";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// API function to fetch dashboard stats
const fetchDashboardStats = async () => {
  try {
    const response = await libraryAPI.getDashboardStats();
    return response.data;
  } catch (error) {
    // Fallback to mock data if API is not available
    console.warn("API not available, using mock data:", error.message);
    return {
      status: "success",
      data: {
        stats: {
          totalBooks: 4,
          totalCopies: 45,
          totalStudents: 5,
          issuedBooks: 0,
          overdueBooks: 0,
          pendingFines: 0.0,
          finesCollected: 0.0,
          availableBooks: 45,
        },
        recentActivities: [
          {
            id: 1,
            type: "issued",
            student: { registerNumber: "20IT001", name: "Arjun Kumar" },
            book: { title: "Web Development Fundamentals" },
            date: "2024-12-25",
            status: "issued",
          },
          {
            id: 2,
            type: "returned",
            student: { registerNumber: "21CS022", name: "Priya Sharma" },
            book: { title: "Data Structures" },
            date: "2024-12-24",
            status: "returned",
          },
        ],
      },
    };
  }
};

function Dashboard() {
  const { data, isLoading, isError } = useQuery(
    "dashboard-stats",
    fetchDashboardStats
  );

  if (isLoading) return <DashboardSkeleton />;
  if (isError) return <ErrorMessage />;

  const stats = data?.data?.stats || {};
  const recentActivities = data?.data?.recentActivities || [];

  const statsCards = [
    {
      title: "Total Books",
      value: stats.totalBooks?.toLocaleString() || "0",
      subtitle: `${stats.totalCopies?.toLocaleString() || "0"} copies`,
      icon: BookOpenIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Students",
      value: stats.totalStudents?.toLocaleString() || "0",
      subtitle: "Registered users",
      icon: UserGroupIcon,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Books Issued",
      value: stats.issuedBooks?.toLocaleString() || "0",
      subtitle: `${stats.availableBooks?.toLocaleString() || "0"} available`,
      icon: ClockIcon,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Overdue Books",
      value: stats.overdueBooks?.toLocaleString() || "0",
      subtitle: `₹${stats.pendingFines?.toLocaleString() || "0"} pending`,
      icon: ExclamationTriangleIcon,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Fines Collected",
      value: `₹${stats.finesCollected?.toLocaleString() || "0"}`,
      subtitle: "This month",
      icon: CurrencyRupeeIcon,
      color: "text-primary-600",
      bgColor: "bg-primary-50",
    },
  ];

  // Mock data for charts
  const categoryData = [
    { name: "Textbooks", books: 1234, available: 1100 },
    { name: "Reference", books: 567, available: 520 },
    { name: "Journals", books: 345, available: 310 },
    { name: "Fiction", books: 234, available: 200 },
    { name: "Project Reports", books: 167, available: 150 },
  ];

  const departmentData = [
    { name: "CSE", value: 450, color: "#22c55e" },
    { name: "IT", value: 320, color: "#3b82f6" },
    { name: "ECE", value: 280, color: "#f59e0b" },
    { name: "Mech", value: 197, color: "#ef4444" },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="page-header flex justify-between items-start">
        <div>
          <h1 className="page-title">📚 Library Dashboard</h1>
          <p className="page-subtitle">
            Welcome to Tamil Nadu College Library Management System
          </p>
        </div>
        <button
          onClick={runConnectivityTest}
          className="btn-secondary flex items-center gap-2"
          title="Test API connectivity"
        >
          <WifiIcon className="h-4 w-4" />
          Test API
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statsCards.map((stat, index) => (
          <div key={index} className="stats-card">
            <div className="flex items-center">
              <div className={`flex-shrink-0 ${stat.bgColor} rounded-lg p-3`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-sm font-medium text-gray-500">
                  {stat.title}
                </h3>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <p className="text-sm text-gray-600">{stat.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Books by Category Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Books by Category</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="books" fill="#22c55e" />
                <Bar dataKey="available" fill="#86efac" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Usage Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Department-wise Usage</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Activities</h3>
        </div>
        <div className="flow-root">
          <ul className="-mb-8">
            {recentActivities.map((activity, index) => (
              <li key={activity.id}>
                <div className="relative pb-8">
                  {index !== recentActivities.length - 1 && (
                    <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" />
                  )}
                  <div className="relative flex space-x-3">
                    <div>
                      <span
                        className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                          activity.type === "issued"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      >
                        {activity.type === "issued" ? (
                          <ClockIcon className="h-4 w-4 text-white" />
                        ) : (
                          <CheckCircleIcon className="h-4 w-4 text-white" />
                        )}
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium text-gray-900">
                            {activity.student.name}
                          </span>{" "}
                          ({activity.student.registerNumber}) {activity.type}{" "}
                          book{" "}
                          <span className="font-medium text-gray-900">
                            "{activity.book.title}"
                          </span>
                        </p>
                      </div>
                      <div className="whitespace-nowrap text-right text-sm text-gray-500">
                        <time dateTime={activity.date}>{activity.date}</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-primary-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-primary-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/books"
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <BookOpenIcon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Manage Books</p>
          </a>
          <a
            href="/students"
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <UserGroupIcon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Manage Students</p>
          </a>
          <a
            href="/issue"
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <ClockIcon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Issue Books</p>
          </a>
          <a
            href="/return"
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <CheckCircleIcon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Return Books</p>
          </a>
        </div>
      </div>
    </div>
  );
}

// Loading skeleton component
function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="page-header">
        <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-96"></div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="stats-card animate-pulse">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="ml-4 flex-1">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-16 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Error message component
function ErrorMessage() {
  return (
    <div className="text-center py-12">
      <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">
        Error loading dashboard
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Unable to load dashboard data. Please check your connection.
      </p>
    </div>
  );
}

export default Dashboard;
