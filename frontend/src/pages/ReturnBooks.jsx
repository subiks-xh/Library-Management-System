import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { libraryAPI } from "../services/api";
import {
  ArrowLeftOnRectangleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  QrCodeIcon,
  XMarkIcon,
  StarIcon,
  ChatBubbleLeftIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";

function ReturnBooks() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnData, setReturnData] = useState({
    return_date: new Date().toISOString().split('T')[0],
    book_condition: 'good',
    fine_paid: false,
    notes: ''
  });
  const [scanning, setScanning] = useState(false);

  const queryClient = useQueryClient();

  // Mutation for returning books
  const returnBookMutation = useMutation(
    (data) => libraryAPI.returnBook(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['currentIssues']);
        queryClient.invalidateQueries(['books']);
        queryClient.invalidateQueries(['students']);
        setShowReturnModal(false);
        setSelectedIssue(null);
        resetReturnData();
      }
    }
  );

  // Mock data for current issues with comprehensive information
  const currentIssues = [
    {
      id: 1,
      studentName: "Arjun Krishnamurthy",
      registerNumber: "20IT001",
      department: "Information Technology",
      year: 4,
      email: "arjun.k@college.edu.in",
      phone: "9876543210",
      photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      bookTitle: "Advanced Web Development with React",
      bookAuthor: "John Doe",
      accessionNumber: "IT001",
      isbn: "978-1234567890",
      category: "Information Technology",
      cover_image: "https://images.unsplash.com/photo-1562813733-b31f71025d54?w=200&h=300&fit=crop",
      issueDate: "2024-12-10",
      dueDate: "2024-12-24",
      daysOverdue: 1,
      fineAmount: 2.0,
      finePerDay: 2.0,
      status: "overdue",
      location: "Section B, Shelf 3",
      renewals: 1,
      maxRenewals: 2
    },
    {
      id: 2,
      studentName: "Priya Lakshmi",
      registerNumber: "21CS022",
      department: "Computer Science",
      year: 3,
      email: "priya.l@college.edu.in",
      phone: "9876543211",
      photo_url: "https://images.unsplash.com/photo-1494790108755-2616b612b829?w=150&h=150&fit=crop&crop=face",
      bookTitle: "Database Management Systems",
      bookAuthor: "Raghu Ramakrishnan",
      accessionNumber: "CS002",
      isbn: "978-0987654321",
      category: "Computer Science",
      cover_image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=300&fit=crop",
      issueDate: "2024-12-15",
      dueDate: "2024-12-29",
      daysOverdue: 0,
      fineAmount: 0,
      finePerDay: 2.0,
      status: "active",
      location: "Section A, Shelf 1",
      renewals: 0,
      maxRenewals: 2
    },
    {
      id: 3,
      studentName: "Rajesh Kumar",
      registerNumber: "22EC025",
      department: "Electronics",
      year: 2,
      email: "rajesh.k@college.edu.in",
      phone: "9876543212",
      photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      bookTitle: "Digital Signal Processing Fundamentals",
      bookAuthor: "Alan V. Oppenheim",
      accessionNumber: "EC001",
      isbn: "978-1122334455",
      category: "Electronics",
      cover_image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop",
      issueDate: "2024-12-05",
      dueDate: "2024-12-19",
      daysOverdue: 6,
      fineAmount: 12.0,
      finePerDay: 2.0,
      status: "overdue",
      location: "Section D, Shelf 1",
      renewals: 2,
      maxRenewals: 2
    },
    {
      id: 4,
      studentName: "Kavitha Devi",
      registerNumber: "23ME015",
      department: "Mechanical Engineering",
      year: 1,
      email: "kavitha.d@college.edu.in",
      phone: "9876543213",
      photo_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      bookTitle: "Engineering Mechanics - Statics",
      bookAuthor: "R.S. Khurmi",
      accessionNumber: "ME001",
      isbn: "978-5566778899",
      category: "Mechanical Engineering",
      cover_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop",
      issueDate: "2024-12-20",
      dueDate: "2025-01-03",
      daysOverdue: 0,
      fineAmount: 0,
      finePerDay: 2.0,
      status: "active",
      location: "Section C, Shelf 2",
      renewals: 0,
      maxRenewals: 2
    }
  ];

  // Filter issues based on search
  const filteredIssues = currentIssues.filter(issue =>
    issue.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.registerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.accessionNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate overdue days and fine
  const calculateOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleReturn = (issue) => {
    setSelectedIssue(issue);
    setReturnData({
      return_date: new Date().toISOString().split('T')[0],
      book_condition: 'good',
      fine_paid: issue.fineAmount > 0 ? false : true,
      notes: ''
    });
    setShowReturnModal(true);
  };

  const handleReturnSubmit = (e) => {
    e.preventDefault();
    
    if (selectedIssue.fineAmount > 0 && !returnData.fine_paid) {
      alert('Please collect the fine amount before processing the return.');
      return;
    }

    const data = {
      issue_id: selectedIssue.id,
      ...returnData
    };

    returnBookMutation.mutate(data);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReturnData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetReturnData = () => {
    setReturnData({
      return_date: new Date().toISOString().split('T')[0],
      book_condition: 'good',
      fine_paid: false,
      notes: ''
    });
  };

  // Simulate barcode scanning
  const simulateBarcodeScan = () => {
    setScanning(true);
    setTimeout(() => {
      const randomIssue = currentIssues[Math.floor(Math.random() * currentIssues.length)];
      handleReturn(randomIssue);
      setScanning(false);
    }, 2000);
  };

  // Stats calculations
  const totalIssued = currentIssues.length;
  const overdueCount = currentIssues.filter(issue => issue.status === 'overdue').length;
  const totalFines = currentIssues.reduce((sum, issue) => sum + issue.fineAmount, 0);
  const activeReturns = currentIssues.filter(issue => issue.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">📥 Return Books</h1>
        <p className="page-subtitle">
          Process book returns and manage overdue items
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name, register number, or book..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Quick Scan */}
        <button
          onClick={simulateBarcodeScan}
          disabled={scanning}
          className="btn-primary inline-flex items-center"
        >
          {scanning ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              Scanning...
            </>
          ) : (
            <>
              <QrCodeIcon className="w-4 h-4 mr-2" />
              Quick Scan
            </>
          )}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="stats-card text-center">
          <div className="text-2xl font-bold text-blue-600">{totalIssued}</div>
          <div className="text-sm text-gray-600">Total Issued</div>
        </div>
        <div className="stats-card text-center">
          <div className="text-2xl font-bold text-green-600">{activeReturns}</div>
          <div className="text-sm text-gray-600">Active Returns</div>
        </div>
        <div className="stats-card text-center">
          <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
          <div className="text-sm text-gray-600">Overdue Books</div>
        </div>
        <div className="stats-card text-center">
          <div className="text-2xl font-bold text-orange-600">₹{totalFines.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Pending Fines</div>
        </div>
      </div>

      {/* Current Issues */}
      <div className="card">
        <div className="card-header">
          <ArrowLeftOnRectangleIcon className="w-5 h-5 text-primary-600 mr-2" />
          <h2 className="text-lg font-semibold">Current Issues</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fine
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIssues.map((issue) => (
                <tr key={issue.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={issue.photo_url}
                        alt={issue.studentName}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {issue.studentName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {issue.registerNumber}
                        </div>
                        <div className="text-xs text-gray-400">
                          {issue.department}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={issue.cover_image}
                        alt={issue.bookTitle}
                        className="w-8 h-10 object-cover rounded mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {issue.bookTitle}
                        </div>
                        <div className="text-sm text-gray-500">
                          by {issue.bookAuthor}
                        </div>
                        <div className="text-xs text-gray-400">
                          {issue.accessionNumber}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(issue.issueDate).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className={issue.status === 'overdue' ? 'text-red-600 font-medium' : ''}>
                      {new Date(issue.dueDate).toLocaleDateString('en-IN')}
                    </div>
                    {issue.status === 'overdue' && (
                      <div className="text-xs text-red-500">
                        {issue.daysOverdue} days overdue
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      issue.status === 'overdue'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {issue.status === 'overdue' ? 'Overdue' : 'Active'}
                    </span>
                    {issue.renewals > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        Renewed {issue.renewals} time{issue.renewals > 1 ? 's' : ''}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {issue.fineAmount > 0 ? (
                      <div className="text-sm">
                        <span className="text-red-600 font-medium">
                          ₹{issue.fineAmount.toFixed(2)}
                        </span>
                        <div className="text-xs text-gray-500">
                          @₹{issue.finePerDay}/day
                        </div>
                      </div>
                    ) : (
                      <span className="text-green-600 text-sm">No fine</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleReturn(issue)}
                      className="text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1 rounded-md transition-colors"
                    >
                      Return
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredIssues.length === 0 && (
            <div className="text-center py-8">
              <ArrowLeftOnRectangleIcon className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No issued books found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm
                  ? "Try adjusting your search terms."
                  : "All books have been returned."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Return Modal */}
      {showReturnModal && selectedIssue && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Return Book</h3>
              <button
                onClick={() => setShowReturnModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Book and Student Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={selectedIssue.cover_image}
                    alt={selectedIssue.bookTitle}
                    className="w-16 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{selectedIssue.bookTitle}</h4>
                    <p className="text-gray-600">by {selectedIssue.bookAuthor}</p>
                    <p className="text-sm text-gray-500">Accession: {selectedIssue.accessionNumber}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center mb-2">
                      <img
                        src={selectedIssue.photo_url}
                        alt={selectedIssue.studentName}
                        className="w-8 h-8 rounded-full object-cover mr-2"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{selectedIssue.studentName}</div>
                        <div className="text-sm text-gray-500">{selectedIssue.registerNumber}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                  <div>
                    <div className="text-xs text-gray-500">Issue Date</div>
                    <div className="font-medium">{new Date(selectedIssue.issueDate).toLocaleDateString('en-IN')}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Due Date</div>
                    <div className={`font-medium ${selectedIssue.status === 'overdue' ? 'text-red-600' : ''}`}>
                      {new Date(selectedIssue.dueDate).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Days Overdue</div>
                    <div className={`font-medium ${selectedIssue.daysOverdue > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {selectedIssue.daysOverdue > 0 ? selectedIssue.daysOverdue : 0}
                    </div>
                  </div>
                </div>

                {selectedIssue.fineAmount > 0 && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
                      <span className="text-red-700 font-medium">
                        Fine Amount: ₹{selectedIssue.fineAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-sm text-red-600 mt-1">
                      {selectedIssue.daysOverdue} days × ₹{selectedIssue.finePerDay} per day
                    </div>
                  </div>
                )}
              </div>

              {/* Return Form */}
              <form onSubmit={handleReturnSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Return Date *
                    </label>
                    <input
                      type="date"
                      name="return_date"
                      value={returnData.return_date}
                      onChange={handleInputChange}
                      max={new Date().toISOString().split('T')[0]}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Book Condition *
                    </label>
                    <select
                      name="book_condition"
                      value={returnData.book_condition}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                      <option value="damaged">Damaged</option>
                    </select>
                  </div>
                </div>

                {selectedIssue.fineAmount > 0 && (
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="fine_paid"
                        checked={returnData.fine_paid}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Fine of ₹{selectedIssue.fineAmount.toFixed(2)} has been collected
                      </span>
                    </label>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={returnData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Any additional notes about the return..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowReturnModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2 text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors inline-flex items-center"
                  >
                    <PrinterIcon className="w-4 h-4 mr-2" />
                    Print Receipt
                  </button>
                  <button
                    type="submit"
                    disabled={returnBookMutation.isLoading || (selectedIssue.fineAmount > 0 && !returnData.fine_paid)}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center"
                  >
                    {returnBookMutation.isLoading ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="w-4 h-4 mr-2" />
                        Process Return
                      </>
                    )}
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

export default ReturnBooks;