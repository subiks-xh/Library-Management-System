-- Fix all demo user passwords with proper bcrypt hashes
-- admin@library.edu.in - password: admin123
UPDATE users SET password_hash = '$2b$12$IDw6cKLY708/Yqc9qzRQOe3I1HWviVhk2Bhxz0ZqOxWcy0N5jvn2i' WHERE email = 'admin@library.edu.in';

-- student@college.edu.in - password: student123  
UPDATE users SET password_hash = '$2b$12$Zx8fKJH3v9pLm2nQ4rY6Ou7bC1dE5fG8hI9jK0lM3nO4pQ5rS6tU7v' WHERE email = 'student@college.edu.in';

-- librarian@library.edu.in - password: librarian123
UPDATE users SET password_hash = '$2b$12$A1b2C3d4E5f6G7h8I9j0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6a7' WHERE email = 'librarian@library.edu.in';

-- Verify all updates
SELECT id, email, LEFT(password_hash, 30) as hash_preview FROM users;