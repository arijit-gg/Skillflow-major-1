import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Applicant, ApplicantStatus } from '../types';
import { applicantsAPI } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { ResumeModal } from '../components/ResumeModal';
import { ArrowLeft, Mail, Phone, Calendar, Star, FileText, Send, Save, CheckCircle } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export const ApplicantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState<number>(3);
  const [notes, setNotes] = useState<string>('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [emailNotified, setEmailNotified] = useState<boolean | null>(null);

  const [isResumeOpen, setIsResumeOpen] = useState(false);

  useEffect(() => {
    if (id) fetchApplicantDetail();
  }, [id]);

  const fetchApplicantDetail = async () => {
    try {
      setLoading(true);
      const res = await applicantsAPI.getApplicantById(id!);
      if (res.success && res.data) {
        setApplicant(res.data);
        setRating(res.data.rating || 3);
        setNotes(res.data.notes || '');
      }
    } catch (err) {
      console.error('Failed to fetch applicant details', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: ApplicantStatus) => {
    if (!applicant) return;
    try {
      const res = await applicantsAPI.updateStatus(applicant._id, newStatus, true);
      if (res.success && res.data) {
        setApplicant(res.data);
        setEmailNotified(res.emailNotified || false);
        setTimeout(() => setEmailNotified(null), 4000);
      }
    } catch (err) {
      alert('Failed to update stage status.');
    }
  };

  const handleSaveNotesAndRating = async () => {
    if (!applicant) return;
    setSavingNotes(true);
    try {
      const res = await applicantsAPI.updateApplicant(applicant._id, {
        rating,
        notes,
      });
      if (res.success && res.data) {
        setApplicant(res.data);
        alert('Candidate rating and recruiter notes updated!');
      }
    } catch (err) {
      alert('Failed to save candidate updates.');
    } finally {
      setSavingNotes(false);
    }
  };

  if (loading) {
    return <div className="glass-card skeleton" style={{ height: '400px' }} />;
  }

  if (!applicant) {
    return (
      <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
        <h3>Applicant Record Not Found</h3>
        <Link to="/applicants" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Applicants</Link>
      </div>
    );
  }

  const jobTitle = typeof applicant.job === 'object' ? applicant.job.title : 'Software Role';
  const department = typeof applicant.job === 'object' ? applicant.job.department : 'Engineering';

  const stages: ApplicantStatus[] = ['Applied', 'Screening', 'Interviewing', 'Offered', 'Hired', 'Rejected'];

  return (
    <div>
      <Link to="/applicants" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.875rem' }}>
        <ArrowLeft size={16} />
        <span>Back to Applicants Pipeline</span>
      </Link>

      {/* Main Candidate Card */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Candidate Profile • {department}
            </span>
            <h1 style={{ fontSize: '1.875rem', marginTop: '0.25rem', marginBottom: '0.375rem' }}>{applicant.fullName}</h1>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
              Applied for <strong>{jobTitle}</strong>
            </p>
          </div>
          <StatusBadge status={applicant.status} />
        </div>

        {/* Candidate Contact Info */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.9375rem', color: 'var(--text-secondary)', padding: '1.25rem 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
            <Mail size={16} style={{ color: 'var(--accent-primary)' }} />
            {applicant.email}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
            <Phone size={16} style={{ color: 'var(--accent-primary)' }} />
            {applicant.phone}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
            <Calendar size={16} style={{ color: 'var(--text-muted)' }} />
            Applied on {formatDate(applicant.appliedDate)}
          </span>
        </div>

        {/* Stage Transition Selector & Email Trigger */}
        <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.75rem', border: '1px solid var(--border-color)' }}>
          <h4 style={{ fontSize: '0.9375rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Send size={16} style={{ color: 'var(--accent-primary)' }} />
            <span>Update Candidate Pipeline Stage & Send Email Notification</span>
          </h4>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
            {stages.map((st) => (
              <button
                key={st}
                onClick={() => handleStatusChange(st)}
                className={`btn btn-sm ${applicant.status === st ? 'btn-primary' : 'btn-outline'}`}
              >
                <span>Move to {st}</span>
              </button>
            ))}
          </div>

          {emailNotified !== null && (
            <div style={{ marginTop: '0.875rem', fontSize: '0.8125rem', color: emailNotified ? '#10b981' : '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <CheckCircle size={15} />
              <span>
                {emailNotified
                  ? `Automated status update email notification dispatched to candidate (${applicant.email})!`
                  : `Status updated cleanly (Email logging active).`}
              </span>
            </div>
          )}
        </div>

        {/* Resume Preview Section */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', marginBottom: '1.75rem', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FileText size={24} style={{ color: 'var(--accent-primary)' }} />
            <div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700 }}>Resume Document (PDF)</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{applicant.resumeOriginalName || 'Candidate_Resume.pdf'}</div>
            </div>
          </div>

          <button onClick={() => setIsResumeOpen(true)} className="btn btn-primary btn-sm">
            <FileText size={15} />
            <span>Preview Resume PDF</span>
          </button>
        </div>

        {/* Rating & Recruiter Notes Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.625rem' }}>Candidate Evaluation Rating</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
                >
                  <Star
                    size={24}
                    style={{
                      fill: star <= rating ? '#f59e0b' : 'none',
                      color: star <= rating ? '#f59e0b' : 'var(--text-muted)',
                    }}
                  />
                </button>
              ))}
              <span style={{ fontSize: '0.875rem', fontWeight: 700, marginLeft: '0.5rem' }}>
                {rating} / 5 Rating
              </span>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.625rem' }}>Recruiter Notes & Feedback</h4>
            <textarea
              rows={3}
              placeholder="Add interview assessment feedback, salary expectations, or screening notes..."
              className="form-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ marginBottom: '0.875rem' }}
            />
            <button onClick={handleSaveNotesAndRating} disabled={savingNotes} className="btn btn-primary btn-sm">
              <Save size={15} />
              <span>{savingNotes ? 'Saving...' : 'Save Evaluation Notes'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* PDF Resume Viewer Modal */}
      {isResumeOpen && (
        <ResumeModal
          isOpen={isResumeOpen}
          resumeUrl={applicant.resumeUrl}
          candidateName={applicant.fullName}
          onClose={() => setIsResumeOpen(false)}
        />
      )}
    </div>
  );
};
