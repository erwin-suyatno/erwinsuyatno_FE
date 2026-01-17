# 📦 Product Management System

A modern, full-featured Product Management application built with Vue.js 3. This application provides a comprehensive solution for managing products with an intuitive dashboard, advanced filtering, and a beautiful user interface.

## ✨ Features

### 🎯 Core Features

- **Complete CRUD Operations**
  - ✅ Create new products with comprehensive form validation
  - ✅ Read/View product details with beautiful detail page
  - ✅ Update existing products with pre-filled forms
  - ✅ Delete products with confirmation modal

- **Dashboard Analytics**
  - 📊 Real-time statistics (Total Products, Categories, Low Stock Items, Inventory Value)
  - 📈 Category distribution with visual progress bars
  - 🔔 Low stock alerts with badge indicators
  - 📋 Recent products list (last 5 products)
  - ⚡ Quick action buttons for common tasks

- **Advanced Product List**
  - 🔍 Real-time search (by name, description, or SKU)
  - 🎛️ Advanced filtering system:
    - Category filter (multi-select)
    - Price range filter (min/max)
    - Stock status filter (All, In Stock, Low Stock, Out of Stock)
  - 📊 Sortable columns (Name, Price, Stock, Category, SKU, Min Stock)
  - 📄 Pagination with customizable items per page
  - 📱 Responsive views (Table view for desktop, Card view for mobile)
  - 🏷️ Active filter tags with quick clear options

- **Product Details Page**
  - 📄 Comprehensive product information display
  - 🎨 Visual stock status indicators
  - ⚡ Quick action buttons (Edit, Delete)
  - 📅 Created/Updated timestamps

### 🎨 UI/UX Features

- **Modern Design System**
  - 🎨 brand colors (Red, Navy, Orange)
  - 🌈 Consistent color palette and theming
  - 💫 Smooth animations and transitions
  - 🎭 Loading states with skeleton screens
  - 📭 Empty states with helpful messages

- **Responsive Design**
  - 📱 Mobile-first approach
  - 💻 Desktop optimized layouts
  - 📊 Tablet-friendly views
  - 🔄 Adaptive sidebar (collapsible on mobile)

- **User Experience Enhancements**
  - 🍞 Breadcrumb navigation
  - 🔔 Toast notification system (Success, Error, Warning, Info)
  - ⏱️ Auto-dismiss notifications (3 seconds)
  - 🎯 Form validation with real-time error messages
  - 💾 Optimistic UI updates
  - 🔄 Loading indicators for async operations

### 🛠️ Technical Features

- **State Management**
  - 🗄️ Pinia stores for centralized state
  - 🔄 Reactive data updates
  - 💾 In-memory data persistence
  - 📊 Computed getters for derived data

- **Code Quality**
  - 🧩 Reusable component architecture
  - 📦 Modular code organization
  - ✅ Form validation utilities
  - 💰 Currency formatting (IDR)
  - 📅 Date/time formatting utilities
  - 🎯 Type-safe component props

- **Performance Optimizations**
  - ⚡ Lazy loading for routes
  - 🎭 Suspense for async components
  - 📊 Computed properties for filtering/sorting
  - 🚀 Optimized re-renders
  - 💨 Efficient pagination

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm/yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:5173` (or the port shown in terminal).

## 🛠️ Tech Stack

- **Framework**: Vue.js 3 (Composition API)
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Build Tool**: Vite
- **Styling**: CSS3 with CSS Variables
- **Icons**: Custom SVG icon system

## 📁 Project Structure

```
product-management/
├── src/
│   ├── assets/
│   │   └── styles/
│   │       ├── variables.css      # CSS variables & color system
│   │       ├── main.css           # Global styles
│   │       └── animations.css    # Animation classes
│   ├── components/
│   │   ├── common/                # Reusable UI components
│   │   │   ├── AppBreadcrumb.vue
│   │   │   ├── AppButton.vue
│   │   │   ├── AppEmpty.vue
│   │   │   ├── AppIcon.vue
│   │   │   ├── AppInput.vue
│   │   │   ├── AppLoading.vue
│   │   │   ├── AppSelect.vue
│   │   │   ├── AppTable.vue
│   │   │   ├── SkeletonCard.vue
│   │   │   └── SkeletonTable.vue
│   │   ├── dashboard/
│   │   │   └── StatCard.vue       # Dashboard statistics card
│   │   ├── layout/
│   │   │   ├── AppLayout.vue       # Main layout wrapper
│   │   │   ├── AppNavbar.vue      # Top navigation bar
│   │   │   └── AppSidebar.vue     # Sidebar navigation
│   │   └── product/
│   │       ├── FilterDrawer.vue   # Advanced filter drawer
│   │       ├── ProductCard.vue    # Product card (mobile view)
│   │       ├── ProductForm.vue    # Reusable product form
│   │       ├── ProductModal.vue   # Delete confirmation modal
│   │       ├── ProductTable.vue   # Product table (desktop view)
│   │       └── SearchBar.vue     # Search input component
│   ├── navigation/
│   │   └── index.js               # Navigation menu configuration
│   ├── pages/
│   │   ├── Dashboard.vue          # Dashboard page
│   │   ├── NotFound.vue           # 404 page
│   │   ├── ProductAddEdit.vue     # Create/Edit product page
│   │   ├── ProductList.vue        # Product list page
│   │   └── ProductView.vue        # Product details page
│   ├── router/
│   │   └── index.js               # Vue Router configuration
│   ├── stores/
│   │   ├── product.store.js       # Product state management
│   │   └── ui.store.js            # UI state management
│   ├── utils/
│   │   ├── formatters.js          # Currency, date formatting
│   │   └── validators.js          # Form validation utilities
│   ├── App.vue
│   └── main.js
├── public/
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🎯 Key Features Explained

