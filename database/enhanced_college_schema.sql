-- Enhanced Tamil Nadu College Library Management System
-- Tailored for MECH, CIVIL, CSE, IT, ECE, EEE, and Science & Humanities Departments

-- Create enhanced database schema
CREATE DATABASE IF NOT EXISTS tn_college_library_enhanced;
USE tn_college_library_enhanced;

-- 1. DEPARTMENTS TABLE
CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    floor_location VARCHAR(50),
    shelf_range VARCHAR(100), -- e.g., "A1-A15"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO departments (code, name, full_name, floor_location, shelf_range) VALUES
('MECH', 'Mechanical Engineering', 'Department of Mechanical Engineering', 'Ground Floor - East Wing', 'M1-M25'),
('CIVIL', 'Civil Engineering', 'Department of Civil Engineering', 'Ground Floor - West Wing', 'C1-C20'),
('CSE', 'Computer Science', 'Department of Computer Science Engineering', 'First Floor - North Wing', 'CS1-CS30'),
('IT', 'Information Technology', 'Department of Information Technology', 'First Floor - South Wing', 'IT1-IT25'),
('ECE', 'Electronics & Communication', 'Department of Electronics and Communication Engineering', 'Ground Floor - North Wing', 'EC1-EC28'),
('EEE', 'Electrical & Electronics', 'Department of Electrical and Electronics Engineering', 'Ground Floor - South Wing', 'EE1-EE22'),
('SH', 'Science & Humanities', 'First Year Science and Humanities Department', 'Second Floor - Central', 'SH1-SH35');

-- 2. ENHANCED CATEGORIES TABLE
DROP TABLE IF EXISTS categories;
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    department_code VARCHAR(10),
    description TEXT,
    shelf_location VARCHAR(50),
    color_code VARCHAR(7) DEFAULT '#3B82F6', -- For UI color coding
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_code) REFERENCES departments(code),
    INDEX idx_department (department_code)
);

-- Department-specific book categories
INSERT INTO categories (name, department_code, description, shelf_location, color_code) VALUES
-- Mechanical Engineering
('Thermodynamics', 'MECH', 'Heat transfer, thermal engineering books', 'M1-M3', '#EF4444'),
('Machine Design', 'MECH', 'Design of mechanical components and systems', 'M4-M7', '#EF4444'),
('Manufacturing Technology', 'MECH', 'Production, machining, and manufacturing processes', 'M8-M12', '#EF4444'),
('Fluid Mechanics', 'MECH', 'Fluid flow, hydraulics, and pneumatics', 'M13-M15', '#EF4444'),
('Strength of Materials', 'MECH', 'Material properties and structural analysis', 'M16-M18', '#EF4444'),
('Automobile Engineering', 'MECH', 'Automotive technology and design', 'M19-M22', '#EF4444'),
('Industrial Engineering', 'MECH', 'Operations research and industrial management', 'M23-M25', '#EF4444'),

-- Civil Engineering
('Structural Engineering', 'CIVIL', 'RCC, steel structures, and design', 'C1-C4', '#10B981'),
('Geotechnical Engineering', 'CIVIL', 'Soil mechanics and foundation engineering', 'C5-C7', '#10B981'),
('Transportation Engineering', 'CIVIL', 'Highway, traffic, and transportation planning', 'C8-C10', '#10B981'),
('Water Resources', 'CIVIL', 'Hydrology, irrigation, and water management', 'C11-C13', '#10B981'),
('Environmental Engineering', 'CIVIL', 'Water treatment, pollution control', 'C14-C16', '#10B981'),
('Construction Management', 'CIVIL', 'Project management and construction techniques', 'C17-C20', '#10B981'),

