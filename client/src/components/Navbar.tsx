import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogOut, Briefcase, User as UserIcon, Plus } from 'lucide-react';

interface NavbarProps {
  onOpenCreateJob?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCreateJob }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="glass-card" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}>
            <Briefcase size={22} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>Smart<span style={{ color: 'var(--accent-primary)' }}>Hire</span></span>
            <span style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Applicant Tracking</span>
          </div>
        </Link>

        {/* Right Action Icons & User Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Dark / Light Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-secondary btn-sm"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            style={{ borderRadius: '50%', width: '38px', height: '38px', padding: 0 }}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {isAuthenticated ? (
            <>
              {onOpenCreateJob && (
                <button onClick={onOpenCreateJob} className="btn btn-primary btn-sm">
                  <Plus size={16} />
                  <span>Post Job</span>
                </button>
              )}

              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none', color: 'var(--text-primary)', padding: '0.375rem 0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-tertiary)' }}>
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={user?.name}
                  style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }} className="desktop-only">{user?.name.split(' ')[0]}</span>
              </Link>

              <button onClick={handleLogout} className="btn btn-outline btn-sm" title="Log Out">
                <LogOut size={16} />
                <span className="desktop-only">Logout</span>
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm">Log In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