### 1. Dashboard Analytics

The dashboard provides a comprehensive overview of your product inventory:

- **Statistics Cards**: Display key metrics at a glance
- **Category Distribution**: Visual representation of products by category with progress bars
- **Low Stock Alerts**: Highlight products that need restocking
- **Recent Products**: Quick access to the latest added products
- **Quick Actions**: One-click access to common tasks

### 2. Advanced Filtering System

The filtering system allows users to find products quickly:

- **Search**: Real-time search across product name, description, and SKU
- **Category Filter**: Multi-select category filtering
- **Price Range**: Filter by minimum and maximum price
- **Stock Status**: Filter by stock availability (All, In Stock, Low Stock, Out of Stock)
- **Active Filter Tags**: Visual indicators of active filters with quick clear options

### 3. Sorting & Pagination

- **Multi-column Sorting**: Sort by any column (Name, Price, Stock, Category, SKU, Min Stock)
- **Ascending/Descending**: Toggle sort order
- **Pagination**: Navigate through large product lists efficiently
- **Items Per Page**: Configurable pagination size

### 4. Responsive Design

The application adapts seamlessly to different screen sizes:

- **Mobile (< 768px)**: Card-based layout, collapsible sidebar, touch-friendly controls
- **Tablet (768px - 1024px)**: Optimized grid layouts
- **Desktop (> 1024px)**: Full table view, expanded sidebar, multi-column layouts

### 5. Form Validation

Comprehensive validation ensures data integrity:

- **Required Fields**: Name, Price, Stock, Category
- **Number Validation**: Price and stock must be valid numbers
- **Min/Max Constraints**: Stock cannot be negative, price must be positive
- **Real-time Feedback**: Errors displayed as user types
- **Clear Error Messages**: User-friendly validation messages

### 6. Notification System

Toast notifications provide user feedback:

- **Success**: Green notifications for successful operations
- **Error**: Red notifications for errors
- **Warning**: Orange notifications for warnings
- **Info**: Blue notifications for informational messages
- **Auto-dismiss**: Notifications automatically disappear after 3 seconds

## 🎨 Design System

### Color Palette

- **Primary Red**: `#DC2626` - Primary actions, accents
- **Navy**: `#1E3A8A` - Sidebar, headers
- **Orange**: `#F97316` - Highlights, badges
- **Gray Scale**: Comprehensive gray scale for text and backgrounds

### Components

All components follow a consistent design system with:
- Consistent spacing (4px, 8px, 12px, 16px, 24px, 32px)
- Border radius (4px, 6px, 8px)
- Typography scale
- Shadow system
- Transition timing

## 📝 Data Model

### Product Schema

```javascript
{
  id: string,              // Unique identifier
  name: string,            // Product name (required)
  description: string,     // Product description
  price: number,           // Price in IDR (required, > 0)
  stock: number,          // Current stock (required, >= 0)
  minStock: number,       // Minimum stock threshold (optional)
  category: string,       // Product category (required)
  sku: string,            // Stock Keeping Unit
  createdAt: string,      // ISO date string
  updatedAt: string       // ISO date string
}
```

## 🔧 Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

### Code Style

- Use Composition API with `<script setup>`
- Follow Vue 3 best practices
- Use semantic HTML
- Maintain consistent naming conventions
- Write reusable components

## 🚢 Deployment

This application can be deployed to any static hosting service:

### Vercel

```bash
npm run build
# Deploy dist folder to Vercel
```

### Netlify

```bash
npm run build
# Deploy dist folder to Netlify
```

### Other Static Hosts

1. Run `npm run build`
2. Upload the `dist` folder to your hosting service
3. Configure your server to serve `index.html` for all routes (SPA routing)

## 📊 Performance

- ⚡ Fast initial load with code splitting
- 🎯 Optimized bundle size
- 💨 Efficient re-renders with computed properties
- 🚀 Lazy loading for routes and components
- 📱 Mobile-optimized performance

## 🔒 Data Persistence

**Note**: This is a frontend-only application. All data is stored in-memory using Pinia stores. Data will be lost on page refresh. For production use, integrate with a backend API.

## 🎯 Future Enhancements

Potential features for future development:

- [ ] Backend API integration
- [ ] User authentication
- [ ] Product image upload
- [ ] Bulk operations (bulk delete, bulk edit)
- [ ] Export to CSV/Excel
- [ ] Product variants
- [ ] Inventory history tracking
- [ ] Advanced analytics and reports
- [ ] Dark mode support
- [ ] Multi-language support

## 📄 License

This project is created as a technical assessment/demo project.

## 👨‍💻 Author

Built with ❤️ using Vue.js 3

---

**Note**: This application uses dummy data stored in-memory. All CRUD operations work with local state management. For production deployment, integrate with a backend API.