-- Computer Science Engineering
('Data Structures & Algorithms', 'CSE', 'Programming fundamentals and algorithms', 'CS1-CS5', '#3B82F6'),
('Database Management', 'CSE', 'DBMS, SQL, and database design', 'CS6-CS8', '#3B82F6'),
('Computer Networks', 'CSE', 'Network protocols, security, and communication', 'CS9-CS12', '#3B82F6'),
('Software Engineering', 'CSE', 'Software development methodologies', 'CS13-CS16', '#3B82F6'),
('Operating Systems', 'CSE', 'OS concepts, system programming', 'CS17-CS19', '#3B82F6'),
('Artificial Intelligence', 'CSE', 'AI, ML, and data science', 'CS20-CS23', '#3B82F6'),
('Web Development', 'CSE', 'Frontend, backend, and full-stack development', 'CS24-CS27', '#3B82F6'),
('Cyber Security', 'CSE', 'Information security and ethical hacking', 'CS28-CS30', '#3B82F6'),

-- Information Technology
('Programming Languages', 'IT', 'Java, Python, C++, and other languages', 'IT1-IT4', '#8B5CF6'),
('System Analysis & Design', 'IT', 'System development and analysis', 'IT5-IT7', '#8B5CF6'),
('Mobile App Development', 'IT', 'Android, iOS, and cross-platform development', 'IT8-IT11', '#8B5CF6'),
('Cloud Computing', 'IT', 'AWS, Azure, and cloud technologies', 'IT12-IT15', '#8B5CF6'),
('Data Analytics', 'IT', 'Big data, analytics, and visualization', 'IT16-IT19', '#8B5CF6'),
('IT Project Management', 'IT', 'Agile, Scrum, and project methodologies', 'IT20-IT22', '#8B5CF6'),
('Enterprise Systems', 'IT', 'ERP, CRM, and business applications', 'IT23-IT25', '#8B5CF6'),

-- Electronics & Communication Engineering
('Digital Electronics', 'ECE', 'Digital circuits and logic design', 'EC1-EC4', '#F59E0B'),
('Analog Electronics', 'ECE', 'Analog circuits and amplifiers', 'EC5-EC8', '#F59E0B'),
('Communication Systems', 'ECE', 'Signal processing and communication', 'EC9-EC12', '#F59E0B'),
('Microprocessors', 'ECE', '8085, 8086, and microcontroller systems', 'EC13-EC16', '#F59E0B'),
('VLSI Design', 'ECE', 'Chip design and semiconductor technology', 'EC17-EC20', '#F59E0B'),
('Embedded Systems', 'ECE', 'Real-time systems and IoT', 'EC21-EC24', '#F59E0B'),
('Antenna & Wave Propagation', 'ECE', 'RF engineering and wireless communication', 'EC25-EC28', '#F59E0B'),

-- Electrical & Electronics Engineering
('Electrical Machines', 'EEE', 'Motors, generators, and transformers', 'EE1-EE4', '#EC4899'),
('Power Systems', 'EEE', 'Generation, transmission, and distribution', 'EE5-EE8', '#EC4899'),
('Control Systems', 'EEE', 'Automatic control and instrumentation', 'EE9-EE12', '#EC4899'),
('Power Electronics', 'EEE', 'Converters, inverters, and drives', 'EE13-EE16', '#EC4899'),
('Renewable Energy', 'EEE', 'Solar, wind, and sustainable energy', 'EE17-EE19', '#EC4899'),
('Electrical Installation', 'EEE', 'Wiring, safety, and electrical codes', 'EE20-EE22', '#EC4899'),

-- Science & Humanities
('Mathematics', 'SH', 'Calculus, algebra, and applied mathematics', 'SH1-SH8', '#06B6D4'),
('Physics', 'SH', 'Engineering physics and applied physics', 'SH9-SH15', '#06B6D4'),
('Chemistry', 'SH', 'Engineering chemistry and materials', 'SH16-SH22', '#06B6D4'),
('English Communication', 'SH', 'Technical writing and communication skills', 'SH23-SH27', '#06B6D4'),
('Engineering Graphics', 'SH', 'Technical drawing and CAD', 'SH28-SH30', '#06B6D4'),
('Environmental Science', 'SH', 'Ecology and environmental studies', 'SH31-SH33', '#06B6D4'),
('Economics & Management', 'SH', 'Engineering economics and management', 'SH34-SH35', '#06B6D4');

-- 3. LIBRARY INFRASTRUCTURE TABLES

