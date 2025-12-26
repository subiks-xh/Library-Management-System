import { useQuery } from "react-query";
import { useState, useEffect } from "react";
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
  ArrowUpIcon,
  ArrowDownIcon,
  BellIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  EyeIcon,
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
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

// API function to fetch dashboard stats
const fetchDashboardStats = async () => {
  try {
    const response = await libraryAPI.getDashboardStats();
    return response.data;
  } catch (error) {
    // Fallback to comprehensive mock data if API is not available
    console.warn("API not available, using mock data:", error.message);
    return {
      status: "success",
      data: {
        stats: {
          totalBooks: 2547,
          totalCopies: 4523,
          totalStudents: 1247,
          issuedBooks: 342,
          overdueBooks: 23,
          pendingFines: 450.0,
          finesCollected: 2750.0,
          availableBooks: 4181,
          newStudentsThisMonth: 45,
          booksAddedThisMonth: 23,
          averageIssueTime: 3.2,
          libraryUtilization: 76.3,
        },
        trends: {
          booksVsLastMonth: 12.5,
          studentsVsLastMonth: 8.3,
          issuesVsLastMonth: 15.7,
          finesVsLastMonth: -22.4,
        },
        recentActivities: [
          {
            id: 1,
            type: "issued",
            student: {
              registerNumber: "20IT001",
              name: "Arjun Krishnamurthy",
              photo_url:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            },
            book: {
              title: "Advanced Web Development with React",
              author: "John Doe",
              cover_image:
                "https://images.unsplash.com/photo-1562813733-b31f71025d54?w=200&h=300&fit=crop",
            },
            date: "2024-12-25",
            time: "14:30",
            status: "issued",
          },
          {
            id: 2,
            type: "returned",
            student: {
              registerNumber: "21CS022",
              name: "Priya Lakshmi",
              photo_url:
                "https://images.unsplash.com/photo-1494790108755-2616b612b829?w=150&h=150&fit=crop&crop=face",
            },
            book: {
              title: "Database Management Systems",
              author: "Raghu Ramakrishnan",
              cover_image:
                "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=300&fit=crop",
            },
            date: "2024-12-25",
            time: "13:45",
            status: "returned",
            fine: 0,
          },
          {
            id: 3,
            type: "renewed",
            student: {
              registerNumber: "22EC025",
              name: "Rajesh Kumar",
              photo_url:
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            },
            book: {
              title: "Digital Signal Processing",
              author: "Alan V. Oppenheim",
              cover_image:
                "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop",
            },
            date: "2024-12-25",
            time: "11:20",
            status: "renewed",
          },
          {
            id: 4,
            type: "fine_paid",
            student: {
              registerNumber: "21IT045",
              name: "Kavitha Devi",
              photo_url:
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
            },
            book: {
              title: "Engineering Mathematics",
              author: "B.S. Grewal",
              cover_image:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop",
            },
            date: "2024-12-25",
            time: "10:15",
            status: "fine_paid",
            fine: 24.0,
          },
        ],
        alerts: [
          {
            id: 1,
            type: "warning",
            title: "Due Today",
            message: "15 books are due for return today",
            count: 15,
          },
          {
            id: 2,
            type: "error",
            title: "Overdue Books",
            message: "23 books are overdue and need immediate attention",
            count: 23,
          },
          {
            id: 3,
            type: "info",
            title: "New Arrivals",
            message: "8 new books added to the collection this week",
            count: 8,
          },
        ],
        todayStats: {
          visits: 89,
          issues: 12,
          returns: 8,
          renewals: 3,
          finesCollected: 85.0,
          newRegistrations: 2,
        },
      },
    };
  }
};

function Dashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("today");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const { data, isLoading, isError, refetch } = useQuery(
    ["dashboard-stats", selectedTimeframe],
    fetchDashboardStats,
    {
      refetchInterval: 30000, // Refresh every 30 seconds
      onSuccess: () => {
        setLastUpdated(new Date());
      },
    }
  );

  // Manual refresh function
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);
    return () => clearInterval(interval);
  }, [refetch]);

  if (isLoading) return <DashboardSkeleton />;
  if (isError) return <ErrorMessage />;

  const stats = data?.data?.stats || {};
  const trends = data?.data?.trends || {};
  const recentActivities = data?.data?.recentActivities || [];
  const alerts = data?.data?.alerts || [];
  const todayStats = data?.data?.todayStats || {};

  const statsCards = [
    {
      title: "Total Books",
      value: stats.totalBooks?.toLocaleString() || "0",
      subtitle: `${stats.totalCopies?.toLocaleString() || "0"} copies`,
      icon: BookOpenIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: trends.booksVsLastMonth,
      trendLabel: "vs last month",
    },
    {
      title: "Active Students",
      value: stats.totalStudents?.toLocaleString() || "0",
      subtitle: `+${stats.newStudentsThisMonth || 0} this month`,
      icon: UserGroupIcon,
      color: "text-green-600",
      bgColor: "bg-green-50",
      trend: trends.studentsVsLastMonth,
      trendLabel: "vs last month",
    },
    {
      title: "Books Issued",
      value: stats.issuedBooks?.toLocaleString() || "0",
      subtitle: `${((stats.issuedBooks / stats.totalCopies) * 100).toFixed(
        1
      )}% utilization`,
      icon: ClockIcon,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      trend: trends.issuesVsLastMonth,
      trendLabel: "vs last month",
    },
    {
      title: "Overdue Books",
      value: stats.overdueBooks?.toString() || "0",
      subtitle: `₹${stats.pendingFines?.toFixed(2) || "0"} in fines`,
      icon: ExclamationTriangleIcon,
      color: "text-red-600",
      bgColor: "bg-red-50",
      trend: null,
      trendLabel: "needs attention",
    },
    {
      title: "Fines Collected",
      value: `₹${stats.finesCollected?.toLocaleString() || "0"}`,
      subtitle: `₹${stats.pendingFines?.toFixed(2) || "0"} pending`,
      icon: CurrencyRupeeIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      trend: trends.finesVsLastMonth,
      trendLabel: "vs last month",
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
