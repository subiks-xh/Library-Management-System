import { useState } from "react";
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

function Students() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - Replace with actual API call
  const students = [
    {
      id: 1,
      registerNumber: "20IT001",
      name: "Arjun Krishnamurthy",
      department: "Information Technology",
      year: 4,
      email: "arjun.k@college.edu.in",
      phone: "9876543210",
      booksIssued: 2,
      overdueBooks: 0,
      pendingFines: 0,
      status: "Active",
    },
    {
      id: 2,
      registerNumber: "21CS022",
      name: "Priya Lakshmi",
      department: "Computer Science",
      year: 3,
      email: "priya.l@college.edu.in",
      phone: "9876543211",
      booksIssued: 1,
      overdueBooks: 1,
      pendingFines: 15.0,
      status: "Active",
    },
    {
      id: 3,
      registerNumber: "22EC025",
      name: "Rajesh Kumar",
      department: "Electronics",
      year: 2,
      email: "rajesh.k@college.edu.in",
      phone: "9876543212",
      booksIssued: 3,
      overdueBooks: 0,
      pendingFines: 0,
      status: "Active",
    },
  ];

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.registerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <button className="btn-primary inline-flex items-center">
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
          <div className="text-2xl font-bold text-yellow-600">
            {students.reduce((sum, student) => sum + student.booksIssued, 0)}
          </div>
          <div className="text-sm text-gray-600">Books Issued</div>
        </div>
        <div className="stats-card text-center">
          <div className="text-2xl font-bold text-red-600">
            {students.reduce((sum, student) => sum + student.overdueBooks, 0)}
          </div>
          <div className="text-sm text-gray-600">Overdue Books</div>
        </div>
        <div className="stats-card text-center">
          <div className="text-2xl font-bold text-green-600">
            ₹
            {students
              .reduce((sum, student) => sum + student.pendingFines, 0)
              .toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">Pending Fines</div>
        </div>
      </div>

      {/* Students Table */}
      <div className="table-container">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Student Records</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Register No.</th>
                <th>Name</th>
                <th>Department</th>
                <th>Year</th>
                <th>Contact</th>
                <th>Books Issued</th>
                <th>Overdue</th>
                <th>Pending Fines</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td className="font-medium">{student.registerNumber}</td>
                    <td>
                      <div className="font-medium text-gray-900">
                        {student.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {student.email}
                      </div>
                    </td>
                    <td className="text-gray-500">{student.department}</td>
                    <td className="text-center">{student.year}</td>
                    <td className="text-gray-500">{student.phone}</td>
                    <td className="text-center">
                      <span className="badge badge-info">
                        {student.booksIssued}
                      </span>
                    </td>
                    <td className="text-center">
                      {student.overdueBooks > 0 ? (
                        <span className="badge badge-danger">
                          {student.overdueBooks}
                        </span>
                      ) : (
                        <span className="badge badge-success">0</span>
                      )}
                    </td>
                    <td className="text-center">
                      {student.pendingFines > 0 ? (
                        <span className="text-red-600 font-medium">
                          ₹{student.pendingFines}
                        </span>
                      ) : (
                        <span className="text-green-600">₹0</span>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-success">
                        {student.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                          View
                        </button>
                        <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center py-8">
                    <UserGroupIcon className="mx-auto h-12 w-12 text-gray-300" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No students found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm
                        ? "Try adjusting your search terms."
                        : "Get started by adding a new student."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Students;
