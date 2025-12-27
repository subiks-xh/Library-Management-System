import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { libraryAPI } from "../services/api";
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  PhotoIcon,
  EyeIcon,
  BookOpenIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon,
  MapPinIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

function Students() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    register_number: "",
    name: "",
    email: "",
    phone: "",
    department: "",
    year: 1,
    address: "",
    photo_url: "",
    guardian_name: "",
    guardian_phone: "",
  });

  const queryClient = useQueryClient();

  // Mutations for CRUD operations
  const addStudentMutation = useMutation({
    mutationFn: (newStudent) => libraryAPI.createStudent(newStudent),
    onSuccess: () => {
      queryClient.invalidateQueries(["students"]);
      setShowAddModal(false);
      resetForm();
    },
  });

  const editStudentMutation = useMutation({
    mutationFn: ({ id, ...data }) => libraryAPI.updateStudent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["students"]);
      setShowEditModal(false);
      resetForm();
    },
  });

  const deleteStudentMutation = useMutation({
    mutationFn: (studentId) => libraryAPI.deleteStudent(studentId),
    onSuccess: () => {
      queryClient.invalidateQueries(["students"]);
    },
  });

  // Mock data with comprehensive student information
  const students = [
    {
      id: 1,
      registerNumber: "20IT001",
      name: "Arjun Krishnamurthy",
      department: "Information Technology",
      year: 4,
      email: "arjun.k@college.edu.in",
      phone: "9876543210",
      address: "123 Anna Nagar, Chennai - 600040",
      guardian_name: "Krishnamurthy Iyer",
      guardian_phone: "9876543200",
      photo_url:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      booksIssued: 2,
      overdueBooks: 0,
      pendingFines: 0,
      status: "Active",
      joinDate: "2020-08-15",
      totalBooksIssued: 45,
    },
    {
      id: 2,
      registerNumber: "21CS022",
      name: "Priya Lakshmi",
      department: "Computer Science",
      year: 3,
      email: "priya.l@college.edu.in",
      phone: "9876543211",
      address: "456 T. Nagar, Chennai - 600017",
      guardian_name: "Lakshmi Narayan",
      guardian_phone: "9876543201",
      photo_url:
        "https://images.unsplash.com/photo-1494790108755-2616b612b829?w=150&h=150&fit=crop&crop=face",
      booksIssued: 1,
      overdueBooks: 1,
      pendingFines: 15.0,
      status: "Active",
      joinDate: "2021-08-20",
      totalBooksIssued: 28,
    },
    {
      id: 3,
      registerNumber: "22EC025",
      name: "Rajesh Kumar",
      department: "Electronics",
      year: 2,
      email: "rajesh.k@college.edu.in",
      phone: "9876543212",
      address: "789 Velachery, Chennai - 600042",
      guardian_name: "Kumar Swamy",
      guardian_phone: "9876543202",
      photo_url:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      booksIssued: 3,
      overdueBooks: 0,
      pendingFines: 0,
      status: "Active",
      joinDate: "2022-08-18",
      totalBooksIssued: 15,
    },
    {
      id: 4,
      registerNumber: "23ME015",
      name: "Kavitha Devi",
      department: "Mechanical Engineering",
      year: 1,
      email: "kavitha.d@college.edu.in",
      phone: "9876543213",
      address: "321 Tambaram, Chennai - 600045",
      guardian_name: "Devi Kumar",
      guardian_phone: "9876543203",
      photo_url:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      booksIssued: 1,
      overdueBooks: 0,
      pendingFines: 0,
      status: "Active",
      joinDate: "2023-08-22",
      totalBooksIssued: 8,
    },
  ];

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.registerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Event handlers
  const handleAddStudent = (e) => {
    e.preventDefault();
    addStudentMutation.mutate(formData);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setFormData({
      register_number: student.registerNumber,
      name: student.name,
      email: student.email,
      phone: student.phone,
      department: student.department,
      year: student.year,
      address: student.address || "",
      photo_url: student.photo_url || "",
      guardian_name: student.guardian_name || "",
      guardian_phone: student.guardian_phone || "",
    });
    setShowEditModal(true);
  };

  const handleUpdateStudent = (e) => {
    e.preventDefault();
    editStudentMutation.mutate({
      id: selectedStudent.id,
      ...formData,
    });
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  const handleDeleteStudent = (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      deleteStudentMutation.mutate(studentId);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      register_number: "",
      name: "",
      email: "",
      phone: "",
      department: "",
      year: 1,
      address: "",
      photo_url: "",
      guardian_name: "",
      guardian_phone: "",
    });
    setSelectedStudent(null);
  };

  const departments = [
    "Computer Science",
    "Information Technology",
    "Electronics",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical Engineering",
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">👥 Students Management</h1>
        <p className="page-subtitle">
          Manage student records and library access
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Search */}
        <div className="search-bar">
          <div className="relative">
            <MagnifyingGlassIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, register number, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Add Student Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary inline-flex items-center"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add New Student
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="stats-card text-center">
          <div className="text-2xl font-bold text-primary-600">
            {students.length}
          </div>
          <div className="text-sm text-gray-600">Total Students</div>
        </div>
        <div className="stats-card text-center">
          <div className="text-2xl font-bold text-green-600">
            {students.filter((s) => s.status === "Active").length}
          </div>
          <div className="text-sm text-gray-600">Active Students</div>
        </div>
        <div className="stats-card text-center">
          <div className="text-2xl font-bold text-orange-600">
            {students.reduce((sum, s) => sum + s.booksIssued, 0)}
          </div>
          <div className="text-sm text-gray-600">Books Issued</div>
        </div>
        <div className="stats-card text-center">
          <div className="text-2xl font-bold text-red-600">
            {students.reduce((sum, s) => sum + s.overdueBooks, 0)}
          </div>
          <div className="text-sm text-gray-600">Overdue Books</div>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <img
                  src={student.photo_url}
                  alt={student.name}
                  className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-gray-200"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";
                  }}
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {student.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {student.registerNumber}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleViewStudent(student)}
                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1 rounded"
                  title="View Details"
                >
                  <EyeIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEditStudent(student)}
                  className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 p-1 rounded"
                  title="Edit Student"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteStudent(student.id)}
                  className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded"
                  title="Delete Student"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <AcademicCapIcon className="w-4 h-4 mr-2 text-gray-400" />
                {student.department}
              </div>
              <div className="flex items-center">
                <UserGroupIcon className="w-4 h-4 mr-2 text-gray-400" />
                Year {student.year}
              </div>
              <div className="flex items-center">
                <EnvelopeIcon className="w-4 h-4 mr-2 text-gray-400" />
                {student.email}
              </div>
              <div className="flex items-center">
                <PhoneIcon className="w-4 h-4 mr-2 text-gray-400" />
                {student.phone}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm">
                <div className="text-center">
                  <span className="block text-lg font-semibold text-green-600">
                    {student.booksIssued}
                  </span>
                  <span className="text-gray-500">Books Issued</span>
                </div>
                <div className="text-center">
                  <span className="block text-lg font-semibold text-red-600">
                    {student.overdueBooks}
                  </span>
                  <span className="text-gray-500">Overdue</span>
                </div>
                <div className="text-center">
                  <span className="block text-lg font-semibold text-orange-600">
                    ₹{student.pendingFines}
                  </span>
                  <span className="text-gray-500">Pending</span>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  student.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {student.status}
              </span>
              {student.overdueBooks > 0 && (
                <ExclamationTriangleIcon
                  className="w-4 h-4 text-red-500"
                  title="Has overdue books"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <UserGroupIcon className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No students found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? "Try adjusting your search terms."
              : "Get started by adding a new student."}
          </p>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Add New Student</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Register Number *
                </label>
                <input
                  type="text"
                  name="register_number"
                  required
                  value={formData.register_number}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="20IT001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Student Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="student@college.edu.in"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="9876543210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department *
                </label>
                <select
                  name="department"
                  required
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year *
                </label>
                <select
                  name="year"
                  required
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value={1}>1st Year</option>
                  <option value={2}>2nd Year</option>
                  <option value={3}>3rd Year</option>
                  <option value={4}>4th Year</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Student address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photo URL
                </label>
                <input
                  type="url"
                  name="photo_url"
                  value={formData.photo_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guardian Name
                </label>
                <input
                  type="text"
                  name="guardian_name"
                  value={formData.guardian_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Guardian name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guardian Phone
                </label>
                <input
                  type="tel"
                  name="guardian_phone"
                  value={formData.guardian_phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="9876543210"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
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
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Edit Student</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateStudent} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Register Number *
                </label>
                <input
                  type="text"
                  name="register_number"
                  required
                  value={formData.register_number}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department *
                </label>
                <select
                  name="department"
                  required
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year *
                </label>
                <select
                  name="year"
                  required
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value={1}>1st Year</option>
                  <option value={2}>2nd Year</option>
                  <option value={3}>3rd Year</option>
                  <option value={4}>4th Year</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photo URL
                </label>
                <input
                  type="url"
                  name="photo_url"
                  value={formData.photo_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guardian Name
                </label>
                <input
                  type="text"
                  name="guardian_name"
                  value={formData.guardian_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guardian Phone
                </label>
                <input
                  type="tel"
                  name="guardian_phone"
                  value={formData.guardian_phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
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
                  Update Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Student Modal */}
      {showViewModal && selectedStudent && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Student Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center mb-6">
                <img
                  src={selectedStudent.photo_url}
                  alt={selectedStudent.name}
                  className="w-20 h-20 rounded-full object-cover mr-4 border-4 border-gray-200"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";
                  }}
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedStudent.name}
                  </h3>
                  <p className="text-gray-600">
                    {selectedStudent.registerNumber}
                  </p>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                      selectedStudent.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedStudent.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {selectedStudent.booksIssued}
                  </div>
                  <div className="text-sm text-green-700">Currently Issued</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedStudent.totalBooksIssued}
                  </div>
                  <div className="text-sm text-blue-700">Total Books</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {selectedStudent.overdueBooks}
                  </div>
                  <div className="text-sm text-red-700">Overdue Books</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    ₹{selectedStudent.pendingFines}
                  </div>
                  <div className="text-sm text-orange-700">Pending Fines</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <AcademicCapIcon className="w-5 h-5 mr-3 text-gray-400" />
                  <div>
                    <div className="font-medium">Department</div>
                    <div className="text-gray-600">
                      {selectedStudent.department}
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <UserGroupIcon className="w-5 h-5 mr-3 text-gray-400" />
                  <div>
                    <div className="font-medium">Academic Year</div>
                    <div className="text-gray-600">
                      Year {selectedStudent.year}
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <EnvelopeIcon className="w-5 h-5 mr-3 text-gray-400" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-gray-600">{selectedStudent.email}</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <PhoneIcon className="w-5 h-5 mr-3 text-gray-400" />
                  <div>
                    <div className="font-medium">Phone</div>
                    <div className="text-gray-600">{selectedStudent.phone}</div>
                  </div>
                </div>

                {selectedStudent.address && (
                  <div className="flex items-start">
                    <MapPinIcon className="w-5 h-5 mr-3 text-gray-400 mt-0.5" />
                    <div>
                      <div className="font-medium">Address</div>
                      <div className="text-gray-600">
                        {selectedStudent.address}
                      </div>
                    </div>
                  </div>
                )}

                {selectedStudent.guardian_name && (
                  <div className="flex items-center">
                    <UserGroupIcon className="w-5 h-5 mr-3 text-gray-400" />
                    <div>
                      <div className="font-medium">Guardian</div>
                      <div className="text-gray-600">
                        {selectedStudent.guardian_name}
                      </div>
                      {selectedStudent.guardian_phone && (
                        <div className="text-sm text-gray-500">
                          {selectedStudent.guardian_phone}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-3 text-gray-400" />
                  <div>
                    <div className="font-medium">Join Date</div>
                    <div className="text-gray-600">
                      {new Date(selectedStudent.joinDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEditStudent(selectedStudent);
                  }}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Edit Student
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Students;
