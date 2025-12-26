import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import {
  BuildingLibraryIcon,
  MapPinIcon,
  UsersIcon,
  BookOpenIcon,
  ClockIcon,
  CogIcon,
  PlusIcon,
  ChartBarIcon,
  WifiIcon,
  ComputerDesktopIcon,
  PrinterIcon,
  AirConditionerIcon,
  EyeIcon,
  PencilIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

function LibraryBranches() {
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data - Replace with actual API calls
  const { data: branchesData, isLoading } = useQuery(
    "library-branches",
    fetchLibraryBranches,
    { refetchOnWindowFocus: false }
  );

  const branches = branchesData?.data || mockBranchesData;

  // Calculate overall statistics
  const totalStats = {
    totalBranches: branches.length,
    totalCapacity: branches.reduce((sum, b) => sum + b.capacity, 0),
    totalCollection: branches.reduce((sum, b) => sum + b.total_books, 0),
    totalUsers: branches.reduce((sum, b) => sum + b.active_users, 0),
    activeBranches: branches.filter((b) => b.is_active).length,
  };

  const BranchCard = ({ branch }) => (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      {/* Branch Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div
            className={`p-2 rounded-lg ${getBranchTypeColor(
              branch.branch_type
            )}`}
          >
            {getBranchIcon(branch.branch_type)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {branch.name}
            </h3>
            <p className="text-sm text-gray-600 capitalize">
              {branch.branch_type} Library
            </p>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <MapPinIcon className="h-4 w-4 mr-1" />
              {branch.location}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              branch.is_active
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {branch.is_active ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Branch Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {branch.capacity.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Capacity</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {branch.total_books.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Books</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {branch.active_users.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Active Users</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {branch.daily_visitors}
          </div>
          <div className="text-sm text-gray-600">Daily Visitors</div>
        </div>
      </div>

      {/* Operating Hours */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
          <ClockIcon className="h-4 w-4 mr-2" />
          Operating Hours
        </h4>
        <div className="text-sm text-gray-600">
          <div>Mon-Fri: {branch.operating_hours.weekdays}</div>
          <div>Sat-Sun: {branch.operating_hours.weekends}</div>
        </div>
      </div>

      {/* Facilities */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
          <CogIcon className="h-4 w-4 mr-2" />
          Facilities
        </h4>
        <div className="flex flex-wrap gap-2">
          {branch.facilities.wifi && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-800">
              <WifiIcon className="h-3 w-3 mr-1" />
              WiFi
            </span>
          )}
          {branch.facilities.ac && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-green-100 text-green-800">
              <AirConditionerIcon className="h-3 w-3 mr-1" />
              AC
            </span>
          )}
          {branch.facilities.computers > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-purple-100 text-purple-800">
              <ComputerDesktopIcon className="h-3 w-3 mr-1" />
              {branch.facilities.computers} PCs
            </span>
          )}
          {branch.facilities.printers > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-orange-100 text-orange-800">
              <PrinterIcon className="h-3 w-3 mr-1" />
              {branch.facilities.printers} Printers
            </span>
          )}
        </div>
      </div>

      {/* Manager Info */}
      <div className="mb-4 pb-4 border-b">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Branch Manager
        </h4>
        <div className="flex items-center space-x-3">
          <img
            className="h-8 w-8 rounded-full"
            src={`https://ui-avatars.com/api/?name=${branch.manager.name}&background=22c55e&color=fff`}
            alt=""
          />
          <div>
            <div className="text-sm font-medium">{branch.manager.name}</div>
            <div className="text-xs text-gray-500">{branch.manager.email}</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => setSelectedBranch(branch)}
          className="flex-1 btn-primary btn-sm flex items-center justify-center"
        >
          <EyeIcon className="h-4 w-4 mr-2" />
          View Details
        </button>
        <button className="btn-secondary btn-sm flex items-center justify-center">
          <PencilIcon className="h-4 w-4 mr-2" />
          Edit
        </button>
        <button className="btn-secondary btn-sm flex items-center justify-center">
          <ChartBarIcon className="h-4 w-4 mr-2" />
          Analytics
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title flex items-center">
              <BuildingLibraryIcon className="h-8 w-8 mr-3 text-primary-600" />
              Library Branches
            </h1>
            <p className="page-subtitle">
              Manage {totalStats.totalBranches} library branches across the
              university
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Branch
          </button>
        </div>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Total Branches</h3>
            <BuildingLibraryIcon className="stat-card-icon text-blue-600" />
          </div>
          <p className="stat-card-value">{totalStats.totalBranches}</p>
          <p className="stat-card-description">Active locations</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Total Capacity</h3>
            <UsersIcon className="stat-card-icon text-green-600" />
          </div>
          <p className="stat-card-value">
            {totalStats.totalCapacity.toLocaleString()}
          </p>
          <p className="stat-card-description">Seating capacity</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Book Collection</h3>
            <BookOpenIcon className="stat-card-icon text-purple-600" />
          </div>
          <p className="stat-card-value">
            {totalStats.totalCollection.toLocaleString()}
          </p>
          <p className="stat-card-description">Total books</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Active Users</h3>
            <UsersIcon className="stat-card-icon text-orange-600" />
          </div>
          <p className="stat-card-value">
            {totalStats.totalUsers.toLocaleString()}
          </p>
          <p className="stat-card-description">Registered users</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Operational</h3>
            <CheckCircleIcon className="stat-card-icon text-indigo-600" />
          </div>
          <p className="stat-card-value">{totalStats.activeBranches}</p>
          <p className="stat-card-description">Active branches</p>
        </div>
      </div>

      {/* Branch Type Filters */}
      <div className="flex flex-wrap gap-2">
        {["all", "main", "department", "digital", "research", "special"].map(
          (type) => (
            <button
              key={type}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 capitalize"
            >
              {type} Libraries
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {type === "all"
                  ? branches.length
                  : branches.filter((b) => b.branch_type === type).length}
              </span>
            </button>
          )
        )}
      </div>

      {/* Branches Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch) => (
            <BranchCard key={branch.id} branch={branch} />
          ))}
        </div>
      )}

      {/* Branch Details Modal */}
      {selectedBranch && (
        <BranchDetailsModal
          branch={selectedBranch}
          onClose={() => setSelectedBranch(null)}
        />
      )}
    </div>
  );
}

