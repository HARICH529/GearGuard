# 🛠️ GearGuard

A comprehensive maintenance management system that allows companies to track assets (machines, vehicles, computers) and manage maintenance requests seamlessly.

## 📋 Table of Contents
- [🎯 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🏗️ System Architecture](#️-system-architecture)
- [🔄 Workflow Diagrams](#-workflow-diagrams)
- [🚀 Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [🛠️ Technology Stack](#️-technology-stack)
- [👥 User Roles & Features](#-user-roles--features)
- [🔧 API Endpoints](#-api-endpoints)
- [📊 Database Models](#-database-models)
- [🎨 Frontend Architecture](#-frontend-architecture)
- [🔐 Security & Authentication](#-security--authentication)
- [🚀 Deployment Guide](#-deployment-guide)

## 🎯 Overview

GearGuard is a modern, full-stack maintenance management system that streamlines asset tracking, team coordination, and maintenance workflow automation. The platform connects equipment, maintenance teams, and service requests in a unified ecosystem.

### 🌟 Core Objectives
- 🏭 **Asset Management**: Comprehensive equipment tracking and lifecycle management
- 👥 **Team Coordination**: Efficient maintenance team workflow and assignment
- 📋 **Request Management**: Streamlined corrective and preventive maintenance
- 📊 **Analytics**: Real-time insights and performance tracking
- 🔧 **Automation**: Smart assignment and workflow optimization

## ✨ Key Features

### 👨‍💼 Manager Features
- 🔐 Secure authentication with role-based access
- 📋 Complete equipment lifecycle management
- 👥 Maintenance team creation and management
- 📊 Comprehensive dashboard with analytics
- 📈 Performance reports and KPI tracking
- 🔧 System configuration and user management

### 👨‍🔧 Technician Features
- 🎯 Department-specific request filtering
- 📋 Interactive Kanban board for workflow management
- 📅 Calendar view for preventive maintenance
- ⏱️ Session timer with automatic tracking
- 📝 Request status updates and completion logging
- 📊 Personal performance analytics

### 👨‍💻 Employee Features
- 📝 Equipment maintenance request creation
- 🔍 Equipment search and status tracking
- 📋 Request history and status monitoring
- 📊 Department equipment overview

## 🏗️ System Architecture

The system connects three essential components:
- **Equipment** (what needs maintenance)
- **Teams** (who performs the work)
- **Requests** (the maintenance tasks)

### Core Components

#### A. Equipment Management
Central database for all company assets with robust tracking capabilities.

**Equipment Tracking:**
- By Department (e.g., CNC Machine → Production department)
- By Employee (e.g., Laptop → Person name)
- Search and group by functionality for request tracking

**Responsibility Assignment:**
- Each equipment has a dedicated Maintenance Team
- Default technician assignment

#### B. Maintenance Teams
Support for multiple specialized teams with workflow logic.

**Team Structure:**
- Team Name (Mechanics, Electricians, IT Support)
- Team Member linking (Technicians)
- Workflow Logic: Only team members can pick up team-specific requests

#### C. Maintenance Requests
Transactional lifecycle management for repair jobs.

**Request Types:**
- **Corrective:** Unplanned repair (Breakdown)
- **Preventive:** Planned maintenance (Routine Checkup)

## 🔄 Workflow Diagrams

### 📋 Complete Maintenance Request Journey

#### Flow 1: The Breakdown
1. **Request Creation:** Any user can create a request
2. **Auto-Fill Logic:** System automatically fetches Equipment category and Maintenance Team
3. **Request State:** Starts in "New" stage
4. **Assignment:** Manager/technician assigns themselves
5. **Execution:** Stage moves to "In Progress"
6. **Completion:** Record hours spent, move to "Repaired"

#### Flow 2: The Routine Checkup
1. **Scheduling:** Manager creates Preventive request
2. **Date Setting:** Set Scheduled Date
3. **Visibility:** Appears on Calendar View for technician scheduling

## 🚀 Quick Start

### 📋 Prerequisites
- 📦 Node.js (v16+ recommended)
- 🍃 MongoDB (Atlas or local)
- 🔧 Git (for version control)

### ⚡ Installation

**Clone Repository**
```bash
git clone https://github.com/HARICH529/GearGuard.git
cd GearGuard
```

**Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Configure environment variables
npm run dev
```

**Frontend Setup**
```bash
cd ../frontend
npm install
npm run dev
```

**Initialize Database**
```bash
cd backend
node utils/createAdmin.js  # Create admin user
node seed.js              # Seed sample data
```

### 🔐 Environment Configuration

**Backend (.env)**
```env
# Database
MONGO_URI=mongodb://localhost:27017/gearguard

# Security
JWT_SECRET=<your_jwt_secret>
JWT_EXPIRE=7d

# Admin Credentials
ADMIN_USERNAME=<admin_username>
ADMIN_EMAIL=<admin_email>
ADMIN_PASSWORD=<admin_password>

# Server
PORT=5000
NODE_ENV=development
```

## 📁 Project Structure

```
GearGuard/
├── 🔙 backend/
│   ├── 🎮 controllers/              # Business logic
│   │   ├── AuthController.js        # Authentication
│   │   ├── EquipmentController.js   # Equipment management
│   │   ├── RequestController.js     # Request handling
│   │   ├── TeamController.js        # Team operations
│   │   └── UserController.js        # User management
│   ├── 🛡️ middleware/              # Auth & validation
│   │   ├── auth.js                 # JWT verification
│   │   ├── csrf.js                 # CSRF protection
│   │   └── errorHandler.js         # Error handling
│   ├── 📊 models/                  # Database schemas
│   │   ├── User.js                 # User model
│   │   ├── Equipment.js            # Equipment model
│   │   ├── MaintenanceRequest.js   # Request model
│   │   └── MaintenanceTeam.js      # Team model
│   ├── 🚏 routes/                  # API routes
│   │   ├── auth.js                 # Authentication routes
│   │   ├── equipment.js            # Equipment routes
│   │   ├── requests.js             # Request routes
│   │   ├── teams.js                # Team routes
│   │   └── users.js                # User routes
│   ├── 🔧 utils/                   # Utilities
│   │   └── createAdmin.js          # Admin creation
│   ├── 📱 server.js                # Server entry point
│   └── 🗄️ seed.js                  # Database seeding
└── 🎨 frontend/
    ├── 📦 src/
    │   ├── 🧩 components/          # UI components
    │   │   ├── common/             # Shared components
    │   │   ├── dashboard/          # Dashboard components
    │   │   ├── equipment/          # Equipment components
    │   │   ├── requests/           # Request components
    │   │   └── teams/              # Team components
    │   ├── 🔄 context/             # React contexts
    │   │   └── AuthContext.jsx     # Authentication context
    │   ├── 📄 pages/               # Page components
    │   │   ├── Dashboard.jsx       # Main dashboard
    │   │   ├── Equipment.jsx       # Equipment management
    │   │   ├── Requests.jsx        # Request management
    │   │   ├── Teams.jsx           # Team management
    │   │   ├── Calendar.jsx        # Calendar view
    │   │   ├── Reports.jsx         # Analytics
    │   │   ├── Login.jsx           # Login page
    │   │   └── Register.jsx        # Registration
    │   ├── 🔌 services/            # API services
    │   │   └── api.js              # API client
    │   ├── 🎨 styles/              # Styling
    │   │   └── globals.css         # Global styles
    │   └── 🎨 App.jsx              # Main app component
    └── ⚙️ vite.config.js           # Vite configuration
```

## 🛠️ Technology Stack

### 🔙 Backend Stack
| Technology | Purpose | Version |
|------------|---------|----------|
| Node.js | Runtime Environment | Latest LTS |
| Express | Web Framework | ^4.18.0 |
| MongoDB | Database | ^6.0.0 |
| Mongoose | ODM | ^7.0.0 |
| JWT | Authentication | ^9.0.0 |
| bcrypt | Password Hashing | ^5.1.0 |

### 🎨 Frontend Stack
| Technology | Purpose | Version |
|------------|---------|----------|
| React | UI Framework | ^18.2.0 |
| Vite | Build Tool | ^4.4.0 |
| React Router | Routing | ^6.15.0 |
| Axios | HTTP Client | ^1.5.0 |

## 👥 User Roles & Features

### 🏭 Manager Capabilities
```javascript
const managerFeatures = {
  equipment: ["create", "update", "delete", "assign_teams"],
  teams: ["create", "manage_members", "assign_equipment"],
  requests: ["view_all", "assign", "approve", "analytics"],
  users: ["create", "manage_roles", "department_assignment"],
  reports: ["generate", "export", "kpi_tracking"]
};
```

### 🔧 Technician Capabilities
```javascript
const technicianFeatures = {
  requests: ["view_department", "accept", "update_status", "log_hours"],
  kanban: ["drag_drop", "status_updates", "priority_sorting"],
  calendar: ["view_scheduled", "preventive_maintenance"],
  equipment: ["view_assigned", "update_status", "maintenance_history"]
};
```

### 👨‍💻 Employee Capabilities
```javascript
const employeeFeatures = {
  requests: ["create", "view_own", "track_status"],
  equipment: ["view_assigned", "report_issues"],
  dashboard: ["personal_overview", "request_history"]
};
```

## 🔧 API Endpoints

### 🔐 Authentication Routes
```
POST   /api/auth/register          # User registration
POST   /api/auth/login             # User login
POST   /api/auth/logout            # User logout
GET    /api/auth/profile           # Get user profile
PUT    /api/auth/profile           # Update profile
```

### 🏭 Equipment Management
```
GET    /api/equipment              # Get all equipment
POST   /api/equipment              # Create equipment
GET    /api/equipment/:id          # Get specific equipment
PUT    /api/equipment/:id          # Update equipment
DELETE /api/equipment/:id          # Delete equipment
GET    /api/equipment/:id/requests # Get equipment requests
```

### 📋 Request Operations
```
GET    /api/requests               # Get requests (filtered by role)
POST   /api/requests               # Create new request
GET    /api/requests/:id           # Get specific request
PUT    /api/requests/:id/status    # Update request status
PUT    /api/requests/:id/assign    # Assign technician
GET    /api/requests/kanban        # Get kanban data
GET    /api/requests/calendar      # Get calendar data
GET    /api/requests/reports       # Get analytics
```

### 👥 Team Management
```
GET    /api/teams                  # Get all teams
POST   /api/teams                  # Create team
GET    /api/teams/:id              # Get specific team
PUT    /api/teams/:id              # Update team
DELETE /api/teams/:id              # Delete team
POST   /api/teams/:id/members      # Add team member
```

### 👤 User Management
```
GET    /api/users                  # Get all users
POST   /api/users                  # Create user
GET    /api/users/:id              # Get specific user
PUT    /api/users/:id              # Update user
DELETE /api/users/:id              # Delete user
```

## 📊 Database Models

### 👤 User Schema
```javascript
{
  username: String,                // Unique username
  email: String,                   // Unique email
  password: String,                // Hashed password
  role: ["Employee", "Technician", "Manager", "Admin"],
  department: String,              // User department
  teams: [ObjectId],              // Assigned maintenance teams
  createdAt: Date,                // Account creation
  updatedAt: Date                 // Last update
}
```

### 🏭 Equipment Schema
```javascript
{
  name: String,                   // Equipment name
  serialNumber: String,           // Unique serial number
  purchaseDate: Date,             // Purchase date
  warranty: {
    startDate: Date,              // Warranty start
    endDate: Date,                // Warranty end
    provider: String              // Warranty provider
  },
  location: String,               // Physical location
  assignedTeam: ObjectId,         // Maintenance team
  defaultTechnician: ObjectId,    // Default technician
  status: ["Active", "Scrapped"], // Equipment status
  department: String,             // Department assignment
  assignedEmployee: ObjectId      // Assigned employee
}
```

### 📋 MaintenanceRequest Schema
```javascript
{
  subject: String,                // Request title
  description: String,            // Detailed description
  equipment: ObjectId,            // Equipment reference
  team: ObjectId,                 // Assigned team
  assignedTechnician: ObjectId,   // Assigned technician
  createdBy: ObjectId,            // Request creator
  status: ["New", "In Progress", "Repaired", "Scrap"],
  category: ["Corrective", "Preventive"],
  scheduledDate: Date,            // Scheduled maintenance
  completionDate: Date,           // Completion timestamp
  durationHours: Number,          // Time spent
  priority: ["Low", "Medium", "High", "Critical"]
}
```

### 👥 MaintenanceTeam Schema
```javascript
{
  name: String,                   // Team name
  description: String,            // Team description
  members: [ObjectId],            // Team members
  specialization: String,         // Area of expertise
  isActive: Boolean,              // Team status
  createdAt: Date,               // Creation date
  updatedAt: Date                // Last update
}
```

## 🎨 Frontend Architecture

### 🔄 Context Providers
- 👤 **AuthContext**: Authentication state and user profile
- 🎨 **ThemeContext**: Dark/light theme management
- 🚨 **AlertContext**: Global notification system

### 🧩 Component Structure
```
components/
├── 🔐 common/
│   ├── Header.jsx               # Navigation header
│   └── Sidebar.jsx              # Navigation sidebar
├── 📊 dashboard/
│   └── DashboardCards.jsx       # Dashboard widgets
├── 🏭 equipment/
│   ├── EquipmentList.jsx        # Equipment listing
│   └── EquipmentForm.jsx        # Equipment form
├── 📋 requests/
│   └── KanbanBoard.jsx          # Kanban workflow
└── 👥 teams/
    ├── TeamList.jsx             # Team listing
    └── TeamForm.jsx             # Team management
```

## 🔐 Security & Authentication

### 🛡️ Authentication System
- 🔑 **JWT Tokens**: Secure stateless authentication
- 🔒 **Password Hashing**: bcrypt with salt rounds
- ⏰ **Token Expiration**: Automatic session management
- 🛡️ **Role-Based Access**: Permission-based routing

### 🔒 Data Protection
- ✅ **Input Validation**: Mongoose schema validation
- 🧹 **Data Sanitization**: XSS prevention
- 🌐 **CORS Configuration**: Cross-origin security
- 🛡️ **CSRF Protection**: Cross-site request forgery prevention

## 🚀 Deployment Guide

### 🌐 Production Setup

**Backend Deployment**
```bash
# Environment setup
export NODE_ENV=production
export MONGO_URI=mongodb+srv://prod-cluster
export JWT_SECRET=ultra-secure-secret

# Install dependencies
npm ci --only=production

# Start server
npm start
```

**Frontend Deployment**
```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy to Netlify
netlify deploy --prod --dir=dist
```

### 🐳 Docker Configuration
```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### ☁️ Environment Variables
```env
# Production environment
NODE_ENV=production
MONGO_URI=mongodb+srv://production-cluster
JWT_SECRET=ultra-secure-jwt-secret
PORT=5000
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@company.com
ADMIN_PASSWORD=secure-admin-password
```

---

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.