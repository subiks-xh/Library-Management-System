import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { libraryAPI } from "../services/api";
import {
  TagIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  BookOpenIcon,
  EyeIcon,
  ChartBarIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";

function Categories() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#22c55e',
    icon: 'BookOpen',
    is_active: true
  });

  const queryClient = useQueryClient();

  // Mutations for CRUD operations
  const addCategoryMutation = useMutation(
    (newCategory) => libraryAPI.createCategory(newCategory),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['categories']);
        setShowAddModal(false);
        resetForm();
      }
    }
  );

  const editCategoryMutation = useMutation(
    ({ id, ...data }) => libraryAPI.updateCategory(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['categories']);
        setShowEditModal(false);
        resetForm();
      }
    }
  );

  const deleteCategoryMutation = useMutation(
    (categoryId) => libraryAPI.deleteCategory(categoryId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['categories']);
      }
    }
  );

  // Enhanced mock data with comprehensive category information
  const categories = [
    {
      id: 1,
      name: "Computer Science & IT",
      description: "Programming, algorithms, data structures, and computer science fundamentals",
      bookCount: 1245,
      issuedCount: 324,
      availableCount: 921,
      color: "#3b82f6",
      icon: "🖥️",
      popularBooks: ["Data Structures and Algorithms", "Computer Networks", "Operating Systems"],
      created_at: "2023-01-15",
      updated_at: "2023-11-20",
      is_active: true
    },
    {
      id: 2,
      name: "Mathematics & Statistics",
      description: "Pure mathematics, applied mathematics, statistics, and mathematical modeling",
      bookCount: 867,
      issuedCount: 198,
      availableCount: 669,
      color: "#10b981",
      icon: "📐",
      popularBooks: ["Linear Algebra", "Calculus", "Probability and Statistics"],
      created_at: "2023-01-15",
      updated_at: "2023-11-18",
      is_active: true
    },
    {
      id: 3,
      name: "Engineering & Technology",
      description: "Mechanical, electrical, civil, and other engineering disciplines",
      bookCount: 1456,
      issuedCount: 456,
      availableCount: 1000,
      color: "#f59e0b",
      icon: "⚙️",
      popularBooks: ["Engineering Mechanics", "Circuit Analysis", "Materials Science"],
      created_at: "2023-01-15",
      updated_at: "2023-11-22",
      is_active: true
    },
    {
      id: 4,
      name: "Science & Research",
      description: "Physics, chemistry, biology, and research methodologies",
      bookCount: 923,
      issuedCount: 267,
      availableCount: 656,
      color: "#8b5cf6",
      icon: "🔬",
      popularBooks: ["General Physics", "Organic Chemistry", "Cell Biology"],
      created_at: "2023-01-15",
      updated_at: "2023-11-19",
      is_active: true
    },
    {
      id: 5,
      name: "Literature & Languages",
      description: "English literature, regional languages, and linguistic studies",
      bookCount: 734,
      issuedCount: 189,
      availableCount: 545,
      color: "#ef4444",
      icon: "📚",
      popularBooks: ["English Literature", "Tamil Literature", "Linguistics"],
      created_at: "2023-01-15",
      updated_at: "2023-11-17",
      is_active: true
    },
    {
      id: 6,
      name: "Business & Management",
      description: "Business administration, management principles, and entrepreneurship",
      bookCount: 456,
      issuedCount: 123,
      availableCount: 333,
      color: "#06b6d4",
      icon: "💼",
      popularBooks: ["Principles of Management", "Marketing Management", "Financial Management"],
      created_at: "2023-02-01",
      updated_at: "2023-11-21",
      is_active: true
    },
    {
      id: 7,
      name: "General Knowledge",
      description: "General awareness, current affairs, and competitive exam preparation",
      bookCount: 345,
      issuedCount: 98,
      availableCount: 247,
      color: "#f97316",
      icon: "🌍",
      popularBooks: ["General Knowledge", "Current Affairs", "Reasoning"],
      created_at: "2023-02-15",
      updated_at: "2023-11-16",
      is_active: true
    },
    {
      id: 8,
      name: "Project Reports",
      description: "Final year projects, dissertations, and thesis documents",
      bookCount: 234,
      issuedCount: 67,
      availableCount: 167,
      color: "#84cc16",
      icon: "📋",
      popularBooks: ["ML Projects", "IoT Projects", "Web Development Projects"],
      created_at: "2023-03-01",
      updated_at: "2023-11-23",
      is_active: true
    }
  ];

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Event handlers
  const handleAddCategory = (e) => {
    e.preventDefault();
    addCategoryMutation.mutate(formData);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color,
      icon: category.icon,
      is_active: category.is_active
    });
    setShowEditModal(true);
  };

  const handleUpdateCategory = (e) => {
    e.preventDefault();
    editCategoryMutation.mutate({
      id: selectedCategory.id,
      ...formData
    });
  };

  const handleViewCategory = (category) => {
    setSelectedCategory(category);
    setShowViewModal(true);
  };

  const handleDeleteCategory = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    if (category?.bookCount > 0) {
      alert(`Cannot delete category "${category.name}" because it contains ${category.bookCount} books. Please move or delete the books first.`);
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategoryMutation.mutate(categoryId);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: '#22c55e',
      icon: 'BookOpen',
      is_active: true
    });
    setSelectedCategory(null);
  };

  const totalBooks = categories.reduce((sum, cat) => sum + cat.bookCount, 0);
  const totalIssued = categories.reduce((sum, cat) => sum + cat.issuedCount, 0);
  const totalAvailable = categories.reduce((sum, cat) => sum + cat.availableCount, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">🏷️ Categories Management</h1>
        <p className="page-subtitle">Organize books into categories and manage library collections</p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Search */}
        <div className="search-bar">
          <div className="relative">
            <MagnifyingGlassIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search categories by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Add Category Button */}
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary inline-flex items-center"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add New Category
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="stats-card text-center">
          <div className="text-2xl font-bold text-primary-600">
            {categories.length}
          </div>
          <div className="text-sm text-gray-600">Total Categories</div>
        </div>
        <div className="stats-card text-center">
          <div className="text-2xl font-bold text-blue-600">
            {totalBooks.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Books</div>
        </div>
        <div className="stats-card text-center">
          <div className="text-2xl font-bold text-green-600">
            {totalAvailable.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Available Books</div>
        </div>
        <div className="stats-card text-center">
          <div className="text-2xl font-bold text-orange-600">
            {totalIssued.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Issued Books</div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            {/* Category Header */}
            <div 
              className="h-2"
              style={{ backgroundColor: category.color }}
            ></div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div 
                    className="rounded-lg p-3 mr-3 text-2xl"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {category.bookCount} books
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleViewCategory(category)}
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1 rounded"
                    title="View Details"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleEditCategory(category)}
                    className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 p-1 rounded"
                    title="Edit Category"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded"
                    title="Delete Category"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {category.description}
              </p>

              {/* Book Statistics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <div className="text-lg font-semibold text-green-600">
                    {category.availableCount}
                  </div>
                  <div className="text-xs text-green-700">Available</div>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg text-center">
                  <div className="text-lg font-semibold text-orange-600">
                    {category.issuedCount}
                  </div>
                  <div className="text-xs text-orange-700">Issued</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Utilization</span>
                  <span>{Math.round((category.issuedCount / category.bookCount) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(category.issuedCount / category.bookCount) * 100}%`,
                      backgroundColor: category.color
                    }}
                  ></div>
                </div>
              </div>

              {/* Popular Books */}
              <div>
                <h4 className="text-xs font-medium text-gray-700 mb-2">Popular Books:</h4>
                <div className="space-y-1">
                  {category.popularBooks.slice(0, 2).map((book, index) => (
                    <div key={index} className="text-xs text-gray-600 flex items-center">
                      <BookOpenIcon className="w-3 h-3 mr-1 text-gray-400" />
                      {book}
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    category.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {category.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <TagIcon className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No categories found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? "Try adjusting your search terms."
              : "Get started by adding a new category."}
          </p>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Add New Category</h3>
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
            
            <form onSubmit={handleAddCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Computer Science"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Brief description of the category..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color Theme
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">{formData.color}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon (Emoji)
                </label>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="📚"
                  maxLength={2}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                  Active category
                </label>
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
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Edit Category</h3>
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
            
            <form onSubmit={handleUpdateCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
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
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color Theme
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">{formData.color}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon (Emoji)
                </label>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  maxLength={2}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  id="edit_is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="edit_is_active" className="ml-2 text-sm text-gray-700">
                  Active category
                </label>
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
                  Update Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Category Modal */}
      {showViewModal && selectedCategory && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Category Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div 
                  className="rounded-lg p-4 mr-4 text-3xl"
                  style={{ backgroundColor: `${selectedCategory.color}20` }}
                >
                  {selectedCategory.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedCategory.name}</h3>
                  <p className="text-gray-600">{selectedCategory.description}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                    selectedCategory.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {selectedCategory.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedCategory.bookCount}</div>
                  <div className="text-sm text-blue-700">Total Books</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{selectedCategory.availableCount}</div>
                  <div className="text-sm text-green-700">Available</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">{selectedCategory.issuedCount}</div>
                  <div className="text-sm text-orange-700">Issued</div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Popular Books in this Category:</h4>
                <div className="space-y-2">
                  {selectedCategory.popularBooks.map((book, index) => (
                    <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg">
                      <BookOpenIcon className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm text-gray-700">{book}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Utilization Rate:</h4>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                  <div 
                    className="h-4 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(selectedCategory.issuedCount / selectedCategory.bookCount) * 100}%`,
                      backgroundColor: selectedCategory.color
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{Math.round((selectedCategory.issuedCount / selectedCategory.bookCount) * 100)}% utilized</span>
                  <span>{selectedCategory.availableCount} available</span>
                </div>
              </div>

              <div className="text-sm text-gray-500 space-y-1">
                <div>Created: {new Date(selectedCategory.created_at).toLocaleDateString()}</div>
                <div>Last Updated: {new Date(selectedCategory.updated_at).toLocaleDateString()}</div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEditCategory(selectedCategory);
                  }}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Edit Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categories;