# Student Task & Assignment Manager

A full-stack academic workflow web application developed for students to manage coursework, projects, homework, and assignment deadlines. Built with modern React and Node.js/Express, the system provides real-time urgency indicators, calendar scheduling, subject categorization, notification alerts, and CSV export capabilities.

---

## 1. Problem Statement and Objectives

### Problem Statement
College students frequently juggle multiple subjects with varying assignment deadlines, laboratory submissions, exam preparations, and project milestones. Conventional calendar applications and fragmented note-taking apps lack academic context:
- No visual prioritization by subject or submission deadline.
- Inadequate warnings for impending or overdue coursework.
- Difficulty tracking historical academic completion rates.

### Objectives
- **Centralize Coursework**: Aggregate all academic deadlines across subjects in a unified, intuitive dashboard.
- **Automated Deadline Tracking**: Dynamically detect approaching deadlines (within 3 days), tasks due today, and overdue assignments.
- **Visual Subject Organization**: Associate tasks with color-coded subjects and faculty instructors.
- **Data Portability**: Enable students to export their coursework records into standard CSV format for offline study planners and spreadsheets.
- **Responsive Student Experience**: Provide a modern, clean web interface accessible across desktop and mobile browsers.

---

## 2. Main Features

- **Authentication & Security**: Student registration and login with bcryptjs password hashing and signed JSON Web Tokens (JWT).
- **Dashboard & Analytics**: KPI metric cards displaying Total, Pending, In Progress, Completed, Overdue, and 7-day completion velocity, plus an urgent deadline feed.
- **Subject Management**: Create, edit, and safely delete academic courses with custom color codes and instructor names (with protection preventing deletion of subjects linked to existing tasks).
- **Comprehensive Task Manager**: Create, edit, search, filter, and sort tasks by status (`Pending`, `In Progress`, `Completed`), priority (`High`, `Medium`, `Low`), academic type (`Assignment`, `Project`, `Lab Record`, `Exam Prep`, `Homework`, `Other`), and timeframe (`today`, `week`, `overdue`).
- **One-Click Status Toggle**: Mark tasks completed or pending directly from any view.
- **Visual Calendar View**: Monthly calendar grid mapping coursework items onto specific deadline days with instant quick-status toggling and subject color indicators.
- **Upcoming Deadlines View**: Chronologically organized view focusing on near-term deadlines.
- **Completed Archive**: Filterable archive of finished assignments showing completion timestamps.
- **Notification Center**: In-app dropdown panel with unread badge counter, automated deadline sync, single-click mark-as-read, and mark-all-as-read.
- **CSV Data Export**: Single-click client-side CSV export containing full task metadata (title, subject, type, priority, status, due date, completion timestamp, description).
- **Profile & Settings**: View and update student name, college, degree/branch, and current semester.

---

## 3. Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + Vite 8 | Fast SPA rendering, component modularity, instant HMR |
| **Routing** | React Router v7 | Client-side routing, protected and public route guards |
| **Styling** | Vanilla CSS3 | Custom design system, responsive grid/flexbox, CSS variables |
| **Backend Runtime** | Node.js (v18+) | Non-blocking server-side execution environment |
| **API Framework** | Express 4.21 | RESTful routing, authentication middleware, error handling |
| **Database** | MongoDB (v6.0+) | Document-oriented NoSQL database |
| **ODM** | Mongoose 8.9 | Schema definition, validation, indexing, and aggregation |
| **Security** | bcryptjs & jsonwebtoken | Password hashing (salt rounds = 10) and stateless JWT auth |

---

## 4. System Requirements

- **Operating System**: Windows 10 / Windows 11 (or macOS / Linux)
- **Node.js**: `v18.x` or higher (LTS recommended)
- **npm**: `v9.x` or higher
- **MongoDB**: MongoDB Community Server `v6.0+` or `v7.0+`
- **MongoDB Compass**: GUI client for MongoDB database inspection
- **Web Browser**: Modern browser (Google Chrome, Microsoft Edge, Mozilla Firefox)

---

## 5. Project Folder Structure

