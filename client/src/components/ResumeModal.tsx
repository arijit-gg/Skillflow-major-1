import React from 'react';
import { X, ExternalLink, Download, FileText } from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeUrl: string;
  candidateName: string;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({
  isOpen,
  onClose,
  resumeUrl,
  candidateName,
}) => {
  if (!isOpen) return null;

  const baseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin;
  const fullResumeUrl = resumeUrl.startsWith('http')
    ? resumeUrl
    : `${baseUrl}${resumeUrl}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '850px', height: '85vh', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <FileText size={20} style={{ color: 'var(--accent-primary)' }} />
            <div>
              <h3 style={{ fontSize: '1.0625rem', margin: 0 }}>Resume Document</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Candidate: {candidateName}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <a
              href={fullResumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
              title="Open in new window"
            >
              <ExternalLink size={14} />
              <span>Open PDF</span>
            </a>
            <a
              href={fullResumeUrl}
              download
              className="btn btn-primary btn-sm"
              title="Download PDF"
            >
              <Download size={14} />
              <span>Download</span>
            </a>
            <button
              onClick={onClose}
              className="btn btn-secondary btn-sm"
              style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body / Embedded PDF Viewer */}
        <div style={{ flex: 1, backgroundColor: '#525659', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <iframe
            src={fullResumeUrl}
            title={`${candidateName} Resume`}
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      </div>
    </div>
  );
};
