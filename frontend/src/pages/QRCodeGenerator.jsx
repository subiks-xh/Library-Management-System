import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  QrCodeIcon,
  PrinterIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

function QRCodeGenerator() {
  const [books] = useState([
    {
      id: "BK001",
      title: "Advanced React Programming",
      author: "John Smith",
      isbn: "978-1234567890",
      location: "A-15-3",
      category: "Programming",
    },
    {
      id: "BK002",
      title: "Database Management Systems",
      author: "Raghu Ramakrishnan",
      isbn: "978-0987654321",
      location: "B-22-1",
      category: "Database",
    },
    {
      id: "BK003",
      title: "Digital Signal Processing",
      author: "Alan V. Oppenheim",
      isbn: "978-1122334455",
      location: "C-08-7",
      category: "Electronics",
    },
  ]);

  const [selectedBooks, setSelectedBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const printRef = useRef();

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm)
  );

  const handleSelectBook = (book) => {
    if (selectedBooks.find((b) => b.id === book.id)) {
      setSelectedBooks(selectedBooks.filter((b) => b.id !== book.id));
    } else {
      setSelectedBooks([...selectedBooks, book]);
    }
  };

  const generateQRData = (book) => {
    return JSON.stringify({
      bookId: book.id,
      title: book.title,
      isbn: book.isbn,
      location: book.location,
      type: "LIBRARY_BOOK",
    });
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    const winPrint = window.open("", "", "width=800,height=600");
    winPrint.document.write(`
      <html>
        <head>
          <title>QR Code Labels</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .qr-label { 
              display: inline-block; 
              margin: 10px; 
              padding: 15px; 
              border: 2px solid #ddd; 
              border-radius: 8px;
              text-align: center;
              page-break-inside: avoid;
              width: 200px;
            }
            .book-title { font-weight: bold; margin: 10px 0 5px 0; font-size: 14px; }
            .book-details { font-size: 12px; color: #666; margin: 3px 0; }
            .qr-code { margin: 10px 0; }
            @media print { 
              .qr-label { margin: 5px; } 
              body { margin: 10px; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    winPrint.document.close();
    winPrint.focus();
    winPrint.print();
    winPrint.close();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">📱 QR Code Generator</h1>
        <p className="page-subtitle">
          Generate QR codes for books to enable quick scanning and management
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Book Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Select Books
            </h3>
          </div>

          <div className="p-6">
            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search books..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Book List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedBooks.find((b) => b.id === book.id)
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleSelectBook(book)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {book.title}
                      </h4>
                      <p className="text-sm text-gray-600">by {book.author}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500">
                          ID: {book.id}
                        </span>
                        <span className="text-xs text-gray-500">
                          ISBN: {book.isbn}
                        </span>
                        <span className="text-xs text-gray-500">
                          Location: {book.location}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      {selectedBooks.find((b) => b.id === book.id) ? (
                        <div className="w-5 h-5 bg-primary-600 rounded flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Selection Summary */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Selected:{" "}
                <span className="font-medium text-gray-900">
                  {selectedBooks.length}
                </span>{" "}
                books
              </p>
            </div>
          </div>
        </div>

        {/* QR Code Preview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              QR Code Preview
            </h3>
            {selectedBooks.length > 0 && (
              <button
                onClick={handlePrint}
                className="btn-primary inline-flex items-center text-sm"
              >
                <PrinterIcon className="w-4 h-4 mr-2" />
                Print Labels
              </button>
            )}
          </div>

          <div className="p-6">
            {selectedBooks.length === 0 ? (
              <div className="text-center py-12">
                <QrCodeIcon className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No books selected
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select books from the left panel to generate QR codes.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
                {selectedBooks.map((book) => (
                  <div
                    key={book.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <QRCodeCanvas
                          value={generateQRData(book)}
                          size={80}
                          level="H"
                          includeMargin={true}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {book.title}
                        </h4>
                        <p className="text-sm text-gray-600 truncate">
                          by {book.author}
                        </p>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center text-xs text-gray-500">
                            <span className="font-medium w-16">ID:</span>
                            <span>{book.id}</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <span className="font-medium w-16">ISBN:</span>
                            <span>{book.isbn}</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <span className="font-medium w-16">Location:</span>
                            <span>{book.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Print Template (Hidden) */}
      <div ref={printRef} style={{ display: "none" }}>
        {selectedBooks.map((book) => (
          <div key={book.id} className="qr-label">
            <div className="qr-code">
              <QRCodeCanvas
                value={generateQRData(book)}
                size={120}
                level="H"
                includeMargin={true}
              />
            </div>
            <div className="book-title">{book.title}</div>
            <div className="book-details">by {book.author}</div>
            <div className="book-details">ID: {book.id}</div>
            <div className="book-details">Location: {book.location}</div>
            <div className="book-details">ISBN: {book.isbn}</div>
          </div>
        ))}
      </div>

      {/* Usage Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
          <QrCodeIcon className="w-5 h-5 mr-2" />
          How to Use QR Codes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-medium mb-2">1. Generate Codes</h4>
            <p>
              Select books and generate QR codes containing book information,
              location, and unique identifiers.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">2. Print Labels</h4>
            <p>
              Print the QR code labels and stick them on the corresponding books
              for easy identification.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">3. Quick Access</h4>
            <p>
              Staff can scan QR codes with any scanner app to instantly access
              book details and location.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QRCodeGenerator;
