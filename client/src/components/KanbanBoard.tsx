import React from 'react';
import { Applicant, ApplicantStatus } from '../types';
import { ApplicantCard } from './ApplicantCard';
import { FileText, Clock, UserCheck, Award, CheckCircle2, XCircle } from 'lucide-react';

interface KanbanBoardProps {
  applicants: Applicant[];
  onStatusChange: (id: string, newStatus: ApplicantStatus) => void;
  onViewResume: (url: string, name: string) => void;
  onDelete: (id: string) => void;
}

const columns: { status: ApplicantStatus; title: string; icon: any; color: string }[] = [
  { status: 'Applied', title: 'New Applied', icon: FileText, color: '#6366f1' },
  { status: 'Screening', title: 'Screening', icon: Clock, color: '#0891b2' },
  { status: 'Interviewing', title: 'Interviewing', icon: UserCheck, color: '#d97706' },
  { status: 'Offered', title: 'Offer Extended', icon: Award, color: '#9333ea' },
  { status: 'Hired', title: 'Hired', icon: CheckCircle2, color: '#059669' },
  { status: 'Rejected', title: 'Rejected', icon: XCircle, color: '#e11d48' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  applicants,
  onStatusChange,
  onViewResume,
  onDelete,
}) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
      {columns.map((col) => {
        const Icon = col.icon;
        const colApplicants = applicants.filter((app) => app.status === col.status);

        return (
          <div
            key={col.status}
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '400px',
            }}
          >
            {/* Column Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '2px solid ' + col.color }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Icon size={18} style={{ color: col.color }} />
                <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {col.title}
                </span>
              </div>

              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor: 'var(--bg-secondary)',
                  color: col.color,
                  padding: '0.125rem 0.625rem',
                  borderRadius: '9999px',
                  border: '1px solid var(--border-color)',
                }}
              >
                {colApplicants.length}
              </span>
            </div>

            {/* Candidates Column List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', flex: 1 }}>
              {colApplicants.length === 0 ? (
                <div style={{ border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                  No candidates in this stage
                </div>
              ) : (
                colApplicants.map((app) => (
                  <ApplicantCard
                    key={app._id}
                    applicant={app}
                    onStatusChange={onStatusChange}
                    onViewResume={onViewResume}
                    onDelete={onDelete}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
