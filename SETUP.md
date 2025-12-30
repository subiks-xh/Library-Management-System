# 🚀 Enhanced College Library Management System - Setup Guide

## 📋 Prerequisites

- **Node.js**: Version 16.0.0 or higher
- **MySQL**: Version 8.0 or higher
- **npm**: Version 8.0.0 or higher
- **Google Cloud Console**: For Google OAuth (optional)

## ⚡ Quick Start

### 1. Database Setup

```sql
-- Create the enhanced database
mysql -u root -p < database/enhanced_college_schema.sql

-- Add department-specific books data
mysql -u root -p < database/department_books_data.sql

-- Add sample data (optional)
mysql -u root -p < database/sample_data.sql
```

### 2. Backend Configuration

```bash
cd backend/

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Configure environment variables
nano .env
```

#### Environment Variables (.env)

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=tn_college_library_enhanced

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_EXPIRES_IN=24h

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Server Configuration
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# File Upload
MAX_FILE_SIZE=10485760
```

### 3. Start Backend Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server will run on: http://localhost:5001

### 4. Frontend Setup (when ready)

```bash
cd frontend/

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will run on: http://localhost:3000

## 🔧 Hardware Integration

### ID Card Scanner Setup

The system supports hardware ID card scanners that can send HTTP requests:

```javascript
// Scanner Configuration
const scannerConfig = {
  endpoint: 'http://localhost:5001/api/card-auth/scan-card',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

// Sample scanner payload
{
  "cardId": "TN12345678",
  "scannerId": "MAIN_ENTRANCE",
  "purpose": "study"
}
```

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)
6. Copy Client ID to environment variables

## 📊 API Endpoints Overview

### Authentication

- `POST /api/card-auth/scan-card` - ID card scanning
- `POST /api/card-auth/google-auth` - Google OAuth
- `POST /api/card-auth/link-card` - Link card to account

### Resource Booking

- `GET /api/bookings` - List all bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/user/:userId` - User's bookings
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Question Papers

- `POST /api/question-papers/upload` - Upload paper (PDF)
- `GET /api/question-papers/search` - Search papers
- `GET /api/question-papers/download/:id` - Download paper
- `GET /api/question-papers/department/:dept/semester/:sem` - By department

### Real-time Dashboard

- `GET /api/real-time/real-time` - Live library status
- `GET /api/real-time/enhanced-stats` - Comprehensive analytics
- `GET /api/real-time/utilization` - Resource utilization
- `POST /api/real-time/update-status` - Update library status

## 🏗️ Database Structure

### Core Tables

- `departments` - Engineering departments
- `categories` - Department-specific book categories
- `books` - Enhanced book records with shelf locations
- `users` - Extended user profiles with card IDs
- `issued_books` - Book lending records

### Infrastructure Tables

- `study_hall_seats` - 200+ seats with specifications
- `computer_systems` - 22 computer systems
- `study_rooms` - 4 AC study rooms
- `bookings` - Resource reservation system

### Tracking Tables

- `entry_exit_logs` - Real-time entry/exit tracking
- `question_papers` - Digital archive with file management
- `usage_analytics` - Daily usage statistics
- `library_status` - Real-time capacity tracking
- `notifications` - System alerts and reminders

## 🎯 Configuration Options

### Department Customization

Modify departments in `database/enhanced_college_schema.sql`:

```sql
INSERT INTO departments (code, name, full_name, floor_location, shelf_range) VALUES
('CUSTOM', 'Custom Department', 'Department of Custom Engineering', 'Floor Location', 'CUST1-CUST20');
```

### Resource Configuration

Update capacity in `library_status` table:

```sql
UPDATE library_status SET
  total_capacity = 300,  -- Adjust total seats
  available_computers = 30,  -- Update computer count
  available_study_rooms = 6;  -- Modify room count
```

### Fine Structure

Modify in application or database triggers:

```sql
-- Current: ₹1 per day
-- Modify in application logic or database triggers
UPDATE books SET fine_per_day = 2.00;  -- ₹2 per day
```

## 🔐 Security Configuration

### JWT Security

- Use strong, unique JWT secrets
- Set appropriate expiration times
- Implement token refresh mechanism

### Database Security

- Use dedicated database user with minimal privileges
- Enable SSL connections
- Regular database backups

### File Upload Security

- PDF-only restriction for question papers
- File size limits (10MB default)
- Virus scanning (recommended)
- Secure file storage location

## 📱 Testing the System

### Health Check

```bash
curl http://localhost:5001/health
```

### Test Card Scanning

```bash
curl -X POST http://localhost:5001/api/card-auth/scan-card \
  -H "Content-Type: application/json" \
  -d '{"cardId":"TEST123456","purpose":"study"}'
```

### Test Booking System

```bash
curl -X POST http://localhost:5001/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "resourceType": "seat",
    "resourceId": 1,
    "bookingDate": "2024-12-20",
    "startTime": "10:00",
    "endTime": "12:00"
  }'
```

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Test MySQL connection
mysql -u root -p -e "SHOW DATABASES;"

# Check if tables exist
mysql -u root -p tn_college_library_enhanced -e "SHOW TABLES;"
```

### Port Conflicts

```bash
# Check if port 5001 is in use
lsof -i :5001

# Kill process if needed
kill -9 <PID>
```

### File Upload Issues

```bash
# Check uploads directory permissions
ls -la backend/uploads/question-papers/

# Create if missing
mkdir -p backend/uploads/question-papers/
chmod 755 backend/uploads/question-papers/
```

## 📞 Support

For issues and questions:

1. Check logs: `backend/logs/`
2. Review database error logs
3. Test API endpoints with Postman
4. Verify environment configuration

## 🚀 Production Deployment

### Environment Setup

- Use production database credentials
- Enable HTTPS with SSL certificates
- Configure reverse proxy (Nginx/Apache)
- Set up process manager (PM2)
- Enable database SSL connections
- Configure backup strategies

### Performance Optimization

- Enable database query caching
- Implement Redis for session storage
- Configure CDN for static assets
- Enable gzip compression
- Monitor with application metrics

---

**🎓 Your Enhanced Tamil Nadu College Library Management System is ready to transform your library operations!**
