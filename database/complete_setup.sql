-- Complete Database Setup for Enhanced Tamil Nadu College Library
-- Run this file to set up everything in the correct order

USE tn_college_library_enhanced;

-- 1. Create users table first (referenced by other tables)
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'librarian', 'faculty', 'student') DEFAULT 'student',
    register_number VARCHAR(50) UNIQUE,
    department VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    card_id VARCHAR(50) UNIQUE,
    google_id VARCHAR(100) UNIQUE,
    profile_picture TEXT,
    current_semester INT,
    graduation_year YEAR,
    is_inside_library BOOLEAN DEFAULT FALSE,
    entry_count INT DEFAULT 0,
    study_hours DECIMAL(10,1) DEFAULT 0.0,
    preferred_seat_section VARCHAR(20),
    notification_preferences JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_card_id (card_id),
    INDEX idx_google_id (google_id),
    INDEX idx_department (department),
    INDEX idx_role (role)
);

-- 2. Create departments table
CREATE TABLE IF NOT EXISTS departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    floor_location VARCHAR(50),
    shelf_range VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    department_code VARCHAR(10),
    description TEXT,
    shelf_location VARCHAR(50),
    color_code VARCHAR(7) DEFAULT '#3B82F6',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_code) REFERENCES departments(code),
    INDEX idx_department (department_code)
);

-- 4. Create books table
CREATE TABLE IF NOT EXISTS books (
    id INT PRIMARY KEY AUTO_INCREMENT,
    accession_number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(300) NOT NULL,
    author VARCHAR(200) NOT NULL,
    isbn VARCHAR(20),
    category_id INT,
    department VARCHAR(100),
    publisher VARCHAR(200),
    published_year YEAR,
    edition VARCHAR(50),
    pages INT,
    shelf_number VARCHAR(50),
    total_copies INT DEFAULT 1,
    available_copies INT DEFAULT 1,
    price DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    INDEX idx_category (category_id),
    INDEX idx_title (title),
    INDEX idx_author (author),
    INDEX idx_department (department)
);

-- 5. Create issued_books table
CREATE TABLE IF NOT EXISTS issued_books (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    book_id INT NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    fine_amount DECIMAL(10,2) DEFAULT 0.00,
    status ENUM('issued', 'returned', 'overdue') DEFAULT 'issued',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES books(id),
    INDEX idx_student (student_id),
    INDEX idx_book (book_id),
    INDEX idx_status (status)
);

-- 6. Create study hall seats table
CREATE TABLE IF NOT EXISTS study_hall_seats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    seat_number VARCHAR(10) NOT NULL,
    section VARCHAR(20) NOT NULL,
    floor VARCHAR(20) DEFAULT 'Ground Floor',
    has_power_outlet BOOLEAN DEFAULT TRUE,
    has_network_access BOOLEAN DEFAULT TRUE,
    is_accessible BOOLEAN DEFAULT FALSE,
    status ENUM('available', 'occupied', 'reserved', 'maintenance') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Create computer systems table
CREATE TABLE IF NOT EXISTS computer_systems (
    id INT PRIMARY KEY AUTO_INCREMENT,
    system_id VARCHAR(10) UNIQUE NOT NULL,
    location VARCHAR(50) NOT NULL,
    specifications TEXT,
    software_installed TEXT,
    status ENUM('available', 'occupied', 'reserved', 'maintenance') DEFAULT 'available',
    last_maintenance DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Create study rooms table
CREATE TABLE IF NOT EXISTS study_rooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_number VARCHAR(10) NOT NULL,
    capacity INT NOT NULL,
    has_ac BOOLEAN DEFAULT TRUE,
    has_projector BOOLEAN DEFAULT FALSE,
    has_whiteboard BOOLEAN DEFAULT TRUE,
    floor VARCHAR(20),
    status ENUM('available', 'occupied', 'reserved', 'maintenance') DEFAULT 'available',
    hourly_rate DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    resource_type ENUM('seat', 'computer', 'study_room') NOT NULL,
    resource_id INT NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled', 'no_show') DEFAULT 'pending',
    booking_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_bookings (user_id),
    INDEX idx_resource_date (resource_type, resource_id, booking_date),
    INDEX idx_booking_date (booking_date)
);

-- 10. Create question papers table
CREATE TABLE IF NOT EXISTS question_papers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    subject_code VARCHAR(20) NOT NULL,
    subject_name VARCHAR(200) NOT NULL,
    department_code VARCHAR(10),
    semester INT NOT NULL,
    exam_type ENUM('CAT1', 'CAT2', 'Semester', 'Supplementary') NOT NULL,
    academic_year VARCHAR(10) NOT NULL,
    exam_date DATE,
    file_path VARCHAR(500),
    file_size BIGINT,
    uploaded_by INT,
    download_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_code) REFERENCES departments(code),
    FOREIGN KEY (uploaded_by) REFERENCES users(id),
    INDEX idx_department_semester (department_code, semester),
    INDEX idx_subject (subject_code),
    INDEX idx_exam_type (exam_type)
);

-- 11. Create entry/exit logs table
CREATE TABLE IF NOT EXISTS entry_exit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    card_id VARCHAR(50),
    entry_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    exit_time TIMESTAMP NULL,
    entry_method ENUM('id_card', 'manual', 'mobile_app', 'google_auth') DEFAULT 'id_card',
    scanner_location VARCHAR(50) DEFAULT 'Main Entrance',
    purpose ENUM('study', 'book_issue', 'computer_use', 'research', 'other') DEFAULT 'study',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user (user_id),
    INDEX idx_entry_time (entry_time),
    INDEX idx_active_sessions (is_active)
);

-- 12. Create library status table
CREATE TABLE IF NOT EXISTS library_status (
    id INT PRIMARY KEY AUTO_INCREMENT,
    total_capacity INT DEFAULT 200,
    current_occupancy INT DEFAULT 0,
    available_seats INT DEFAULT 200,
    available_computers INT DEFAULT 22,
    available_study_rooms INT DEFAULT 4,
    total_books_issued_today INT DEFAULT 0,
    peak_hour_start TIME DEFAULT '10:00:00',
    peak_hour_end TIME DEFAULT '16:00:00',
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 13. Create usage analytics table
CREATE TABLE IF NOT EXISTS usage_analytics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date DATE NOT NULL,
    department_code VARCHAR(10),
    total_entries INT DEFAULT 0,
    total_study_hours DECIMAL(10,1) DEFAULT 0,
    books_issued INT DEFAULT 0,
    computers_used INT DEFAULT 0,
    peak_occupancy INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_code) REFERENCES departments(code),
    UNIQUE KEY unique_date_dept (date, department_code)
);

-- 14. Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('booking_reminder', 'due_date', 'system_alert', 'general') DEFAULT 'general',
    is_read BOOLEAN DEFAULT FALSE,
    scheduled_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_unread (user_id, is_read)
);

-- Insert initial library status
INSERT INTO library_status (total_capacity, current_occupancy, available_seats, available_computers, available_study_rooms) 
VALUES (200, 0, 200, 22, 4);

-- Create a default admin user (password: admin123)
INSERT INTO users (first_name, last_name, email, password_hash, role, register_number, department, is_active)
VALUES ('Admin', 'User', 'admin@college.edu', '$2b$10$YourHashedPasswordHere', 'admin', 'ADMIN001', 'Administration', TRUE);

SELECT 'Database setup completed successfully!' AS Status;
