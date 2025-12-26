import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  ComputerDesktopIcon,
  BookOpenIcon,
  FilmIcon,
  MusicalNoteIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  LockClosedIcon,
  LockOpenIcon,
  EyeIcon,
  ArrowTopRightOnSquareIcon,
  ChartBarIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CloudDownloadIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

function DigitalResources() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedAccess, setSelectedAccess] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const queryClient = useQueryClient();

  // Fetch digital resources
  const { data: resourcesData, isLoading } = useQuery(
    [
      "digital-resources",
      { search: searchTerm, type: selectedType, access: selectedAccess },
    ],
    () =>
      fetchDigitalResources({
        search: searchTerm,
        type: selectedType,
        access: selectedAccess,
      }),
    { refetchOnWindowFocus: false }
  );

  const resources = resourcesData?.data || mockDigitalResources;

  // Filter resources
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      !selectedType || resource.resource_type === selectedType;
    const matchesAccess =
      !selectedAccess || resource.access_method === selectedAccess;

    return matchesSearch && matchesType && matchesAccess;
  });

  // Calculate statistics
  const stats = {
    totalResources: resources.length,
    activeSubscriptions: resources.filter(
      (r) => r.is_active && r.subscription_end > new Date()
    ).length,
    totalCost: resources.reduce((sum, r) => sum + (r.cost_per_year || 0), 0),
    totalUsage: resources.reduce(
      (sum, r) => sum + (r.usage_statistics?.total_access || 0),
      0
    ),
    expiringThisMonth: resources.filter((r) => {
      const expiry = new Date(r.subscription_end);
      const now = new Date();
      return (
        expiry >= now &&
        expiry <= new Date(now.getFullYear(), now.getMonth() + 1, 0)
      );
    }).length,
  };

  const getResourceIcon = (type) => {
    const icons = {
      ebook: BookOpenIcon,
      journal: DocumentTextIcon,
      database: ComputerDesktopIcon,
      video: FilmIcon,
      audio: MusicalNoteIcon,
      software: ComputerDesktopIcon,
    };
    return icons[type] || ComputerDesktopIcon;
  };

  const getAccessMethodColor = (method) => {
    const colors = {
      ip_based: "bg-green-100 text-green-800",
      login_required: "bg-blue-100 text-blue-800",
      proxy: "bg-orange-100 text-orange-800",
      vpn: "bg-purple-100 text-purple-800",
    };
    return colors[method] || "bg-gray-100 text-gray-800";
  };

  const ResourceCard = ({ resource }) => {
    const Icon = getResourceIcon(resource.resource_type);
    const daysUntilExpiry = resource.subscription_end
      ? Math.ceil(
          (new Date(resource.subscription_end) - new Date()) /
            (1000 * 60 * 60 * 24)
        )
      : null;

    return (
      <div className="card hover:shadow-lg transition-all duration-200">
        {/* Resource Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <div
              className={`p-2 rounded-lg ${
                resource.is_active
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                {resource.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{resource.vendor}</p>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                  {resource.resource_type}
                </span>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAccessMethodColor(
                    resource.access_method
                  )}`}
                >
                  {resource.access_method === "ip_based" ? (
                    <LockOpenIcon className="h-3 w-3 mr-1" />
                  ) : (
                    <LockClosedIcon className="h-3 w-3 mr-1" />
                  )}
                  {resource.access_method.replace("_", " ")}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                resource.is_active
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {resource.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Subscription Info */}
        {resource.subscription_end && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-700">
                  Subscription Status
                </div>
                <div className="text-xs text-gray-500">
                  Expires:{" "}
                  {new Date(resource.subscription_end).toLocaleDateString()}
                </div>
              </div>
              <div className="text-right">
                {daysUntilExpiry > 30 ? (
                  <span className="text-green-600 text-sm font-medium">
                    {daysUntilExpiry} days left
                  </span>
                ) : daysUntilExpiry > 0 ? (
                  <span className="text-orange-600 text-sm font-medium">
                    <ExclamationTriangleIcon className="h-4 w-4 inline mr-1" />
                    {daysUntilExpiry} days left
                  </span>
                ) : (
                  <span className="text-red-600 text-sm font-medium">
                    Expired
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Usage Statistics */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {resource.usage_statistics?.total_access?.toLocaleString() || 0}
            </div>
            <div className="text-xs text-gray-600">Total Access</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {resource.usage_statistics?.active_users || 0}
            </div>
            <div className="text-xs text-gray-600">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">
              {resource.max_concurrent_users}
            </div>
            <div className="text-xs text-gray-600">Max Users</div>
          </div>
        </div>

        {/* Cost Information */}
        {resource.cost_per_year && (
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="text-gray-600">Annual Cost:</span>
            <span className="font-semibold text-gray-900">
              ${resource.cost_per_year.toLocaleString()}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {resource.url && (
            <button
              onClick={() => window.open(resource.url, "_blank")}
              className="flex-1 btn-primary btn-sm flex items-center justify-center"
            >
              <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-2" />
              Access
            </button>
          )}
          <button
            onClick={() => setSelectedResource(resource)}
            className="btn-secondary btn-sm flex items-center justify-center"
          >
            <EyeIcon className="h-4 w-4 mr-2" />
            Details
          </button>
          <button className="btn-secondary btn-sm flex items-center justify-center">
            <ChartBarIcon className="h-4 w-4 mr-2" />
            Analytics
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title flex items-center">
              <ComputerDesktopIcon className="h-8 w-8 mr-3 text-primary-600" />
              Digital Resources
            </h1>
            <p className="page-subtitle">
              Manage {stats.totalResources} digital resources and subscriptions
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Resource
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Total Resources</h3>
            <ComputerDesktopIcon className="stat-card-icon text-blue-600" />
          </div>
          <p className="stat-card-value">{stats.totalResources}</p>
          <p className="stat-card-description">Digital collections</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Active Subscriptions</h3>
            <CheckCircleIcon className="stat-card-icon text-green-600" />
          </div>
          <p className="stat-card-value">{stats.activeSubscriptions}</p>
          <p className="stat-card-description">Currently available</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Annual Cost</h3>
            <CurrencyDollarIcon className="stat-card-icon text-purple-600" />
          </div>
          <p className="stat-card-value">${stats.totalCost.toLocaleString()}</p>
          <p className="stat-card-description">Subscription costs</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Total Usage</h3>
            <ChartBarIcon className="stat-card-icon text-orange-600" />
          </div>
          <p className="stat-card-value">{stats.totalUsage.toLocaleString()}</p>
          <p className="stat-card-description">Access count</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Expiring Soon</h3>
            <ExclamationTriangleIcon className="stat-card-icon text-red-600" />
          </div>
          <p className="stat-card-value">{stats.expiringThisMonth}</p>
          <p className="stat-card-description">This month</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search digital resources..."
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
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="border-t pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Resource Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="form-select"
                  >
                    <option value="">All Types</option>
                    <option value="ebook">E-Books</option>
                    <option value="journal">Journals</option>
                    <option value="database">Databases</option>
                    <option value="video">Videos</option>
                    <option value="audio">Audio</option>
                    <option value="software">Software</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Access Method</label>
                  <select
                    value={selectedAccess}
                    onChange={(e) => setSelectedAccess(e.target.value)}
                    className="form-select"
                  >
                    <option value="">All Access</option>
                    <option value="ip_based">IP Based</option>
                    <option value="login_required">Login Required</option>
                    <option value="proxy">Proxy</option>
                    <option value="vpn">VPN</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSelectedType("");
                      setSelectedAccess("");
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

      {/* Resource Type Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          "all",
          "ebook",
          "journal",
          "database",
          "video",
          "audio",
          "software",
        ].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type === "all" ? "" : type)}
            className={`px-4 py-2 rounded-lg border text-sm font-medium capitalize transition-colors ${
              selectedType === (type === "all" ? "" : type)
                ? "border-primary-500 bg-primary-50 text-primary-700"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {type === "all" ? "All Resources" : type.replace("_", " ")}
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {type === "all"
                ? resources.length
                : resources.filter((r) => r.resource_type === type).length}
            </span>
          </button>
        ))}
      </div>

      {/* Resources Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-20 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}

      {/* Resource Details Modal */}
      {selectedResource && (
        <ResourceDetailsModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
        />
      )}
    </div>
  );
}

// Resource Details Modal
function ResourceDetailsModal({ resource, onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Resource Details
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                {resource.title}
              </h4>
              <p className="text-gray-600">{resource.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-gray-900 mb-2">
                  Resource Information
                </h5>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Type</dt>
                    <dd className="text-sm text-gray-900 capitalize">
                      {resource.resource_type}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Vendor
                    </dt>
                    <dd className="text-sm text-gray-900">{resource.vendor}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Access Method
                    </dt>
                    <dd className="text-sm text-gray-900 capitalize">
                      {resource.access_method.replace("_", " ")}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 mb-2">
                  Subscription Details
                </h5>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Start Date
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {new Date(
                        resource.subscription_start
                      ).toLocaleDateString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      End Date
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {new Date(resource.subscription_end).toLocaleDateString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Annual Cost
                    </dt>
                    <dd className="text-sm text-gray-900">
                      ${resource.cost_per_year?.toLocaleString()}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Usage Analytics */}
            <div>
              <h5 className="font-medium text-gray-900 mb-4">
                Usage Analytics
              </h5>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {resource.usage_statistics?.total_access?.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Access</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {resource.usage_statistics?.active_users}
                  </div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {resource.usage_statistics?.downloads || 0}
                  </div>
                  <div className="text-sm text-gray-600">Downloads</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              {resource.url && (
                <button
                  onClick={() => window.open(resource.url, "_blank")}
                  className="btn-primary flex items-center"
                >
                  <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-2" />
                  Access Resource
                </button>
              )}
              <button className="btn-secondary">Edit Details</button>
              <button className="btn-secondary">View Analytics</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mock data
const mockDigitalResources = [
  {
    id: 1,
    title: "IEEE Digital Library",
    description: "Comprehensive collection of IEEE publications and standards",
    resource_type: "database",
    url: "https://ieeexplore.ieee.org",
    access_method: "ip_based",
    subscription_start: "2024-01-01",
    subscription_end: "2024-12-31",
    max_concurrent_users: 50,
    cost_per_year: 25000,
    vendor: "IEEE",
    usage_statistics: {
      total_access: 15420,
      active_users: 450,
      downloads: 2340,
    },
    is_active: true,
  },
  {
    id: 2,
    title: "Springer Nature eBooks",
    description: "Access to thousands of engineering and science eBooks",
    resource_type: "ebook",
    url: "https://link.springer.com",
    access_method: "login_required",
    subscription_start: "2024-01-01",
    subscription_end: "2024-12-31",
    max_concurrent_users: 100,
    cost_per_year: 18000,
    vendor: "Springer Nature",
    usage_statistics: {
      total_access: 8920,
      active_users: 320,
      downloads: 1840,
    },
    is_active: true,
  },
  // Add more mock resources...
];

async function fetchDigitalResources(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: "success",
        data: mockDigitalResources,
      });
    }, 1000);
  });
}

export default DigitalResources;
