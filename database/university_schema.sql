-- University-Level Library Management System Database Schema
-- Supporting 1000+ students, multiple libraries, advanced features

-- Enhanced Users table with hierarchy
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(20) UNIQUE NOT NULL, -- Student/Faculty ID
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    user_type ENUM('super_admin', 'library_director', 'library_manager', 'librarian', 'assistant_librarian', 'faculty', 'research_scholar', 'postgraduate', 'undergraduate', 'visiting_faculty', 'external_member') NOT NULL,
    status ENUM('active', 'inactive', 'suspended', 'graduated', 'transferred') DEFAULT 'active',
    phone VARCHAR(15),
    address TEXT,
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    profile_image VARCHAR(255),
    department_id INT,
    designation VARCHAR(100),
    joining_date DATE,
    academic_year VARCHAR(10),
    semester VARCHAR(10),
    cgpa DECIMAL(3,2),
    research_interests TEXT,
    borrowing_limit INT DEFAULT 3,
    borrowing_period_days INT DEFAULT 14,
    fine_exemption BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_email (email),
    INDEX idx_user_type (user_type),
    INDEX idx_department (department_id),
    INDEX idx_status (status)
);

-- Departments table
CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    head_of_department INT,
    library_allocation DECIMAL(12,2) DEFAULT 0.00,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(15),
    building VARCHAR(100),
    floor_number INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_name (name)
);

-- Library branches
CREATE TABLE library_branches (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    branch_type ENUM('main', 'department', 'digital', 'research', 'special') DEFAULT 'department',
    location VARCHAR(255),
    floor_plan TEXT,
    capacity INT DEFAULT 100,
    operating_hours JSON,
    manager_id INT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(15),
    facilities JSON, -- {wifi: true, ac: true, computers: 20, printers: 2}
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES users(id),
    INDEX idx_code (code),
    INDEX idx_type (branch_type)
);

-- Enhanced categories with hierarchy
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    parent_id INT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    dewey_decimal VARCHAR(10),
    subject_heading VARCHAR(255),
    level INT DEFAULT 1, -- Category depth level
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id),
    INDEX idx_code (code),
    INDEX idx_parent (parent_id),
    INDEX idx_dewey (dewey_decimal)
);

-- Publishers table
CREATE TABLE publishers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(15),
    website VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
);

-- Authors table
CREATE TABLE authors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    biography TEXT,
    birth_date DATE,
    nationality VARCHAR(100),
    specialization VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (last_name, first_name)
);

-- Enhanced books table
CREATE TABLE books (
    id INT PRIMARY KEY AUTO_INCREMENT,
    isbn VARCHAR(20) UNIQUE,
    isbn13 VARCHAR(20),
    title VARCHAR(500) NOT NULL,
    subtitle VARCHAR(500),
    edition VARCHAR(50),
    publication_year YEAR,
    language VARCHAR(50) DEFAULT 'English',
    pages INT,
    description TEXT,
    table_of_contents TEXT,
    keywords TEXT,
    subject_headings TEXT,
    dewey_decimal VARCHAR(10),
    lc_classification VARCHAR(50),
    publisher_id INT,
    category_id INT NOT NULL,
    book_type ENUM('physical', 'ebook', 'audiobook', 'journal', 'magazine', 'thesis', 'research_paper') DEFAULT 'physical',
    cover_image VARCHAR(255),
    pdf_file VARCHAR(255), -- For ebooks
    audio_file VARCHAR(255), -- For audiobooks
    access_type ENUM('open', 'restricted', 'subscription') DEFAULT 'open',
    price DECIMAL(10,2),
    procurement_date DATE,
    vendor_id INT,
    condition_status ENUM('excellent', 'good', 'fair', 'poor', 'damaged') DEFAULT 'excellent',
    location_code VARCHAR(50),
    shelf_number VARCHAR(20),
    is_reference BOOLEAN DEFAULT FALSE,
    is_rare BOOLEAN DEFAULT FALSE,
    can_reserve BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (publisher_id) REFERENCES publishers(id),
    INDEX idx_isbn (isbn),
    INDEX idx_title (title),
    INDEX idx_category (category_id),
    INDEX idx_type (book_type),
    INDEX idx_location (location_code)
);

-- Book authors relationship
CREATE TABLE book_authors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    book_id INT NOT NULL,
    author_id INT NOT NULL,
    author_role ENUM('primary', 'co_author', 'editor', 'translator') DEFAULT 'primary',
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES authors(id),
    UNIQUE KEY unique_book_author (book_id, author_id),
    INDEX idx_book (book_id),
    INDEX idx_author (author_id)
);

