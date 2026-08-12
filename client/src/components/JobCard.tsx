import React from 'react';
import { Job } from '../types';
import { StatusBadge } from './StatusBadge';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Users, Calendar, Edit3, Trash2, ChevronRight } from 'lucide-react';
import { formatDate } from '../utils/formatters';

interface JobCardProps {
  job: Job;
  onEdit?: (job: Job) => void;
  onDelete?: (id: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onEdit, onDelete }) => {
  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {job.department}
            </span>
            <h3 style={{ fontSize: '1.125rem', marginTop: '0.125rem', marginBottom: '0.25rem' }}>
              <Link to={`/jobs/${job._id}`} style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>
                {job.title}
              </Link>
            </h3>
          </div>
          <StatusBadge status={job.status} />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
            <MapPin size={14} style={{ color: 'var(--text-muted)' }} />
            {job.location}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
            <DollarSign size={14} style={{ color: 'var(--text-muted)' }} />
            {job.salaryRange}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', backgroundColor: 'var(--bg-tertiary)', padding: '0.125rem 0.5rem', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
            {job.jobType}
          </span>
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {job.description}
        </p>

        {job.requirements && job.requirements.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1.25rem' }}>
            {job.requirements.slice(0, 3).map((req, idx) => (
              <span key={idx} style={{ fontSize: '0.6875rem', backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                {req}
              </span>
            ))}
            {job.requirements.length > 3 && (
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', padding: '0.25rem' }}>
                +{job.requirements.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          <Users size={16} style={{ color: 'var(--accent-primary)' }} />
          <span><strong>{job.applicantCount || 0}</strong> Applicants</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {onEdit && (
            <button onClick={() => onEdit(job)} className="btn btn-secondary btn-sm" title="Edit Job">
              <Edit3 size={14} />
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(job._id)} className="btn btn-danger btn-sm" title="Delete Job">
              <Trash2 size={14} />
            </button>
          )}
          <Link to={`/jobs/${job._id}`} className="btn btn-primary btn-sm">
            <span>View</span>
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
