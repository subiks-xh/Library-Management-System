# 🚀 Deployment Guide

## Tamil Nadu College Library Management System

### 📋 Prerequisites

#### System Requirements

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- Git

#### Development Tools

- VS Code (recommended)
- MySQL Workbench (optional)
- Postman (for API testing)

### 🏗️ Local Development Setup

#### 1. Clone Repository

```bash
git clone https://github.com/your-username/libms.git
cd libms
```

#### 2. Database Setup

```sql
-- Create database
CREATE DATABASE college_library;
USE college_library;

-- Run schema (from /database/schema.sql)
-- Run sample data (from /database/sample_data.sql)
```

#### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your database credentials
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=college_library

# Start development server
npm run dev
```

Backend will run on: `http://localhost:5000`

#### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:3000`

### ☁️ Production Deployment

#### Option 1: Railway (Recommended for Backend)

1. **Create Railway Account**

   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend**

   ```bash
   # Install Railway CLI
   npm install -g @railway/cli

   # Login to Railway
   railway login

   # Navigate to backend folder
   cd backend

   # Deploy
   railway init
   railway up
   ```

3. **Add MySQL Database**
   - In Railway dashboard, add MySQL plugin
   - Copy connection details to environment variables

#### Option 2: Render (Alternative)

1. **Connect GitHub Repository**
2. **Create Web Service**
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
3. **Add Environment Variables**
   - Add all variables from .env.example

#### Frontend Deployment (Vercel)

1. **Connect GitHub Repository**
2. **Deploy Settings**
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. **Environment Variables**
   - Add backend API URL

#### Frontend Deployment (Netlify Alternative)

1. **Build for Production**

   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy dist folder to Netlify**

### 🔧 Environment Configuration

#### Backend (.env)

```env
NODE_ENV=production
PORT=5000
HOST=0.0.0.0

DB_HOST=your_database_host
DB_PORT=3306
DB_NAME=college_library
DB_USER=your_database_user
DB_PASSWORD=your_database_password

JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=24h

RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

#### Frontend (.env)

```env
VITE_API_BASE_URL=https://your-backend-url.railway.app/api
```

### 🗄️ Database Deployment

#### Option 1: Railway MySQL

- Automatically provisioned with Railway
- Connection string provided in environment

#### Option 2: PlanetScale (MySQL-compatible)

```bash
# Install PlanetScale CLI
# Create database
pscale database create college-library

# Import schema
pscale shell college-library main < database/schema.sql
```

#### Option 3: AWS RDS MySQL

- Create RDS MySQL instance
- Configure security groups
- Import schema and data

### 🚀 Deployment Checklist

#### Pre-deployment

- [ ] Database schema created
- [ ] Sample data imported
- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] Build successful locally

#### Backend Deployment

- [ ] Database connection working
- [ ] All API endpoints responding
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Error handling working

#### Frontend Deployment

- [ ] API endpoints connected
- [ ] All pages loading
- [ ] Charts and components working
- [ ] Mobile responsive
- [ ] Build size optimized

#### Post-deployment

- [ ] Health check endpoint working
- [ ] Database operations successful
- [ ] File uploads working (if applicable)
- [ ] Monitoring setup
- [ ] SSL certificate installed

### 🔍 Monitoring & Maintenance

#### Health Checks

- Backend: `GET /health`
- Database: Connection status
- Frontend: Page load times

#### Performance Optimization

- Enable gzip compression
- Implement caching
- Database indexing
- CDN for static assets

#### Backup Strategy

```bash
# Database backup
mysqldump -u username -p college_library > backup_$(date +%Y%m%d).sql

# Automated backups (cron job)
0 2 * * * mysqldump -u username -p college_library > /backups/college_library_$(date +\%Y\%m\%d).sql
```

### 🐛 Troubleshooting

#### Common Issues

1. **Database Connection Error**

   ```
   Solution: Check DB credentials and firewall rules
   ```

2. **CORS Error in Frontend**

   ```javascript
   // Add to backend/server.js
   app.use(
     cors({
       origin: "https://your-frontend-url.vercel.app",
       credentials: true,
     })
   );
   ```

3. **Build Errors**

   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **API Not Found (404)**
   ```
   Check: Base URL in frontend environment variables
   ```

### 📱 Mobile Deployment (Optional)

#### Progressive Web App (PWA)

- Add service worker
- Create manifest.json
- Enable offline functionality

### 🔐 Security Considerations

#### Production Security

- [ ] Environment variables secured
- [ ] Database access restricted
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] SQL injection protection
- [ ] HTTPS enforced

### 📊 Analytics & Monitoring

#### Recommended Tools

- **Backend**: Railway/Render logs
- **Database**: Query performance monitoring
- **Frontend**: Vercel analytics
- **Uptime**: UptimeRobot

### 🎓 College-Specific Setup

#### Customization for Different Colleges

1. Update library name in settings
2. Modify register number format validation
3. Adjust fine calculation rules
4. Update department lists
5. Customize email templates

#### Data Migration

```sql
-- Export from existing system
-- Transform data format
-- Import using provided SQL scripts
```

### 📞 Support & Maintenance

#### Regular Tasks

- Weekly database backup
- Monthly dependency updates
- Quarterly security audit
- Annual system review

#### Contact Information

- Technical Support: [your-email]
- Documentation: [wiki-link]
- Bug Reports: [github-issues]

---

**🎉 Your Tamil Nadu College Library Management System is ready for production!**

Access URLs:

- **Frontend**: https://your-app.vercel.app
- **Backend API**: https://your-api.railway.app
- **Health Check**: https://your-api.railway.app/health
