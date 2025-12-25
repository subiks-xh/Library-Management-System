import { TagIcon } from "@heroicons/react/24/outline";

function Categories() {
  // Mock data - Replace with actual API call
  const categories = [
    {
      id: 1,
      name: "Textbooks",
      description: "Academic textbooks for various subjects",
      bookCount: 1234,
    },
    {
      id: 2,
      name: "Reference Books",
      description: "Reference materials and encyclopedias",
      bookCount: 567,
    },
    {
      id: 3,
      name: "Journals",
      description: "Academic journals and periodicals",
      bookCount: 345,
    },
    {
      id: 4,
      name: "Project Reports",
      description: "Student project reports and dissertations",
      bookCount: 167,
    },
    {
      id: 5,
      name: "Fiction",
      description: "Fiction books and novels",
      bookCount: 234,
    },
    {
      id: 6,
      name: "Non-Fiction",
      description: "Non-fiction books and biographies",
      bookCount: 123,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">🏷️ Categories Management</h1>
        <p className="page-subtitle">Organize books into categories</p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="card hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-primary-50 rounded-lg p-2 mr-3">
                  <TagIcon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {category.bookCount} books
                  </p>
                </div>
              </div>
              <div className="flex space-x-1">
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Edit
                </button>
                <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                  Delete
                </button>
              </div>
            </div>
            <p className="text-gray-600 text-sm">{category.description}</p>
          </div>
        ))}
      </div>

      {/* Add Category Button */}
      <div className="text-center">
        <button className="btn-primary">Add New Category</button>
      </div>
    </div>
  );
}

export default Categories;
