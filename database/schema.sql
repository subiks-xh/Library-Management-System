# 📊 Database Schema Design
## Tamil Nadu College Library Management System

### 🗄️ Database: MySQL

### 📋 Core Tables

#### 1. categories
```sql
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sample Data
INSERT INTO categories (name, description) VALUES 
('Textbooks', 'Academic textbooks for various subjects'),
('Reference Books', 'Reference materials and encyclopedias'),
('Journals', 'Academic journals and periodicals'),
('Project Reports', 'Student project reports and dissertations'),
('Fiction', 'Fiction books and novels'),
('Non-Fiction', 'Non-fiction books and biographies');
```

#### 2. books
```sql
CREATE TABLE books (
    id INT PRIMARY KEY AUTO_INCREMENT,
    accession_number VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(13),
    category_id INT,
    department VARCHAR(100),
    publisher VARCHAR(255),
    published_year YEAR,
    edition VARCHAR(50),
    pages INT,
    shelf_number VARCHAR(20),
    total_copies INT DEFAULT 1,
    available_copies INT DEFAULT 1,
    price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_accession (accession_number),
    INDEX idx_title (title),
    INDEX idx_author (author),
    INDEX idx_category (category_id)
);

-- Sample Data
INSERT INTO books VALUES 
(1, 'B001', 'Web Development Fundamentals', 'John Smith', '9781234567890', 1, 'Computer Science', 'Tech Publications', 2023, '2nd Edition', 450, 'CS-101-A', 3, 3, 750.00, NOW(), NOW()),
(2, 'B002', 'Data Structures and Algorithms', 'Jane Doe', '9781234567891', 1, 'Computer Science', 'Academic Press', 2022, '3rd Edition', 600, 'CS-102-B', 5, 4, 850.00, NOW(), NOW()),
(3, 'B003', 'Digital Electronics', 'Robert Brown', '9781234567892', 1, 'Electronics', 'Engineering Books', 2023, '1st Edition', 400, 'EC-201-A', 2, 2, 650.00, NOW(), NOW());
```

#### 3. students
```sql
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    register_number VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(15),
    address TEXT,
    status ENUM('active', 'inactive', 'graduated') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_register_number (register_number),
    INDEX idx_department (department),
    INDEX idx_year (year)
);

-- Sample Data
INSERT INTO students VALUES 
(1, '19IT001', 'Arun Kumar', 'Information Technology', 4, 'arun.kumar@college.edu', '9876543210', 'Chennai, Tamil Nadu', 'active', NOW(), NOW()),
(2, '20CS015', 'Priya Sharma', 'Computer Science', 3, 'priya.sharma@college.edu', '9876543211', 'Coimbatore, Tamil Nadu', 'active', NOW(), NOW()),
(3, '21EC025', 'Rajesh Patel', 'Electronics', 2, 'rajesh.patel@college.edu', '9876543212', 'Madurai, Tamil Nadu', 'active', NOW(), NOW()),
(4, '18ME010', 'Kavitha Rajan', 'Mechanical Engineering', 4, 'kavitha.rajan@college.edu', '9876543213', 'Salem, Tamil Nadu', 'active', NOW(), NOW());
```

#### 4. issued_books
```sql
CREATE TABLE issued_books (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    book_id INT NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE NULL,
    fine_amount DECIMAL(10,2) DEFAULT 0.00,
    status ENUM('issued', 'returned', 'overdue') DEFAULT 'issued',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    INDEX idx_student (student_id),
    INDEX idx_book (book_id),
    INDEX idx_issue_date (issue_date),
    INDEX idx_due_date (due_date),
    INDEX idx_status (status)
);

-- Sample Data
INSERT INTO issued_books VALUES 
(1, 1, 2, '2024-12-01', '2024-12-15', NULL, 0.00, 'issued', 'Data Structures book issued', NOW(), NOW()),
(2, 2, 1, '2024-12-10', '2024-12-24', NULL, 0.00, 'issued', 'Web Development book issued', NOW(), NOW()),
(3, 3, 3, '2024-11-20', '2024-12-04', '2024-12-06', 2.00, 'returned', 'Returned 2 days late', NOW(), NOW());
```

