# 🎨 UI/UX Design Specification

## Tamil Nadu College Library Management System

### 🌈 Color Palette

#### Primary Colors

```css
/* Light Neon Green - Primary Theme */
--primary-50: #f0fdf4    /* Lightest green background */
--primary-100: #dcfce7   /* Light green cards */
--primary-500: #22c55e   /* Main green - buttons, headers */
--primary-600: #16a34a   /* Darker green - hover states */
```

#### Secondary Colors

```css
/* Dark Charcoal & Neutrals */
--gray-900: #111827      /* Dark charcoal text */
--gray-800: #1f2937      /* Secondary dark */
--gray-600: #4b5563      /* Muted text */
--gray-100: #f3f4f6      /* Light backgrounds */
--white: #ffffff         /* Pure white */
```

#### Status Colors

```css
--red-500: #ef4444       /* Overdue, errors */
--yellow-500: #f59e0b    /* Warnings, pending */
--blue-500: #3b82f6      /* Information */
```

### 📱 Layout Structure

#### Header Navigation

```
┌─────────────────────────────────────────────────────┐
│ 📚 TN College Library    [Dashboard] [Books] [...]  │
│                          Nav Items                   │
└─────────────────────────────────────────────────────┘
```

#### Dashboard Cards Layout

```
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│   📚     │  │   📖     │  │   ⏰     │  │   💰     │
│Total     │  │ Issued   │  │ Overdue  │  │  Fines   │
│Books     │  │ Books    │  │ Books    │  │Collected │
│  500     │  │   120    │  │    15    │  │  ₹450    │
└──────────┘  └──────────┘  └──────────┘  └──────────┘
```

#### Data Tables

```
┌─────────────────────────────────────────────────────┐
│ 🔍 Search: [___________]    [+ Add New] [Export]   │
├─────────────────────────────────────────────────────┤
│ ID     │ Title           │ Author      │ Status     │
│ B001   │ Web Development │ John Doe    │ Available  │
│ B002   │ Data Structures │ Jane Smith  │ Issued     │
└─────────────────────────────────────────────────────┘
```

### 🎯 Component Design Patterns

#### 1. Action Cards

- **Rounded corners**: `rounded-lg` (8px)
- **Subtle shadow**: `shadow-sm hover:shadow-md`
- **Hover effects**: Lift slightly with color change
- **Icons**: Use simple, recognizable icons

#### 2. Forms

- **Clean inputs**: Light gray border, green focus ring
- **Button hierarchy**:
  - Primary: Green background
  - Secondary: Gray outline
  - Danger: Red background

#### 3. Status Indicators

- **Available**: Green dot + text
- **Issued**: Yellow dot + text
- **Overdue**: Red dot + text
- **Returned**: Gray dot + text

### 📐 Typography Scale

```css
/* Headings */
h1: text-3xl font-bold text-gray-900      /* Page titles */
h2: text-2xl font-semibold text-gray-800  /* Section headers */
h3: text-xl font-medium text-gray-700     /* Card titles */

/* Body Text */
body: text-base text-gray-600             /* Regular text */
small: text-sm text-gray-500              /* Helper text */

/* Numbers/Stats */
stats: text-2xl font-bold text-primary-600  /* Dashboard numbers */
```

### 🖼️ Page Layouts

#### Dashboard

- **4-column stats cards** (responsive: 2x2 on mobile)
- **Recent activities section**
- **Quick actions buttons**

#### Book Management

- **Search & filter bar**
- **Data table with pagination**
- **Add/Edit modal forms**

#### Student Management

- **Register number search**
- **Student info cards**
- **Issue history tabs**

### 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
sm: 640px    /* Small tablets */
md: 768px    /* Tablets */
lg: 1024px   /* Laptops */
xl: 1280px   /* Desktops */
```

### 🎨 Visual Examples

#### Button Styles

```jsx
// Primary Button
<button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg shadow-sm transition-colors">
  Issue Book
</button>

// Secondary Button
<button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
  Cancel
</button>
```

#### Card Component

```jsx
<div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-xl font-medium text-gray-800">Total Books</h3>
    <BookIcon className="w-8 h-8 text-primary-500" />
  </div>
  <p className="text-2xl font-bold text-primary-600">1,247</p>
  <p className="text-sm text-gray-500">+12 this month</p>
</div>
```

### ✨ Interactive Elements

#### Hover States

- **Cards**: Slight elevation (shadow increase)
- **Buttons**: Color darkening
- **Table rows**: Light gray background
- **Links**: Underline with green color

#### Loading States

- **Skeleton screens** for table loading
- **Spinner** for button actions
- **Progress bars** for file uploads

### 🏛️ Tamil Nadu College Context

#### Visual Elements

- **Clean, professional** appearance
- **Easy-to-read fonts** for all ages
- **Color coding** for different book categories
- **Clear status indicators** for quick understanding
- **Familiar iconography** (books, students, calendar)

This design system ensures the library management system looks modern yet professional, suitable for both government and private colleges in Tamil Nadu.
