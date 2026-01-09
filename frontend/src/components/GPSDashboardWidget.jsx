import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import gpsTrackingAPI from "../services/gpsTrackingAPI";
import {
  MapPinIcon,
  UserGroupIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  EyeIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

// API call for GPS dashboard stats
const fetchGPSDashboardStats = async () => {
  return gpsTrackingAPI.getDashboardStats();
};

const GPSDashboardWidget = () => {
  const { data: gpsStats, isLoading } = useQuery({
    queryKey: ["gps-dashboard-stats"],
    queryFn: fetchGPSDashboardStats,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const entryTime = new Date(dateString);
    const diffMinutes = Math.floor((now - entryTime) / (1000 * 60));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-lg p-2 mr-3">
              <MapPinIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                GPS Tracking
              </h3>
              <p className="text-sm text-gray-500">Live library occupancy</p>
            </div>
          </div>
          <Link
            to="/gps-tracking"
            className="inline-flex items-center text-sm text-green-600 hover:text-green-700 font-medium"
          >
            View Details
            <ChevronRightIcon className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <UserGroupIcon className="w-5 h-5 text-blue-500 mr-1" />
              <span className="text-2xl font-bold text-gray-900">
                {gpsStats?.currentOccupancy || 0}
              </span>
            </div>
            <p className="text-sm text-gray-500">Currently Inside</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <EyeIcon className="w-5 h-5 text-purple-500 mr-1" />
              <span className="text-2xl font-bold text-gray-900">
                {gpsStats?.uniqueVisitors || 0}
              </span>
            </div>
            <p className="text-sm text-gray-500">Unique Visitors</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center justify-center py-2 px-3 bg-green-50 rounded-lg">
            <ArrowRightOnRectangleIcon className="w-4 h-4 text-green-600 mr-2" />
            <div className="text-center">
              <div className="text-lg font-semibold text-green-700">
                {gpsStats?.todayEntries || 0}
              </div>
              <div className="text-xs text-green-600">Entries</div>
            </div>
          </div>

          <div className="flex items-center justify-center py-2 px-3 bg-blue-50 rounded-lg">
            <ArrowLeftOnRectangleIcon className="w-4 h-4 text-blue-600 mr-2" />
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-700">
                {gpsStats?.todayExits || 0}
              </div>
              <div className="text-xs text-blue-600">Exits</div>
            </div>
          </div>
        </div>

        {/* Recent Entries */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Recent Entries
          </h4>
          <div className="space-y-2">
            {gpsStats?.recentEntries?.slice(0, 3).map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {entry.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {entry.register_number} • {entry.department}
                  </p>
                </div>
                <div className="text-xs text-gray-400 ml-2">
                  {formatTimeAgo(entry.entry_time)}
                </div>
              </div>
            ))}

            {(!gpsStats?.recentEntries ||
              gpsStats.recentEntries.length === 0) && (
              <div className="text-center py-4 text-gray-500 text-sm">
                No recent entries
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Auto-refreshes every 30s</span>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
            Live
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPSDashboardWidget;
