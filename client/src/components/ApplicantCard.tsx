import React from 'react';
import { Applicant, ApplicantStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { Mail, Phone, FileText, Star, Trash2, Calendar, Send } from 'lucide-react';
import { formatDate } from '../utils/formatters';
import { Link } from 'react-router-dom';

interface ApplicantCardProps {
  applicant: Applicant;
  onStatusChange?: (id: string, newStatus: ApplicantStatus) => void;
  onViewResume?: (resumeUrl: string, name: string) => void;
  onDelete?: (id: string) => void;
}

export const ApplicantCard: React.FC<ApplicantCardProps> = ({
  applicant,
  onStatusChange,
  onViewResume,
  onDelete,
}) => {
  const jobTitle = typeof applicant.job === 'object' ? applicant.job.title : 'Job Posting';

  const stages: ApplicantStatus[] = ['Applied', 'Screening', 'Interviewing', 'Offered', 'Hired', 'Rejected'];

  return (
    <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              <Link to={`/applicants/${applicant._id}`} style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>
                {applicant.fullName}
              </Link>
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-tertiary)', padding: '0.125rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
              {jobTitle}
            </span>
          </div>

          <StatusBadge status={applicant.status} />
        </div>

        {/* Contact Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Mail size={14} style={{ color: 'var(--text-muted)' }} />
            <span>{applicant.email}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Phone size={14} style={{ color: 'var(--text-muted)' }} />
            <span>{applicant.phone}</span>
          </div>
        </div>

        {/* Rating Stars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.875rem' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={14}
              style={{
                fill: star <= applicant.rating ? '#f59e0b' : 'none',
                color: star <= applicant.rating ? '#f59e0b' : 'var(--text-muted)',
              }}
            />
          ))}
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.375rem' }}>
            ({applicant.rating}/5)
          </span>
        </div>

        {applicant.notes && (
          <p style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)', fontStyle: 'italic', backgroundColor: 'var(--bg-tertiary)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', borderLeft: '3px solid var(--accent-primary)' }}>
            "{applicant.notes}"
          </p>
        )}
      </div>

      {/* Footer Controls */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
        {/* Stage Changer Dropdown */}
        {onStatusChange ? (
          <select
            value={applicant.status}
            onChange={(e) => onStatusChange(applicant._id, e.target.value as ApplicantStatus)}
            className="form-select"
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', width: 'auto', flex: 1 }}
          >
            {stages.map((st) => (
              <option key={st} value={st}>
                Stage: {st}
              </option>
            ))}
          </select>
        ) : (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {formatDate(applicant.appliedDate)}
          </span>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          {onViewResume && (
            <button
              onClick={() => onViewResume(applicant.resumeUrl, applicant.fullName)}
              className="btn btn-outline btn-sm"
              title="Preview PDF Resume"
              style={{ padding: '0.375rem 0.5rem' }}
            >
              <FileText size={14} />
              <span style={{ fontSize: '0.75rem' }}>Resume</span>
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(applicant._id)}
              className="btn btn-danger btn-sm"
              title="Delete Applicant"
              style={{ padding: '0.375rem 0.5rem' }}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
