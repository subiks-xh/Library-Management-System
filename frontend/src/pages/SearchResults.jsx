import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  BookOpenIcon,
  UsersIcon,
  MagnifyingGlassIcon,
  AcademicCapIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

function SearchResults() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState({
    books: [],
    students: [],
    categories: [],
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Mock data - In real app, this would come from API
  const mockBooks = [
    {
      id: 1,
      title: "Introduction to Computer Science",
      author: "John Smith",
      isbn: "978-0123456789",
      category: "Computer Science",
      available: true,
      location: "A-101",
    },
    {
      id: 2,
      title: "Advanced Mathematics",
      author: "Jane Doe",
      isbn: "978-0987654321",
      category: "Mathematics",
      available: false,
      location: "B-205",
    },
    {
      id: 3,
      title: "Web Development Fundamentals",
      author: "Mike Johnson",
      isbn: "978-0555444333",
      category: "Computer Science",
      available: true,
      location: "A-150",
    },
    {
      id: 4,
      title: "Data Structures and Algorithms",
      author: "Sarah Wilson",
      isbn: "978-0777888999",
      category: "Computer Science",
      available: true,
      location: "A-120",
    },
  ];

  const mockStudents = [
    {
      id: 1,
      firstName: "Raj",
      lastName: "Kumar",
      registerNumber: "CS2021001",
      department: "Computer Science",
      email: "raj.kumar@college.edu.in",
      phone: "9876543210",
    },
    {
      id: 2,
      firstName: "Priya",
      lastName: "Sharma",
      registerNumber: "EC2021015",
      department: "Electronics",
      email: "priya.sharma@college.edu.in",
      phone: "9876543211",
    },
    {
      id: 3,
      firstName: "Arjun",
      lastName: "Reddy",
      registerNumber: "ME2021008",
      department: "Mechanical",
      email: "arjun.reddy@college.edu.in",
      phone: "9876543212",
    },
  ];

  const mockCategories = [
    { id: 1, name: "Computer Science", bookCount: 150, description: "Programming, algorithms, software engineering" },
    { id: 2, name: "Mathematics", bookCount: 89, description: "Calculus, algebra, statistics, discrete math" },
    { id: 3, name: "Electronics", bookCount: 67, description: "Circuit design, microprocessors, communications" },
    { id: 4, name: "Mechanical Engineering", bookCount: 94, description: "Thermodynamics, mechanics, manufacturing" },
  ];

  useEffect(() => {
    // Get search query from URL parameters
    const params = new URLSearchParams(location.search);
    const query = params.get("q") || "";
    setSearchQuery(query);
    
    if (query) {
      performSearch(query);
    }
  }, [location.search]);

  const performSearch = (query) => {
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      
      const foundBooks = mockBooks.filter(
        book =>
          book.title.toLowerCase().includes(lowerQuery) ||
          book.author.toLowerCase().includes(lowerQuery) ||
          book.isbn.includes(lowerQuery) ||
          book.category.toLowerCase().includes(lowerQuery)
      );

      const foundStudents = mockStudents.filter(
        student =>
          student.firstName.toLowerCase().includes(lowerQuery) ||
          student.lastName.toLowerCase().includes(lowerQuery) ||
          student.registerNumber.toLowerCase().includes(lowerQuery) ||
          student.department.toLowerCase().includes(lowerQuery)
      );

      const foundCategories = mockCategories.filter(
        category =>
          category.name.toLowerCase().includes(lowerQuery) ||
          category.description.toLowerCase().includes(lowerQuery)
      );

      setResults({
        books: foundBooks,
        students: foundStudents,
        categories: foundCategories,
      });
      setLoading(false);
    }, 500);
  };

  const totalResults = results.books.length + results.students.length + results.categories.length;

  const handleNewSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newQuery = formData.get("search");
    if (newQuery.trim()) {
      setSearchQuery(newQuery);
      performSearch(newQuery);
      // Update URL
      window.history.pushState({}, "", `/search?q=${encodeURIComponent(newQuery)}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Search Header */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
              {searchQuery && (
                <p className="text-sm text-gray-600 mt-1">
                  {loading ? "Searching..." : `${totalResults} results found for "${searchQuery}"`}
                </p>
              )}
            </div>
            
            {/* Search Form */}
            <form onSubmit={handleNewSearch} className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                name="search"
                placeholder="Search books, students, categories..."
                defaultValue={searchQuery}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 sm:text-sm"
              />
            </form>
          </div>
        </div>

        {/* Search Tabs */}
        <div className="px-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("all")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "all"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                All Results ({totalResults})
              </button>
              <button
                onClick={() => setActiveTab("books")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "books"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Books ({results.books.length})
              </button>
              <button
                onClick={() => setActiveTab("students")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "students"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Students ({results.students.length})
              </button>
              <button
                onClick={() => setActiveTab("categories")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "categories"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Categories ({results.categories.length})
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Searching...</p>
        </div>
      )}

      {/* No Results */}
      {!loading && searchQuery && totalResults === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search terms or browse our catalog.
          </p>
          <div className="mt-6 flex justify-center space-x-4">
            <Link
              to="/books"
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Browse Books
            </Link>
            <Link
              to="/students"
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              View Students
            </Link>
          </div>
        </div>
      )}

      {/* Search Results */}
      {!loading && totalResults > 0 && (
        <div className="space-y-6">
          {/* Books Results */}
          {(activeTab === "all" || activeTab === "books") && results.books.length > 0 && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <BookOpenIcon className="w-5 h-5 mr-2 text-green-500" />
                  Books ({results.books.length})
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {results.books.map((book) => (
                  <div key={book.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{book.title}</h3>
                        <p className="text-sm text-gray-600">by {book.author}</p>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <span>ISBN: {book.isbn}</span>
                          <span>Category: {book.category}</span>
                          <span>Location: {book.location}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            book.available
                              ? "text-green-800 bg-green-100"
                              : "text-red-800 bg-red-100"
                          }`}
                        >
                          {book.available ? "Available" : "Checked Out"}
                        </span>
                        <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                          {book.available ? "Issue Book" : "Reserve"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Students Results */}
          {(activeTab === "all" || activeTab === "students") && results.students.length > 0 && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <UsersIcon className="w-5 h-5 mr-2 text-blue-500" />
                  Students ({results.students.length})
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {results.students.map((student) => (
                  <div key={student.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{student.email}</p>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <span>Reg: {student.registerNumber}</span>
                          <span>Dept: {student.department}</span>
                          <span>Phone: {student.phone}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-green-800 bg-green-100">
                          Active
                        </span>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categories Results */}
          {(activeTab === "all" || activeTab === "categories") && results.categories.length > 0 && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <AcademicCapIcon className="w-5 h-5 mr-2 text-purple-500" />
                  Categories ({results.categories.length})
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {results.categories.map((category) => (
                  <div key={category.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-600">{category.description}</p>
                        <p className="text-sm text-gray-500 mt-1">{category.bookCount} books available</p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                          Browse Category
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading && !searchQuery && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Start your search</h3>
          <p className="mt-1 text-sm text-gray-500">
            Search for books, students, or categories using the search box above.
          </p>
        </div>
      )}
    </div>
  );
}

export default SearchResults;