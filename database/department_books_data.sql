-- Department-specific Books Data for Tamil Nadu College Library
-- Comprehensive book collection for all engineering departments

USE tn_college_library_enhanced;

-- Enhanced books table with department-specific content
INSERT INTO books (accession_number, title, author, isbn, category_id, department, publisher, published_year, edition, pages, shelf_number, total_copies, available_copies, price) VALUES

-- MECHANICAL ENGINEERING BOOKS
('ME-TH-001', 'Engineering Thermodynamics', 'P.K. Nag', '9780073398198', 1, 'MECH', 'McGraw Hill Education', 2023, '6th Edition', 850, 'M1-A01', 15, 12, 995.00),
('ME-TH-002', 'Heat and Mass Transfer', 'Incropera & DeWitt', '9781118137253', 1, 'MECH', 'Wiley', 2022, '8th Edition', 992, 'M1-A02', 20, 15, 1250.00),
('ME-MD-001', 'Machine Design', 'R.S. Khurmi', '9788121925235', 2, 'MECH', 'S. Chand Publishing', 2023, '15th Edition', 1200, 'M4-B01', 25, 20, 875.00),
('ME-MD-002', 'Design of Machine Elements', 'V.B. Bhandari', '9781259006623', 2, 'MECH', 'McGraw Hill', 2022, '4th Edition', 950, 'M4-B02', 18, 14, 1125.00),
('ME-MFG-001', 'Manufacturing Technology', 'P.N. Rao', '9781259006272', 3, 'MECH', 'McGraw Hill Education', 2023, '4th Edition', 780, 'M8-C01', 22, 18, 825.00),
('ME-MFG-002', 'Production Technology', 'R.K. Jain', '9788174091464', 3, 'MECH', 'Khanna Publishers', 2022, '17th Edition', 1100, 'M8-C02', 16, 12, 750.00),
('ME-FM-001', 'Fluid Mechanics', 'Frank M. White', '9781259696534', 4, 'MECH', 'McGraw Hill', 2023, '8th Edition', 864, 'M13-D01', 20, 16, 1195.00),
('ME-SOM-001', 'Strength of Materials', 'R.K. Bansal', '9789386173041', 5, 'MECH', 'Laxmi Publications', 2023, '6th Edition', 950, 'M16-E01', 25, 20, 695.00),
('ME-AUTO-001', 'Automotive Engineering', 'Kirpal Singh', '9788121924986', 6, 'MECH', 'Standard Publishers', 2022, '13th Edition', 1050, 'M19-F01', 12, 8, 825.00),

-- CIVIL ENGINEERING BOOKS
('CE-STR-001', 'Reinforced Concrete Design', 'S.N. Sinha', '9780071077989', 8, 'CIVIL', 'McGraw Hill', 2023, '5th Edition', 890, 'C1-A01', 20, 15, 1150.00),
('CE-STR-002', 'Steel Structure Design', 'S.K. Duggal', '9780071070713', 8, 'CIVIL', 'McGraw Hill', 2022, '4th Edition', 750, 'C1-A02', 15, 12, 925.00),
('CE-GEO-001', 'Soil Mechanics and Foundation', 'B.C. Punmia', '9789386173553', 9, 'CIVIL', 'Laxmi Publications', 2023, '16th Edition', 850, 'C5-B01', 18, 14, 795.00),
('CE-TRANS-001', 'Traffic and Highway Engineering', 'Garber & Hoel', '9781133605157', 10, 'CIVIL', 'Cengage Learning', 2022, '5th Edition', 920, 'C8-C01', 12, 9, 1295.00),
('CE-WR-001', 'Irrigation and Water Resources', 'B.C. Punmia', '9789386173584', 11, 'CIVIL', 'Laxmi Publications', 2023, '18th Edition', 1100, 'C11-D01', 16, 12, 875.00),
('CE-ENV-001', 'Environmental Engineering', 'Peavy & Rowe', '9780071125529', 12, 'CIVIL', 'McGraw Hill', 2022, '3rd Edition', 720, 'C14-E01', 14, 11, 1050.00),

