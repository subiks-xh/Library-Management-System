import { useState } from "react";
import { useQuery } from "react-query";
import { libraryAPI } from "../services/api";
import {
  BookOpenIcon,
  PlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

function Books() {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch books from API
  const {
    data: booksData,
    isLoading,
    error,
  } = useQuery(
    ["books", { search: searchTerm }],
    () => libraryAPI.getBooks({ search: searchTerm }),
    {
      enabled: true,
      refetchOnWindowFocus: false,
    }
  );

  // Use API data or fallback to mock data
  const books = booksData?.data?.data || [
    {
      id: 1,
      isbn: "978-93-325-4567-8",
      title: "Data Structures and Algorithms",
      author: "Dr. R. Narasimhan",
      publisher: "TechMax Publications",
      category_name: "Textbooks",
      total_copies: 10,
      available_copies: 8,
      status: "active",
      location: "A-101",
      language: "English",
      price: 450.0,
    },
    {
      id: 2,
      isbn: "978-93-325-4568-9",
      title: "Database Management Systems",
      author: "Prof. S. Lakshmi",
      publisher: "McGraw Hill Education",
      category_name: "Textbooks",
      totalCopies: 3,
      availableCopies: 2,
      status: "Available",
    },
    {
      id: 3,
      accessionNumber: "EC001",
      title: "Digital Electronics",
      author: "Morris Mano",
      department: "Electronics",
      category: "Textbooks",
      totalCopies: 4,
      availableCopies: 0,
      status: "Not Available",
    },
  ];

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.accessionNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">📚 Books Management</h1>
        <p className="page-subtitle">Manage your library's book collection</p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Search */}
        <div className="search-bar">
          <div className="relative">
            <MagnifyingGlassIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search books by title, author, or accession number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Add Book Button */}
        <button className="btn-primary inline-flex items-center">
          <PlusIcon className="w-4 h-4 mr-2" />
          Add New Book
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="stats-card text-center">
          <div className="text-2xl font-bold text-primary-600">
            {books.length}
          </div>
          <div className="text-sm text-gray-600">Total Books</div>
        </div>
        <div className="stats-card text-center">
          <div className="text-2xl font-bold text-green-600">
            {books.reduce((sum, book) => sum + book.totalCopies, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Copies</div>
        </div>
        <div className="stats-card text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {books.reduce((sum, book) => sum + book.availableCopies, 0)}
          </div>
          <div className="text-sm text-gray-600">Available</div>
        </div>
        <div className="stats-card text-center">
          <div className="text-2xl font-bold text-red-600">
            {books.reduce(
              (sum, book) => sum + (book.totalCopies - book.availableCopies),
              0
            )}
          </div>
          <div className="text-sm text-gray-600">Issued</div>
        </div>
      </div>

      {/* Books Table */}
      <div className="table-container">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Book Collection</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Accession No.</th>
                <th>Title</th>
                <th>Author</th>
                <th>Department</th>
                <th>Category</th>
                <th>Copies</th>
                <th>Available</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <tr key={book.id}>
                    <td className="font-medium">{book.accessionNumber}</td>
                    <td>
                      <div className="font-medium text-gray-900">
                        {book.title}
                      </div>
                    </td>
                    <td className="text-gray-500">{book.author}</td>
                    <td className="text-gray-500">{book.department}</td>
                    <td>
                      <span className="badge badge-info">{book.category}</span>
                    </td>
                    <td>{book.totalCopies}</td>
                    <td>{book.availableCopies}</td>
                    <td>
                      <span
                        className={`badge ${
                          book.status === "Available"
                            ? "badge-success"
                            : "badge-danger"
                        }`}
                      >
                        {book.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-8">
                    <BookOpenIcon className="mx-auto h-12 w-12 text-gray-300" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No books found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm
                        ? "Try adjusting your search terms."
                        : "Get started by adding a new book."}
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

export default Books;
