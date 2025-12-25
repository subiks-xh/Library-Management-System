-- Tamil Nadu College Library Management System
-- Sample Data for Testing

USE college_library;

-- Clear existing data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE fines;
TRUNCATE TABLE issued_books;
TRUNCATE TABLE students;
TRUNCATE TABLE books;
TRUNCATE TABLE categories;
TRUNCATE TABLE library_settings;
SET FOREIGN_KEY_CHECKS = 1;

-- Insert Categories
INSERT INTO categories (name, description) VALUES 
('Textbooks', 'Academic textbooks for various subjects'),
('Reference Books', 'Reference materials and encyclopedias'),
('Journals', 'Academic journals and periodicals'),
('Project Reports', 'Student project reports and dissertations'),
('Fiction', 'Fiction books and novels'),
('Non-Fiction', 'Non-fiction books and biographies');

-- Insert Books (Tamil Nadu college relevant subjects)
INSERT INTO books (accession_number, title, author, isbn, category_id, department, publisher, published_year, edition, pages, shelf_number, total_copies, available_copies, price) VALUES 

-- Computer Science Department Books
('CS001', 'Programming in C', 'E. Balagurusamy', '9788131710982', 1, 'Computer Science', 'McGraw Hill', 2023, '8th Edition', 550, 'CS-A-01', 5, 4, 450.00),
('CS002', 'Data Structures Using C++', 'Reema Thareja', '9780199452057', 1, 'Computer Science', 'Oxford University', 2022, '2nd Edition', 650, 'CS-A-02', 3, 3, 520.00),
('CS003', 'Computer Networks', 'Andrew S. Tanenbaum', '9789332518742', 1, 'Computer Science', 'Pearson', 2021, '5th Edition', 800, 'CS-B-01', 4, 2, 680.00),
('CS004', 'Database System Concepts', 'Abraham Silberschatz', '9780078022159', 1, 'Computer Science', 'McGraw Hill', 2020, '7th Edition', 750, 'CS-B-02', 3, 3, 720.00),
('CS005', 'Operating System Concepts', 'Abraham Silberschatz', '9781118063330', 1, 'Computer Science', 'Wiley', 2022, '10th Edition', 900, 'CS-C-01', 4, 4, 850.00),

-- Information Technology Books
('IT001', 'Web Technology', 'Uttam K. Roy', '9780199456222', 1, 'Information Technology', 'Oxford University', 2023, '3rd Edition', 480, 'IT-A-01', 5, 3, 420.00),
('IT002', 'Software Engineering', 'Roger S. Pressman', '9789339219109', 1, 'Information Technology', 'McGraw Hill', 2022, '9th Edition', 950, 'IT-A-02', 3, 2, 780.00),
('IT003', 'Network Security', 'William Stallings', '9789353438678', 1, 'Information Technology', 'Pearson', 2021, '7th Edition', 750, 'IT-B-01', 2, 2, 650.00),

-- Electronics and Communication Books  
('EC001', 'Digital Electronics', 'Morris Mano', '9789332570689', 1, 'Electronics', 'Pearson', 2023, '6th Edition', 520, 'EC-A-01', 4, 4, 480.00),
('EC002', 'Communication Systems', 'Simon Haykin', '9789814126717', 1, 'Electronics', 'Wiley', 2022, '5th Edition', 680, 'EC-A-02', 3, 1, 620.00),
('EC003', 'Microprocessors and Microcontrollers', 'A.P. Godse', '9789350380581', 1, 'Electronics', 'Technical Publications', 2021, '2nd Edition', 450, 'EC-B-01', 3, 3, 380.00),

-- Mechanical Engineering Books
('ME001', 'Engineering Mechanics', 'R.S. Khurmi', '9788121925877', 1, 'Mechanical', 'S Chand', 2023, '14th Edition', 850, 'ME-A-01', 4, 4, 520.00),
('ME002', 'Thermodynamics', 'P.K. Nag', '9781259003967', 1, 'Mechanical', 'McGraw Hill', 2022, '6th Edition', 750, 'ME-A-02', 3, 2, 580.00),
('ME003', 'Manufacturing Processes', 'H.N. Gupta', '9789385935411', 1, 'Mechanical', 'New Age International', 2021, '3rd Edition', 650, 'ME-B-01', 2, 2, 450.00),

