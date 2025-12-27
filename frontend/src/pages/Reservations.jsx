import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { libraryAPI } from "../services/api";
import {
  ClockIcon,
  BookmarkIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  CheckCircleIcon,
  XMarkIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
  BellIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";

function Reservations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [reservationData, setReservationData] = useState({
    studentId: "",
    bookId: "",
    reservationDate: new Date().toISOString().split("T")[0],
    expectedReturnDate: "",
    priority: "normal",
    notes: "",
  });

  const queryClient = useQueryClient();

  // Mutation for creating reservations
  const createReservationMutation = useMutation({
    mutationFn: (data) => libraryAPI.createReservation(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["reservations"]);
      setShowReserveModal(false);
      resetForm();
    },
  });

  const cancelReservationMutation = useMutation({
    mutationFn: (reservationId) => libraryAPI.cancelReservation(reservationId),
    onSuccess: () => {
      queryClient.invalidateQueries(["reservations"]);
    },
  });

  // Mock data for reservations with comprehensive information
  const reservations = [
    {
      id: 1,
      student: {
        name: "Arjun Krishnamurthy",
        registerNumber: "20IT001",
        department: "Information Technology",
        photo_url:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        email: "arjun.k@college.edu.in",
        phone: "9876543210",
      },
      book: {
        title: "Advanced React Programming",
        author: "John Smith",
        isbn: "978-1234567890",
        cover_image:
          "https://images.unsplash.com/photo-1562813733-b31f71025d54?w=200&h=300&fit=crop",
        category: "Programming",
      },
      reservationDate: "2024-12-20",
      expectedAvailableDate: "2024-12-28",
      dueDate: "2025-01-04",
      status: "active",
      priority: "high",
      position: 1,
      totalQueue: 3,
      notificationSent: true,
      queueEstimate: "2-3 days",
    },
    {
      id: 2,
      student: {
        name: "Priya Lakshmi",
        registerNumber: "21CS022",
        department: "Computer Science",
        photo_url:
          "https://images.unsplash.com/photo-1494790108755-2616b612b829?w=150&h=150&fit=crop&crop=face",
        email: "priya.l@college.edu.in",
        phone: "9876543211",
      },
      book: {
        title: "Database Management Systems",
        author: "Raghu Ramakrishnan",
        isbn: "978-0987654321",
        cover_image:
          "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=300&fit=crop",
        category: "Database",
      },
      reservationDate: "2024-12-22",
      expectedAvailableDate: "2024-12-30",
      dueDate: "2025-01-06",
      status: "ready",
      priority: "normal",
      position: 1,
      totalQueue: 1,
      notificationSent: true,
      queueEstimate: "Available now",
    },
    {
      id: 3,
      student: {
        name: "Rajesh Kumar",
        registerNumber: "22EC025",
        department: "Electronics",
        photo_url:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        email: "rajesh.k@college.edu.in",
        phone: "9876543212",
      },
      book: {
        title: "Digital Signal Processing",
        author: "Alan V. Oppenheim",
        isbn: "978-1122334455",
        cover_image:
          "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop",
        category: "Electronics",
      },
      reservationDate: "2024-12-25",
      expectedAvailableDate: "2025-01-02",
      dueDate: "2025-01-09",
      status: "waiting",
      priority: "normal",
      position: 2,
      totalQueue: 4,
      notificationSent: false,
      queueEstimate: "5-7 days",
    },
  ];

  // Available books for reservation
  const availableBooks = [
    {
      id: 1,
      title: "Machine Learning Fundamentals",
      author: "Sebastian Raschka",
      isbn: "978-1617295263",
      category: "AI/ML",
      copies: 3,
      availableCopies: 0,
      reservedCopies: 2,
      cover_image:
        "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=200&h=300&fit=crop",
    },
    {
      id: 2,
      title: "Cloud Computing Architecture",
      author: "Michael J. Kavis",
      isbn: "978-1449357615",
      category: "Cloud Computing",
      copies: 2,
      availableCopies: 0,
      reservedCopies: 3,
      cover_image:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&h=300&fit=crop",
    },
  ];

  const filteredReservations = reservations.filter(
    (reservation) =>
      reservation.student.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      reservation.student.registerNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      reservation.book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReserveBook = (book) => {
    setSelectedBook(book);
    setShowReserveModal(true);
  };

  const handleCreateReservation = (e) => {
    e.preventDefault();
    createReservationMutation.mutate(reservationData);
  };

  const handleCancelReservation = (reservationId) => {
    if (window.confirm("Are you sure you want to cancel this reservation?")) {
      cancelReservationMutation.mutate(reservationId);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReservationData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setReservationData({
      studentId: "",
      bookId: "",
      reservationDate: new Date().toISOString().split("T")[0],
      expectedReturnDate: "",
      priority: "normal",
      notes: "",
    });
    setSelectedBook(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ready":
        return "bg-green-100 text-green-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      case "waiting":
        return "bg-yellow-100 text-yellow-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50";
      case "normal":
        return "text-blue-600 bg-blue-50";
      case "low":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const stats = {
    totalReservations: reservations.length,
    activeReservations: reservations.filter((r) => r.status === "active")
      .length,
    readyForPickup: reservations.filter((r) => r.status === "ready").length,
    waitingInQueue: reservations.filter((r) => r.status === "waiting").length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">📋 Book Reservations</h1>
        <p className="page-subtitle">
          Manage book reservations and waiting queues efficiently
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reservations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* New Reservation Button */}
        <button
          onClick={() => setShowReserveModal(true)}
          className="btn-primary inline-flex items-center"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          New Reservation
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="stats-card text-center">
          <div className="text-2xl font-bold text-blue-600">
            {stats.totalReservations}
          </div>
          <div className="text-sm text-gray-600">Total Reservations</div>
        </div>
        <div className="stats-card text-center">
          <div className="text-2xl font-bold text-orange-600">
            {stats.activeReservations}
          </div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="stats-card text-center">
          <div className="text-2xl font-bold text-green-600">
            {stats.readyForPickup}
          </div>
          <div className="text-sm text-gray-600">Ready for Pickup</div>
        </div>
        <div className="stats-card text-center">
          <div className="text-2xl font-bold text-purple-600">
            {stats.waitingInQueue}
          </div>
          <div className="text-sm text-gray-600">In Queue</div>
        </div>
      </div>

      {/* Reservations List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <BookmarkIcon className="w-5 h-5 mr-2 text-primary-600" />
            Active Reservations
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Queue Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={reservation.student.photo_url}
                        alt={reservation.student.name}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {reservation.student.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {reservation.student.registerNumber}
                        </div>
                        <div className="text-xs text-gray-400">
                          {reservation.student.department}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={reservation.book.cover_image}
                        alt={reservation.book.title}
                        className="w-8 h-10 object-cover rounded mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {reservation.book.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          by {reservation.book.author}
                        </div>
                        <div className="text-xs text-gray-400">
                          {reservation.book.isbn}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Position:{" "}
                      <span className="font-semibold">
                        {reservation.position}
                      </span>{" "}
                      of {reservation.totalQueue}
                    </div>
                    <div className="text-xs text-gray-500">
                      {reservation.queueEstimate}
                    </div>
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getPriorityColor(
                        reservation.priority
                      )}`}
                    >
                      {reservation.priority} priority
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      Reserved:{" "}
                      {new Date(
                        reservation.reservationDate
                      ).toLocaleDateString()}
                    </div>
                    <div>
                      Expected:{" "}
                      {new Date(
                        reservation.expectedAvailableDate
                      ).toLocaleDateString()}
                    </div>
                    <div>
                      Due: {new Date(reservation.dueDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        reservation.status
                      )}`}
                    >
                      {reservation.status}
                    </span>
                    {reservation.notificationSent && (
                      <div className="flex items-center mt-1">
                        <BellIcon className="w-3 h-3 text-green-500 mr-1" />
                        <span className="text-xs text-green-600">Notified</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {reservation.status === "ready" ? (
                      <button className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md">
                        Issue Book
                      </button>
                    ) : (
                      <button
                        onClick={() => handleCancelReservation(reservation.id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredReservations.length === 0 && (
            <div className="text-center py-8">
              <BookmarkIcon className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No reservations found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm
                  ? "Try adjusting your search terms."
                  : "Create a new reservation to get started."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Popular Books for Reservation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <ClockIcon className="w-5 h-5 mr-2 text-orange-600" />
            Books Available for Reservation
          </h3>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableBooks.map((book) => (
              <div
                key={book.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start">
                  <img
                    src={book.cover_image}
                    alt={book.title}
                    className="w-16 h-20 object-cover rounded mr-4"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {book.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-2">
                      by {book.author}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {book.category}
                      </span>
                      <span className="text-sm text-red-600 font-medium">
                        {book.reservedCopies} in queue
                      </span>
                    </div>
                    <button
                      onClick={() => handleReserveBook(book)}
                      className="w-full text-sm bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-700 transition-colors"
                    >
                      Reserve Book
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reserve Book Modal */}
      {showReserveModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Create Reservation</h3>
              <button
                onClick={() => {
                  setShowReserveModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateReservation} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student Register Number *
                </label>
                <input
                  type="text"
                  name="studentId"
                  required
                  value={reservationData.studentId}
                  onChange={handleInputChange}
                  placeholder="20IT001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {selectedBook && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <img
                      src={selectedBook.cover_image}
                      alt={selectedBook.title}
                      className="w-12 h-16 object-cover rounded mr-3"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {selectedBook.title}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        by {selectedBook.author}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedBook.isbn}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority Level
                </label>
                <select
                  name="priority"
                  value={reservationData.priority}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="low">Low Priority</option>
                  <option value="normal">Normal Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={reservationData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Any special requirements or notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowReserveModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Create Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reservations;
