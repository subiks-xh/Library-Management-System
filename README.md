# 📚 College Library Management System

## 🎓 Tamil Nadu College Library Management System

A complete, modern library management system designed specifically for Tamil Nadu colleges (Government & Private).

### 🔧 Tech Stack

- **Frontend**: React.js + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MySQL
- **Authentication**: JWT (Phase 2)

### 🎨 UI Design Theme

- **Primary**: Light Neon Green (#22c55e, #16a34a)
- **Secondary**: Dark Charcoal (#1f2937), White (#ffffff)
- **Accent**: Muted Gray (#6b7280)
- **Style**: Modern, minimalistic, clean dashboards

### 📋 Core Features (Phase 1 - No Auth)

1. **Dashboard** - Overview of library statistics
2. **Book Management** - Add, update, delete books
3. **Category Management** - Organize books by categories
4. **Student Management** - Manage student records
5. **Issue Books** - Issue books to students (max 2-3 per student)
6. **Return Books** - Handle returns with auto fine calculation
7. **Reports** - Generate various library reports

### 🏛️ Tamil Nadu College Specific Rules

- Manual issue/return by librarian
- Register Number as primary student ID
- 14-day borrowing period
- ₹1 per day fine for overdue books
- Department-wise categorization

### 📁 Project Structure

```
libms/
├── backend/          # Node.js + Express API
├── frontend/         # React.js application
├── database/         # MySQL schema & data
└── docs/            # Documentation & wireframes
```

### 🚀 Development Phases

**Phase 1**: Core Library System (NO AUTH)

- All functionality without login
- Focus on UI, data flow, and core features

**Phase 2**: Authentication & Role Protection

- Admin & Student login systems
- JWT-based authentication
- Role-based access control

### 🎯 Target Users

- **Librarians**: Full access to all features
- **Students**: View books, check issued books, view fines
- **Admin**: System configuration and reports

---

**Built for Tamil Nadu College Libraries** 🏫
