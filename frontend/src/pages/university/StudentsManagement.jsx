import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  UserGroupIcon,
  AcademicCapIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

function StudentsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const queryClient = useQueryClient();

  // Mock data - Replace with actual API calls
  const {
    data: studentsData,
    isLoading,
    error,
  } = useQuery(
    [
      "students",
      {
        search: searchTerm,
        department: selectedDepartment,
        year: selectedYear,
        status: selectedStatus,
      },
    ],
    () =>
      fetchStudents({
        search: searchTerm,
        department: selectedDepartment,
        year: selectedYear,
        status: selectedStatus,
      }),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const students = studentsData?.data || mockStudentsData;

  // Filter students based on search and filters
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      !selectedDepartment || student.department === selectedDepartment;
    const matchesYear = !selectedYear || student.academic_year === selectedYear;
    const matchesStatus = !selectedStatus || student.status === selectedStatus;

    return matchesSearch && matchesDepartment && matchesYear && matchesStatus;
  });

  // Statistics
  const stats = {
    totalStudents: students.length,
    activeStudents: students.filter((s) => s.status === "active").length,
    totalBorrowed: students.reduce((sum, s) => sum + s.currently_borrowed, 0),
    totalFines: students.reduce((sum, s) => sum + s.outstanding_fines, 0),
    departments: [...new Set(students.map((s) => s.department))].length,
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedStudents(filteredStudents.map((s) => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (studentId, checked) => {
    if (checked) {
      setSelectedStudents((prev) => [...prev, studentId]);
    } else {
      setSelectedStudents((prev) => prev.filter((id) => id !== studentId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title flex items-center">
              <AcademicCapIcon className="h-8 w-8 mr-3 text-primary-600" />
              Students Management
            </h1>
            <p className="page-subtitle">
              Manage {stats.totalStudents.toLocaleString()} students across{" "}
              {stats.departments} departments
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Student
            </button>
            <button className="btn-secondary flex items-center">
              <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
              Import
            </button>
            <button className="btn-secondary flex items-center">
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Total Students</h3>
            <UserGroupIcon className="stat-card-icon text-blue-600" />
          </div>
          <p className="stat-card-value">
            {stats.totalStudents.toLocaleString()}
          </p>
          <p className="stat-card-description">Registered students</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Active Students</h3>
            <CheckCircleIcon className="stat-card-icon text-green-600" />
          </div>
          <p className="stat-card-value">
            {stats.activeStudents.toLocaleString()}
          </p>
          <p className="stat-card-description">Currently enrolled</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Books Borrowed</h3>
            <BookOpenIcon className="stat-card-icon text-purple-600" />
          </div>
          <p className="stat-card-value">
            {stats.totalBorrowed.toLocaleString()}
          </p>
          <p className="stat-card-description">Currently issued</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Outstanding Fines</h3>
            <CurrencyRupeeIcon className="stat-card-icon text-red-600" />
          </div>
          <p className="stat-card-value">
            ₹{stats.totalFines.toLocaleString()}
          </p>
          <p className="stat-card-description">Pending payments</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Departments</h3>
            <BuildingOfficeIcon className="stat-card-icon text-indigo-600" />
          </div>
          <p className="stat-card-value">{stats.departments}</p>
          <p className="stat-card-description">Active departments</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search students by name, ID, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10 w-full"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary flex items-center"
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filters
                {(selectedDepartment || selectedYear || selectedStatus) && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {
                      [selectedDepartment, selectedYear, selectedStatus].filter(
                        Boolean
                      ).length
                    }
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="border-t pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="form-label">Department</label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="form-select"
                  >
                    <option value="">All Departments</option>
                    <option value="Computer Science & Engineering">CSE</option>
                    <option value="Electronics & Communication">ECE</option>
                    <option value="Mechanical Engineering">MECH</option>
                    <option value="Information Technology">IT</option>
                    <option value="Civil Engineering">CIVIL</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Academic Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="form-select"
                  >
                    <option value="">All Years</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="form-select"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                    <option value="graduated">Graduated</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSelectedDepartment("");
                      setSelectedYear("");
                      setSelectedStatus("");
                    }}
                    className="btn-secondary w-full"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedStudents.length > 0 && (
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm font-medium text-blue-900">
                {selectedStudents.length} student(s) selected
              </span>
            </div>
            <div className="flex space-x-2">
              <button className="btn-sm btn-primary">Send Notification</button>
              <button className="btn-sm btn-secondary">Export Selected</button>
              <button className="btn-sm btn-danger">Suspend Selected</button>
              <button
                onClick={() => setSelectedStudents([])}
                className="btn-sm btn-secondary"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Students Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header w-12">
                  <input
                    type="checkbox"
                    checked={
                      selectedStudents.length === filteredStudents.length &&
                      filteredStudents.length > 0
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="form-checkbox"
                  />
                </th>
                <th className="table-header">Student Details</th>
                <th className="table-header">Department & Year</th>
                <th className="table-header">Library Status</th>
                <th className="table-header">Contact</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="table-cell">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={(e) =>
                        handleSelectStudent(student.id, e.target.checked)
                      }
                      className="form-checkbox"
                    />
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={
                            student.profile_image ||
                            `https://ui-avatars.com/api/?name=${student.name}&background=22c55e&color=fff`
                          }
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {student.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.user_id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {student.department}
                      </div>
                      <div className="text-sm text-gray-500">
                        {student.academic_year} • {student.semester}
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div>
                      <div className="flex items-center text-sm">
                        <BookOpenIcon className="h-4 w-4 mr-1 text-blue-500" />
                        <span>{student.currently_borrowed} books</span>
                      </div>
                      {student.outstanding_fines > 0 && (
                        <div className="flex items-center text-sm text-red-600 mt-1">
                          <CurrencyRupeeIcon className="h-4 w-4 mr-1" />
                          <span>₹{student.outstanding_fines} fine</span>
                        </div>
                      )}
                      {student.overdue_books > 0 && (
                        <div className="flex items-center text-sm text-orange-600 mt-1">
                          <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                          <span>{student.overdue_books} overdue</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div>
                      <div className="text-sm text-gray-900">
                        {student.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {student.phone}
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        student.status === "active"
                          ? "bg-green-100 text-green-800"
                          : student.status === "suspended"
                          ? "bg-red-100 text-red-800"
                          : student.status === "graduated"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-900"
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="btn-secondary">Previous</button>
            <button className="btn-secondary">Next</button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">10</span> of{" "}
                <span className="font-medium">{filteredStudents.length}</span>{" "}
                results
              </p>
            </div>
            <div className="flex space-x-2">
              <button className="btn-secondary btn-sm">Previous</button>
              <button className="btn-primary btn-sm">1</button>
              <button className="btn-secondary btn-sm">2</button>
              <button className="btn-secondary btn-sm">3</button>
              <button className="btn-secondary btn-sm">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mock data for demonstration
const mockStudentsData = [
  {
    id: 1,
    user_id: "20CS001",
    name: "Arjun Kumar",
    email: "arjun.kumar@university.edu.in",
    phone: "+91 9876543210",
    department: "Computer Science & Engineering",
    academic_year: "3rd Year",
    semester: "6th Semester",
    status: "active",
    currently_borrowed: 3,
    outstanding_fines: 45.0,
    overdue_books: 1,
    profile_image: null,
  },
  {
    id: 2,
    user_id: "20ECE015",
    name: "Priya Sharma",
    email: "priya.sharma@university.edu.in",
    phone: "+91 9876543211",
    department: "Electronics & Communication",
    academic_year: "2nd Year",
    semester: "4th Semester",
    status: "active",
    currently_borrowed: 2,
    outstanding_fines: 0.0,
    overdue_books: 0,
    profile_image: null,
  },
  // Add more mock data...
];

// Mock API function
async function fetchStudents(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: "success",
        data: mockStudentsData,
        total: mockStudentsData.length,
      });
    }, 1000);
  });
}

export default StudentsManagement;