-- Reference Books
('REF001', 'Engineering Mathematics', 'B.S. Grewal', '9789353162153', 2, 'General', 'Khanna Publishers', 2023, '44th Edition', 1200, 'REF-A-01', 6, 5, 750.00),
('REF002', 'Physics for Engineers', 'M.R. Srinivasan', '9788122414523', 2, 'General', 'New Age International', 2022, '4th Edition', 680, 'REF-A-02', 4, 4, 420.00),
('REF003', 'Technical English', 'Meenakshi Raman', '9780199456833', 2, 'General', 'Oxford University', 2021, '2nd Edition', 350, 'REF-B-01', 5, 5, 320.00);

-- Insert Students (Tamil Nadu naming patterns and register numbers)
INSERT INTO students (register_number, name, department, year, email, phone, address, status) VALUES 

-- 4th Year Students (2020 batch)
('20IT001', 'Arjun Krishnamurthy', 'Information Technology', 4, 'arjun.k@college.edu.in', '9876543210', 'No.15, Anna Nagar, Chennai - 600040', 'active'),
('20CS005', 'Priya Lakshmi', 'Computer Science', 4, 'priya.l@college.edu.in', '9876543211', 'No.22, Gandhi Road, Coimbatore - 641001', 'active'),
('20EC010', 'Rajesh Kumar', 'Electronics', 4, 'rajesh.k@college.edu.in', '9876543212', 'No.8, Bharathi Street, Madurai - 625001', 'active'),
('20ME007', 'Kavitha Selvam', 'Mechanical', 4, 'kavitha.s@college.edu.in', '9876543213', 'No.12, Nehru Colony, Salem - 636001', 'active'),

-- 3rd Year Students (2021 batch)
('21IT015', 'Vikram Sundar', 'Information Technology', 3, 'vikram.s@college.edu.in', '9876543214', 'No.5, Patel Road, Trichy - 620001', 'active'),
('21CS022', 'Deepika Raman', 'Computer Science', 3, 'deepika.r@college.edu.in', '9876543215', 'No.18, Kamaraj Street, Vellore - 632001', 'active'),
('21EC018', 'Suresh Babu', 'Electronics', 3, 'suresh.b@college.edu.in', '9876543216', 'No.25, MGR Nagar, Erode - 638001', 'active'),
('21ME012', 'Meera Devi', 'Mechanical', 3, 'meera.d@college.edu.in', '9876543217', 'No.7, Tilak Road, Thanjavur - 613001', 'active'),

-- 2nd Year Students (2022 batch)
('22IT025', 'Arun Kumar', 'Information Technology', 2, 'arun.k22@college.edu.in', '9876543218', 'No.30, EVR Street, Kanchipuram - 631501', 'active'),
('22CS030', 'Sowmya Krishnan', 'Computer Science', 2, 'sowmya.k@college.edu.in', '9876543219', 'No.14, Subash Road, Tirunelveli - 627001', 'active'),

-- 1st Year Students (2023 batch)  
('23IT035', 'Karthik Raj', 'Information Technology', 1, 'karthik.r@college.edu.in', '9876543220', 'No.9, APJ Abdul Kalam Street, Thoothukudi - 628001', 'active'),
('23CS040', 'Anitha Devi', 'Computer Science', 1, 'anitha.d@college.edu.in', '9876543221', 'No.16, Karunanidhi Nagar, Cuddalore - 607001', 'active');

-- Insert Issued Books (Some current issues, some overdue for testing)
INSERT INTO issued_books (student_id, book_id, issue_date, due_date, return_date, fine_amount, status, notes) VALUES 

-- Current Issues
(1, 1, '2024-12-10', '2024-12-24', NULL, 0.00, 'issued', 'Programming in C book issued'),
(2, 6, '2024-12-12', '2024-12-26', NULL, 0.00, 'issued', 'Web Technology book issued'),
(3, 10, '2024-12-08', '2024-12-22', NULL, 0.00, 'issued', 'Communication Systems book issued'),
(4, 14, '2024-12-15', '2024-12-29', NULL, 0.00, 'issued', 'Thermodynamics book issued'),
(5, 3, '2024-12-11', '2024-12-25', NULL, 0.00, 'issued', 'Computer Networks book issued'),
(6, 7, '2024-12-09', '2024-12-23', NULL, 0.00, 'issued', 'Software Engineering book issued'),

