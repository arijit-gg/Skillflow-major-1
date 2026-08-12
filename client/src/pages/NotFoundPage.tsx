import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', padding: '1rem', textAlign: 'center' }}>
      <div className="glass-card" style={{ maxWidth: '440px', width: '100%', padding: '3rem 2rem' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
          <AlertCircle size={36} />
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>404 - Page Not Found</h1>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
          The page or recruitment route you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary btn-lg" style={{ display: 'inline-flex', width: '100%' }}>
          <Home size={18} />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};