#### 5. fines
```sql
CREATE TABLE fines (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    issued_book_id INT NOT NULL,
    fine_amount DECIMAL(10,2) NOT NULL,
    reason VARCHAR(255) NOT NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0.00,
    paid_date DATE NULL,
    status ENUM('pending', 'paid', 'waived') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (issued_book_id) REFERENCES issued_books(id) ON DELETE CASCADE,
    INDEX idx_student (student_id),
    INDEX idx_status (status)
);

-- Sample Data
INSERT INTO fines VALUES 
(1, 3, 3, 2.00, 'Late return - 2 days overdue', 2.00, '2024-12-06', 'paid', NOW(), NOW());
```

#### 6. library_settings
```sql
CREATE TABLE library_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sample Data
INSERT INTO library_settings VALUES 
(1, 'max_books_per_student', '3', 'Maximum number of books a student can issue at once', NOW(), NOW()),
(2, 'issue_duration_days', '14', 'Number of days a book can be issued', NOW(), NOW()),
(3, 'fine_per_day', '1.00', 'Fine amount per day for overdue books (in Rupees)', NOW(), NOW()),
(4, 'library_name', 'Sri Venkateswara College of Engineering Library', 'Official library name', NOW(), NOW()),
(5, 'library_address', 'Sriperumbudur, Tamil Nadu - 602117', 'Library address', NOW(), NOW());
```

### 🔗 Table Relationships

```
categories (1) ←→ (many) books
students (1) ←→ (many) issued_books
books (1) ←→ (many) issued_books
issued_books (1) ←→ (1) fines
```

### 📊 Key Indexes for Performance

```sql
-- Composite indexes for common queries
CREATE INDEX idx_books_category_dept ON books(category_id, department);
CREATE INDEX idx_issued_status_due ON issued_books(status, due_date);
CREATE INDEX idx_student_year_dept ON students(year, department);
```

### 🔍 Common Queries

#### Find Available Books
```sql
SELECT b.*, c.name as category_name 
FROM books b 
LEFT JOIN categories c ON b.category_id = c.id 
WHERE b.available_copies > 0;
```

#### Get Student's Currently Issued Books
```sql
SELECT b.title, b.author, ib.issue_date, ib.due_date,
       CASE WHEN ib.due_date < CURDATE() THEN 'Overdue' ELSE 'Active' END as status
FROM issued_books ib
JOIN books b ON ib.book_id = b.id
JOIN students s ON ib.student_id = s.id
WHERE s.register_number = '19IT001' AND ib.status = 'issued';
```

#### Calculate Overdue Books with Fines
```sql
SELECT s.register_number, s.name, b.title, ib.due_date,
       DATEDIFF(CURDATE(), ib.due_date) as days_overdue,
       DATEDIFF(CURDATE(), ib.due_date) * 1.00 as fine_amount
FROM issued_books ib
JOIN students s ON ib.student_id = s.id
JOIN books b ON ib.book_id = b.id
WHERE ib.status = 'issued' AND ib.due_date < CURDATE();
```

#### Dashboard Statistics
```sql
-- Total books
SELECT COUNT(*) as total_books, SUM(total_copies) as total_copies FROM books;

-- Currently issued books
SELECT COUNT(*) as issued_books FROM issued_books WHERE status = 'issued';

-- Overdue books
SELECT COUNT(*) as overdue_books FROM issued_books 
WHERE status = 'issued' AND due_date < CURDATE();

-- Total fines collected
SELECT SUM(paid_amount) as total_fines FROM fines WHERE status = 'paid';
```

### 🛡️ Data Validation Rules

1. **Register Number Format**: Follow Tamil Nadu pattern (e.g., 19IT001, 20CS015)
2. **Book Availability**: `available_copies` cannot exceed `total_copies`
3. **Issue Limits**: Students cannot issue more than `max_books_per_student`
4. **Date Validation**: `due_date` must be after `issue_date`
5. **Fine Calculation**: Auto-calculate based on overdue days

### 📈 Performance Considerations

1. **Pagination** for large datasets
2. **Proper indexing** on frequently queried columns
3. **Archival strategy** for old records
4. **Regular maintenance** for optimal performance

This schema is designed for Tamil Nadu college libraries with specific focus on:
- Register number-based student identification
- Department-wise book categorization  
- Simple fine calculation system
- Easy reporting and analytics