-- Overdue Books (for fine calculation testing)
(7, 11, '2024-11-25', '2024-12-09', NULL, 0.00, 'overdue', 'Digital Electronics - overdue'),
(8, 15, '2024-11-20', '2024-12-04', NULL, 0.00, 'overdue', 'Engineering Mathematics - overdue'),

-- Returned Books (with fines)
(9, 2, '2024-11-15', '2024-11-29', '2024-12-02', 3.00, 'returned', 'Data Structures book - returned 3 days late'),
(10, 13, '2024-11-10', '2024-11-24', '2024-11-26', 2.00, 'returned', 'Microprocessors book - returned 2 days late');

-- Insert Fines
INSERT INTO fines (student_id, issued_book_id, fine_amount, reason, paid_amount, paid_date, status) VALUES 
(9, 9, 3.00, 'Late return - 3 days overdue', 3.00, '2024-12-02', 'paid'),
(10, 10, 2.00, 'Late return - 2 days overdue', 2.00, '2024-11-26', 'paid'),
(7, 7, 16.00, 'Late return - 16 days overdue', 0.00, NULL, 'pending'),
(8, 8, 21.00, 'Late return - 21 days overdue', 0.00, NULL, 'pending');

-- Insert Library Settings
INSERT INTO library_settings (setting_key, setting_value, description) VALUES 
('max_books_per_student', '3', 'Maximum number of books a student can issue simultaneously'),
('issue_duration_days', '14', 'Standard issue duration in days'),
('fine_per_day', '1.00', 'Fine amount per day for overdue books (₹)'),
('library_name', 'Sri Venkateswara College of Engineering Library', 'Official name of the library'),
('library_address', 'Sriperumbudur, Kanchipuram District, Tamil Nadu - 602117', 'Complete library address'),
('working_hours', '9:00 AM to 5:00 PM', 'Library working hours'),
('contact_phone', '044-27162462', 'Library contact phone number'),
('contact_email', 'library@svce.edu.in', 'Library contact email');

-- Update book availability after issues
UPDATE books SET available_copies = total_copies - (
    SELECT COUNT(*) FROM issued_books 
    WHERE book_id = books.id AND status = 'issued'
);

-- Create views for common queries
CREATE VIEW current_issues AS
SELECT 
    s.register_number,
    s.name as student_name,
    s.department,
    s.year,
    b.accession_number,
    b.title,
    b.author,
    ib.issue_date,
    ib.due_date,
    DATEDIFF(CURDATE(), ib.due_date) as days_overdue,
    CASE 
        WHEN ib.due_date < CURDATE() THEN 'Overdue'
        ELSE 'Active'
    END as status,
    CASE 
        WHEN ib.due_date < CURDATE() THEN DATEDIFF(CURDATE(), ib.due_date) * 1.00
        ELSE 0.00
    END as fine_amount
FROM issued_books ib
JOIN students s ON ib.student_id = s.id
JOIN books b ON ib.book_id = b.id
WHERE ib.status IN ('issued', 'overdue');

CREATE VIEW available_books AS
SELECT 
    b.id,
    b.accession_number,
    b.title,
    b.author,
    c.name as category,
    b.department,
    b.shelf_number,
    b.total_copies,
    b.available_copies,
    CASE 
        WHEN b.available_copies > 0 THEN 'Available'
        ELSE 'Not Available'
    END as availability_status
FROM books b
LEFT JOIN categories c ON b.category_id = c.id
ORDER BY b.accession_number;

-- Display sample data summary
SELECT 'Sample Data Inserted Successfully!' as message;
SELECT COUNT(*) as total_categories FROM categories;
SELECT COUNT(*) as total_books FROM books;
SELECT COUNT(*) as total_students FROM students;
SELECT COUNT(*) as current_issued_books FROM issued_books WHERE status = 'issued';
SELECT COUNT(*) as overdue_books FROM issued_books WHERE status = 'overdue';
SELECT SUM(paid_amount) as total_fines_collected FROM fines WHERE status = 'paid';