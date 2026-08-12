import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Job, Applicant, ApplicantStatus } from '../types';
import { jobsAPI, applicantsAPI } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { ApplicantCard } from '../components/ApplicantCard';
import { ResumeModal } from '../components/ResumeModal';
import { AddApplicantModal } from '../components/AddApplicantModal';
import { ArrowLeft, MapPin, DollarSign, Users, UserPlus, Briefcase, Calendar } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<(Job & { applicants: Applicant[] }) | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeResume, setActiveResume] = useState<{ url: string; name: string } | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    if (id) fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const res = await jobsAPI.getJobById(id!);
      if (res.success && res.data) {
        setJob(res.data);
      }
    } catch (err) {
      console.error('Failed to load job details', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicantId: string, newStatus: ApplicantStatus) => {
    try {
      const res = await applicantsAPI.updateStatus(applicantId, newStatus);
      if (res.success && job) {
        setJob({
          ...job,
          applicants: job.applicants.map((a) =>
            a._id === applicantId ? { ...a, status: newStatus } : a
          ),
        });
      }
    } catch (err) {
      alert('Failed to update candidate status.');
    }
  };

  const handleDeleteApplicant = async (applicantId: string) => {
    if (!window.confirm('Delete this candidate record?')) return;
    try {
      await applicantsAPI.deleteApplicant(applicantId);
      if (job) {
        setJob({
          ...job,
          applicants: job.applicants.filter((a) => a._id !== applicantId),
        });
      }
    } catch (err) {
      alert('Failed to delete applicant.');
    }
  };

  if (loading) {
    return <div className="glass-card skeleton" style={{ height: '400px' }} />;
  }

  if (!job) {
    return (
      <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
        <h3>Job Opening Not Found</h3>
        <Link to="/jobs" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Jobs</Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.875rem' }}>
        <ArrowLeft size={16} />
        <span>Back to All Jobs</span>
      </Link>

      {/* Job Detail Header Card */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {job.department} Department
            </span>
            <h1 style={{ fontSize: '1.875rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>{job.title}</h1>
          </div>
          <StatusBadge status={job.status} />
        </div>

        {/* Quick Attributes */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.9375rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
            <MapPin size={16} style={{ color: 'var(--accent-primary)' }} />
            {job.location}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
            <DollarSign size={16} style={{ color: 'var(--accent-emerald)' }} />
            {job.salaryRange}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
            <Briefcase size={16} style={{ color: 'var(--accent-amber)' }} />
            {job.jobType}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
            <Calendar size={16} style={{ color: 'var(--text-muted)' }} />
            Posted {formatDate(job.createdAt)}
          </span>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Description & Scope</h4>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
            {job.description}
          </p>
        </div>

        {job.requirements && job.requirements.length > 0 && (
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Required Skills & Expertise</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {job.requirements.map((req, i) => (
                <span key={i} style={{ fontSize: '0.8125rem', backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', padding: '0.375rem 0.75rem', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
                  {req}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Candidates Applied to this Job */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.375rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={20} style={{ color: 'var(--accent-primary)' }} />
          <span>Applicants for this Position ({job.applicants ? job.applicants.length : 0})</span>
        </h2>
        <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary btn-sm">
          <UserPlus size={16} />
          <span>Add Candidate to Job</span>
        </button>
      </div>

      {job.applicants && job.applicants.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {job.applicants.map((app) => (
            <ApplicantCard
              key={app._id}
              applicant={app}
              onStatusChange={handleStatusChange}
              onViewResume={(url, name) => setActiveResume({ url, name })}
              onDelete={handleDeleteApplicant}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p style={{ marginBottom: '1rem' }}>No candidates have applied to this specific job post yet.</p>
          <button onClick={() => setIsAddModalOpen(true)} className="btn btn-outline btn-sm">
            <UserPlus size={16} />
            <span>Add Candidate</span>
          </button>
        </div>
      )}

      {/* PDF Resume Viewer Modal */}
      {activeResume && (
        <ResumeModal
          isOpen={!!activeResume}
          resumeUrl={activeResume.url}
          candidateName={activeResume.name}
          onClose={() => setActiveResume(null)}
        />
      )}

      {/* Add Applicant Modal */}
      {isAddModalOpen && (
        <AddApplicantModal
          isOpen={isAddModalOpen}
          jobs={[job]}
          defaultJobId={job._id}
          onClose={() => setIsAddModalOpen(false)}
          onApplicantAdded={(newApplicant) => {
            setJob({
              ...job,
              applicants: [newApplicant, ...(job.applicants || [])],
            });
            setIsAddModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
