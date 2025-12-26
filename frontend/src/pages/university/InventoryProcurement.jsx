import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  CubeIcon,
  ShoppingCartIcon,
  TruckIcon,
  BuildingStorefrontIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  XMarkIcon,
  CalendarDaysIcon,
  UserIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function InventoryProcurement() {
  const [selectedTab, setSelectedTab] = useState("inventory");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const queryClient = useQueryClient();

  // Fetch inventory data
  const { data: inventoryData, isLoading: inventoryLoading } = useQuery(
    [
      "inventory",
      {
        search: searchTerm,
        category: selectedCategory,
        status: selectedStatus,
      },
    ],
    () =>
      fetchInventoryData({
        search: searchTerm,
        category: selectedCategory,
        status: selectedStatus,
      }),
    { refetchOnWindowFocus: false }
  );

  // Fetch procurement data
  const { data: procurementData, isLoading: procurementLoading } = useQuery(
    ["procurement"],
    fetchProcurementData,
    { refetchOnWindowFocus: false }
  );

  // Fetch vendors data
  const { data: vendorsData, isLoading: vendorsLoading } = useQuery(
    ["vendors"],
    fetchVendorsData,
    { refetchOnWindowFocus: false }
  );

  const inventory = inventoryData?.data || mockInventory;
  const procurement = procurementData?.data || mockProcurement;
  const vendors = vendorsData?.data || mockVendors;

  // Calculate statistics
  const inventoryStats = {
    totalItems: inventory.length,
    totalValue: inventory.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    ),
    lowStockItems: inventory.filter(
      (item) => item.quantity <= item.reorder_level
    ).length,
    outOfStock: inventory.filter((item) => item.quantity === 0).length,
  };

  const procurementStats = {
    activeOrders: procurement.filter((order) => order.status === "pending")
      .length,
    totalSpent: procurement.reduce((sum, order) => sum + order.total_amount, 0),
    completedOrders: procurement.filter((order) => order.status === "delivered")
      .length,
    pendingApprovals: procurement.filter(
      (order) => order.status === "awaiting_approval"
    ).length,
  };

  // Filter inventory items
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.isbn.includes(searchTerm) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || item.category === selectedCategory;
    const matchesStatus =
      !selectedStatus ||
      (selectedStatus === "low_stock" && item.quantity <= item.reorder_level) ||
      (selectedStatus === "out_of_stock" && item.quantity === 0) ||
      (selectedStatus === "in_stock" && item.quantity > item.reorder_level);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-blue-100 text-blue-800",
      ordered: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      awaiting_approval: "bg-orange-100 text-orange-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStockStatus = (item) => {
    if (item.quantity === 0)
      return { label: "Out of Stock", color: "text-red-600" };
    if (item.quantity <= item.reorder_level)
      return { label: "Low Stock", color: "text-orange-600" };
    return { label: "In Stock", color: "text-green-600" };
  };

  const InventoryCard = ({ item }) => {
    const stockStatus = getStockStatus(item);

    return (
      <div className="card hover:shadow-lg transition-all duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
            <p className="text-sm text-gray-600 mb-1">by {item.author}</p>
            <p className="text-xs text-gray-500">ISBN: {item.isbn}</p>
          </div>
          <div className="text-right">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                stockStatus.label === "Out of Stock"
                  ? "bg-red-100 text-red-800"
                  : stockStatus.label === "Low Stock"
                  ? "bg-orange-100 text-orange-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {stockStatus.label}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm font-medium text-gray-500">Quantity</div>
            <div className={`text-lg font-bold ${stockStatus.color}`}>
              {item.quantity}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Location</div>
            <div className="text-sm text-gray-900">{item.location}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Unit Price</div>
            <div className="text-sm text-gray-900">${item.unit_price}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Total Value</div>
            <div className="text-sm font-bold text-gray-900">
              ${(item.quantity * item.unit_price).toFixed(2)}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">Stock Level</span>
            <span className="text-xs text-gray-500">
              Reorder at: {item.reorder_level}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                item.quantity === 0
                  ? "bg-red-500"
                  : item.quantity <= item.reorder_level
                  ? "bg-orange-500"
                  : "bg-green-500"
              }`}
              style={{
                width: `${Math.min(
                  100,
                  (item.quantity / (item.reorder_level * 2)) * 100
                )}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedItem(item)}
            className="btn-secondary btn-sm flex items-center flex-1"
          >
            <EyeIcon className="h-4 w-4 mr-2" />
            Details
          </button>
          <button className="btn-secondary btn-sm flex items-center">
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit
          </button>
          {item.quantity <= item.reorder_level && (
            <button className="btn-primary btn-sm flex items-center">
              <ShoppingCartIcon className="h-4 w-4 mr-2" />
              Reorder
            </button>
          )}
        </div>
      </div>
    );
  };

  const ProcurementCard = ({ order }) => {
    return (
      <div className="card hover:shadow-lg transition-all duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">
              Order #{order.order_number}
            </h3>
            <p className="text-sm text-gray-600 mb-1">
              Vendor: {order.vendor_name}
            </p>
            <p className="text-xs text-gray-500">
              Ordered: {new Date(order.order_date).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                order.status
              )}`}
            >
              {order.status.replace("_", " ")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <div className="text-sm font-medium text-gray-500">Items</div>
            <div className="text-lg font-bold text-blue-600">
              {order.items_count}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">
              Total Amount
            </div>
            <div className="text-lg font-bold text-green-600">
              ${order.total_amount.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Expected</div>
            <div className="text-sm text-gray-900">
              {order.expected_delivery
                ? new Date(order.expected_delivery).toLocaleDateString()
                : "TBD"}
            </div>
          </div>
        </div>

        {order.notes && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">{order.notes}</div>
          </div>
        )}

        <div className="flex space-x-2">
          <button className="btn-secondary btn-sm flex items-center flex-1">
            <EyeIcon className="h-4 w-4 mr-2" />
            View Details
          </button>
          <button className="btn-secondary btn-sm flex items-center">
            <DocumentTextIcon className="h-4 w-4 mr-2" />
            Invoice
          </button>
          {order.status === "pending" && (
            <button className="btn-primary btn-sm flex items-center">
              <CheckCircleIcon className="h-4 w-4 mr-2" />
              Approve
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case "inventory":
        return (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="card">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search books, ISBN, or authors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="form-input pl-10 w-full"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="form-select"
                    >
                      <option value="">All Categories</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Civil">Civil</option>
                      <option value="Mathematics">Mathematics</option>
                    </select>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="form-select"
                    >
                      <option value="">All Stock Status</option>
                      <option value="in_stock">In Stock</option>
                      <option value="low_stock">Low Stock</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </select>
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
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="form-label">Price Range</label>
                        <select className="form-select">
                          <option value="">Any Price</option>
                          <option value="0-50">$0 - $50</option>
                          <option value="50-100">$50 - $100</option>
                          <option value="100-500">$100 - $500</option>
                          <option value="500+">$500+</option>
                        </select>
                      </div>
                      <div>
                        <label className="form-label">Location</label>
                        <select className="form-select">
                          <option value="">All Locations</option>
                          <option value="A">Section A</option>
                          <option value="B">Section B</option>
                          <option value="C">Section C</option>
                          <option value="Storage">Storage</option>
                        </select>
                      </div>
                      <div>
                        <label className="form-label">Publisher</label>
                        <select className="form-select">
                          <option value="">All Publishers</option>
                          <option value="Pearson">Pearson</option>
                          <option value="McGraw-Hill">McGraw-Hill</option>
                          <option value="Wiley">Wiley</option>
                          <option value="Oxford">Oxford</option>
                        </select>
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() => {
                            setSelectedCategory("");
                            setSelectedStatus("");
                            setSearchTerm("");
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

            {/* Inventory Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInventory.map((item) => (
                <InventoryCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        );

      case "procurement":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {procurement.map((order) => (
                <ProcurementCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        );

      case "vendors":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className="card hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {vendor.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        {vendor.email}
                      </p>
                      <p className="text-sm text-gray-500">{vendor.phone}</p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        vendor.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {vendor.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm font-medium text-gray-500">
                        Total Orders
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        {vendor.total_orders}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">
                        Total Spent
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        ${vendor.total_spent.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Rating</span>
                      <span className="text-xs text-gray-500">
                        {vendor.rating}/5
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 w-4 rounded-full ${
                            i < vendor.rating ? "bg-yellow-400" : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button className="btn-secondary btn-sm flex items-center flex-1">
                      <EyeIcon className="h-4 w-4 mr-2" />
                      View Profile
                    </button>
                    <button className="btn-primary btn-sm flex items-center">
                      <ShoppingCartIcon className="h-4 w-4 mr-2" />
                      New Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "analytics":
        return (
          <div className="space-y-6">
            {/* Inventory Value Trend */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Inventory Value Trend</h3>
                <p className="card-description">
                  Monthly inventory value changes
                </p>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockAnalyticsData.inventory_value_trend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [
                        `$${value.toLocaleString()}`,
                        "Value",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#3B82F6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Distribution */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Inventory by Category</h3>
                  <p className="card-description">Book distribution</p>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockAnalyticsData.category_distribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="count"
                        label={({ name, percent }) =>
                          `${name} (${(percent * 100).toFixed(0)}%)`
                        }
                      >
                        {mockAnalyticsData.category_distribution.map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={`hsl(${index * 45}, 70%, 60%)`}
                            />
                          )
                        )}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Procurement Trends */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Monthly Procurement</h3>
                  <p className="card-description">Purchase orders by month</p>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockAnalyticsData.procurement_trend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [
                          `$${value.toLocaleString()}`,
                          "Amount",
                        ]}
                      />
                      <Bar dataKey="amount" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title flex items-center">
              <CubeIcon className="h-8 w-8 mr-3 text-primary-600" />
              Inventory & Procurement
            </h1>
            <p className="page-subtitle">
              Manage library inventory and procurement operations
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="btn-secondary flex items-center">
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              Generate Report
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Item
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Total Items</h3>
            <CubeIcon className="stat-card-icon text-blue-600" />
          </div>
          <p className="stat-card-value">
            {inventoryStats.totalItems.toLocaleString()}
          </p>
          <p className="stat-card-description">Books in inventory</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Total Value</h3>
            <CurrencyDollarIcon className="stat-card-icon text-green-600" />
          </div>
          <p className="stat-card-value">
            ${inventoryStats.totalValue.toLocaleString()}
          </p>
          <p className="stat-card-description">Inventory worth</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Low Stock</h3>
            <ExclamationTriangleIcon className="stat-card-icon text-orange-600" />
          </div>
          <p className="stat-card-value">{inventoryStats.lowStockItems}</p>
          <p className="stat-card-description">Need reordering</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Active Orders</h3>
            <ShoppingCartIcon className="stat-card-icon text-purple-600" />
          </div>
          <p className="stat-card-value">{procurementStats.activeOrders}</p>
          <p className="stat-card-description">Pending procurement</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "inventory", name: "Inventory", icon: CubeIcon },
            { id: "procurement", name: "Procurement", icon: ShoppingCartIcon },
            { id: "vendors", name: "Vendors", icon: BuildingStorefrontIcon },
            { id: "analytics", name: "Analytics", icon: ChartBarIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  selectedTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Item Details Modal */}
      {selectedItem && (
        <ItemDetailsModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}

// Item Details Modal
function ItemDetailsModal({ item, onClose }) {
  const stockStatus =
    item.quantity === 0
      ? "Out of Stock"
      : item.quantity <= item.reorder_level
      ? "Low Stock"
      : "In Stock";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Item Details
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
                {item.title}
              </h4>
              <p className="text-gray-600">by {item.author}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-gray-900 mb-2">
                  Basic Information
                </h5>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">ISBN</dt>
                    <dd className="text-sm text-gray-900">{item.isbn}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Category
                    </dt>
                    <dd className="text-sm text-gray-900">{item.category}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Publisher
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {item.publisher || "Not specified"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Location
                    </dt>
                    <dd className="text-sm text-gray-900">{item.location}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 mb-2">
                  Inventory Details
                </h5>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Current Stock
                    </dt>
                    <dd className="text-sm text-gray-900 font-bold">
                      {item.quantity}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Reorder Level
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {item.reorder_level}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Unit Price
                    </dt>
                    <dd className="text-sm text-gray-900">
                      ${item.unit_price}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Total Value
                    </dt>
                    <dd className="text-sm text-gray-900 font-bold">
                      ${(item.quantity * item.unit_price).toFixed(2)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Status
                    </dt>
                    <dd
                      className={`text-sm font-medium ${
                        stockStatus === "Out of Stock"
                          ? "text-red-600"
                          : stockStatus === "Low Stock"
                          ? "text-orange-600"
                          : "text-green-600"
                      }`}
                    >
                      {stockStatus}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="btn-secondary">Edit Details</button>
              <button className="btn-secondary">Update Stock</button>
              {item.quantity <= item.reorder_level && (
                <button className="btn-primary">Create Purchase Order</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mock data
const mockInventory = [
  {
    id: 1,
    title: "Data Structures and Algorithms",
    author: "Thomas H. Cormen",
    isbn: "978-0262033848",
    category: "Computer Science",
    publisher: "MIT Press",
    quantity: 5,
    reorder_level: 10,
    unit_price: 89.99,
    location: "CS-A-001",
  },
  {
    id: 2,
    title: "Operating System Concepts",
    author: "Abraham Silberschatz",
    isbn: "978-1118063330",
    category: "Computer Science",
    publisher: "Wiley",
    quantity: 0,
    reorder_level: 8,
    unit_price: 76.5,
    location: "CS-A-002",
  },
  // Add more mock inventory items...
];

const mockProcurement = [
  {
    id: 1,
    order_number: "PO-2024-001",
    vendor_name: "Academic Books Inc.",
    order_date: "2024-01-15T00:00:00Z",
    status: "pending",
    items_count: 25,
    total_amount: 2450.75,
    expected_delivery: "2024-02-15T00:00:00Z",
    notes: "Urgent order for new semester",
  },
  // Add more mock procurement orders...
];

const mockVendors = [
  {
    id: 1,
    name: "Academic Books Inc.",
    email: "sales@academicbooks.com",
    phone: "+1-555-0123",
    status: "active",
    total_orders: 45,
    total_spent: 125000,
    rating: 4,
  },
  // Add more mock vendors...
];

const mockAnalyticsData = {
  inventory_value_trend: [
    { month: "Jan", value: 125000 },
    { month: "Feb", value: 132000 },
    { month: "Mar", value: 128000 },
    { month: "Apr", value: 145000 },
    { month: "May", value: 152000 },
    { month: "Jun", value: 148000 },
  ],
  category_distribution: [
    { name: "Computer Science", count: 1245 },
    { name: "Electronics", count: 987 },
    { name: "Mechanical", count: 876 },
    { name: "Mathematics", count: 654 },
    { name: "Physics", count: 432 },
  ],
  procurement_trend: [
    { month: "Jan", amount: 15000 },
    { month: "Feb", amount: 23000 },
    { month: "Mar", amount: 18000 },
    { month: "Apr", amount: 31000 },
    { month: "May", amount: 28000 },
    { month: "Jun", amount: 35000 },
  ],
};

async function fetchInventoryData(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: "success",
        data: mockInventory,
      });
    }, 1000);
  });
}

async function fetchProcurementData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: "success",
        data: mockProcurement,
      });
    }, 1000);
  });
}

async function fetchVendorsData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: "success",
        data: mockVendors,
      });
    }, 1000);
  });
}

export default InventoryProcurement;
