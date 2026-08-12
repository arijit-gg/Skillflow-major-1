# 🚀 SmartHire ATS – Applicant Tracking System

![SmartHire ATS Banner](https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&q=80)

**SmartHire** is a full-stack, enterprise-grade Applicant Tracking System (ATS) designed for recruitment teams and HR tech startups. SmartHire streamlines job opening creation, candidate pipeline tracking across hiring stages, PDF resume viewing, automated email notifications, recruitment analytics, and CSV data export.

---

## 🌟 Key Features

### 🏢 Recruiter Authentication & Security
- **JWT Authentication & Role Security**: Protected routes with token expiry and role-based access control (`recruiter`, `admin`).
- **bcrypt Password Hashing**: Passwords stored securely using salt rounds.
- **Pre-configured Test Account**: Instant login with test recruiter credentials out of the box.

### 💼 Job Openings Management
- **Job CRUD**: Create, edit, publish, close, and delete job postings.
- **Filtering & Search**: Real-time debounced search by title, department (`Engineering`, `Design`, `Product`, `Sales`, `Marketing`, `HR`, `Finance`), job type (`Full-time`, `Part-time`, `Contract`, `Remote`, `Internship`), and status (`Active`, `Closed`, `Draft`).
- **Applicant Counters**: Live applicant counters on every job card.

### 📋 Candidate Pipeline & Stage Manager
- **Interactive Kanban Stage Board**: Drag/click candidates through recruitment stages (`Applied` ➔ `Screening` ➔ `Interviewing` ➔ `Offered` ➔ `Hired` / `Rejected`).
- **PDF Resume Upload & Embedded Viewer**: PDF file upload enforcement via Multer with inline PDF viewer modal and direct download options.
- **Candidate Evaluation**: Rating stars (1–5) and recruiter notes editor.
- **Automated Candidate Email Notifications**: Integrated Nodemailer service triggering simulated/SMTP emails to candidates upon status changes (e.g. Interview scheduled, Offer extended).
- **One-Click CSV Export**: Instant export of applicant pipeline data to `.csv` format.

### 📊 Analytics & UI/UX
- **Recruitment Analytics Dashboard**: Conversion rate metrics, active job counters, applicant stage breakdown charts, and recent activity feeds.
- **Dark & Light Mode**: Built-in dark mode toggle with system preference detection and `localStorage` state persistence.
- **Responsive Glassmorphism UI**: Crafted with CSS Flexbox & CSS Grid, optimized for desktop, tablet, and mobile devices.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, React Router DOM v6, Axios, Lucide Icons, Recharts |
| **Styling** | Vanilla CSS Design System with CSS Variables, Flexbox, Grid, Glassmorphism & Dark Mode |
| **Backend** | Node.js, Express.js (MVC Architecture), Mongoose |
| **Database** | MongoDB / MongoDB Atlas (with automatic fallback to `mongodb-memory-server` for seamless zero-setup local runs) |
| **Authentication** | JSON Web Token (JWT) & bcryptjs |
| **File Handling** | Multer (PDF validation & static file serving) |
| **Email Service** | Nodemailer |
| **Data Export** | json2csv |

---

## 📁 Repository Structure

```
Skillflow major 1/
├── server/                          # Backend REST API Server (Node + Express + Mongoose)
│   ├── config/                      # Database configuration & MongoMemoryServer fallback
│   ├── controllers/                 # Auth, Job, Applicant, Analytics controllers
│   ├── middleware/                  # JWT auth, Multer upload, Centralized error handler
│   ├── models/                      # User, Job, Applicant Mongoose Schemas
│   ├── routes/                      # API endpoint routes (/api/auth, /api/jobs, etc.)
│   ├── services/                    # Email notification (Nodemailer) & CSV export
│   ├── utils/                       # Database seed script & test data generator
│   ├── uploads/                     # Resume PDF storage directory
│   ├── server.js                    # Backend entry point
│   └── package.json
│
├── client/                          # Frontend SPA (React + TypeScript + Vite)
│   ├── src/
│   │   ├── components/              # Navbar, Sidebar, JobCard, ApplicantCard, KanbanBoard,
│   │   │                            # ResumeModal, CreateJobModal, AddApplicantModal, SearchBar
│   │   ├── context/                 # AuthContext, ThemeContext
│   │   ├── hooks/                   # useDebounce hook
│   │   ├── pages/                   # LoginPage, RegisterPage, DashboardPage, JobsPage,
│   │   │                            # JobDetailPage, ApplicantsPage, ApplicantDetailPage, ProfilePage
│   │   ├── services/                # Centralized Axios API Service
│   │   ├── types/                   # TypeScript Interfaces (User, Job, Applicant, Stats)
│   │   ├── utils/                   # Formatters & CSV file download helper
│   │   ├── index.css                # CSS Design System & Variables
│   │   ├── App.tsx                  # App layout & route guards
│   │   └── main.tsx                 # Entry point
│   ├── vite.config.ts               # Proxy configuration to port 5000
│   └── package.json
│
├── .gitignore                       # Git ignore configuration
└── README.md                        # Documentation & setup guide
```

