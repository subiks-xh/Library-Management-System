-- Tamil Nadu College Library Management System
-- Database Schema

-- Create categories table
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
);

-- Create books table
CREATE TABLE books (
    id INT PRIMARY KEY AUTO_INCREMENT,
    isbn VARCHAR(20) UNIQUE,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    publisher VARCHAR(255),
    publication_year YEAR,
    category_id INT NOT NULL,
    total_copies INT NOT NULL DEFAULT 1,
    available_copies INT NOT NULL DEFAULT 1,
    location VARCHAR(100),
    language VARCHAR(50) DEFAULT 'Tamil',
    price DECIMAL(10,2),
    status ENUM('active', 'inactive', 'damaged', 'lost') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_title (title),
    INDEX idx_author (author),
    INDEX idx_isbn (isbn),
    INDEX idx_category (category_id),
    INDEX idx_status (status)
);

-- Create students table
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    register_number VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    year_of_study INT NOT NULL,
    phone VARCHAR(15),
    email VARCHAR(255),
    address TEXT,
    date_of_birth DATE,
    blood_group VARCHAR(5),
    status ENUM('active', 'inactive', 'graduated', 'dropped') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_register_number (register_number),
    INDEX idx_name (name),
    INDEX idx_department (department),
    INDEX idx_status (status)
);

-- Create issued_books table
CREATE TABLE issued_books (
    id INT PRIMARY KEY AUTO_INCREMENT,
    book_id INT NOT NULL,
    student_id INT NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE NULL,
    fine_amount DECIMAL(10,2) DEFAULT 0.00,
    status ENUM('issued', 'returned', 'overdue', 'lost') DEFAULT 'issued',
    issued_by VARCHAR(100),
    return_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE RESTRICT,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE RESTRICT,
    INDEX idx_book_id (book_id),
    INDEX idx_student_id (student_id),
    INDEX idx_issue_date (issue_date),
    INDEX idx_due_date (due_date),
    INDEX idx_status (status)
);

-- Create fines table
CREATE TABLE fines (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    issued_book_id INT NULL,
    fine_type ENUM('overdue', 'damage', 'lost_book', 'other') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    reason TEXT,
    status ENUM('pending', 'paid', 'waived') DEFAULT 'pending',
    fine_date DATE NOT NULL,
    paid_date DATE NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0.00,
    waived_by VARCHAR(100) NULL,
    payment_method ENUM('cash', 'card', 'online', 'other') NULL,
    receipt_number VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE RESTRICT,
    FOREIGN KEY (issued_book_id) REFERENCES issued_books(id) ON DELETE SET NULL,
    INDEX idx_student_id (student_id),
    INDEX idx_fine_type (fine_type),
    INDEX idx_status (status),
    INDEX idx_fine_date (fine_date)
);

-- Create library_settings table
CREATE TABLE library_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    description TEXT,
    data_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_setting_key (setting_key)
);

-- Insert sample categories
INSERT INTO categories (name, description) VALUES 
('Textbooks', 'Academic textbooks for various subjects'),
('Reference Books', 'Reference materials and dictionaries'),
('Fiction', 'Novels and story books'),
('Non-Fiction', 'Biographical and educational books'),
('Periodicals', 'Magazines and journals'),
('Digital Resources', 'E-books and online materials');

-- Insert sample students
INSERT INTO students (register_number, name, department, year_of_study, phone, email, status) VALUES
('20IT001', 'Arjun Kumar', 'Information Technology', 2, '9876543210', 'arjun.kumar@college.edu.in', 'active'),
('20CS002', 'Priya Sharma', 'Computer Science', 3, '9876543211', 'priya.sharma@college.edu.in', 'active'),
('20EC003', 'Raj Patel', 'Electronics', 1, '9876543212', 'raj.patel@college.edu.in', 'active'),
('20ME004', 'Sneha Reddy', 'Mechanical Engineering', 4, '9876543213', 'sneha.reddy@college.edu.in', 'active'),
('20CE005', 'Vikram Singh', 'Civil Engineering', 2, '9876543214', 'vikram.singh@college.edu.in', 'active');

-- Insert sample books
INSERT INTO books (isbn, title, author, publisher, publication_year, category_id, total_copies, available_copies, location, language, price) VALUES
('978-93-325-4567-8', 'Data Structures and Algorithms', 'Dr. R. Narasimhan', 'TechMax Publications', 2023, 1, 10, 8, 'A-101', 'English', 450.00),
('978-93-325-4568-9', 'Database Management Systems', 'Prof. S. Lakshmi', 'McGraw Hill Education', 2022, 1, 8, 6, 'A-102', 'English', 520.00),
('978-93-325-4569-0', 'Computer Networks', 'Dr. M. Ramesh', 'Pearson Education', 2023, 1, 12, 10, 'A-103', 'English', 480.00),
('978-93-325-4570-6', 'Operating Systems', 'Prof. K. Arun', 'Wiley India', 2022, 1, 15, 12, 'A-104', 'English', 395.00);

-- Insert library settings
INSERT INTO library_settings (setting_key, setting_value, description, data_type) VALUES
('max_books_per_student', '3', 'Maximum number of books a student can borrow', 'number'),
('loan_period_days', '14', 'Default loan period in days', 'number'),
('fine_per_day', '1.00', 'Fine amount per day for overdue books (in Rupees)', 'number'),
('library_name', 'Tamil Nadu College Library', 'Name of the library', 'string'),
('library_address', 'Tamil Nadu College Campus, Chennai - 600001', 'Library address', 'string'),
('working_hours', '9:00 AM - 6:00 PM', 'Library working hours', 'string'),
('contact_email', 'library@tncollege.edu.in', 'Library contact email', 'string'),
('contact_phone', '+91-44-12345678', 'Library contact phone', 'string');