// Helper functions
function getBranchTypeColor(type) {
  const colors = {
    main: "bg-blue-100 text-blue-600",
    department: "bg-green-100 text-green-600",
    digital: "bg-purple-100 text-purple-600",
    research: "bg-orange-100 text-orange-600",
    special: "bg-indigo-100 text-indigo-600",
  };
  return colors[type] || "bg-gray-100 text-gray-600";
}

function getBranchIcon(type) {
  const icons = {
    main: <BuildingLibraryIcon className="h-5 w-5" />,
    department: <AcademicCapIcon className="h-5 w-5" />,
    digital: <ComputerDesktopIcon className="h-5 w-5" />,
    research: <BeakerIcon className="h-5 w-5" />,
    special: <StarIcon className="h-5 w-5" />,
  };
  return icons[type] || <BuildingLibraryIcon className="h-5 w-5" />;
}

// Branch Details Modal Component
function BranchDetailsModal({ branch, onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {branch.name} - Detailed View
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Detailed branch information would go here */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {branch.capacity}
                </div>
                <div className="text-sm text-gray-600">Capacity</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {branch.total_books}
                </div>
                <div className="text-sm text-gray-600">Books</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {branch.active_users}
                </div>
                <div className="text-sm text-gray-600">Users</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {branch.daily_visitors}
                </div>
                <div className="text-sm text-gray-600">Daily Visitors</div>
              </div>
            </div>

            {/* More detailed information panels would be added here */}
          </div>
        </div>
      </div>
    </div>
  );
}

// Mock data
const mockBranchesData = [
  {
    id: 1,
    code: "MAIN",
    name: "Main Library",
    description: "Central University Library",
    branch_type: "main",
    location: "Main Building, Ground Floor",
    capacity: 500,
    total_books: 45000,
    active_users: 2500,
    daily_visitors: 800,
    operating_hours: {
      weekdays: "8:00 AM - 9:00 PM",
      weekends: "10:00 AM - 6:00 PM",
    },
    facilities: {
      wifi: true,
      ac: true,
      computers: 50,
      printers: 5,
    },
    manager: {
      name: "Dr. Rajesh Kumar",
      email: "rajesh.kumar@university.edu.in",
    },
    is_active: true,
  },
  {
    id: 2,
    code: "ENG",
    name: "Engineering Library",
    description: "Engineering College Library",
    branch_type: "department",
    location: "Engineering Block A, 1st Floor",
    capacity: 200,
    total_books: 15000,
    active_users: 800,
    daily_visitors: 250,
    operating_hours: {
      weekdays: "9:00 AM - 8:00 PM",
      weekends: "10:00 AM - 5:00 PM",
    },
    facilities: {
      wifi: true,
      ac: true,
      computers: 20,
      printers: 2,
    },
    manager: {
      name: "Prof. Anitha Sharma",
      email: "anitha.sharma@university.edu.in",
    },
    is_active: true,
  },
  // More mock data...
];

async function fetchLibraryBranches() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: "success",
        data: mockBranchesData,
      });
    }, 1000);
  });
}

export default LibraryBranches;
