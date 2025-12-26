import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  BellIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  SpeakerWaveIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  BookOpenIcon,
  CogIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

function NotificationSystem() {
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const queryClient = useQueryClient();

  // Fetch notifications data
  const { data: notificationsData, isLoading } = useQuery(
    [
      "notifications",
      { search: searchTerm, status: selectedStatus, type: selectedType },
    ],
    () =>
      fetchNotifications({
        search: searchTerm,
        status: selectedStatus,
        type: selectedType,
      }),
    { refetchOnWindowFocus: false }
  );

  const notifications = notificationsData?.data || mockNotifications;

  // Fetch notification statistics
  const { data: statsData } = useQuery(
    ["notification-stats"],
    fetchNotificationStats,
    { refetchOnWindowFocus: false }
  );

  const stats = statsData?.data || mockStats;

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      !selectedStatus || notification.status === selectedStatus;
    const matchesType = !selectedType || notification.type === selectedType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status) => {
    const colors = {
      sent: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
      scheduled: "bg-blue-100 text-blue-800",
      draft: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getTypeIcon = (type) => {
    const icons = {
      overdue: ExclamationTriangleIcon,
      reminder: ClockIcon,
      announcement: SpeakerWaveIcon,
      reservation: BookOpenIcon,
      registration: UserGroupIcon,
      system: InformationCircleIcon,
    };
    return icons[type] || BellIcon;
  };

  const getTypeColor = (type) => {
    const colors = {
      overdue: "text-red-600",
      reminder: "text-orange-600",
      announcement: "text-blue-600",
      reservation: "text-green-600",
      registration: "text-purple-600",
      system: "text-gray-600",
    };
    return colors[type] || "text-gray-600";
  };

  const NotificationCard = ({ notification }) => {
    const TypeIcon = getTypeIcon(notification.type);

    return (
      <div className="card hover:shadow-lg transition-all duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <div
              className={`p-2 rounded-lg bg-gray-100 ${getTypeColor(
                notification.type
              )}`}
            >
              <TypeIcon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                {notification.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {notification.message}
              </p>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>Type: {notification.type}</span>
                <span>•</span>
                <span>Recipients: {notification.recipient_count}</span>
                <span>•</span>
                <span>
                  Created:{" "}
                  {new Date(notification.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                notification.status
              )}`}
            >
              {notification.status}
            </span>
          </div>
        </div>

        {/* Notification Stats */}
        <div className="grid grid-cols-4 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {notification.delivery_stats.sent}
            </div>
            <div className="text-xs text-gray-600">Sent</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {notification.delivery_stats.delivered}
            </div>
            <div className="text-xs text-gray-600">Delivered</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600">
              {notification.delivery_stats.opened}
            </div>
            <div className="text-xs text-gray-600">Opened</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">
              {notification.delivery_stats.failed}
            </div>
            <div className="text-xs text-gray-600">Failed</div>
          </div>
        </div>

        {/* Delivery Channels */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-2">
            {notification.channels.email && (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                <EnvelopeIcon className="h-3 w-3 mr-1" />
                Email
              </span>
            )}
            {notification.channels.sms && (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                <DevicePhoneMobileIcon className="h-3 w-3 mr-1" />
                SMS
              </span>
            )}
            {notification.channels.push && (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                <BellIcon className="h-3 w-3 mr-1" />
                Push
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            {notification.scheduled_at
              ? `Scheduled: ${new Date(
                  notification.scheduled_at
                ).toLocaleString()}`
              : "Sent immediately"}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedNotification(notification)}
            className="btn-secondary btn-sm flex items-center"
          >
            <EyeIcon className="h-4 w-4 mr-2" />
            View Details
          </button>
          {notification.status === "draft" && (
            <button className="btn-primary btn-sm flex items-center">
              <PlayIcon className="h-4 w-4 mr-2" />
              Send Now
            </button>
          )}
          {notification.status === "scheduled" && (
            <button className="btn-secondary btn-sm flex items-center">
              <PauseIcon className="h-4 w-4 mr-2" />
              Pause
            </button>
          )}
          <button className="btn-secondary btn-sm flex items-center">
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit
          </button>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="stat-card">
                <div className="stat-card-header">
                  <h3 className="stat-card-title">Total Sent</h3>
                  <BellIcon className="stat-card-icon text-blue-600" />
                </div>
                <p className="stat-card-value">
                  {stats.total_sent.toLocaleString()}
                </p>
                <p className="stat-card-description">This month</p>
              </div>

              <div className="stat-card">
                <div className="stat-card-header">
                  <h3 className="stat-card-title">Delivery Rate</h3>
                  <CheckCircleIcon className="stat-card-icon text-green-600" />
                </div>
                <p className="stat-card-value">{stats.delivery_rate}%</p>
                <p className="stat-card-description">Success rate</p>
              </div>

              <div className="stat-card">
                <div className="stat-card-header">
                  <h3 className="stat-card-title">Open Rate</h3>
                  <EyeIcon className="stat-card-icon text-orange-600" />
                </div>
                <p className="stat-card-value">{stats.open_rate}%</p>
                <p className="stat-card-description">Email opens</p>
              </div>

              <div className="stat-card">
                <div className="stat-card-header">
                  <h3 className="stat-card-title">Scheduled</h3>
                  <CalendarDaysIcon className="stat-card-icon text-purple-600" />
                </div>
                <p className="stat-card-value">{stats.scheduled_count}</p>
                <p className="stat-card-description">Pending delivery</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Recent Notifications</h3>
                <p className="card-description">Latest 10 notifications</p>
              </div>
              <div className="space-y-4">
                {filteredNotifications.slice(0, 5).map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg bg-white ${getTypeColor(
                          notification.type
                        )}`}
                      >
                        {(() => {
                          const Icon = getTypeIcon(notification.type);
                          return <Icon className="h-4 w-4" />;
                        })()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {notification.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          {notification.recipient_count} recipients •{" "}
                          {new Date(
                            notification.created_at
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        notification.status
                      )}`}
                    >
                      {notification.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="card">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search notifications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="form-input pl-10 w-full"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="form-select"
                    >
                      <option value="">All Status</option>
                      <option value="sent">Sent</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="draft">Draft</option>
                    </select>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="form-select"
                    >
                      <option value="">All Types</option>
                      <option value="overdue">Overdue</option>
                      <option value="reminder">Reminder</option>
                      <option value="announcement">Announcement</option>
                      <option value="reservation">Reservation</option>
                      <option value="registration">Registration</option>
                      <option value="system">System</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                />
              ))}
            </div>
          </div>
        );

      case "templates":
        return (
          <div className="space-y-6">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Notification Templates</h3>
                <p className="card-description">
                  Pre-configured message templates
                </p>
              </div>
              <div className="space-y-4">
                {mockTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {template.name}
                      </h4>
                      <div className="flex space-x-2">
                        <button className="btn-secondary btn-sm">Edit</button>
                        <button className="btn-primary btn-sm">
                          Use Template
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {template.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Type: {template.type}</span>
                      <span>Used: {template.usage_count} times</span>
                      <span>
                        Last used:{" "}
                        {new Date(template.last_used).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Notification Settings</h3>
                <p className="card-description">
                  Configure notification channels and preferences
                </p>
              </div>
              <div className="space-y-6">
                {/* Email Settings */}
                <div className="border-b pb-6">
                  <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                    <EnvelopeIcon className="h-5 w-5 mr-2" />
                    Email Configuration
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">SMTP Server</label>
                      <input
                        type="text"
                        className="form-input"
                        defaultValue="smtp.gmail.com"
                      />
                    </div>
                    <div>
                      <label className="form-label">SMTP Port</label>
                      <input
                        type="text"
                        className="form-input"
                        defaultValue="587"
                      />
                    </div>
                    <div>
                      <label className="form-label">Username</label>
                      <input
                        type="email"
                        className="form-input"
                        defaultValue="library@university.edu"
                      />
                    </div>
                    <div>
                      <label className="form-label">From Name</label>
                      <input
                        type="text"
                        className="form-input"
                        defaultValue="University Library"
                      />
                    </div>
                  </div>
                </div>

                {/* SMS Settings */}
                <div className="border-b pb-6">
                  <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                    <DevicePhoneMobileIcon className="h-5 w-5 mr-2" />
                    SMS Configuration
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">SMS Provider</label>
                      <select className="form-select">
                        <option>Twilio</option>
                        <option>AWS SNS</option>
                        <option>Nexmo</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">API Key</label>
                      <input
                        type="password"
                        className="form-input"
                        placeholder="Enter API key"
                      />
                    </div>
                    <div>
                      <label className="form-label">From Number</label>
                      <input
                        type="text"
                        className="form-input"
                        defaultValue="+1234567890"
                      />
                    </div>
                    <div>
                      <label className="form-label">
                        Rate Limit (per hour)
                      </label>
                      <input
                        type="number"
                        className="form-input"
                        defaultValue="1000"
                      />
                    </div>
                  </div>
                </div>

                {/* Push Notification Settings */}
                <div className="pb-6">
                  <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                    <BellIcon className="h-5 w-5 mr-2" />
                    Push Notification Configuration
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Firebase Server Key</label>
                      <input
                        type="password"
                        className="form-input"
                        placeholder="Enter server key"
                      />
                    </div>
                    <div>
                      <label className="form-label">
                        Apple Push Certificate
                      </label>
                      <input type="file" className="form-input" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="btn-primary">Save Settings</button>
                </div>
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
              <BellIcon className="h-8 w-8 mr-3 text-primary-600" />
              Notification System
            </h1>
            <p className="page-subtitle">
              Manage notifications, alerts, and communication
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="btn-secondary flex items-center">
              <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
              Bulk SMS
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Notification
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "dashboard", name: "Dashboard", icon: ChartBarIcon },
            { id: "notifications", name: "All Notifications", icon: BellIcon },
            { id: "templates", name: "Templates", icon: DocumentTextIcon },
            { id: "settings", name: "Settings", icon: CogIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  selectedTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Notification Details Modal */}
      {selectedNotification && (
        <NotificationDetailsModal
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
        />
      )}

      {/* Create Notification Modal */}
      {showCreateModal && (
        <CreateNotificationModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

// Notification Details Modal
function NotificationDetailsModal({ notification, onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Notification Details
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                {notification.title}
              </h4>
              <p className="text-gray-600">{notification.message}</p>
            </div>

            {/* Delivery Statistics */}
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {notification.delivery_stats.sent}
                </div>
                <div className="text-sm text-gray-600">Sent</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {notification.delivery_stats.delivered}
                </div>
                <div className="text-sm text-gray-600">Delivered</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {notification.delivery_stats.opened}
                </div>
                <div className="text-sm text-gray-600">Opened</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {notification.delivery_stats.failed}
                </div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
            </div>

            {/* Recipient Details */}
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Recipients</h5>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">
                  Total Recipients: {notification.recipient_count}
                </div>
                {notification.recipient_groups && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {notification.recipient_groups.map((group, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {group}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="btn-secondary">View Recipients</button>
              <button className="btn-secondary">Export Report</button>
              <button className="btn-primary">Send Again</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Create Notification Modal
function CreateNotificationModal({ onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "announcement",
    channels: {
      email: true,
      sms: false,
      push: false,
    },
    recipients: [],
    scheduleType: "now",
    scheduledAt: "",
  });

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Create New Notification
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="form-input"
                  placeholder="Notification title"
                />
              </div>
              <div>
                <label className="form-label">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="form-select"
                >
                  <option value="announcement">Announcement</option>
                  <option value="reminder">Reminder</option>
                  <option value="overdue">Overdue Notice</option>
                  <option value="reservation">Reservation</option>
                  <option value="system">System Alert</option>
                </select>
              </div>
            </div>

            <div>
              <label className="form-label">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                rows={4}
                className="form-textarea"
                placeholder="Notification message content..."
              />
            </div>

            <div>
              <label className="form-label">Delivery Channels</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.channels.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        channels: {
                          ...formData.channels,
                          email: e.target.checked,
                        },
                      })
                    }
                    className="form-checkbox"
                  />
                  <EnvelopeIcon className="h-4 w-4 mx-2" />
                  <span>Email</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.channels.sms}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        channels: {
                          ...formData.channels,
                          sms: e.target.checked,
                        },
                      })
                    }
                    className="form-checkbox"
                  />
                  <DevicePhoneMobileIcon className="h-4 w-4 mx-2" />
                  <span>SMS</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.channels.push}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        channels: {
                          ...formData.channels,
                          push: e.target.checked,
                        },
                      })
                    }
                    className="form-checkbox"
                  />
                  <BellIcon className="h-4 w-4 mx-2" />
                  <span>Push Notification</span>
                </label>
              </div>
            </div>

            <div>
              <label className="form-label">Recipients</label>
              <select multiple className="form-select h-32">
                <option>All Students</option>
                <option>Faculty Members</option>
                <option>Computer Science Department</option>
                <option>Electronics Department</option>
                <option>Overdue Users</option>
                <option>Active Borrowers</option>
              </select>
            </div>

            <div>
              <label className="form-label">Schedule</label>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="scheduleType"
                      value="now"
                      checked={formData.scheduleType === "now"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          scheduleType: e.target.value,
                        })
                      }
                      className="form-radio"
                    />
                    <span className="ml-2">Send immediately</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="scheduleType"
                      value="scheduled"
                      checked={formData.scheduleType === "scheduled"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          scheduleType: e.target.value,
                        })
                      }
                      className="form-radio"
                    />
                    <span className="ml-2">Schedule for later</span>
                  </label>
                </div>
                {formData.scheduleType === "scheduled" && (
                  <input
                    type="datetime-local"
                    value={formData.scheduledAt}
                    onChange={(e) =>
                      setFormData({ ...formData, scheduledAt: e.target.value })
                    }
                    className="form-input"
                  />
                )}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button type="button" className="btn-secondary">
                Save as Draft
              </button>
              <button type="submit" className="btn-primary">
                {formData.scheduleType === "now" ? "Send Now" : "Schedule"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Mock data
const mockNotifications = [
  {
    id: 1,
    title: "Book Return Reminder",
    message:
      'Dear student, your borrowed book "Data Structures" is due tomorrow. Please return it to avoid late fees.',
    type: "reminder",
    status: "sent",
    created_at: "2024-01-15T10:30:00Z",
    scheduled_at: null,
    recipient_count: 145,
    recipient_groups: ["Computer Science Students"],
    channels: {
      email: true,
      sms: true,
      push: false,
    },
    delivery_stats: {
      sent: 145,
      delivered: 142,
      opened: 89,
      failed: 3,
    },
  },
  // Add more mock notifications...
];

const mockStats = {
  total_sent: 12450,
  delivery_rate: 94.2,
  open_rate: 67.8,
  scheduled_count: 23,
};

const mockTemplates = [
  {
    id: 1,
    name: "Book Overdue Notice",
    description: "Standard template for overdue book notifications",
    type: "overdue",
    usage_count: 1245,
    last_used: "2024-01-14T15:30:00Z",
  },
  // Add more mock templates...
];

async function fetchNotifications(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: "success",
        data: mockNotifications,
      });
    }, 1000);
  });
}

async function fetchNotificationStats() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: "success",
        data: mockStats,
      });
    }, 500);
  });
}

export default NotificationSystem;