-- Study Hall Seats
CREATE TABLE study_hall_seats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    seat_number VARCHAR(10) NOT NULL,
    section VARCHAR(20) NOT NULL, -- 'Main Hall', 'Quiet Zone', 'Group Study'
    floor VARCHAR(20) DEFAULT 'Ground Floor',
    has_power_outlet BOOLEAN DEFAULT TRUE,
    has_network_access BOOLEAN DEFAULT TRUE,
    is_accessible BOOLEAN DEFAULT FALSE, -- For differently-abled students
    status ENUM('available', 'occupied', 'reserved', 'maintenance') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert study hall seats (Main Hall with 200 seats)
INSERT INTO study_hall_seats (seat_number, section, floor, has_power_outlet, has_network_access) VALUES
-- Main Study Hall (150 seats)
('MH001', 'Main Hall', 'Ground Floor', TRUE, TRUE),
('MH002', 'Main Hall', 'Ground Floor', TRUE, TRUE),
-- ... (I'll add a few examples, you can expand)
('QZ001', 'Quiet Zone', 'Ground Floor', TRUE, TRUE),
('QZ002', 'Quiet Zone', 'Ground Floor', TRUE, TRUE),
('GS001', 'Group Study', 'Ground Floor', TRUE, TRUE),
('GS002', 'Group Study', 'Ground Floor', TRUE, TRUE);

-- Computer Systems
CREATE TABLE computer_systems (
    id INT PRIMARY KEY AUTO_INCREMENT,
    system_id VARCHAR(10) UNIQUE NOT NULL,
    location VARCHAR(50) NOT NULL, -- 'Ground Floor Lab', 'Top Floor Lab'
    specifications TEXT,
    software_installed TEXT,
    status ENUM('available', 'occupied', 'reserved', 'maintenance') DEFAULT 'available',
    last_maintenance DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert computer systems
INSERT INTO computer_systems (system_id, location, specifications, software_installed) VALUES
-- Ground Floor Computer Room (Separate room)
('GF001', 'Ground Floor Computer Room', 'Intel i5, 8GB RAM, 256GB SSD', 'MS Office, Adobe Suite, Programming IDEs'),
('GF002', 'Ground Floor Computer Room', 'Intel i5, 8GB RAM, 256GB SSD', 'MS Office, Adobe Suite, Programming IDEs'),
-- Top Floor Systems (20 systems)
('TF001', 'Top Floor Computer Lab', 'Intel i7, 16GB RAM, 512GB SSD', 'Full Software Suite, CAD Software'),
('TF002', 'Top Floor Computer Lab', 'Intel i7, 16GB RAM, 512GB SSD', 'Full Software Suite, CAD Software');
-- ... (Add all 20 systems)

-- AC Study Rooms
CREATE TABLE study_rooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_number VARCHAR(10) NOT NULL,
    capacity INT NOT NULL,
    has_ac BOOLEAN DEFAULT TRUE,
    has_projector BOOLEAN DEFAULT FALSE,
    has_whiteboard BOOLEAN DEFAULT TRUE,
    floor VARCHAR(20),
    status ENUM('available', 'occupied', 'reserved', 'maintenance') DEFAULT 'available',
    hourly_rate DECIMAL(10,2) DEFAULT 0.00, -- If charging is needed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO study_rooms (room_number, capacity, has_ac, has_projector, has_whiteboard, floor) VALUES
('SR001', 6, TRUE, TRUE, TRUE, 'First Floor'),
('SR002', 8, TRUE, FALSE, TRUE, 'First Floor'),
('SR003', 4, TRUE, TRUE, TRUE, 'Second Floor'),
('SR004', 10, TRUE, TRUE, TRUE, 'Second Floor');

-- 4. QUESTION PAPERS ARCHIVE
CREATE TABLE question_papers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    subject_code VARCHAR(20) NOT NULL,
    subject_name VARCHAR(200) NOT NULL,
    department_code VARCHAR(10),
    semester INT NOT NULL,
    exam_type ENUM('CAT1', 'CAT2', 'Semester', 'Supplementary') NOT NULL,
    academic_year VARCHAR(10) NOT NULL, -- e.g., '2024-25'
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

-- 5. ENTRY/EXIT TRACKING SYSTEM
CREATE TABLE entry_exit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    card_id VARCHAR(50), -- Physical ID card number
    entry_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    exit_time TIMESTAMP NULL,
    entry_method ENUM('id_card', 'manual', 'mobile_app') DEFAULT 'id_card',
    scanner_location VARCHAR(50) DEFAULT 'Main Entrance',
    purpose ENUM('study', 'book_issue', 'computer_use', 'research', 'other') DEFAULT 'study',
    is_active BOOLEAN DEFAULT TRUE, -- TRUE if still inside
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user (user_id),
    INDEX idx_entry_time (entry_time),
    INDEX idx_active_sessions (is_active)
);

-- 6. BOOKING SYSTEM
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    resource_type ENUM('seat', 'computer', 'study_room') NOT NULL,
    resource_id INT NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_hours DECIMAL(3,1) COMPUTED AS (TIME_TO_SEC(TIMEDIFF(end_time, start_time)) / 3600),
    status ENUM('pending', 'confirmed', 'completed', 'cancelled', 'no_show') DEFAULT 'pending',
    booking_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_bookings (user_id),
    INDEX idx_resource_date (resource_type, resource_id, booking_date),
    INDEX idx_booking_date (booking_date)
);

