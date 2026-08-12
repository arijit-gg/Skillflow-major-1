import React, { useState } from 'react';
import { X, Edit3, Save } from 'lucide-react';
import { Job, JobType, JobStatus } from '../types';
import { jobsAPI } from '../services/api';

interface EditJobModalProps {
  isOpen: boolean;
  job: Job;
  onClose: () => void;
  onJobUpdated: (updatedJob: Job) => void;
}

export const EditJobModal: React.FC<EditJobModalProps> = ({
  isOpen,
  job,
  onClose,
  onJobUpdated,
}) => {
  const [formData, setFormData] = useState({
    title: job.title,
    department: job.department,
    location: job.location,
    jobType: job.jobType,
    salaryRange: job.salaryRange,
    description: job.description,
    requirements: job.requirements ? job.requirements.join(', ') : '',
    status: job.status,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await jobsAPI.updateJob(job._id, {
        ...formData,
        requirements: formData.requirements
          .split(',')
          .map((r) => r.trim())
          .filter(Boolean),
      });

      if (response.success && response.data) {
        onJobUpdated(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update job post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Edit3 size={20} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ fontSize: '1.25rem' }}>Edit Job Opening</h3>
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
            <label className="form-label">Job Title *</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Department</label>
              <select
                className="form-select"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                <option value="Engineering">Engineering</option>
                <option value="Product">Product</option>
                <option value="Design">Design</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Job Type</label>
              <select
                className="form-select"
                value={formData.jobType}
                onChange={(e) => setFormData({ ...formData, jobType: e.target.value as JobType })}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as JobStatus })}
              >
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Salary Range</label>
              <input
                type="text"
                className="form-input"
                value={formData.salaryRange}
                onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Job Description *</label>
            <textarea
              required
              rows={4}
              className="form-textarea"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Requirements (comma-separated)</label>
            <input
              type="text"
              className="form-input"
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              <Save size={16} />
              <span>{loading ? 'Saving Changes...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
