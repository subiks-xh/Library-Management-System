// API Configuration for Tamil Nadu College Library Management System
import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://your-backend-domain.com/api"
      : "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // In Phase 2, redirect to login page
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const libraryAPI = {
  // Dashboard
  getDashboardStats: () => api.get("/dashboard"),

  // Books
  getBooks: (params = {}) => api.get("/books", { params }),
  getBook: (id) => api.get(`/books/${id}`),
  createBook: (data) => api.post("/books", data),
  addBook: (data) => api.post("/books", data), // Alias for createBook
  updateBook: (id, data) => api.put(`/books/${id}`, data),
  deleteBook: (id) => api.delete(`/books/${id}`),

  // Categories
  getCategories: () => api.get("/categories"),
  getCategory: (id) => api.get(`/categories/${id}`),
  createCategory: (data) => api.post("/categories", data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),

  // Students
  getStudents: (params = {}) => api.get("/students", { params }),
  getStudent: (id) => api.get(`/students/${id}`),
  createStudent: (data) => api.post("/students", data),
  updateStudent: (id, data) => api.put(`/students/${id}`, data),
  deleteStudent: (id) => api.delete(`/students/${id}`),

  // Issue/Return Books
  issueBook: (data) => api.post("/issues", data),
  returnBook: (issueId, data) => api.put(`/issues/${issueId}/return`, data),
  getIssuedBooks: (params = {}) => api.get("/issues", { params }),
  getStudentIssues: (studentId) => api.get(`/issues/student/${studentId}`),

  // Fines
  getFines: (params = {}) => api.get("/fines", { params }),
  payFine: (fineId, data) => api.put(`/fines/${fineId}/pay`, data),
  waiveFine: (fineId, data) => api.put(`/fines/${fineId}/waive`, data),

  // Reports
  getReports: (type, params = {}) => api.get(`/reports/${type}`, { params }),

  // Health check
  healthCheck: () => api.get("/health"),
};

export default api;
