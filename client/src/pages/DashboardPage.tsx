import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI, applicantsAPI } from '../services/api';
import { DashboardStats, ApplicantStatus } from '../types';
import { DashboardCards } from '../components/DashboardCards';
import { StatusBadge } from '../components/StatusBadge';
import { Link } from 'react-router-dom';
import { Plus, Users, Download, ArrowUpRight, BarChart3, Briefcase, FileText } from 'lucide-react';
import { formatDate, downloadBlobFile } from '../utils/formatters';

interface DashboardPageProps {
  onOpenCreateJob: () => void;
  onOpenAddApplicant: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onOpenCreateJob,
  onOpenAddApplicant,
}) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await analyticsAPI.getDashboardStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await applicantsAPI.exportCSV();
      downloadBlobFile(blob, `SmartHire_Applicants_${Date.now()}.csv`);
    } catch (err) {
      console.error('Export CSV failed', err);
    }
  };

  return (
    <div>
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '1.75rem 2rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)', border: '1px solid var(--accent-light)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
              Welcome back, {user?.name.split(' ')[0]} 👋
            </h1>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
              Here is your recruitment overview for <strong>{user?.companyName}</strong>.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={handleExportCSV} className="btn btn-secondary btn-sm">
              <Download size={15} />
              <span>Export CSV</span>
            </button>
            <button onClick={onOpenAddApplicant} className="btn btn-outline btn-sm">
              <Users size={15} />
              <span>Add Candidate</span>
            </button>
            <button onClick={onOpenCreateJob} className="btn btn-primary btn-sm">
              <Plus size={15} />
              <span>Post New Job</span>
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <DashboardCards summary={stats?.summary} loading={loading} />

      {/* Pipeline Breakdown & Recent Applications Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Candidate Pipeline Stage Metrics */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={18} style={{ color: 'var(--accent-primary)' }} />
              <span>Recruitment Funnel</span>
            </h3>
            <Link to="/applicants" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>View All</Link>
          </div>

          {stats ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {Object.entries(stats.statusBreakdown).map(([stage, count]) => {
                const total = stats.summary.totalApplicants || 1;
                const percent = Math.round((count / total) * 100);

                return (
                  <div key={stage}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.375rem' }}>
                      <span style={{ fontWeight: 600 }}>{stage}</span>
                      <span style={{ color: 'var(--text-secondary)' }}><strong>{count}</strong> ({percent}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${percent}%`,
                          borderRadius: '9999px',
                          backgroundColor:
                            stage === 'Hired' ? '#10b981' :
                            stage === 'Offered' ? '#9333ea' :
                            stage === 'Interviewing' ? '#f59e0b' :
                            stage === 'Screening' ? '#06b6d4' :
                            stage === 'Rejected' ? '#f43f5e' : '#6366f1',
                          transition: 'width 0.5s ease',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="skeleton" style={{ height: '220px' }} />
          )}
        </div>

        {/* Recent Candidate Activity Feed */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} style={{ color: 'var(--accent-primary)' }} />
              <span>Recent Applications</span>
            </h3>
            <Link to="/applicants" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Manage Pipeline</Link>
          </div>

          {stats?.recentApplicants && stats.recentApplicants.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {stats.recentApplicants.map((app) => (
                <div key={app._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                  <div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 700 }}>
                      <Link to={`/applicants/${app._id}`} style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>
                        {app.fullName}
                      </Link>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {typeof app.job === 'object' ? app.job.title : 'Software Developer'} • {formatDate(app.appliedDate)}
                    </div>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
              No recent applications received yet.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
