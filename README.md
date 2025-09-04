# Flowops - Business Management & Contact CRM System

A modern, full-stack business management application built with React, TypeScript, Node.js, and Prisma. Flowops provides comprehensive contact management, document transfer, user administration, and reporting capabilities for business operations.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization** - Secure login with JWT tokens and role-based access control
- **Contact Management** - Complete CRM system for managing clients, prospects, vendors, and partners
- **Document Transfer** - Upload and download management system
- **User Administration** - Manage contacts, notices, and user roles
- **Dashboard & Analytics** - Business insights and reporting tools
- **Role-Based Access** - Multiple user roles (Partner, Associate, Analyst, Administrator, Client)

### User Roles & Permissions
- **Partner** - Senior partner with full firm access and client management
- **Associate** - Mid-level professional with project management capabilities
- **Analyst** - Junior professional with research and analysis responsibilities
- **Administrator** - System administrator with full technical access
- **Client** - External client with limited access to their projects

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Chakra UI** for modern, accessible components
- **Vite** for fast development and building
- **React Router** for navigation
- **React Hook Form** with Yup validation
- **Framer Motion** for animations

### Backend
- **Node.js** with Express.js
- **Prisma ORM** for database management
- **MySQL** database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads
- **CORS** enabled

### Database Schema
- Users with role-based permissions
- Contact management system
- File upload tracking
- Form submissions logging

## 📁 Project Structure

```
Flowop1/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # API route handlers
│   ├── middleware/      # Custom middleware
│   ├── prisma/         # Database schema and migrations
│   ├── routes/         # API routes
│   ├── uploads/        # File upload storage
│   └── index.js        # Main server file
├── frontend/
│   ├── src/
│   │   ├── AuthPages/   # Login and authentication
│   │   ├── components/  # Reusable UI components
│   │   ├── dashboard/   # Dashboard pages
│   │   ├── layouts/     # Page layouts
│   │   ├── pages/       # Main application pages
│   │   └── SideBar/     # Navigation sidebar
│   └── public/          # Static assets
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MySQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Awesome-SSP/Flowop1.git
   cd Flowop1
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/flowops"
   JWT_SECRET="your-secret-key"
   PORT=5000
   ```

5. **Database Setup**
   ```bash
   cd backend
   npx prisma generate
   npx prisma migrate dev
   npx prisma db seed
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server runs on http://localhost:5000

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Application runs on http://localhost:5173

## 🔐 Default Login Credentials

After seeding the database, you can use these credentials:

- **Email:** Any user with @flowops.com domain
- **Password:** Password123!

Example users:
- sarah.johnson@flowops.com (Partner)
- michael.chen@flowops.com (Partner)
- admin@flowops.com (Administrator)

## 📱 Application Features

### Dashboard
- Business overview and analytics
- Quick access to key metrics
- Recent activity tracking

### Contact Management
- Add, edit, and manage business contacts
- Categorize contacts (Client, Prospect, Vendor, Partner)
- Store detailed contact information
- Contact status tracking

### Document Transfer
- Upload and manage files
- Download tracking
- File organization system

### Administration
- User management
- Contact administration
- Notice management
- System settings

### Reports & Analytics
- Business performance metrics
- Contact analytics
- Data visualization

## 🎨 UI/UX Features

- **Modern Design** - Clean, professional interface with glassmorphism effects
- **Responsive Layout** - Works seamlessly on desktop and mobile devices
- **Dark/Light Mode** - Automatic theme switching support
- **Smooth Animations** - Enhanced user experience with micro-interactions
- **Accessible** - Built with accessibility best practices

## 🧪 Development

### Available Scripts

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Database Commands
- `npx prisma generate` - Generate Prisma client
- `npx prisma migrate dev` - Run database migrations
- `npx prisma db seed` - Seed database with sample data
- `npx prisma studio` - Open Prisma Studio

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Awesome-SSP**

## 🙏 Acknowledgments

- Built with modern web technologies
- Designed for business efficiency
- Focused on user experience and performance

---

For support or questions, please open an issue in the GitHub repository.
