import { useState } from "react";
import {
  BellIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  PlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

function NotificationCenter() {
  const [notifications] = useState([
    {
      id: 1,
      type: "overdue",
      title: "Overdue Books Alert",
      message: "5 books are overdue and need immediate attention",
      student: {
        name: "Arjun Krishnamurthy",
        registerNumber: "20IT001",
        email: "arjun.k@college.edu.in",
        phone: "9876543210",
      },
      books: [
        { title: "Advanced React Programming", daysOverdue: 5 },
        { title: "Database Systems", daysOverdue: 3 },
      ],
      timestamp: "2024-12-25T10:30:00",
      status: "sent",
      method: ["email", "sms"],
      priority: "high",
    },
    {
      id: 2,
      type: "due_soon",
      title: "Books Due Tomorrow",
      message: "3 books are due for return tomorrow",
      student: {
        name: "Priya Lakshmi",
        registerNumber: "21CS022",
        email: "priya.l@college.edu.in",
        phone: "9876543211",
      },
      books: [
        { title: "Machine Learning Fundamentals", daysUntilDue: 1 },
        { title: "Cloud Computing", daysUntilDue: 1 },
        { title: "Data Structures", daysUntilDue: 1 },
      ],
      timestamp: "2024-12-25T08:15:00",
      status: "pending",
      method: ["email"],
      priority: "medium",
    },
    {
      id: 3,
      type: "reservation_ready",
      title: "Reserved Book Available",
      message: "Your reserved book is now ready for pickup",
      student: {
        name: "Rajesh Kumar",
        registerNumber: "22EC025",
        email: "rajesh.k@college.edu.in",
        phone: "9876543212",
      },
      books: [{ title: "Digital Signal Processing", status: "available" }],
      timestamp: "2024-12-25T14:45:00",
      status: "sent",
      method: ["email", "sms"],
      priority: "medium",
    },
    {
      id: 4,
      type: "fine_due",
      title: "Fine Payment Reminder",
      message: "Outstanding fine of ₹150 needs to be paid",
      student: {
        name: "Meera Nair",
        registerNumber: "20ME018",
        email: "meera.n@college.edu.in",
        phone: "9876543213",
      },
      fineAmount: 150,
      timestamp: "2024-12-25T16:20:00",
      status: "failed",
      method: ["email"],
      priority: "high",
    },
  ]);

  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [newNotification, setNewNotification] = useState({
    type: "overdue",
    title: "",
    message: "",
    studentId: "",
    method: ["email"],
    priority: "medium",
  });

  const notificationTypes = [
    { value: "all", label: "All Notifications", count: notifications.length },
    {
      value: "overdue",
      label: "Overdue",
      count: notifications.filter((n) => n.type === "overdue").length,
    },
    {
      value: "due_soon",
      label: "Due Soon",
      count: notifications.filter((n) => n.type === "due_soon").length,
    },
    {
      value: "reservation_ready",
      label: "Reservations",
      count: notifications.filter((n) => n.type === "reservation_ready").length,
    },
    {
      value: "fine_due",
      label: "Fines",
      count: notifications.filter((n) => n.type === "fine_due").length,
    },
  ];

  const filteredNotifications = notifications.filter((notification) => {
    const matchesType =
      selectedType === "all" || notification.type === selectedType;
    const matchesStatus =
      selectedStatus === "all" || notification.status === selectedStatus;
    const matchesSearch =
      searchTerm === "" ||
      notification.student.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      notification.student.registerNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      notification.title.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesType && matchesStatus && matchesSearch;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case "overdue":
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      case "due_soon":
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case "reservation_ready":
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case "fine_due":
        return <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />;
      default:
        return <BellIcon className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-yellow-500";
      case "low":
        return "border-l-green-500";
      default:
        return "border-l-gray-300";
    }
  };

  const handleResendNotification = (notificationId) => {
    console.log("Resending notification:", notificationId);
    // Here you would implement the actual resend logic
  };

  const handleComposeNotification = (e) => {
    e.preventDefault();
    console.log("Sending new notification:", newNotification);
    // Here you would implement the send logic
    setShowComposeModal(false);
    setNewNotification({
      type: "overdue",
      title: "",
      message: "",
      studentId: "",
      method: ["email"],
      priority: "medium",
    });
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffMinutes < 1440) {
      return `${Math.floor(diffMinutes / 60)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const stats = {
    total: notifications.length,
    sent: notifications.filter((n) => n.status === "sent").length,
    pending: notifications.filter((n) => n.status === "pending").length,
    failed: notifications.filter((n) => n.status === "failed").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">🔔 Notification Center</h1>
        <p className="page-subtitle">
          Manage automated notifications for overdue books, reservations, and
          fines
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="stats-card text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Sent</div>
        </div>
        <div className="stats-card text-center">
          <div className="text-2xl font-bold text-green-600">{stats.sent}</div>
          <div className="text-sm text-gray-600">Delivered</div>
        </div>
        <div className="stats-card text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {stats.pending}
          </div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="stats-card text-center">
          <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
          <div className="text-sm text-gray-600">Failed</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Notification Types */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Filter by Type</h3>
            </div>
            <div className="p-4 space-y-2">
              {notificationTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                    selectedType === type.value
                      ? "bg-primary-100 text-primary-700"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <span>{type.label}</span>
                  <span className="text-sm bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                    {type.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Status Filter</h3>
            </div>
            <div className="p-4 space-y-2">
              {["all", "sent", "pending", "failed"].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedStatus === status
                      ? "bg-primary-100 text-primary-700"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search notifications..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Compose Button */}
            <button
              onClick={() => setShowComposeModal(true)}
              className="btn-primary inline-flex items-center"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Compose
            </button>
          </div>

          {/* Notifications List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Notification History ({filteredNotifications.length})
              </h3>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 border-l-4 ${getPriorityColor(
                    notification.priority
                  )} hover:bg-gray-50 transition-colors`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getTypeIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-gray-900">
                            {notification.title}
                          </h4>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                              notification.status
                            )}`}
                          >
                            {notification.status}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                          {notification.message}
                        </p>

                        {/* Student Info */}
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="font-medium text-gray-900">
                                {notification.student.name}
                              </span>
                              <span className="text-gray-500 text-sm ml-2">
                                ({notification.student.registerNumber})
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <EnvelopeIcon className="w-4 h-4 mr-1" />
                                {notification.student.email}
                              </div>
                              <div className="flex items-center">
                                <DevicePhoneMobileIcon className="w-4 h-4 mr-1" />
                                {notification.student.phone}
                              </div>
                            </div>
                          </div>

                          {/* Books Info */}
                          {notification.books && (
                            <div className="space-y-1">
                              {notification.books.map((book, index) => (
                                <div
                                  key={index}
                                  className="text-sm text-gray-600 flex items-center justify-between"
                                >
                                  <span>📚 {book.title}</span>
                                  {book.daysOverdue && (
                                    <span className="text-red-600 font-medium">
                                      {book.daysOverdue} days overdue
                                    </span>
                                  )}
                                  {book.daysUntilDue && (
                                    <span className="text-yellow-600 font-medium">
                                      Due in {book.daysUntilDue} day
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Fine Amount */}
                          {notification.fineAmount && (
                            <div className="text-sm text-orange-600 font-medium">
                              Fine Amount: ₹{notification.fineAmount}
                            </div>
                          )}
                        </div>

                        {/* Notification Methods */}
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <span>Sent via:</span>
                            {notification.method.includes("email") && (
                              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                Email
                              </span>
                            )}
                            {notification.method.includes("sms") && (
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                                SMS
                              </span>
                            )}
                          </div>
                          <span>{formatTimestamp(notification.timestamp)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      {notification.status === "failed" && (
                        <button
                          onClick={() =>
                            handleResendNotification(notification.id)
                          }
                          className="text-blue-600 hover:text-blue-800 text-sm bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md"
                        >
                          Retry
                        </button>
                      )}
                      <button className="text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredNotifications.length === 0 && (
              <div className="text-center py-12">
                <BellIcon className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No notifications found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm
                    ? "Try adjusting your search terms or filters."
                    : "Notifications will appear here when sent."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compose Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Compose Notification</h3>
              <button
                onClick={() => setShowComposeModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form
              onSubmit={handleComposeNotification}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notification Type *
                </label>
                <select
                  value={newNotification.type}
                  onChange={(e) =>
                    setNewNotification({
                      ...newNotification,
                      type: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="overdue">Overdue Books</option>
                  <option value="due_soon">Books Due Soon</option>
                  <option value="reservation_ready">Reservation Ready</option>
                  <option value="fine_due">Fine Due</option>
                  <option value="general">General Notice</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student Register Number *
                </label>
                <input
                  type="text"
                  value={newNotification.studentId}
                  onChange={(e) =>
                    setNewNotification({
                      ...newNotification,
                      studentId: e.target.value,
                    })
                  }
                  placeholder="20IT001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={newNotification.title}
                  onChange={(e) =>
                    setNewNotification({
                      ...newNotification,
                      title: e.target.value,
                    })
                  }
                  placeholder="Enter notification title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  value={newNotification.message}
                  onChange={(e) =>
                    setNewNotification({
                      ...newNotification,
                      message: e.target.value,
                    })
                  }
                  rows={4}
                  placeholder="Enter notification message"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Method
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newNotification.method.includes("email")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewNotification({
                            ...newNotification,
                            method: [...newNotification.method, "email"],
                          });
                        } else {
                          setNewNotification({
                            ...newNotification,
                            method: newNotification.method.filter(
                              (m) => m !== "email"
                            ),
                          });
                        }
                      }}
                      className="mr-2"
                    />
                    Email Notification
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newNotification.method.includes("sms")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewNotification({
                            ...newNotification,
                            method: [...newNotification.method, "sms"],
                          });
                        } else {
                          setNewNotification({
                            ...newNotification,
                            method: newNotification.method.filter(
                              (m) => m !== "sms"
                            ),
                          });
                        }
                      }}
                      className="mr-2"
                    />
                    SMS Notification
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority Level
                </label>
                <select
                  value={newNotification.priority}
                  onChange={(e) =>
                    setNewNotification({
                      ...newNotification,
                      priority: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowComposeModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Send Notification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationCenter;
