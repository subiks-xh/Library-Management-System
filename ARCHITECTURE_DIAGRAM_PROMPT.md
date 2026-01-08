# Architecture Diagram Generation Prompt for Tamil Nadu College Library Management System

## PROMPT FOR AI ARCHITECTURE DIAGRAM GENERATOR:

Create a comprehensive system architecture diagram for a "Tamil Nadu College Library Management System" following this specification:

### SYSTEM OVERVIEW:
- **Project Type**: Full-stack web application for college library management
- **Target Users**: Engineering students, librarians, administrators across 7 departments (MECH, CIVIL, CSE, IT, ECE, EEE, SH)
- **Core Purpose**: Digital transformation of traditional college library operations with modern features

### FRONTEND LAYER:
**Web Application (React.js)**
- Component: "React Frontend App" 
- Technologies: React.js, Tailwind CSS, React Router
- Features: Student portal, librarian dashboard, admin panel
- Authentication UI: Google OAuth, ID card scanning, traditional login
- Pages: Book search, computer booking, question papers, analytics dashboard

**Mobile Responsive Interface**
- Component: "Mobile Web App"
- Same React frontend optimized for mobile devices
- QR code scanning capability
- Push notification support

### BACKEND API LAYER:
**Main Backend Server (Node.js)**
- Component: "Node.js + Express.js API Server"
- Port: 5001
- Technologies: Express.js, Node.js, JWT, bcrypt
- Middleware: Helmet, CORS, Rate Limiting, Compression

**API Endpoints Structure:**
- **Public APIs**: `/api/auth` (login, register, Google OAuth)
- **Private APIs**: `/api/books`, `/api/users`, `/api/bookings`, `/api/question-papers`, `/api/dashboard`, `/api/card-auth`, `/api/real-time`

### DATABASE LAYER:
**Primary Database (MySQL)**
- Component: "MySQL Database"
- Tables: 14 interconnected tables
- Key Tables: users, books, departments, bookings, study_hall_seats, computer_systems, question_papers, user_activity
- Connection: MySQL2 with connection pooling

### AUTHENTICATION SYSTEM:
**Multi-Modal Authentication Hub**
- Component: "Authentication Services"
- **Google OAuth 2.0**: Integration with Google APIs
- **ID Card Scanning**: NFC/RFID card reader integration
- **JWT Tokens**: Secure session management
- **Manual Login**: Traditional username/password fallback

### FILE MANAGEMENT:
**Document Storage System**
- Component: "File Storage Service"
- Technology: Multer for file uploads
- Storage: Local filesystem for PDFs
- Path: `/backend/uploads/question-papers/`
- Security: PDF-only, 10MB limit, virus scanning

### THIRD-PARTY INTEGRATIONS:
**Google Services**
- Google OAuth 2.0 API
- Gmail integration for notifications
- Google Drive (future integration)

**Hardware Integration**
- ID Card Scanners (NFC/RFID readers)
- Barcode scanners for books
- QR code generators

### CORE MODULES & PACKAGES:

**Backend Dependencies:**
- express: Web framework
- mysql2: Database connection
- jsonwebtoken: JWT authentication
- bcryptjs: Password hashing
- multer: File uploads
- google-auth-library: Google OAuth
- express-validator: Input validation
- helmet: Security headers
- cors: Cross-origin requests
- compression: Response compression
- express-rate-limit: API rate limiting
- winston: Logging system
- dotenv: Environment configuration

**Frontend Dependencies:**
- react: Frontend framework
- react-router-dom: Client-side routing
- tailwindcss: CSS framework
- axios: HTTP client
- react-query: Data fetching
- react-hook-form: Form handling
- chart.js: Analytics charts
- qr-scanner: QR code scanning
- react-pdf: PDF viewing

### KEY FEATURES TO SHOW:

**Book Management Module**
- Search, issue, return, renew books
- Department-wise categorization
- Real-time availability tracking

**Computer Lab Booking System**
- Advance reservation system
- Real-time availability
- Conflict prevention
- 22 computer systems across 2 labs

**Question Papers Archive**
- PDF upload/download system
- Department and semester organization
- Search and filter capabilities
- Download analytics

**Real-Time Dashboard**
- Live occupancy monitoring
- Usage analytics and reports
- Peak hours analysis
- Department-wise statistics

**User Activity Tracking**
- Entry/exit logging
- Booking history
- Usage patterns
- Performance metrics

### SECURITY FEATURES:
- Rate limiting (100 requests/15min)
- Input validation and sanitization
- File upload security (PDF only)
- JWT token expiry management
- CORS protection
- Security headers (Helmet)
- Password hashing (bcrypt)

### INFRASTRUCTURE COMPONENTS:
**College-Specific Resources:**
- 200+ Study hall seats (mapped by section and floor)
- 22 Computer systems (with specifications)
- 7 Engineering departments with dedicated resources
- Digital question papers archive
- User activity monitoring system

### DEPLOYMENT ENVIRONMENT:
- **Development**: Local development server
- **Production**: College server infrastructure
- **Port Configuration**: Backend (5001), Frontend (3000)
- **Database**: MySQL server
- **File Storage**: Local filesystem with backup strategy

### VISUAL STYLE REQUIREMENTS:
- Use Tamil Nadu college theme colors (Light Neon Green #22c55e as primary)
- Clean, modern architecture layout similar to the EdTech sample
- Show data flow between components
- Include icons for different technologies
- Group related components in logical sections
- Show both frontend and backend clearly
- Include database schema representation
- Display third-party integrations prominently

### DIAGRAM LAYOUT STRUCTURE:
1. **Top Layer**: User interfaces (Web + Mobile)
2. **API Layer**: Backend services and endpoints
3. **Business Logic**: Core modules and features
4. **Data Layer**: Database and file storage
5. **Integration Layer**: Third-party services and hardware
6. **Infrastructure**: Deployment and security components

Create a professional, comprehensive architecture diagram that clearly shows all these components, their relationships, technologies used, and data flow for the Tamil Nadu College Library Management System.