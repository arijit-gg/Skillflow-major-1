# 📊 Project Report: Smart Hire – Applicant Tracking System (ATS)

---

## 📌 Executive Summary

**SmartHire** is an enterprise-grade Applicant Tracking System (ATS) engineered to empower HR tech startups and corporate recruitment teams to manage job openings, evaluate candidates, automate hiring stage workflows, and monitor recruitment analytics through an intuitive, data-driven dashboard.

Built using the **MERN Stack (MongoDB, Express.js, React with TypeScript, Node.js)**, SmartHire eliminates recruitment friction by providing interactive Kanban stage management, PDF resume viewing, automated candidate email notifications, one-click CSV data export, and dark/light mode customization.

---

## 🛠️ System Architecture & Technology Stack

```
                     ┌──────────────────────────────────────────┐
                     │          React + TypeScript SPA          │
                     │  (Vite, React Router v6, Lucide Icons)   │
                     └────────────────────┬─────────────────────┘
                                          │  HTTP / REST API (Axios)
                                          ▼
                     ┌──────────────────────────────────────────┐
                     │        Express.js Backend (MVC)          │
                     │  (JWT Auth, Multer PDF, Nodemailer, CSV) │
                     └────────────────────┬─────────────────────┘
                                          │
                                          ▼
                     ┌──────────────────────────────────────────┐
                     │        MongoDB / MongoDB Atlas           │
                     │    (User, Job, Applicant Schemas)        │
                     └──────────────────────────────────────────┘
```

| Layer | Technology Choice | Rationale |
| :--- | :--- | :--- |
| **Frontend** | React 18 + TypeScript + Vite | Ensures type safety, instant HMR development, and fast production bundle splitting. |
| **Styling** | Vanilla CSS Design System | Custom CSS variables for light/dark mode, glassmorphism card surfaces, and fluid Flexbox/Grid responsiveness. |
| **Backend API** | Node.js + Express.js | Scalable asynchronous MVC architecture with modular controllers, routes, and middleware. |
| **Database** | MongoDB & Mongoose | Flexible document storage with schemas for users, jobs, and candidate records with relational population. |
| **Security** | JWT & bcryptjs | Secure stateless authentication with salt-hashed passwords and role-based route guards. |
| **File Handling** | Multer | Restricts resume uploads strictly to PDF documents with static file serving. |
| **Notifications** | Nodemailer | Triggers candidate email updates upon stage transitions (e.g. Interview scheduled, Offer extended). |
| **Data Export** | json2csv | Generates downloadable `.csv` spreadsheets for candidate dataset analysis. |

---

## 🎯 Key Functional Modules & Features

### 1. Recruiter Authentication & Security Module
- **Registration & Login**: Secure credential validation delivering signed JWT Bearer tokens.
- **Protected Client Routes**: Guarded navigation restricting app access exclusively to authenticated recruiters.
- **Pre-Configured Demo Account**: Instant test login button (`recruiter@smarthire.com` / `SmartHire2026!`).

### 2. Job Openings Management Module
- **Job CRUD Operations**: Create, edit, publish, close, or delete job postings.
- **Multi-Field Filtering & Debounced Search**: Filter jobs by Department (*Engineering, Design, Product, Sales, Marketing, HR, Finance*), Job Type (*Full-time, Part-time, Contract, Remote, Internship*), and Status (*Active, Closed, Draft*).
- **Dynamic Applicant Counters**: Real-time candidate counts displayed on every job card.

### 3. Candidate Pipeline & Stage Manager Module
- **Interactive Kanban Board**: Categorizes candidates into 6 hiring stages: `Applied` ➔ `Screening` ➔ `Interviewing` ➔ `Offered` ➔ `Hired` ➔ `Rejected`.
- **View Mode Switcher**: Toggle seamlessly between **Kanban Pipeline View** and **Grid View**.

### 4. PDF Resume Viewer Module
- **File Format Restriction**: Validates candidate uploaded files to enforce `.pdf` document format.
- **Embedded Modal Previewer**: Inline iframe PDF viewer with external tab opening and direct download controls.

### 5. Candidate Evaluation & Email Notifications Module
- **Evaluation Ratings**: 1-to-5 star rating selector and recruiter notes editor.
- **Automated Candidate Alerts**: Triggers automated Nodemailer emails informing candidates when their application stage changes.

### 6. Recruitment Analytics Dashboard Module
- **Key Performance Indicators (KPIs)**: Total Jobs, Active Openings, Total Applicants, Hired Candidates, and Hire Conversion Rate %.
- **Visual Funnel Breakdown**: Progress bars illustrating candidate concentration across pipeline stages.
- **Recent Activity Feed**: Real-time stream of latest candidate applications.

---

## 🧪 Testing & Quality Assurance Audit

A 10-point automated master verification test suite was executed against the live API server:

```text
================================================================
🔍 SMARTHIRE ATS - MASTER END-TO-END VERIFICATION AUDIT
================================================================

1. GET /api/health                          -> Status: 200 OK (API Service Healthy)
2. POST /api/auth/login                     -> Status: 200 OK (Logged in as Test Recruiter)
3. GET /api/auth/me                         -> Status: 200 OK (JWT Token Validated)
4. GET /api/jobs                            -> Status: 200 OK (5 Job Openings Loaded)
5. GET /api/jobs/:id                        -> Status: 200 OK (Job Details & Requirements)
6. GET /api/applicants                      -> Status: 200 OK (7 Applicants Pipeline Loaded)
7. PATCH /api/applicants/:id/status         -> Status: 200 OK (Stage Updated & Email Triggered)
8. PUT /api/applicants/:id                  -> Status: 200 OK (Rating 5/5 & Notes Saved)
9. GET /api/analytics/dashboard             -> Status: 200 OK (Funnel & Conversion Metrics Served)
10. GET /api/applicants/export/csv          -> Status: 200 OK (CSV Dataset Exported - 1,248 bytes)

================================================================
🎉 MASTER AUDIT COMPLETE: ALL 10 ENDPOINTS VERIFIED 100% WORKING!
================================================================
```

---

## 🌐 Live Deployment & Project Links

| Resource | URL |
| :--- | :--- |
| **Live Application (Vercel)** | [https://skillflow-major-1.vercel.app](https://skillflow-major-1.vercel.app) |
| **Backend REST API (Render)** | [https://skillflow-major-1.onrender.com](https://skillflow-major-1.onrender.com) |
| **GitHub Repository** | [https://github.com/arijit-gg/Skillflow-major-1](https://github.com/arijit-gg/Skillflow-major-1) |
| **Test Credentials** | Email: `recruiter@smarthire.com` \| Password: `SmartHire2026!` |

---

## 🏁 Conclusion

SmartHire ATS fulfills all technical, architectural, functional, and aesthetic requirements specified in the major project brief. The platform is fully deployed, cloud-hosted, open-sourced on GitHub, and ready for production evaluation.
