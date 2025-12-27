import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { libraryAPI } from "../services/api";
import {
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  BookOpenIcon,
  UserIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  QrCodeIcon,
  CameraIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

function IssueBooks() {
  const [formData, setFormData] = useState({
    registerNumber: "",
    bookId: "",
    issueDays: 14,
    issueDate: new Date().toISOString().split("T")[0],
  });
  const [searchStudent, setSearchStudent] = useState("");
  const [searchBook, setSearchBook] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastIssue, setLastIssue] = useState(null);
  const [scanning, setScanning] = useState(false);

  const queryClient = useQueryClient();

  // Mutation for issuing books
  const issueBookMutation = useMutation({
    mutationFn: (issueData) => libraryAPI.issueBook(issueData),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["recentIssues"]);
      queryClient.invalidateQueries(["books"]);
      queryClient.invalidateQueries(["students"]);
      setLastIssue(data);
      setShowSuccessModal(true);
      resetForm();
    },
    onError: (error) => {
      alert(error.message || "Failed to issue book. Please try again.");
    },
  });

  // Mock data for students
  const students = [
    {
      id: 1,
      registerNumber: "20IT001",
      name: "Arjun Krishnamurthy",
      department: "Information Technology",
      year: 4,
      email: "arjun.k@college.edu.in",
      phone: "9876543210",
      photo_url:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      booksIssued: 2,
      overdueBooks: 0,
      maxBooksAllowed: 5,
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
      photo_url:
        "https://images.unsplash.com/photo-1494790108755-2616b612b829?w=150&h=150&fit=crop&crop=face",
      booksIssued: 1,
      overdueBooks: 1,
      maxBooksAllowed: 5,
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
      photo_url:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      booksIssued: 3,
      overdueBooks: 0,
      maxBooksAllowed: 5,
      status: "Active",
    },
  ];

  // Mock data for available books
  const availableBooks = [
    {
      id: 1,
      accessionNumber: "CS001",
      title: "Data Structures and Algorithms in C",
      author: "E. Balagurusamy",
      category: "Computer Science",
      isbn: "978-0070634541",
      publisher: "McGraw Hill Education",
      edition: "4th Edition",
      year: 2019,
      copies: 5,
      availableCopies: 3,
      cover_image:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=300&fit=crop",
      location: "Section A, Shelf 1",
    },
    {
      id: 2,
      accessionNumber: "IT001",
      title: "Web Technology and Design",
      author: "C. Xavier",
      category: "Information Technology",
      isbn: "978-1259029844",
      publisher: "McGraw Hill Education",
      edition: "1st Edition",
      year: 2020,
      copies: 8,
      availableCopies: 6,
      cover_image:
        "https://images.unsplash.com/photo-1562813733-b31f71025d54?w=200&h=300&fit=crop",
      location: "Section B, Shelf 3",
    },
    {
      id: 3,
      accessionNumber: "ME001",
      title: "Engineering Mechanics - Statics & Dynamics",
      author: "R.S. Khurmi & J.K. Gupta",
      category: "Mechanical Engineering",
      isbn: "978-8121926171",
      publisher: "S. Chand Publishing",
      edition: "14th Edition",
      year: 2018,
      copies: 12,
      availableCopies: 8,
      cover_image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop",
      location: "Section C, Shelf 2",
    },
    {
      id: 4,
      accessionNumber: "EC001",
      title: "Electronic Devices and Circuit Theory",
      author: "Robert L. Boylestad",
      category: "Electronics",
      isbn: "978-0132622264",
      publisher: "Pearson Education",
      edition: "11th Edition",
      year: 2019,
      copies: 6,
      availableCopies: 4,
      cover_image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop",
      location: "Section D, Shelf 1",
    },
  ];

  // Mock data for recent issues
  const recentIssues = [
    {
      id: 1,
      studentName: "Kavitha Devi",
      registerNumber: "23ME015",
      bookTitle: "Engineering Mathematics",
      bookAuthor: "B.S. Grewal",
      accessionNumber: "MA001",
      issueDate: "2024-12-25",
      dueDate: "2025-01-08",
      status: "Active",
      daysRemaining: 6,
      photo_url:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 2,
      studentName: "Priya Lakshmi",
      registerNumber: "21CS022",
      bookTitle: "Database Management Systems",
      bookAuthor: "Raghu Ramakrishnan",
      accessionNumber: "CS002",
      issueDate: "2024-12-23",
      dueDate: "2025-01-06",
      status: "Active",
      daysRemaining: 4,
      photo_url:
        "https://images.unsplash.com/photo-1494790108755-2616b612b829?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 3,
      studentName: "Rajesh Kumar",
      registerNumber: "22EC025",
      bookTitle: "Digital Signal Processing",
      bookAuthor: "Alan V. Oppenheim",
      accessionNumber: "EC002",
      issueDate: "2024-12-20",
      dueDate: "2025-01-03",
      status: "Active",
      daysRemaining: 1,
      photo_url:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
  ];

  // Filtered data based on search
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
      student.registerNumber.toLowerCase().includes(searchStudent.toLowerCase())
  );

  const filteredBooks = availableBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(searchBook.toLowerCase()) ||
      book.author.toLowerCase().includes(searchBook.toLowerCase()) ||
      book.accessionNumber.toLowerCase().includes(searchBook.toLowerCase())
  );

  // Calculate due date
  const calculateDueDate = (issueDate, days) => {
    const due = new Date(issueDate);
    due.setDate(due.getDate() + parseInt(days));
    return due.toISOString().split("T")[0];
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedStudent || !selectedBook) {
      alert("Please select both a student and a book.");
      return;
    }

    // Validation checks
    if (selectedStudent.status !== "Active") {
      alert("Cannot issue books to inactive students.");
      return;
    }

    if (selectedStudent.booksIssued >= selectedStudent.maxBooksAllowed) {
      alert(
        `Student has reached the maximum limit of ${selectedStudent.maxBooksAllowed} books.`
      );
      return;
    }

    if (selectedStudent.overdueBooks > 0) {
      if (
        !window.confirm(
          "Student has overdue books. Do you still want to issue a new book?"
        )
      ) {
        return;
      }
    }

    if (selectedBook.availableCopies <= 0) {
      alert("No copies of this book are currently available.");
      return;
    }

    const issueData = {
      student_id: selectedStudent.id,
      book_id: selectedBook.id,
      issue_date: formData.issueDate,
      due_date: calculateDueDate(formData.issueDate, formData.issueDays),
      issue_days: formData.issueDays,
    };

    issueBookMutation.mutate(issueData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const selectStudent = (student) => {
    setSelectedStudent(student);
    setFormData((prev) => ({
      ...prev,
      registerNumber: student.registerNumber,
    }));
    setSearchStudent("");
  };

  const selectBook = (book) => {
    setSelectedBook(book);
    setFormData((prev) => ({ ...prev, bookId: book.accessionNumber }));
    setSearchBook("");
  };

  const resetForm = () => {
    setFormData({
      registerNumber: "",
      bookId: "",
      issueDays: 14,
      issueDate: new Date().toISOString().split("T")[0],
    });
    setSelectedStudent(null);
    setSelectedBook(null);
    setSearchStudent("");
    setSearchBook("");
  };

  // Simulate barcode scanning
  const simulateBarcodeScan = (type) => {
    setScanning(true);
    setTimeout(() => {
      if (type === "student") {
        const randomStudent =
          students[Math.floor(Math.random() * students.length)];
        selectStudent(randomStudent);
      } else if (type === "book") {
        const availableBook = availableBooks.find(
          (book) => book.availableCopies > 0
        );
        if (availableBook) {
          selectBook(availableBook);
        }
      }
      setScanning(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">📚 Issue Books</h1>
        <p className="page-subtitle">
          Issue books to students and manage borrowing records
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Issue Form */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <ArrowRightOnRectangleIcon className="w-5 h-5 text-primary-600 mr-2" />
              <h2 className="text-lg font-semibold">Issue New Book</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Student Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Student *
                </label>

                {selectedStudent ? (
                  <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
                    <img
                      src={selectedStudent.photo_url}
                      alt={selectedStudent.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {selectedStudent.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {selectedStudent.registerNumber}
                      </div>
                      <div className="text-xs text-gray-500">
                        {selectedStudent.department} - Year{" "}
                        {selectedStudent.year}
                      </div>
                    </div>
                    <div className="text-right mr-4">
                      <div className="text-sm text-gray-600">
                        Books: {selectedStudent.booksIssued}/
                        {selectedStudent.maxBooksAllowed}
                      </div>
                      {selectedStudent.overdueBooks > 0 && (
                        <div className="text-xs text-red-600">
                          {selectedStudent.overdueBooks} overdue
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedStudent(null);
                        setFormData((prev) => ({
                          ...prev,
                          registerNumber: "",
                        }));
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <div className="flex-1 relative">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                          type="text"
                          value={searchStudent}
                          onChange={(e) => setSearchStudent(e.target.value)}
                          placeholder="Search by name or register number..."
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => simulateBarcodeScan("student")}
                        disabled={scanning}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        title="Scan Student ID"
                      >
                        {scanning ? (
                          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                        ) : (
                          <QrCodeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {searchStudent && (
                      <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg">
                        {filteredStudents.map((student) => (
                          <button
                            key={student.id}
                            type="button"
                            onClick={() => selectStudent(student)}
                            className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
                          >
                            <div className="flex items-center">
                              <img
                                src={student.photo_url}
                                alt={student.name}
                                className="w-8 h-8 rounded-full object-cover mr-3"
                              />
                              <div>
                                <div className="font-medium text-sm">
                                  {student.name}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {student.registerNumber}
                                </div>
                              </div>
                              <div className="ml-auto text-xs text-gray-500">
                                {student.booksIssued}/{student.maxBooksAllowed}{" "}
                                books
                              </div>
                            </div>
                          </button>
                        ))}
                        {filteredStudents.length === 0 && (
                          <div className="p-3 text-center text-gray-500 text-sm">
                            No students found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Book Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Book *
                </label>

                {selectedBook ? (
                  <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
                    <img
                      src={selectedBook.cover_image}
                      alt={selectedBook.title}
                      className="w-12 h-16 object-cover rounded mr-4"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {selectedBook.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        by {selectedBook.author}
                      </div>
                      <div className="text-xs text-gray-500">
                        {selectedBook.accessionNumber} • {selectedBook.category}
                      </div>
                    </div>
                    <div className="text-right mr-4">
                      <div className="text-sm text-green-600 font-medium">
                        {selectedBook.availableCopies} available
                      </div>
                      <div className="text-xs text-gray-500">
                        of {selectedBook.copies} total
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBook(null);
                        setFormData((prev) => ({ ...prev, bookId: "" }));
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <div className="flex-1 relative">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                          type="text"
                          value={searchBook}
                          onChange={(e) => setSearchBook(e.target.value)}
                          placeholder="Search by title, author, or accession number..."
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => simulateBarcodeScan("book")}
                        disabled={scanning}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        title="Scan Book Barcode"
                      >
                        {scanning ? (
                          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                        ) : (
                          <QrCodeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {searchBook && (
                      <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg">
                        {filteredBooks.map((book) => (
                          <button
                            key={book.id}
                            type="button"
                            onClick={() => selectBook(book)}
                            disabled={book.availableCopies <= 0}
                            className={`w-full text-left p-3 border-b border-gray-200 last:border-b-0 ${
                              book.availableCopies > 0
                                ? "hover:bg-gray-50"
                                : "bg-gray-50 opacity-60 cursor-not-allowed"
                            }`}
                          >
                            <div className="flex items-center">
                              <img
                                src={book.cover_image}
                                alt={book.title}
                                className="w-8 h-10 object-cover rounded mr-3"
                              />
                              <div className="flex-1">
                                <div className="font-medium text-sm">
                                  {book.title}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {book.author}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {book.accessionNumber}
                                </div>
                              </div>
                              <div
                                className={`ml-auto text-xs ${
                                  book.availableCopies > 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {book.availableCopies > 0
                                  ? `${book.availableCopies} available`
                                  : "Not available"}
                              </div>
                            </div>
                          </button>
                        ))}
                        {filteredBooks.length === 0 && (
                          <div className="p-3 text-center text-gray-500 text-sm">
                            No books found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Issue Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issue Date *
                  </label>
                  <input
                    type="date"
                    name="issueDate"
                    value={formData.issueDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issue Period (Days) *
                  </label>
                  <select
                    name="issueDays"
                    value={formData.issueDays}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="7">7 days (1 week)</option>
                    <option value="14">14 days (2 weeks)</option>
                    <option value="21">21 days (3 weeks)</option>
                    <option value="30">30 days (1 month)</option>
                  </select>
                </div>
              </div>

              {/* Due Date Display */}
              {formData.issueDate && formData.issueDays && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center">
                    <CalendarIcon className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-blue-900 font-medium">
                      Due Date:{" "}
                      {new Date(
                        calculateDueDate(formData.issueDate, formData.issueDays)
                      ).toLocaleDateString("en-IN", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={
                    issueBookMutation.isLoading ||
                    !selectedStudent ||
                    !selectedBook
                  }
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {issueBookMutation.isLoading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Issuing...
                    </>
                  ) : (
                    <>
                      <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                      Issue Book
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Quick Stats & Recent Issues */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold">Today's Summary</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Books Issued Today</span>
                <span className="font-semibold text-green-600">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Available Books</span>
                <span className="font-semibold text-blue-600">
                  {availableBooks.reduce(
                    (sum, book) => sum + book.availableCopies,
                    0
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Students</span>
                <span className="font-semibold text-purple-600">
                  {students.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Overdue Returns</span>
                <span className="font-semibold text-red-600">3</span>
              </div>
            </div>
          </div>

          {/* Recent Issues */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold">Recent Issues</h3>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="flex items-center p-3 bg-gray-50 rounded-lg"
                >
                  <img
                    src={issue.photo_url}
                    alt={issue.studentName}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {issue.bookTitle}
                    </div>
                    <div className="text-xs text-gray-600">
                      {issue.studentName}
                    </div>
                    <div className="text-xs text-gray-500">
                      Due: {new Date(issue.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div
                    className={`text-xs px-2 py-1 rounded-full ${
                      issue.daysRemaining <= 2
                        ? "bg-red-100 text-red-800"
                        : issue.daysRemaining <= 5
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {issue.daysRemaining}d left
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && lastIssue && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>

              <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
                Book Issued Successfully!
              </h3>

              <div className="text-center text-gray-600 mb-6">
                <p className="mb-2">
                  <strong>{selectedStudent?.name}</strong> has been issued
                </p>
                <p className="mb-2">
                  <strong>{selectedBook?.title}</strong>
                </p>
                <p>
                  Due Date:{" "}
                  <strong>
                    {calculateDueDate(formData.issueDate, formData.issueDays) &&
                      new Date(
                        calculateDueDate(formData.issueDate, formData.issueDays)
                      ).toLocaleDateString()}
                  </strong>
                </p>
              </div>

              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default IssueBooks;
