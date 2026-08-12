import React from 'react';
import { DashboardSummary } from '../types';
import { Briefcase, Users, UserCheck, CheckCircle, TrendingUp } from 'lucide-react';

interface DashboardCardsProps {
  summary?: DashboardSummary;
  loading?: boolean;
}

export const DashboardCards: React.FC<DashboardCardsProps> = ({ summary, loading }) => {
  if (loading || !summary) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card skeleton" style={{ height: '110px' }} />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Job Postings',
      value: summary.totalJobs,
      subtitle: `${summary.activeJobs} Active • ${summary.closedJobs} Closed`,
      icon: Briefcase,
      color: 'var(--accent-primary)',
      bgColor: 'rgba(99, 102, 241, 0.12)',
    },
    {
      title: 'Total Applicants',
      value: summary.totalApplicants,
      subtitle: 'Applications Received',
      icon: Users,
      color: '#06b6d4',
      bgColor: 'rgba(6, 182, 212, 0.12)',
    },
    {
      title: 'In Interview Stage',
      value: summary.interviewingApplicants,
      subtitle: `${summary.offeredApplicants} Offer(s) Extended`,
      icon: UserCheck,
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.12)',
    },
    {
      title: 'Successful Hires',
      value: summary.hiredApplicants,
      subtitle: `${summary.conversionRate}% Conversion Rate`,
      icon: CheckCircle,
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.12)',
    },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{card.title}</span>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: card.bgColor, color: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Plus Jakarta Sans' }}>
                {card.value}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.375rem' }}>
              <TrendingUp size={13} style={{ color: card.color }} />
              <span>{card.subtitle}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