-- COMPUTER SCIENCE ENGINEERING BOOKS
('CS-DS-001', 'Data Structures and Algorithms in Java', 'Robert Lafore', '9788131759745', 14, 'CSE', 'Pearson Education', 2023, '2nd Edition', 800, 'CS1-A01', 30, 25, 795.00),
('CS-DS-002', 'Introduction to Algorithms', 'Cormen, Leiserson, Rivest', '9780262033848', 14, 'CSE', 'MIT Press', 2022, '4th Edition', 1312, 'CS1-A02', 25, 20, 1850.00),
('CS-DB-001', 'Database System Concepts', 'Silberschatz & Korth', '9781259054228', 15, 'CSE', 'McGraw Hill', 2023, '7th Edition', 1376, 'CS6-B01', 22, 18, 1295.00),
('CS-CN-001', 'Computer Networks', 'Andrew Tanenbaum', '9789332518742', 16, 'CSE', 'Pearson', 2022, '5th Edition', 960, 'CS9-C01', 20, 15, 1125.00),
('CS-SE-001', 'Software Engineering', 'Ian Sommerville', '9789353063207', 17, 'CSE', 'Pearson', 2023, '10th Edition', 816, 'CS13-D01', 18, 14, 1050.00),
('CS-OS-001', 'Operating System Concepts', 'Galvin & Gagne', '9781119320913', 18, 'CSE', 'Wiley', 2022, '10th Edition', 944, 'CS17-E01', 25, 20, 1195.00),
('CS-AI-001', 'Artificial Intelligence', 'Stuart Russell', '9789332543515', 19, 'CSE', 'Pearson', 2023, '4th Edition', 1152, 'CS20-F01', 15, 12, 1495.00),
('CS-WEB-001', 'Full Stack Web Development', 'John Duckett', '9781118907443', 20, 'CSE', 'Wiley', 2022, '1st Edition', 640, 'CS24-G01', 20, 16, 895.00),

-- INFORMATION TECHNOLOGY BOOKS
('IT-PROG-001', 'Java: The Complete Reference', 'Herbert Schildt', '9781260463729', 22, 'IT', 'McGraw Hill', 2023, '12th Edition', 1248, 'IT1-A01', 25, 20, 1095.00),
('IT-PROG-002', 'Python Programming', 'John Zelle', '9781590282755', 22, 'IT', 'Franklin Beedle', 2022, '3rd Edition', 550, 'IT1-A02', 30, 25, 695.00),
('IT-SYS-001', 'Systems Analysis and Design', 'Dennis & Wixom', '9781119496557', 23, 'IT', 'Wiley', 2023, '6th Edition', 720, 'IT5-B01', 18, 14, 1125.00),
('IT-MOBILE-001', 'Android Application Development', 'Reto Meier', '9781119290384', 24, 'IT', 'Wrox', 2022, '4th Edition', 912, 'IT8-C01', 15, 12, 1250.00),
('IT-CLOUD-001', 'Cloud Computing Concepts', 'Anthony T. Velte', '9781260440195', 25, 'IT', 'McGraw Hill', 2023, '3rd Edition', 450, 'IT12-D01', 12, 9, 925.00),
('IT-DATA-001', 'Big Data Analytics', 'Seema Acharya', '9789386850935', 26, 'IT', 'McGraw Hill', 2022, '2nd Edition', 680, 'IT16-E01', 16, 13, 795.00),

-- ELECTRONICS & COMMUNICATION ENGINEERING BOOKS
('EC-DE-001', 'Digital Design', 'Morris Mano', '9789332575905', 29, 'ECE', 'Pearson', 2023, '6th Edition', 688, 'EC1-A01', 22, 18, 895.00),
('EC-AE-001', 'Electronic Devices and Circuit Theory', 'Boylestad & Nashelsky', '9789332582279', 30, 'ECE', 'Pearson', 2022, '11th Edition', 928, 'EC5-B01', 20, 16, 1125.00),
('EC-CS-001', 'Communication Systems', 'Simon Haykin', '9781118147392', 31, 'ECE', 'Wiley', 2023, '5th Edition', 832, 'EC9-C01', 18, 14, 1295.00),
('EC-MP-001', 'Microprocessor and Interfacing', 'Douglas Hall', '9781259254529', 32, 'ECE', 'McGraw Hill', 2022, '3rd Edition', 720, 'EC13-D01', 25, 20, 875.00),
('EC-VLSI-001', 'CMOS VLSI Design', 'Neil Weste', '9789332570344', 33, 'ECE', 'Pearson', 2023, '4th Edition', 840, 'EC17-E01', 12, 8, 1495.00),
('EC-EMB-001', 'Embedded Systems Design', 'Peter Marwedel', '9783319560458', 34, 'ECE', 'Springer', 2022, '3rd Edition', 400, 'EC21-F01', 15, 12, 1195.00),

