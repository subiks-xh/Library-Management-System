-- Tamil Nadu College Library Management System Database Schema
-- Users table for authentication and user management

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'librarian', 'faculty', 'admin') DEFAULT 'student',
    register_number VARCHAR(20) UNIQUE NULL, -- For students
    department VARCHAR(100),
    institution VARCHAR(200),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    
    INDEX idx_email (email),
    INDEX idx_register_number (register_number),
    INDEX idx_role (role),
    INDEX idx_department (department)
);

-- Insert sample users for testing
INSERT IGNORE INTO users (
    first_name, last_name, email, phone, password_hash, role, 
    register_number, department, institution, is_active
) VALUES 
-- Admin user (password: admin123)
('Admin', 'User', 'admin@library.edu.in', '9876543210', 
 '$2b$12$LQv3c1yqBwEHFl2AdcvQu.LrUGLWwTWxBHmJdkkBYDN/vfY6aQ5yu', 
 'admin', NULL, 'Administration', 'Tamil Nadu College Library', true),

-- Librarian user (password: lib123)
('Librarian', 'User', 'librarian@library.edu.in', '9876543211', 
 '$2b$12$X3xKJFLNdZMY8QWzZvyPhu.YHuIQK2g7YuOlRLMm9QXqNlQQZqH2K', 
 'librarian', NULL, 'Library Science', 'Tamil Nadu College Library', true),

-- Demo student (password: student123)
('Demo', 'Student', 'student@college.edu.in', '9876543212', 
 '$2b$12$v8PtXHjKGYh2UfXtN9uGk.YQF5uL8DZtZzWdXyKmNvFrR6pWm8.Yu', 
 'student', '20IT001', 'Computer Science', 'Tamil Nadu Engineering College', true),

-- Faculty user (password: faculty123)  
('Faculty', 'Member', 'faculty@college.edu.in', '9876543213', 
 '$2b$12$m9RtYHjKGYh2UfXtN9uGk.YQF5uL8DZtZzWdXyKmNvFrR6pWm8.Ft', 
 'faculty', NULL, 'Information Technology', 'Tamil Nadu Engineering College', true);

-- Update existing tables to reference users (if needed in future)
-- You may want to add foreign key relationships to existing tables like:
-- ALTER TABLE students ADD COLUMN user_id INT, ADD FOREIGN KEY (user_id) REFERENCES users(id);
-- ALTER TABLE issues ADD COLUMN issued_by_user_id INT, ADD FOREIGN KEY (issued_by_user_id) REFERENCES users(id);

-- Create sessions table for token management (optional - for more secure token handling)
CREATE TABLE IF NOT EXISTS user_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    device_info TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT true,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_token_hash (token_hash),
    INDEX idx_expires_at (expires_at)
);

-- Show created tables
SHOW TABLES LIKE 'users';
SHOW TABLES LIKE 'user_sessions';