# GearGuard

A comprehensive maintenance management system that allows companies to track assets (machines, vehicles, computers) and manage maintenance requests seamlessly.

## Core Philosophy

The system connects three essential components:
- **Equipment** (what is broken)
- **Teams** (who fix it) 
- **Requests** (the work to be done)

## System Components

### A. Equipment Management
Central database for all company assets with robust tracking capabilities.

**Equipment Tracking:**
- By Department (e.g., CNC Machine → Production department)
- By Employee (e.g., Laptop → Person name)
- Search and group by functionality for request tracking

**Responsibility Assignment:**
- Each equipment has a dedicated Maintenance Team
- Default technician assignment

**Key Fields:**
- Equipment Name & Serial Number
- Purchase Date & Warranty Information
- Physical Location
- Department/Employee assignment

### B. Maintenance Teams
Support for multiple specialized teams with workflow logic.

**Team Structure:**
- Team Name (Mechanics, Electricians, IT Support)
- Team Member linking (Technicians)
- Workflow Logic: Only team members can pick up team-specific requests

### C. Maintenance Requests
Transactional lifecycle management for repair jobs.

**Request Types:**
- **Corrective:** Unplanned repair (Breakdown)
- **Preventive:** Planned maintenance (Routine Checkup)

**Key Fields:**
- Subject (What is wrong?)
- Equipment (Which machine?)
- Scheduled Date
- Duration (Hours spent)

## Business Workflows

### Flow 1: The Breakdown
1. **Request Creation:** Any user can create a request
2. **Auto-Fill Logic:** System automatically fetches Equipment category and Maintenance Team
3. **Request State:** Starts in "New" stage
4. **Assignment:** Manager/technician assigns themselves
5. **Execution:** Stage moves to "In Progress"
6. **Completion:** Record hours spent, move to "Repaired"

### Flow 2: The Routine Checkup
1. **Scheduling:** Manager creates Preventive request
2. **Date Setting:** Set Scheduled Date
3. **Visibility:** Appears on Calendar View for technician scheduling

## User Interface Features

### Maintenance Kanban Board
Primary workspace for technicians:
- **Group By:** Stages (New | In Progress | Repaired | Scrap)
- **Drag & Drop:** Move cards between stages
- **Visual Indicators:**
  - Technician avatars
  - Red status for overdue requests

### Calendar View
- Display all Preventive maintenance requests
- Click-to-schedule new maintenance requests

### Smart Features
- **Smart Buttons:** Equipment form "Maintenance" button showing request count
- **Scrap Logic:** Equipment flagging when moved to Scrap stage
- **Pivot/Graph Reports:** Requests per Team/Equipment Category

## Installation

1. Clone the repository
```bash
git clone https://github.com/HARICH529/GearGuard.git
```
2. Install dependencies
```bash
npm install
```
3. Set up environment variables in `.env`
4. Run the server
```bash
npm start
```

## API Endpoints

- `/api/auth` - Authentication routes
- `/api/equipment` - Equipment management
- `/api/requests` - Maintenance requests
- `/api/teams` - Team management
- `/api/users` - User management

## Technologies Used

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- RESTful API Design