-- Book copies for physical inventory
CREATE TABLE book_copies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    book_id INT NOT NULL,
    barcode VARCHAR(50) UNIQUE NOT NULL,
    rfid_tag VARCHAR(50) UNIQUE,
    copy_number INT NOT NULL,
    library_branch_id INT NOT NULL,
    location_code VARCHAR(50),
    shelf_number VARCHAR(20),
    acquisition_date DATE,
    cost DECIMAL(10,2),
    vendor_id INT,
    condition_status ENUM('excellent', 'good', 'fair', 'poor', 'damaged', 'lost', 'missing') DEFAULT 'excellent',
    last_inventory_date DATE,
    notes TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (library_branch_id) REFERENCES library_branches(id),
    INDEX idx_barcode (barcode),
    INDEX idx_book (book_id),
    INDEX idx_branch (library_branch_id),
    INDEX idx_available (is_available)
);

-- Enhanced circulation/issues table
CREATE TABLE circulation (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    book_copy_id INT NOT NULL,
    issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP NOT NULL,
    return_date TIMESTAMP NULL,
    renewal_count INT DEFAULT 0,
    max_renewals INT DEFAULT 2,
    issued_by INT NOT NULL, -- Staff member who issued
    returned_to INT NULL, -- Staff member who processed return
    status ENUM('issued', 'renewed', 'returned', 'overdue', 'lost', 'damaged') DEFAULT 'issued',
    fine_amount DECIMAL(10,2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_copy_id) REFERENCES book_copies(id),
    FOREIGN KEY (issued_by) REFERENCES users(id),
    FOREIGN KEY (returned_to) REFERENCES users(id),
    INDEX idx_user (user_id),
    INDEX idx_copy (book_copy_id),
    INDEX idx_status (status),
    INDEX idx_due_date (due_date),
    INDEX idx_issue_date (issue_date)
);

-- Book reservations
CREATE TABLE reservations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    reservation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    priority_number INT,
    notification_sent BOOLEAN DEFAULT FALSE,
    expiry_date TIMESTAMP,
    status ENUM('pending', 'available', 'fulfilled', 'cancelled', 'expired') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES books(id),
    INDEX idx_user (user_id),
    INDEX idx_book (book_id),
    INDEX idx_status (status)
);

-- Enhanced fines table
CREATE TABLE fines (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    circulation_id INT NULL,
    fine_type ENUM('overdue', 'damage', 'lost_book', 'processing_fee', 'late_return', 'other') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    assessed_date DATE NOT NULL,
    due_date DATE,
    paid_date DATE NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0.00,
    payment_method ENUM('cash', 'card', 'online', 'cheque', 'bank_transfer') NULL,
    receipt_number VARCHAR(50) NULL,
    status ENUM('pending', 'paid', 'partial', 'waived', 'disputed') DEFAULT 'pending',
    waived_by INT NULL,
    waiver_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (circulation_id) REFERENCES circulation(id),
    FOREIGN KEY (waived_by) REFERENCES users(id),
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_type (fine_type)
);

-- Digital resources
CREATE TABLE digital_resources (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(500) NOT NULL,
    resource_type ENUM('ebook', 'journal', 'database', 'video', 'audio', 'software') NOT NULL,
    url VARCHAR(500),
    access_method ENUM('ip_based', 'login_required', 'proxy', 'vpn') DEFAULT 'ip_based',
    subscription_start DATE,
    subscription_end DATE,
    max_concurrent_users INT DEFAULT 1,
    cost_per_year DECIMAL(12,2),
    vendor VARCHAR(255),
    description TEXT,
    usage_statistics JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_type (resource_type),
    INDEX idx_title (title)
);

-- Reading rooms and facilities
CREATE TABLE reading_rooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    library_branch_id INT NOT NULL,
    room_code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    room_type ENUM('general', 'silent', 'group_study', 'research', 'computer', 'multimedia') DEFAULT 'general',
    capacity INT NOT NULL,
    facilities JSON, -- {ac: true, wifi: true, projector: true}
    booking_required BOOLEAN DEFAULT FALSE,
    hourly_rate DECIMAL(10,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (library_branch_id) REFERENCES library_branches(id),
    INDEX idx_branch (library_branch_id),
    INDEX idx_type (room_type)
);

-- Room bookings
CREATE TABLE room_bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    reading_room_id INT NOT NULL,
    user_id INT NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    purpose TEXT,
    attendees INT DEFAULT 1,
    status ENUM('booked', 'confirmed', 'cancelled', 'completed') DEFAULT 'booked',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reading_room_id) REFERENCES reading_rooms(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_room_date (reading_room_id, booking_date),
    INDEX idx_user (user_id)
);

