import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import gpsTrackingAPI from "../services/gpsTrackingAPI";
import {
  MapPinIcon,
  UserGroupIcon,
  ClockIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  EyeIcon,
  ChartBarIcon,
  CogIcon,
  BellIcon,
  ArrowPathIcon,
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

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

// API calls using the GPS tracking service
const fetchGPSData = async () => {
  return gpsTrackingAPI.getAnalytics();
};

const fetchCurrentOccupancy = async () => {
  return gpsTrackingAPI.getCurrentOccupancy();
};

const fetchRecentLogs = async () => {
  return gpsTrackingAPI.getEntryLogs({ limit: 20 });
};

function GPSLibraryTracking() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLocationPermissionGranted, setIsLocationPermissionGranted] =
    useState(false);

  // Queries
  const { data: analyticsData, refetch: refetchAnalytics } = useQuery({
    queryKey: ["gps-analytics"],
    queryFn: fetchGPSData,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: occupancyData, refetch: refetchOccupancy } = useQuery({
    queryKey: ["current-occupancy"],
    queryFn: fetchCurrentOccupancy,
    refetchInterval: 15000, // Refresh every 15 seconds
  });

  const { data: logsData, refetch: refetchLogs } = useQuery({
    queryKey: ["entry-logs"],
    queryFn: fetchRecentLogs,
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Check geolocation permission
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        setIsLocationPermissionGranted(result.state === "granted");
      });
    }
  }, []);

  const refreshAllData = () => {
    refetchAnalytics();
    refetchOccupancy();
    refetchLogs();
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
              <ArrowRightOnRectangleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Today's Entries
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {analyticsData?.todayStats?.entries_today || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
              <ArrowLeftOnRectangleIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Today's Exits</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analyticsData?.todayStats?.exits_today || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-100 rounded-lg p-3">
              <UserGroupIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Currently Inside
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {analyticsData?.currentOccupancy || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
              <EyeIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Unique Visitors
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {analyticsData?.todayStats?.unique_visitors_today || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Hourly Library Activity
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData?.hourlyActivity || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" tickFormatter={(hour) => `${hour}:00`} />
                <YAxis />
                <Tooltip
                  labelFormatter={(hour) => `${hour}:00`}
                  formatter={(value) => [value, "Entries"]}
                />
                <Bar
                  dataKey="activities"
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Stats */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Department-wise Visitors
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData?.departmentStats || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ department, unique_visitors }) =>
                    `${department.split(" ")[0]}: ${unique_visitors}`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="unique_visitors"
                >
                  {(analyticsData?.departmentStats || []).map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    )
                  )}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentOccupancy = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Students Currently in Library ({occupancyData?.totalCount || 0})
          </h3>
          <button
            onClick={refetchOccupancy}
            className="btn-secondary btn-sm flex items-center"
          >
            <ArrowPathIcon className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Entry Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(occupancyData?.students || []).map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {student.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {student.register_number}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatTime(student.entry_time)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDuration(student.minutes_inside)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    Reading Area
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(!occupancyData?.students || occupancyData.students.length === 0) && (
        <div className="text-center py-12">
          <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No students currently in library
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Students will appear here when they enter the library premises.
          </p>
        </div>
      )}
    </div>
  );

  const renderRecentActivity = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Recent Entry/Exit Activity
          </h3>
          <button
            onClick={refetchLogs}
            className="btn-secondary btn-sm flex items-center"
          >
            <ArrowPathIcon className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>
      <div className="flow-root">
        <ul className="-mb-8 px-6 py-4">
          {(logsData?.logs || []).map((log, logIdx) => (
            <li key={log.id}>
              <div className="relative pb-8">
                {logIdx !== logsData?.logs?.length - 1 && (
                  <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" />
                )}
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={`
                      h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white
                      ${
                        log.entry_type === "entry"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }
                    `}
                    >
                      {log.entry_type === "entry" ? (
                        <ArrowRightOnRectangleIcon className="h-4 w-4 text-white" />
                      ) : (
                        <ArrowLeftOnRectangleIcon className="h-4 w-4 text-white" />
                      )}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium text-gray-900">
                          {log.name}
                        </span>{" "}
                        <span className="text-gray-500">
                          ({log.register_number})
                        </span>{" "}
                        {log.entry_type === "entry" ? "entered" : "exited"} the
                        library
                        {log.duration_minutes && (
                          <span className="text-gray-400">
                            {" "}
                            • Duration: {formatDuration(log.duration_minutes)}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-400">{log.department}</p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <time>{formatTime(log.entry_time)}</time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {(!logsData?.logs || logsData.logs.length === 0) && (
        <div className="text-center py-12">
          <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No recent activity
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Entry and exit logs will appear here.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title flex items-center">
              <MapPinIcon className="h-8 w-8 mr-3 text-primary-600" />
              GPS Library Tracking
            </h1>
            <p className="page-subtitle">
              Real-time student entry/exit monitoring using GPS location
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={refreshAllData}
              className="btn-secondary flex items-center"
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Refresh All
            </button>
            {!isLocationPermissionGranted && (
              <div className="flex items-center bg-yellow-50 text-yellow-700 px-3 py-2 rounded-md text-sm">
                <BellIcon className="h-4 w-4 mr-2" />
                Location access needed
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "overview"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <ChartBarIcon className="w-4 h-4 inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab("occupancy")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "occupancy"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <UserGroupIcon className="w-4 h-4 inline mr-2" />
            Current Occupancy
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "activity"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <ClockIcon className="w-4 h-4 inline mr-2" />
            Recent Activity
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "overview" && renderOverview()}
        {activeTab === "occupancy" && renderCurrentOccupancy()}
        {activeTab === "activity" && renderRecentActivity()}
      </div>
    </div>
  );
}

export default GPSLibraryTracking;