-- ELECTRICAL & ELECTRONICS ENGINEERING BOOKS
('EE-EM-001', 'Electric Machinery', 'A.E. Fitzgerald', '9780073380469', 36, 'EEE', 'McGraw Hill', 2023, '7th Edition', 736, 'EE1-A01', 20, 15, 1250.00),
('EE-PS-001', 'Power System Analysis', 'John Grainger', '9780070612938', 37, 'EEE', 'McGraw Hill', 2022, '2nd Edition', 880, 'EE5-B01', 18, 14, 1175.00),
('EE-CS-001', 'Modern Control Engineering', 'Katsuhiko Ogata', '9789332550162', 38, 'EEE', 'Pearson', 2023, '5th Edition', 912, 'EE9-C01', 22, 18, 1095.00),
('EE-PE-001', 'Power Electronics', 'Ned Mohan', '9781118993545', 39, 'EEE', 'Wiley', 2022, '1st Edition', 368, 'EE13-D01', 16, 12, 925.00),
('EE-RE-001', 'Solar Photovoltaic Technology', 'Chetan Singh Solanki', '9788120348738', 40, 'EEE', 'PHI Learning', 2023, '2nd Edition', 450, 'EE17-E01', 14, 11, 695.00),

-- SCIENCE & HUMANITIES BOOKS
('SH-MATH-001', 'Higher Engineering Mathematics', 'B.S. Grewal', '9788174091895', 42, 'SH', 'Khanna Publishers', 2023, '44th Edition', 1250, 'SH1-A01', 40, 35, 795.00),
('SH-MATH-002', 'Advanced Engineering Mathematics', 'Erwin Kreyszig', '9781119455868', 42, 'SH', 'Wiley', 2022, '10th Edition', 1312, 'SH1-A02', 35, 30, 1195.00),
('SH-PHY-001', 'Engineering Physics', 'Gaur & Gupta', '9788173714764', 43, 'SH', 'Dhanpat Rai', 2023, '8th Edition', 850, 'SH9-B01', 30, 25, 695.00),
('SH-CHEM-001', 'Engineering Chemistry', 'Jain & Jain', '9788173714559', 44, 'SH', 'Dhanpat Rai', 2022, '16th Edition', 650, 'SH16-C01', 28, 22, 595.00),
('SH-ENG-001', 'Technical Communication', 'Meenakshi Raman', '9780199489848', 45, 'SH', 'Oxford University Press', 2023, '2nd Edition', 420, 'SH23-D01', 25, 20, 495.00),
('SH-GRAPH-001', 'Engineering Graphics', 'K.R. Gopalakrishna', '9788187819806', 46, 'SH', 'Subhas Stores', 2022, '46th Edition', 480, 'SH28-E01', 30, 25, 395.00),

-- REFERENCE AND GENERAL BOOKS
('REF-HAND-001', 'Engineering Handbook', 'Richard C. Dorf', '9781138552739', NULL, 'GENERAL', 'CRC Press', 2023, '3rd Edition', 3000, 'REF-001', 5, 5, 2495.00),
('REF-DICT-001', 'Technical Dictionary', 'McGraw Hill', '9789352605316', NULL, 'GENERAL', 'McGraw Hill', 2022, '5th Edition', 1500, 'REF-002', 10, 10, 1295.00);

-- Update the books count in existing categories
UPDATE categories SET description = CONCAT(description, ' - ', (SELECT COUNT(*) FROM books WHERE category_id = categories.id), ' books available') WHERE department_code IS NOT NULL;

-- Sample issued books data
INSERT INTO issued_books (student_id, book_id, issue_date, due_date, fine_amount, status, notes) VALUES
(1, 1, CURDATE() - INTERVAL 5 DAY, CURDATE() + INTERVAL 9 DAY, 0.00, 'issued', 'Regular issue'),
(1, 15, CURDATE() - INTERVAL 3 DAY, CURDATE() + INTERVAL 11 DAY, 0.00, 'issued', 'CSE textbook'),
(2, 8, CURDATE() - INTERVAL 7 DAY, CURDATE() + INTERVAL 7 DAY, 0.00, 'issued', 'MECH reference'),
(3, 22, CURDATE() - INTERVAL 2 DAY, CURDATE() + INTERVAL 12 DAY, 0.00, 'issued', 'IT programming book'),
(4, 35, CURDATE() - INTERVAL 10 DAY, CURDATE() + INTERVAL 4 DAY, 0.00, 'issued', 'ECE textbook'),
(5, 42, CURDATE() - INTERVAL 1 DAY, CURDATE() + INTERVAL 13 DAY, 0.00, 'issued', 'Mathematics reference');

-- Update book availability after issues
UPDATE books SET available_copies = available_copies - 1 WHERE id IN (1, 15, 8, 22, 35, 42);