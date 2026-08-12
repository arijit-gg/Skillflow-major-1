import React, { useState, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { CreateJobModal } from './components/CreateJobModal';
import { AddApplicantModal } from './components/AddApplicantModal';
import { jobsAPI, applicantsAPI } from './services/api';
import { Job, Applicant } from './types';
import { downloadBlobFile } from './utils/formatters';

// Lazy Loaded Pages for performance optimization & code splitting
const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const JobsPage = lazy(() => import('./pages/JobsPage').then((m) => ({ default: m.JobsPage })));
const JobDetailPage = lazy(() => import('./pages/JobDetailPage').then((m) => ({ default: m.JobDetailPage })));
const ApplicantsPage = lazy(() => import('./pages/ApplicantsPage').then((m) => ({ default: m.ApplicantsPage })));
const ApplicantDetailPage = lazy(() => import('./pages/ApplicantDetailPage').then((m) => ({ default: m.ApplicantDetailPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

// Protected Route Guard Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div className="glass-card skeleton" style={{ width: '120px', height: '120px', borderRadius: '50%' }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [isAddApplicantOpen, setIsAddApplicantOpen] = useState(false);
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const handleOpenAddApplicant = async () => {
    try {
      const res = await jobsAPI.getJobs({ limit: 50 });
      if (res.success && res.data) {
        setAvailableJobs(res.data);
      }
    } catch (err) {
      console.error('Failed to load jobs', err);
    }
    setIsAddApplicantOpen(true);
  };

  const handleExportCSV = async () => {
    try {
      const blob = await applicantsAPI.exportCSV();
      downloadBlobFile(blob, `SmartHire_Applicants_${Date.now()}.csv`);
    } catch (err) {
      alert('Failed to generate CSV export.');
    }
  };

  return (
    <div className="app-container">
      <Navbar onOpenCreateJob={isAuthenticated ? () => setIsCreateJobOpen(true) : undefined} />

      <div className="main-layout">
        {isAuthenticated && !isAuthPage && (
          <Sidebar
            onOpenCreateJob={() => setIsCreateJobOpen(true)}
            onExportCSV={handleExportCSV}
          />
        )}

        <main className="content-container">
          <Suspense
            fallback={
              <div className="glass-card skeleton" style={{ height: '350px', width: '100%' }} />
            }
          >
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardPage
                      onOpenCreateJob={() => setIsCreateJobOpen(true)}
                      onOpenAddApplicant={handleOpenAddApplicant}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/jobs"
                element={
                  <ProtectedRoute>
                    <JobsPage onOpenCreateJob={() => setIsCreateJobOpen(true)} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/jobs/:id"
                element={
                  <ProtectedRoute>
                    <JobDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/applicants"
                element={
                  <ProtectedRoute>
                    <ApplicantsPage onOpenAddApplicant={handleOpenAddApplicant} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/applicants/:id"
                element={
                  <ProtectedRoute>
                    <ApplicantDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* 404 Catch All */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
      </div>

      {/* Global Modals */}
      {isCreateJobOpen && (
        <CreateJobModal
          isOpen={isCreateJobOpen}
          onClose={() => setIsCreateJobOpen(false)}
          onJobCreated={() => {
            setIsCreateJobOpen(false);
            window.location.reload();
          }}
        />
      )}

      {isAddApplicantOpen && (
        <AddApplicantModal
          isOpen={isAddApplicantOpen}
          jobs={availableJobs}
          onClose={() => setIsAddApplicantOpen(false)}
          onApplicantAdded={() => {
            setIsAddApplicantOpen(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};

export default App;
