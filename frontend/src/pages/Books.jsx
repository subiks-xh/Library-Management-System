import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { libraryAPI } from "../services/api";
import {
  BookOpenIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

function Books() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [formData, setFormData] = useState({
    isbn: "",
    title: "",
    author: "",
    publisher: "",
    category: "",
    total_copies: 1,
    price: 0,
    language: "English",
    location: "",
    image_url: "",
  });

  const queryClient = useQueryClient();

  // Fetch books from API
  const {
    data: booksData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["books", { search: searchTerm }],
    queryFn: () => libraryAPI.getBooks({ search: searchTerm }),
    enabled: true,
    refetchOnWindowFocus: false,
  });

  // Add book mutation
  const addBookMutation = useMutation({
    mutationFn: (newBook) => libraryAPI.addBook(newBook),
    onSuccess: () => {
      queryClient.invalidateQueries(["books"]);
      setShowAddModal(false);
      setFormData({
        isbn: "",
        title: "",
        author: "",
        publisher: "",
        category: "",
        total_copies: 1,
        price: 0,
        language: "English",
        location: "",
        image_url: "",
      });
    },
    onError: (error) => {
      console.error("Error adding book:", error);
    },
  });

  // Delete book mutation
  const deleteBookMutation = useMutation({
    mutationFn: (bookId) => libraryAPI.deleteBook(bookId),
    onSuccess: () => {
      queryClient.invalidateQueries(["books"]);
    },
    onError: (error) => {
      console.error("Error deleting book:", error);
    },
  });

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
      image_url:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=250&fit=crop",
      accessionNumber: "CS001",
      department: "Computer Science",
      category: "Textbooks",
      totalCopies: 10,
      availableCopies: 8,
    },
    {
      id: 2,
      isbn: "978-93-325-4568-9",
      title: "Database Management Systems",
      author: "Prof. S. Lakshmi",
      publisher: "McGraw Hill Education",
      category_name: "Textbooks",
      total_copies: 8,
      available_copies: 6,
      status: "active",
      location: "A-102",
      language: "English",
      price: 520.0,
      image_url:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=250&fit=crop",
      accessionNumber: "CS002",
      department: "Computer Science",
      category: "Textbooks",
      totalCopies: 8,
      availableCopies: 6,
    },
    {
      id: 3,
      isbn: "978-93-325-4569-0",
      title: "Digital Electronics",
      author: "Morris Mano",
      publisher: "Pearson Education",
      category_name: "Textbooks",
      total_copies: 6,
      available_copies: 3,
      status: "active",
      location: "A-103",
      language: "English",
      price: 480.0,
      image_url:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=250&fit=crop",
      accessionNumber: "EC001",
      department: "Electronics",
      category: "Textbooks",
      totalCopies: 6,
      availableCopies: 3,
    },
  ];

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.accessionNumber &&
        book.accessionNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle form submission
  const handleAddBook = (e) => {
    e.preventDefault();
    addBookMutation.mutate(formData);
  };

  // Handle edit book
  const handleEditBook = (book) => {
    setSelectedBook(book);
    setFormData({
      isbn: book.isbn || "",
      title: book.title || "",
      author: book.author || "",
      publisher: book.publisher || "",
      category: book.category || book.category_name || "",
      total_copies: book.total_copies || book.totalCopies || 1,
      price: book.price || 0,
      language: book.language || "English",
      location: book.location || "",
      image_url: book.image_url || "",
    });
    setShowEditModal(true);
  };

  // Handle delete book
  const handleDeleteBook = (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      deleteBookMutation.mutate(bookId);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary inline-flex items-center"
        >
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
            {books.reduce(
              (sum, book) => sum + (book.total_copies || book.totalCopies || 0),
              0
            )}
          </div>
          <div className="text-sm text-gray-600">Total Copies</div>
        </div>
        <div className="stats-card text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {books.reduce(
              (sum, book) =>
                sum + (book.available_copies || book.availableCopies || 0),
              0
            )}
          </div>
          <div className="text-sm text-gray-600">Available</div>
        </div>
        <div className="stats-card text-center">
          <div className="text-2xl font-bold text-red-600">
            {books.reduce(
              (sum, book) =>
                sum +
                ((book.total_copies || book.totalCopies || 0) -
                  (book.available_copies || book.availableCopies || 0)),
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
                <th>Book</th>
                <th>Details</th>
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
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-16 flex-shrink-0">
                          {book.image_url ? (
                            <img
                              src={book.image_url}
                              alt={book.title}
                              className="w-full h-full object-cover rounded shadow-sm"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://via.placeholder.com/150x200/e5e7eb/6b7280?text=No+Image";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                              <PhotoIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {book.accessionNumber || book.isbn}
                          </div>
                          <div className="text-xs text-gray-500">
                            ISBN: {book.isbn}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="font-medium text-gray-900">
                        {book.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {book.publisher} • ₹{book.price || 0}
                      </div>
                    </td>
                    <td className="text-gray-500">{book.author}</td>
                    <td className="text-gray-500">{book.department}</td>
                    <td>
                      <span className="badge badge-info">
                        {book.category || book.category_name}
                      </span>
                    </td>
                    <td>{book.total_copies || book.totalCopies}</td>
                    <td>{book.available_copies || book.availableCopies}</td>
                    <td>
                      <span
                        className={`badge ${
                          (book.available_copies || book.availableCopies) > 0
                            ? "badge-success"
                            : "badge-danger"
                        }`}
                      >
                        {(book.available_copies || book.availableCopies) > 0
                          ? "Available"
                          : "Not Available"}
                      </span>
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditBook(book)}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                        >
                          <PencilIcon className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBook(book.id)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center"
                        >
                          <TrashIcon className="h-4 w-4 mr-1" />
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

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Add New Book
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleAddBook} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ISBN
                    </label>
                    <input
                      type="text"
                      name="isbn"
                      value={formData.isbn}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Author
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Publisher
                    </label>
                    <input
                      type="text"
                      name="publisher"
                      value={formData.publisher}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Textbooks">Textbooks</option>
                      <option value="Reference">Reference</option>
                      <option value="Fiction">Fiction</option>
                      <option value="Non-Fiction">Non-Fiction</option>
                      <option value="Journals">Journals</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Copies
                    </label>
                    <input
                      type="number"
                      name="total_copies"
                      value={formData.total_copies}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Language
                    </label>
                    <select
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="English">English</option>
                      <option value="Tamil">Tamil</option>
                      <option value="Hindi">Hindi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., A-101"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Book Cover Image URL
                    </label>
                    <input
                      type="url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleInputChange}
                      placeholder="https://example.com/book-cover.jpg"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addBookMutation.isLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {addBookMutation.isLoading ? "Adding..." : "Add Book"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Book Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Edit Book
                </h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ISBN
                    </label>
                    <input
                      type="text"
                      name="isbn"
                      value={formData.isbn}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Author
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Publisher
                    </label>
                    <input
                      type="text"
                      name="publisher"
                      value={formData.publisher}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Books;