```
26070521503/
├── .agents/                      # Agent and customization configuration
├── client/                       # Frontend Single Page Application (React + Vite)
│   ├── public/                   # Static assets (favicons, manifest)
│   ├── src/
│   │   ├── assets/               # Local icons and SVGs
│   │   ├── components/           # Reusable UI components & layouts
│   │   │   ├── common/           # Button, Alert, Modal, Logo, PageLoader, NotificationPanel
│   │   │   └── AppLayout.jsx     # Navigation sidebar, topbar, and outlet wrapper
│   │   ├── context/              # React Context providers (AuthContext)
│   │   ├── pages/                # Page route components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AllTasks.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   ├── Subjects.jsx
│   │   │   ├── CalendarView.jsx
│   │   │   ├── UpcomingDeadlines.jsx
│   │   │   ├── CompletedTasks.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── AboutHelp.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── services/             # API HTTP helper (apiRequest)
│   │   ├── styles/               # Component-specific CSS stylesheets
│   │   ├── App.jsx               # Main React router setup
│   │   ├── index.css             # Design tokens and global CSS
│   │   └── main.jsx              # Vite React entry point
│   ├── .env.example              # Client environment variables template
│   ├── package.json              # Client scripts and dependencies
│   └── vite.config.js            # Vite build and dev server proxy config
├── docs/                         # Detailed project documentation
│   ├── PROJECT_REPORT.md         # Comprehensive academic report
│   ├── SYSTEM_DESIGN.md          # Architecture, request flows & diagrams
│   ├── DATABASE_SCHEMA.md        # Mongoose data models, fields & indexes
│   ├── API_DOCUMENTATION.md      # REST API endpoints, schemas & examples
│   └── USER_GUIDE.md             # Student walkthrough and visual guides
├── server/                       # Backend REST API Server (Node.js + Express)
│   ├── config/                   # Database connection configuration (db.js)
│   ├── controllers/              # Route business logic handlers
│   │   ├── authController.js
│   │   ├── subjectController.js
│   │   ├── taskController.js
│   │   └── notificationController.js
│   ├── middleware/               # Auth verification (authMiddleware.js)
│   ├── models/                   # Mongoose data models
│   │   ├── User.js
│   │   ├── Subject.js
│   │   ├── Task.js
│   │   └── Notification.js
│   ├── routes/                   # Express router definitions
│   │   ├── authRoutes.js
│   │   ├── subjectRoutes.js
│   │   ├── taskRoutes.js
│   │   └── notificationRoutes.js
│   ├── .env.example              # Server environment variables template
│   ├── package.json              # Server dependencies and start scripts
│   └── server.js                 # Express server bootstrap & middleware
├── .env.example                  # Combined root environment template
├── .gitignore                    # Git ignore specifications
└── README.md                     # Project overview and quickstart guide
```

---

## 6. Installation and Setup Instructions (Windows)

### Prerequisites Check
Open PowerShell or Command Prompt and verify Node.js and npm:
```powershell
node -v
npm -v
```

### Step 1: Install Server Dependencies
```powershell
cd server
npm install
cd ..
```

### Step 2: Install Client Dependencies
```powershell
cd client
npm install
cd ..
```

---

## 7. MongoDB Setup (Local Service & MongoDB Compass)

### Option A: Local MongoDB Windows Service
1. Ensure the MongoDB service is running via Windows Services (`services.msc` -> `MongoDB Server (MongoDB)`).
2. Alternatively, verify or start it from PowerShell (Run as Administrator):
   ```powershell
   Get-Service -Name MongoDB
   Start-Service -Name MongoDB
   ```

### Option B: Connecting with MongoDB Compass
1. Launch **MongoDB Compass**.
2. In the connection string bar, enter:
   ```
   mongodb://127.0.0.1:27017
   ```
3. Click **Connect**.
4. The database `student_task_manager` will automatically be created by Mongoose upon first student registration or seed. You can inspect the four collections: `users`, `subjects`, `tasks`, and `notifications`.

---

## 8. Environment Variable Configuration

Copy the example configuration files into active `.env` files.

### Server Environment Configuration
Inside the `server/` directory, create `.env` from `.env.example`:
```powershell
copy server\.env.example server\.env
```
Default parameters in `server/.env`:
```ini
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/student_task_manager
CLIENT_URL=http://localhost:5173
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
```

### Client Environment Configuration
Inside the `client/` directory, create `.env` from `.env.example`:
```powershell
copy client\.env.example client\.env
```
Default parameters in `client/.env`:
```ini
VITE_API_URL=http://localhost:5000/api
```

---

## 9. Commands to Start Backend and Frontend

Run the server and client in two separate terminal windows.

### Terminal 1 — Start the Backend Server:
```powershell
cd server
npm run dev
```
*The server will start on port 5000 and log:*
```
[MongoDB] Successfully connected to: 127.0.0.1
[Server] Running on port 5000
[CORS] Configured to allow requests from: http://localhost:5173
[Health] Test endpoint at http://localhost:5000/api/health
```

