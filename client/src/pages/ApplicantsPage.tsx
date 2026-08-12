import React, { useEffect, useState } from 'react';
import { Applicant, Job, ApplicantStatus } from '../types';
import { applicantsAPI, jobsAPI } from '../services/api';
import { KanbanBoard } from '../components/KanbanBoard';
import { ApplicantCard } from '../components/ApplicantCard';
import { SearchBar } from '../components/SearchBar';
import { ResumeModal } from '../components/ResumeModal';
import { AddApplicantModal } from '../components/AddApplicantModal';
import { Pagination } from '../components/Pagination';
import { EmptyState } from '../components/EmptyState';
import { useDebounce } from '../hooks/useDebounce';
import { downloadBlobFile } from '../utils/formatters';
import { Users, LayoutGrid, Kanban, Download, UserPlus } from 'lucide-react';

interface ApplicantsPageProps {
  onOpenAddApplicant: () => void;
}

export const ApplicantsPage: React.FC<ApplicantsPageProps> = ({ onOpenAddApplicant }) => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const [viewMode, setViewMode] = useState<'kanban' | 'grid'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [jobId, setJobId] = useState('All');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [activeResume, setActiveResume] = useState<{ url: string; name: string } | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 350);

  useEffect(() => {
    fetchJobsList();
  }, []);

  useEffect(() => {
    fetchApplicants();
  }, [debouncedSearch, jobId, status, page, viewMode]);

  const fetchJobsList = async () => {
    try {
      const res = await jobsAPI.getJobs({ limit: 50 });
      if (res.success && res.data) {
        setJobs(res.data);
      }
    } catch (err) {
      console.error('Failed to load jobs for filter dropdown', err);
    }
  };

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const res = await applicantsAPI.getApplicants({
        search: debouncedSearch,
        jobId: jobId !== 'All' ? jobId : undefined,
        status: status !== 'All' ? status : undefined,
        page,
        limit: viewMode === 'kanban' ? 100 : 9,
      });

      if (res.success && res.data) {
        setApplicants(res.data);
        setTotalPages(res.pages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch applicants list', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: ApplicantStatus) => {
    try {
      const res = await applicantsAPI.updateStatus(id, newStatus);
      if (res.success) {
        setApplicants(applicants.map((a) => (a._id === id ? { ...a, status: newStatus } : a)));
      }
    } catch (err) {
      alert('Failed to update candidate status.');
    }
  };

  const handleDeleteApplicant = async (id: string) => {
    if (!window.confirm('Delete candidate record?')) return;
    try {
      await applicantsAPI.deleteApplicant(id);
      setApplicants(applicants.filter((a) => a._id !== id));
    } catch (err) {
      alert('Failed to delete candidate.');
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await applicantsAPI.exportCSV({
        jobId: jobId !== 'All' ? jobId : undefined,
        status: status !== 'All' ? status : undefined,
      });
      downloadBlobFile(blob, `SmartHire_Applicants_${Date.now()}.csv`);
    } catch (err) {
      alert('Failed to generate CSV export.');
    }
  };

  const statuses = ['Applied', 'Screening', 'Interviewing', 'Offered', 'Hired', 'Rejected'];

  return (
    <div>
      {/* Header Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Applicants Pipeline</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Review candidate applications, manage hiring stages, and preview PDF resumes.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* View Mode Toggle Switch */}
          <div style={{ display: 'flex', backgroundColor: 'var(--bg-tertiary)', padding: '0.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setViewMode('kanban')}
              className={`btn btn-sm ${viewMode === 'kanban' ? 'btn-primary' : 'btn-outline'}`}
              style={{ border: 'none' }}
              title="Kanban Stage Board View"
            >
              <Kanban size={15} />
              <span>Pipeline Board</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline'}`}
              style={{ border: 'none' }}
              title="Grid Cards View"
            >
              <LayoutGrid size={15} />
              <span>Grid View</span>
            </button>
          </div>

          <button onClick={handleExportCSV} className="btn btn-secondary btn-sm">
            <Download size={15} />
            <span>Export CSV</span>
          </button>
          <button onClick={onOpenAddApplicant} className="btn btn-primary btn-sm">
            <UserPlus size={15} />
            <span>Add Candidate</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search applicant name, email, or phone number..."
        statusFilter={status}
        onStatusChange={setStatus}
        statuses={statuses}
        onClearFilters={() => {
          setSearchTerm('');
          setJobId('All');
          setStatus('All');
          setPage(1);
        }}
      />

      {/* Main View Area */}
      {loading ? (
        <div className="glass-card skeleton" style={{ height: '450px' }} />
      ) : applicants.length === 0 ? (
        <EmptyState
          title="No Applicants Found"
          description="There are no candidate applications matching your selected filters. Click below to add a candidate manually."
          actionText="Add New Candidate"
          onAction={onOpenAddApplicant}
          icon={Users}
        />
      ) : viewMode === 'kanban' ? (
        <KanbanBoard
          applicants={applicants}
          onStatusChange={handleStatusChange}
          onViewResume={(url, name) => setActiveResume({ url, name })}
          onDelete={handleDeleteApplicant}
        />
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {applicants.map((app) => (
              <ApplicantCard
                key={app._id}
                applicant={app}
                onStatusChange={handleStatusChange}
                onViewResume={(url, name) => setActiveResume({ url, name })}
                onDelete={handleDeleteApplicant}
              />
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </>
      )}

      {/* Resume Viewer Modal */}
      {activeResume && (
        <ResumeModal
          isOpen={!!activeResume}
          resumeUrl={activeResume.url}
          candidateName={activeResume.name}
          onClose={() => setActiveResume(null)}
        />
      )}
    </div>
  );
};
