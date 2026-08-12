import React, { useState } from 'react';
import { X, Briefcase, Plus } from 'lucide-react';
import { Job, JobType, JobStatus } from '../types';
import { jobsAPI } from '../services/api';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreated: (job: Job) => void;
}

export const CreateJobModal: React.FC<CreateJobModalProps> = ({
  isOpen,
  onClose,
  onJobCreated,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering',
    location: 'Remote',
    jobType: 'Full-time' as JobType,
    salaryRange: '$90,000 - $120,000 / yr',
    description: '',
    requirements: '',
    status: 'Active' as JobStatus,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await jobsAPI.createJob({
        ...formData,
        requirements: formData.requirements
          .split(',')
          .map((r) => r.trim())
          .filter(Boolean),
      });

      if (response.success && response.data) {
        onJobCreated(response.data);
        onClose();
        setFormData({
          title: '',
          department: 'Engineering',
          location: 'Remote',
          jobType: 'Full-time',
          salaryRange: '$90,000 - $120,000 / yr',
          description: '',
          requirements: '',
          status: 'Active',
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create job posting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Briefcase size={20} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ fontSize: '1.25rem' }}>Create New Job Opening</h3>
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
              placeholder="e.g. Senior Full Stack Engineer"
              className="form-input"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Department *</label>
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
                <option value="HR">HR & People</option>
                <option value="Finance">Finance</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Job Type *</label>
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
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Location *</label>
              <input
                type="text"
                required
                placeholder="e.g. Remote / New York, NY"
                className="form-input"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Salary Range</label>
              <input
                type="text"
                placeholder="e.g. $100,000 - $130,000 / yr"
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
              placeholder="Provide role overview, team context, and responsibilities..."
              className="form-textarea"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Requirements (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. React, Node.js, TypeScript, MongoDB"
              className="form-input"
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              <Plus size={16} />
              <span>{loading ? 'Posting Job...' : 'Publish Job Post'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
