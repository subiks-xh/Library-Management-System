import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpenIcon,
  AcademicCapIcon,
  ChartBarIcon,
  UserGroupIcon,
  SparklesIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <BookOpenIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">LibMS</h1>
                <p className="text-sm text-gray-600">
                  Tamil Nadu College Library
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-green-600 font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Modern Library
            <span className="text-green-500"> Management</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Complete digital solution for Tamil Nadu colleges. Manage books,
            students, and library operations with advanced AI-powered features
            and real-time analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Login to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything Your Library Needs
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Comprehensive tools designed specifically for Tamil Nadu college
            libraries
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <BookOpenIcon className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Book Management
            </h3>
            <p className="text-gray-600">
              Complete CRUD operations for books, categories, and inventory
              tracking with barcode support.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <UserGroupIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Student Management
            </h3>
            <p className="text-gray-600">
              Manage student records with register numbers, issue/return
              tracking, and fine management.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <SparklesIcon className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              AI Features
            </h3>
            <p className="text-gray-600">
              Smart book recommendations, automated cataloging, and intelligent
              search capabilities.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <ChartBarIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Analytics & Reports
            </h3>
            <p className="text-gray-600">
              Comprehensive reporting with circulation statistics, popular
              books, and usage analytics.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <AcademicCapIcon className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Digital Library
            </h3>
            <p className="text-gray-600">
              Access digital resources, e-books, research papers, and multimedia
              content.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              QR & Mobile
            </h3>
            <p className="text-gray-600">
              QR code generation, mobile-friendly interface, and instant book
              scanning.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-500 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Modernize Your Library?
          </h2>
          <p className="text-green-100 text-lg mb-8">
            Join Tamil Nadu colleges already using our system to improve their
            library operations.
          </p>
          <Link
            to="/register"
            className="bg-white text-green-500 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-medium transition-colors inline-block"
          >
            Start Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-green-500 rounded-lg">
                  <BookOpenIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">LibMS</h3>
                  <p className="text-gray-400 text-sm">
                    Tamil Nadu College Library
                  </p>
                </div>
              </div>
              <p className="text-gray-400">
                Modern library management system designed for Tamil Nadu
                educational institutions.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Book Management</li>
                <li>Student Records</li>
                <li>Digital Resources</li>
                <li>AI Recommendations</li>
                <li>Analytics & Reports</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>Training Videos</li>
                <li>Technical Support</li>
                <li>System Status</li>
                <li>Contact Us</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; 2025 LibMS - Tamil Nadu College Library Management System.
              All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