### Terminal 2 — Start the Frontend Application:
```powershell
cd client
npm run dev
```
*Vite will start the client on:*
```
  VITE v8.3.4  ready in 250 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 10. Application URL and API Base URL

- **Web Application URL**: [http://localhost:5173](http://localhost:5173)
- **REST API Base URL**: [http://localhost:5000/api](http://localhost:5000/api)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 11. Available Pages and Purpose

| Page Route | Page Component | Purpose |
| :--- | :--- | :--- |
| `/login` | `Login.jsx` | Authenticates existing students with email and password |
| `/signup` | `Signup.jsx` | Registers a new student account (Name, College, Degree, Semester, Email, Password) |
| `/dashboard` | `Dashboard.jsx` | Central overview displaying metrics, urgent deadlines, and quick completion shortcuts |
| `/tasks` | `AllTasks.jsx` | Complete task grid with multi-filter controls, search, sorting, status toggle, and CSV export |
| `/tasks/new` | `TaskForm.jsx` | Form to create a new task with title, subject selection, type, priority, and due date |
| `/tasks/edit/:id` | `TaskForm.jsx` | Pre-populated form to update existing task attributes |
| `/subjects` | `Subjects.jsx` | Manage academic courses, assign color badges, instructor names, and view task counts |
| `/calendar` | `CalendarView.jsx` | Monthly calendar interface plotting tasks on due dates with fast status updating |
| `/deadlines` | `UpcomingDeadlines.jsx`| Dedicated urgency view highlighting tasks due in the immediate future |
| `/completed` | `CompletedTasks.jsx` | Archive of finished tasks with completion date records |
| `/profile` | `Profile.jsx` | Student profile viewer and editor for academic credentials |
| `/settings` | `Settings.jsx` | Application preferences and system configuration |
| `/help` | `AboutHelp.jsx` | User documentation, workflow guides, and system status check |

---

## 12. Main API Endpoint Groups

| Group | Route Prefix | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| **Authentication** | `/api/auth` | Register (`/signup`), login (`/login`), get current user (`/me`), update profile (`/profile`) | Public / JWT |
| **Subjects** | `/api/subjects` | List subjects with task stats, create subject, retrieve by ID, update, and safe delete | JWT |
| **Tasks** | `/api/tasks` | Filtered list with search/sort, task stats summary, task CRUD, status patch | JWT |
| **Notifications** | `/api/notifications` | Fetch deadline alerts with automatic sync, mark single as read, mark all as read | JWT |
| **Health** | `/api/health` | Service uptime and MongoDB connection state (`readyState`) | Public |

---

## 13. Screenshots Section

*(Placeholders: Add application interface captures here)*

### 1. Student Dashboard Overview
```
+-----------------------------------------------------------------------------------+
|  [ Dashboard Screenshot Placeholder: Metrics cards, Urgency feed, Quick Actions ] |
+-----------------------------------------------------------------------------------+
```

### 2. All Tasks & Filter Bar
```
+-----------------------------------------------------------------------------------+
|  [ All Tasks Screenshot Placeholder: Search, Subject Filters, Task Cards & CSV ] |
+-----------------------------------------------------------------------------------+
```

### 3. Monthly Calendar Grid
```
+-----------------------------------------------------------------------------------+
|  [ Calendar Screenshot Placeholder: Month navigation, Day tiles & Coursework dots ]|
+-----------------------------------------------------------------------------------+
```

### 4. Subject Management
```
+-----------------------------------------------------------------------------------+
|  [ Subjects Screenshot Placeholder: Color badges, Course statistics, Modal form ] |
+-----------------------------------------------------------------------------------+
```

---

## 14. Contribution & Development Guidelines

1. **Branching**: Create a feature branch (`git checkout -b feature/your-feature-name`).
2. **Code Standards**: Maintain modular React components, clean CSS styling without external utility frameworks, and explicit Mongoose error handling.
3. **Environment Security**: Never commit `.env` files containing live credentials, private database URIs, or production JWT secrets. Always commit updates to `.env.example`.
4. **Commits**: Use conventional commits (e.g., `feat:`, `fix:`, `docs:`, `refactor:`).
5. **Testing Verification**: Test endpoints using Postman or curl, and ensure client-side builds pass cleanly before pull requests.

---

## 15. License

This project is developed for educational and academic management purposes.
