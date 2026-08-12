import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Users, User, Download, PlusCircle } from 'lucide-react';

interface SidebarProps {
  onOpenCreateJob?: () => void;
  onExportCSV?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenCreateJob, onExportCSV }) => {
  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Jobs Pipeline', path: '/jobs', icon: Briefcase },
    { label: 'Applicants', path: '/applicants', icon: Users },
    { label: 'Recruiter Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className="sidebar-container" style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', paddingLeft: '0.75rem' }}>
          Navigation Menu
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `btn ${isActive ? 'btn-primary' : 'btn-outline'}`
                }
                style={{
                  justifyContent: 'flex-start',
                  border: 'none',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'left',
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Quick Action Widget */}
      <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <div style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.25rem' }}>Quick Actions</div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.875rem' }}>Manage candidate workflow & export data.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {onOpenCreateJob && (
            <button onClick={onOpenCreateJob} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
              <PlusCircle size={15} />
              <span>Create Job Post</span>
            </button>
          )}
          {onExportCSV && (
            <button onClick={onExportCSV} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
              <Download size={15} />
              <span>Export CSV</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
