import { useState } from "react";
import {
  CloudIcon,
  DocumentIcon,
  PlayIcon,
  BookOpenIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TagIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  StarIcon,
  ClockIcon,
  UserIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";

function DigitalLibrary() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Mock digital resources data
  const digitalResources = [
    {
      id: 1,
      title: "Advanced JavaScript Programming",
      type: "ebook",
      category: "Programming",
      author: "John Doe",
      format: "PDF",
      size: "15.2 MB",
      pages: 450,
      language: "English",
      uploadDate: "2024-12-20",
      downloads: 125,
      rating: 4.8,
      cover:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=400&fit=crop",
      description:
        "Comprehensive guide to modern JavaScript development including ES6+ features and advanced concepts.",
      tags: ["JavaScript", "Web Development", "Programming", "ES6"],
      url: "/digital-resources/advanced-js.pdf",
    },
    {
      id: 2,
      title: "Data Science Fundamentals",
      type: "video",
      category: "Data Science",
      author: "Prof. Sarah Wilson",
      format: "MP4",
      duration: "4h 32m",
      size: "2.1 GB",
      language: "English",
      uploadDate: "2024-12-18",
      views: 89,
      rating: 4.6,
      cover:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=400&fit=crop",
      description:
        "Complete video course covering statistics, machine learning, and data visualization techniques.",
      tags: ["Data Science", "Statistics", "Machine Learning", "Python"],
      url: "/digital-resources/data-science-course.mp4",
    },
    {
      id: 3,
      title: "Digital Signal Processing Research Papers",
      type: "document",
      category: "Electronics",
      author: "IEEE Collection",
      format: "PDF Collection",
      size: "45.7 MB",
      papers: 15,
      language: "English",
      uploadDate: "2024-12-15",
      downloads: 67,
      rating: 4.9,
      cover:
        "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=300&h=400&fit=crop",
      description:
        "Collection of latest research papers on digital signal processing and communication systems.",
      tags: ["DSP", "Electronics", "Research", "IEEE"],
      url: "/digital-resources/dsp-papers.zip",
    },
    {
      id: 4,
      title: "Tamil Literature Classics",
      type: "ebook",
      category: "Literature",
      author: "Various Authors",
      format: "EPUB",
      size: "8.9 MB",
      pages: 320,
      language: "Tamil",
      uploadDate: "2024-12-12",
      downloads: 156,
      rating: 4.7,
      cover:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
      description:
        "Collection of classical Tamil literature including works by Thiruvalluvar and other renowned poets.",
      tags: ["Tamil", "Literature", "Classics", "Poetry"],
      url: "/digital-resources/tamil-literature.epub",
    },
    {
      id: 5,
      title: "Database Design Tutorial Series",
      type: "video",
      category: "Database",
      author: "Tech Academy",
      format: "MP4 Series",
      duration: "6h 15m",
      size: "3.2 GB",
      language: "English",
      uploadDate: "2024-12-10",
      views: 203,
      rating: 4.5,
      cover:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop",
      description:
        "Comprehensive tutorial series on database design principles, normalization, and optimization.",
      tags: ["Database", "SQL", "Design", "Normalization"],
      url: "/digital-resources/db-tutorial-series.zip",
    },
  ];

  const categories = [
    { value: "all", label: "All Resources", count: digitalResources.length },
    {
      value: "Programming",
      label: "Programming",
      count: digitalResources.filter((r) => r.category === "Programming")
        .length,
    },
    {
      value: "Data Science",
      label: "Data Science",
      count: digitalResources.filter((r) => r.category === "Data Science")
        .length,
    },
    {
      value: "Electronics",
      label: "Electronics",
      count: digitalResources.filter((r) => r.category === "Electronics")
        .length,
    },
    {
      value: "Literature",
      label: "Literature",
      count: digitalResources.filter((r) => r.category === "Literature").length,
    },
    {
      value: "Database",
      label: "Database",
      count: digitalResources.filter((r) => r.category === "Database").length,
    },
  ];

  const resourceTypes = [
    {
      type: "ebook",
      icon: BookOpenIcon,
      label: "E-Books",
      color: "text-blue-600",
    },
    { type: "video", icon: PlayIcon, label: "Videos", color: "text-red-600" },
    {
      type: "document",
      icon: DocumentIcon,
      label: "Documents",
      color: "text-green-600",
    },
    { type: "audio", icon: "🎵", label: "Audio", color: "text-purple-600" },
  ];

  const filteredResources = digitalResources.filter((resource) => {
    const matchesCategory =
      selectedCategory === "all" || resource.category === selectedCategory;
    const matchesSearch =
      searchTerm === "" ||
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesCategory && matchesSearch;
  });

  const getTypeIcon = (type) => {
    const typeInfo = resourceTypes.find((t) => t.type === type);
    return typeInfo
      ? { icon: typeInfo.icon, color: typeInfo.color }
      : { icon: DocumentIcon, color: "text-gray-600" };
  };

  const formatFileSize = (size) => {
    if (size.includes("GB")) return size;
    if (size.includes("MB")) return size;
    return `${size} MB`;
  };

  const handleDownload = (resource) => {
    console.log("Downloading:", resource.title);
    // Here you would implement the actual download logic
  };

  const stats = {
    totalResources: digitalResources.length,
    totalDownloads: digitalResources.reduce(
      (sum, r) => sum + (r.downloads || r.views || 0),
      0
    ),
    ebooks: digitalResources.filter((r) => r.type === "ebook").length,
    videos: digitalResources.filter((r) => r.type === "video").length,
    documents: digitalResources.filter((r) => r.type === "document").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">📚 Digital Library</h1>
        <p className="page-subtitle">
          Access e-books, videos, research papers and other digital resources
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        <div className="stats-card text-center">
          <div className="text-2xl font-bold text-primary-600">
            {stats.totalResources}
          </div>
          <div className="text-sm text-gray-600">Total Resources</div>
        </div>
        <div className="stats-card text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.ebooks}</div>
          <div className="text-sm text-gray-600">E-Books</div>
        </div>
        <div className="stats-card text-center">
          <div className="text-2xl font-bold text-red-600">{stats.videos}</div>
          <div className="text-sm text-gray-600">Videos</div>
        </div>
        <div className="stats-card text-center">
          <div className="text-2xl font-bold text-green-600">
            {stats.documents}
          </div>
          <div className="text-sm text-gray-600">Documents</div>
        </div>
        <div className="stats-card text-center">
          <div className="text-2xl font-bold text-orange-600">
            {stats.totalDownloads}
          </div>
          <div className="text-sm text-gray-600">Downloads</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Categories */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Categories</h3>
            </div>
            <div className="p-4 space-y-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                    selectedCategory === category.value
                      ? "bg-primary-100 text-primary-700"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <span>{category.label}</span>
                  <span className="text-sm bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Resource Types */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Resource Types</h3>
            </div>
            <div className="p-4 space-y-3">
              {resourceTypes.map((type) => (
                <div key={type.type} className="flex items-center space-x-3">
                  <type.icon className={`w-5 h-5 ${type.color}`} />
                  <span className="text-sm text-gray-700">{type.label}</span>
                  <span className="ml-auto text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {
                      digitalResources.filter((r) => r.type === type.type)
                        .length
                    }
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search digital resources..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 rounded-md ${
                  viewMode === "grid"
                    ? "bg-primary-100 text-primary-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 rounded-md ${
                  viewMode === "list"
                    ? "bg-primary-100 text-primary-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                List
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="btn-primary inline-flex items-center ml-4"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Upload
              </button>
            </div>
          </div>

          {/* Resources Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredResources.map((resource) => {
                const typeInfo = getTypeIcon(resource.type);
                const IconComponent = typeInfo.icon;

                return (
                  <div
                    key={resource.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={resource.cover}
                        alt={resource.title}
                        className="w-full h-48 object-cover"
                      />
                      <div
                        className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${
                          resource.type === "ebook"
                            ? "bg-blue-100 text-blue-700"
                            : resource.type === "video"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        <IconComponent className="w-3 h-3 inline mr-1" />
                        {resource.type.charAt(0).toUpperCase() +
                          resource.type.slice(1)}
                      </div>
                      <div className="absolute top-2 right-2 flex items-center space-x-1 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                        <StarIcon className="w-3 h-3 text-yellow-400 fill-current" />
                        <span>{resource.rating}</span>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {resource.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {resource.language}
                        </span>
                      </div>

                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        by {resource.author}
                      </p>
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                        {resource.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>{resource.format}</span>
                        <span>{formatFileSize(resource.size)}</span>
                        {resource.pages && <span>{resource.pages} pages</span>}
                        {resource.duration && <span>{resource.duration}</span>}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <ArrowDownTrayIcon className="w-3 h-3 mr-1" />
                            {resource.downloads || resource.views || 0}
                          </div>
                          <div className="flex items-center">
                            <ClockIcon className="w-3 h-3 mr-1" />
                            {new Date(resource.uploadDate).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleDownload(resource)}
                            className="text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1 rounded-md text-sm"
                          >
                            <ArrowDownTrayIcon className="w-4 h-4 inline mr-1" />
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-200">
                {filteredResources.map((resource) => {
                  const typeInfo = getTypeIcon(resource.type);
                  const IconComponent = typeInfo.icon;

                  return (
                    <div
                      key={resource.id}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start space-x-4">
                        <img
                          src={resource.cover}
                          alt={resource.title}
                          className="w-16 h-20 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {resource.title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                by {resource.author}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center text-xs text-gray-500">
                                <StarIcon className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                                {resource.rating}
                              </div>
                              <button
                                onClick={() => handleDownload(resource)}
                                className="text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1 rounded-md text-sm"
                              >
                                <ArrowDownTrayIcon className="w-4 h-4 inline mr-1" />
                                Download
                              </button>
                            </div>
                          </div>

                          <p className="text-sm text-gray-500 mb-3">
                            {resource.description}
                          </p>

                          <div className="flex items-center space-x-6 text-xs text-gray-500">
                            <div className="flex items-center">
                              <IconComponent
                                className={`w-4 h-4 mr-1 ${typeInfo.color}`}
                              />
                              {resource.format}
                            </div>
                            <div>Size: {formatFileSize(resource.size)}</div>
                            {resource.pages && (
                              <div>{resource.pages} pages</div>
                            )}
                            {resource.duration && (
                              <div>{resource.duration}</div>
                            )}
                            <div>
                              {resource.downloads || resource.views || 0}{" "}
                              downloads
                            </div>
                            <div>
                              {new Date(
                                resource.uploadDate
                              ).toLocaleDateString()}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 mt-2">
                            {resource.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <CloudIcon className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No digital resources found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm
                  ? "Try adjusting your search terms or filters."
                  : "Upload digital resources to get started."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Upload Digital Resource</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <CloudIcon className="mx-auto h-12 w-12 text-gray-300" />
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-900">
                    Upload a file
                  </p>
                  <p className="text-sm text-gray-500">
                    PDF, EPUB, MP4, or ZIP up to 100MB
                  </p>
                </div>
                <button className="mt-3 btn-primary">Choose File</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DigitalLibrary;
