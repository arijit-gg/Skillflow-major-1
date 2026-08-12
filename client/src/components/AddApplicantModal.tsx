import React, { useState } from 'react';
import { X, UserPlus, Upload, FileText } from 'lucide-react';
import { Job, Applicant } from '../types';
import { applicantsAPI } from '../services/api';

interface AddApplicantModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: Job[];
  defaultJobId?: string;
  onApplicantAdded: (applicant: Applicant) => void;
}

export const AddApplicantModal: React.FC<AddApplicantModalProps> = ({
  isOpen,
  onClose,
  jobs,
  defaultJobId,
  onApplicantAdded,
}) => {
  const [jobId, setJobId] = useState(defaultJobId || (jobs[0]?._id || ''));
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [rating, setRating] = useState('3');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type !== 'application/pdf' && !selected.name.toLowerCase().endsWith('.pdf')) {
        setError('Only PDF documents are allowed for candidate resume upload.');
        setFile(null);
        return;
      }
      setError(null);
      setFile(selected);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobId) {
      setError('Please select a job opening for this application.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('jobId', jobId);
      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('rating', rating);
      formData.append('notes', notes);

      if (file) {
        formData.append('resume', file);
      }

      const response = await applicantsAPI.addApplicant(formData);

      if (response.success && response.data) {
        onApplicantAdded(response.data);
        onClose();
        setFullName('');
        setEmail('');
        setPhone('');
        setNotes('');
        setFile(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit applicant record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserPlus size={20} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ fontSize: '1.25rem' }}>Add Candidate Application</h3>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}>
            <X size={18} />
          </button>
        </div>

        {error && (
          <div style={{ padding: '0.75rem 1rem', backgroundColor: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent-rose)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', marginBottom: '1rem', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Job Opening *</label>
            <select
              required
              className="form-select"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
            >
              {jobs.map((j) => (
                <option key={j._id} value={j._id}>
                  {j.title} ({j.department})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. John Doe"
              className="form-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                required
                placeholder="john@example.com"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="+1 (555) 000-0000"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          {/* PDF Resume File Upload Field */}
          <div className="form-group">
            <label className="form-label">Resume Document (PDF only) *</label>
            <div
              style={{
                border: '2px dashed var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                padding: '1.25rem',
                textAlign: 'center',
                backgroundColor: 'var(--bg-tertiary)',
                cursor: 'pointer',
              }}
              onClick={() => document.getElementById('resume-file-input')?.click()}
            >
              <input
                id="resume-file-input"
                type="file"
                accept=".pdf,application/pdf"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <Upload size={24} style={{ color: 'var(--accent-primary)', marginBottom: '0.375rem' }} />
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                {file ? file.name : 'Click to select or drag & drop candidate PDF resume'}
              </p>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB PDF` : 'PDF format only, up to 10MB'}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Initial Rating</label>
              <select
                className="form-select"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                <option value="5">5 - Excellent Match</option>
                <option value="4">4 - Strong Candidate</option>
                <option value="3">3 - Average Fit</option>
                <option value="2">2 - Weak Fit</option>
                <option value="1">1 - Poor Fit</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Recruiter Notes</label>
              <input
                type="text"
                placeholder="Initial screening notes or interview key points..."
                className="form-input"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              <UserPlus size={16} />
              <span>{loading ? 'Submitting...' : 'Submit Application'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