---

## 🔑 Test Recruiter Credentials

You can log into the platform immediately using the pre-seeded recruiter test account:

- **Email**: `recruiter@smarthire.com`
- **Password**: `SmartHire2026!`
- **Role**: `recruiter`
- **Company**: `SmartHire Global Inc.`

---

## 💻 Local Installation & Running Guide

### Prerequisites
- **Node.js**: v18+ or v24+
- **NPM**: v9+ or v11+

### Step 1: Clone Repository & Setup Backend
```bash
cd "Skillflow major 1/server"
npm install
npm run seed     # (Optional) Manually seed test recruiter & jobs data
npm dev          # Starts Express backend on http://localhost:5000
```

### Step 2: Setup Frontend
Open a new terminal window:
```bash
cd "Skillflow major 1/client"
npm install
npm run dev      # Starts Vite React dev server on http://localhost:3000
```

Open your browser and navigate to `http://localhost:3000`.

---

## 📡 REST API Documentation

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | No | Register new recruiter account |
| `POST` | `/api/auth/login` | No | Authenticate recruiter & return JWT token |
| `GET` | `/api/auth/me` | Yes | Get logged in recruiter profile |
| `PUT` | `/api/auth/profile` | Yes | Update recruiter name, company, avatar |
| `GET` | `/api/jobs` | No | List jobs with search, department & status filters, pagination |
| `POST` | `/api/jobs` | Yes | Post a new job opening |
| `GET` | `/api/jobs/:id` | No | Get single job details with applicants list |
| `PUT` | `/api/jobs/:id` | Yes | Update job details |
| `DELETE` | `/api/jobs/:id` | Yes | Delete job listing and associated applicants |
| `GET` | `/api/applicants` | Yes | List applicants (Kanban or Grid view) |
| `POST` | `/api/applicants` | No/Yes | Add applicant record with PDF resume upload |
| `GET` | `/api/applicants/:id` | Yes | Get candidate details, evaluation notes & rating |
| `PATCH` | `/api/applicants/:id/status` | Yes | Update hiring stage & trigger candidate email |
| `PUT` | `/api/applicants/:id` | Yes | Update candidate rating stars and recruiter notes |
| `DELETE` | `/api/applicants/:id` | Yes | Remove candidate record |
| `GET` | `/api/applicants/export/csv` | Yes | Export applicant dataset as CSV file |
| `GET` | `/api/analytics/dashboard` | Yes | Fetch overview statistics & stage metrics |

---

## ⚙️ Environment Variables Reference

### Backend (`server/.env`)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/smarthire
JWT_SECRET=smarthire_super_secret_jwt_key_2026_recruitment
JWT_EXPIRE=30d

# SMTP Email Configuration (Nodemailer - optional)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass
FROM_EMAIL=notifications@smarthire.com
FROM_NAME=SmartHire ATS
```

---

## 🌐 Deployment Configuration

### Frontend Deployment → Vercel
1. Root directory: `client`
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add environment variable `VITE_API_BASE_URL` pointing to Render backend URL.

### Backend Deployment → Render
1. Environment: `Node`
2. Root directory: `server`
3. Build command: `npm install`
4. Start command: `node server.js`
5. Configure `MONGODB_URI` environment variable with MongoDB Atlas cluster URI.

### Database → MongoDB Atlas
1. Create a cluster on MongoDB Atlas.
2. Add network IP access `0.0.0.0/0`.
3. Obtain connection string URI and set `MONGODB_URI`.

---

## 📄 Deliverables Summary for Submission

- **Live Application URL (Vercel)**: `https://smarthire-ats.vercel.app`
- **Backend API URL (Render)**: `https://smarthire-api.onrender.com`
- **GitHub Repository**: `https://github.com/recruiter-tech/smarthire-ats`
- **Test Recruiter Credentials**:
  - Email: `recruiter@smarthire.com`
  - Password: `SmartHire2026!`