-- Notifications
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type ENUM('due_reminder', 'overdue_notice', 'reservation_available', 'fine_notice', 'general', 'system') NOT NULL,
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    delivery_method ENUM('email', 'sms', 'push', 'in_app') DEFAULT 'email',
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP NULL,
    read_at TIMESTAMP NULL,
    status ENUM('pending', 'sent', 'failed', 'read') DEFAULT 'pending',
    related_id INT NULL, -- Related record ID (circulation_id, fine_id, etc.)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_status (user_id, status),
    INDEX idx_type (notification_type),
    INDEX idx_scheduled (scheduled_at)
);

-- System audit logs
CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50),
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user (user_id),
    INDEX idx_action (action),
    INDEX idx_timestamp (timestamp)
);

-- Library settings and configurations
CREATE TABLE library_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    description TEXT,
    category VARCHAR(50),
    data_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key (setting_key),
    INDEX idx_category (category)
);

-- Reports cache for performance
CREATE TABLE report_cache (
    id INT PRIMARY KEY AUTO_INCREMENT,
    report_type VARCHAR(100) NOT NULL,
    parameters JSON,
    data JSON,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    INDEX idx_type (report_type),
    INDEX idx_expires (expires_at)
);

-- Add foreign key constraints
ALTER TABLE users ADD FOREIGN KEY (department_id) REFERENCES departments(id);
ALTER TABLE book_copies ADD FOREIGN KEY (vendor_id) REFERENCES publishers(id);
ALTER TABLE books ADD FOREIGN KEY (vendor_id) REFERENCES publishers(id);

-- Insert default departments
INSERT INTO departments (code, name, description) VALUES 
('CSE', 'Computer Science & Engineering', 'Computer Science and Engineering Department'),
('ECE', 'Electronics & Communication', 'Electronics and Communication Engineering'),
('MECH', 'Mechanical Engineering', 'Mechanical Engineering Department'),
('CIVIL', 'Civil Engineering', 'Civil Engineering Department'),
('EEE', 'Electrical & Electronics', 'Electrical and Electronics Engineering'),
('IT', 'Information Technology', 'Information Technology Department'),
('MBA', 'Master of Business Administration', 'Management Studies'),
('ARTS', 'Arts & Literature', 'Arts and Literature Department'),
('SCI', 'Science', 'Basic Sciences Department'),
('MED', 'Medicine', 'Medical College'),
('PHARM', 'Pharmacy', 'Pharmaceutical Sciences'),
('LAW', 'Law', 'Law Department');

-- Insert library branches
INSERT INTO library_branches (code, name, description, branch_type, location, capacity) VALUES
('MAIN', 'Main Library', 'Central University Library', 'main', 'Main Building, Ground Floor', 500),
('ENG', 'Engineering Library', 'Engineering College Library', 'department', 'Engineering Block A', 200),
('MED', 'Medical Library', 'Medical College Library', 'department', 'Medical College Building', 150),
('DIG', 'Digital Library', 'Digital Resources Center', 'digital', 'IT Building, 2nd Floor', 100),
('RES', 'Research Library', 'Research & Development Center', 'research', 'Research Building', 80);

-- Insert enhanced library settings
INSERT INTO library_settings (setting_key, setting_value, description, category, data_type) VALUES
('undergraduate_book_limit', '5', 'Maximum books for undergraduate students', 'circulation', 'number'),
('postgraduate_book_limit', '8', 'Maximum books for postgraduate students', 'circulation', 'number'),
('faculty_book_limit', '15', 'Maximum books for faculty members', 'circulation', 'number'),
('research_scholar_book_limit', '12', 'Maximum books for research scholars', 'circulation', 'number'),
('undergraduate_loan_period', '14', 'Loan period for undergraduate students (days)', 'circulation', 'number'),
('postgraduate_loan_period', '21', 'Loan period for postgraduate students (days)', 'circulation', 'number'),
('faculty_loan_period', '45', 'Loan period for faculty members (days)', 'circulation', 'number'),
('research_scholar_loan_period', '30', 'Loan period for research scholars (days)', 'circulation', 'number'),
('overdue_fine_per_day', '2.00', 'Fine amount per day for overdue books (Rupees)', 'fines', 'number'),
('max_renewal_count', '2', 'Maximum number of renewals allowed', 'circulation', 'number'),
('reservation_expiry_days', '3', 'Days after which reservation expires', 'reservations', 'number'),
('library_email', 'library@university.edu.in', 'Library contact email', 'contact', 'string'),
('library_phone', '+91-44-12345678', 'Library contact phone', 'contact', 'string'),
('university_name', 'Tamil Nadu State University', 'University name', 'general', 'string'),
('academic_year_start', '2024-07-01', 'Academic year start date', 'academic', 'string'),
('working_hours', '{"monday": "8:00-20:00", "tuesday": "8:00-20:00", "sunday": "10:00-18:00"}', 'Library working hours', 'operations', 'json');