-- 7. ENHANCED USERS TABLE (Update existing)
ALTER TABLE users 
ADD COLUMN card_id VARCHAR(50) UNIQUE,
ADD COLUMN google_id VARCHAR(100) UNIQUE,
ADD COLUMN profile_picture TEXT,
ADD COLUMN current_semester INT,
ADD COLUMN graduation_year YEAR,
ADD COLUMN is_inside_library BOOLEAN DEFAULT FALSE,
ADD COLUMN entry_count INT DEFAULT 0,
ADD COLUMN study_hours DECIMAL(10,1) DEFAULT 0.0,
ADD COLUMN preferred_seat_section VARCHAR(20),
ADD COLUMN notification_preferences JSON,
ADD INDEX idx_card_id (card_id),
ADD INDEX idx_google_id (google_id);

-- 8. REAL-TIME LIBRARY STATUS
CREATE TABLE library_status (
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

INSERT INTO library_status (total_capacity, current_occupancy, available_seats, available_computers, available_study_rooms) 
VALUES (200, 0, 200, 22, 4);

-- 9. ANALYTICS AND REPORTING
CREATE TABLE usage_analytics (
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

-- 10. NOTIFICATION SYSTEM
CREATE TABLE notifications (
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

-- Create views for easy data access
CREATE VIEW active_library_users AS
SELECT u.id, u.first_name, u.last_name, u.department, u.current_semester,
       eel.entry_time, eel.purpose
FROM users u
JOIN entry_exit_logs eel ON u.id = eel.user_id
WHERE eel.is_active = TRUE;

CREATE VIEW department_book_stats AS
SELECT d.name as department, d.code,
       COUNT(b.id) as total_books,
       SUM(b.available_copies) as available_copies,
       SUM(b.total_copies) as total_copies
FROM departments d
LEFT JOIN categories c ON d.code = c.department_code
LEFT JOIN books b ON c.id = b.category_id
GROUP BY d.id, d.name, d.code;

-- Sample question papers for demonstration
INSERT INTO question_papers (subject_code, subject_name, department_code, semester, exam_type, academic_year, exam_date) VALUES
('CS301', 'Data Structures and Algorithms', 'CSE', 3, 'Semester', '2024-25', '2024-12-15'),
('MA101', 'Engineering Mathematics-I', 'SH', 1, 'Semester', '2024-25', '2024-12-10'),
('ME201', 'Strength of Materials', 'MECH', 2, 'CAT1', '2024-25', '2024-10-15'),
('EC401', 'Digital Signal Processing', 'ECE', 4, 'Semester', '2024-25', '2024-12-20');

SHOW TABLES;