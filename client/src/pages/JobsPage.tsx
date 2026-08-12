import React, { useEffect, useState } from 'react';
import { Job } from '../types';
import { jobsAPI } from '../services/api';
import { JobCard } from '../components/JobCard';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import { EmptyState } from '../components/EmptyState';
import { useDebounce } from '../hooks/useDebounce';
import { Briefcase, Plus } from 'lucide-react';
import { EditJobModal } from '../components/EditJobModal';

interface JobsPageProps {
  onOpenCreateJob: () => void;
}

export const JobsPage: React.FC<JobsPageProps> = ({ onOpenCreateJob }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [department, setDepartment] = useState('All');
  const [status, setStatus] = useState('All');
  const [jobType, setJobType] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 350);

  useEffect(() => {
    fetchJobs();
  }, [debouncedSearch, department, status, jobType, page]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await jobsAPI.getJobs({
        search: debouncedSearch,
        department: department !== 'All' ? department : undefined,
        status: status !== 'All' ? status : undefined,
        jobType: jobType !== 'All' ? jobType : undefined,
        page,
        limit: 6,
      });

      if (res.success && res.data) {
        setJobs(res.data);
        setTotalPages(res.pages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch job postings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this job posting and all candidate applications associated with it?')) {
      return;
    }

    try {
      await jobsAPI.deleteJob(id);
      setJobs(jobs.filter((j) => j._id !== id));
    } catch (err) {
      alert('Failed to delete job posting.');
    }
  };

  const departments = ['Engineering', 'Product', 'Design', 'Sales', 'Marketing', 'HR', 'Finance'];
  const statuses = ['Active', 'Closed', 'Draft'];
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Job Openings</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Manage job listings, post new roles, and review applicant counts.</p>
        </div>
        <button onClick={onOpenCreateJob} className="btn btn-primary">
          <Plus size={16} />
          <span>Post New Job</span>
        </button>
      </div>

      {/* Filter & Search Controls */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search job title, department, or description..."
        departmentFilter={department}
        onDepartmentChange={setDepartment}
        departments={departments}
        statusFilter={status}
        onStatusChange={setStatus}
        statuses={statuses}
        jobTypeFilter={jobType}
        onJobTypeChange={setJobType}
        jobTypes={jobTypes}
        onClearFilters={() => {
          setSearchTerm('');
          setDepartment('All');
          setStatus('All');
          setJobType('All');
          setPage(1);
        }}
      />

      {/* Job Cards Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-card skeleton" style={{ height: '260px' }} />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No Job Postings Found"
          description="We couldn't find any job openings matching your search criteria. Create a new job post to start accepting candidate applications."
          actionText="Post New Job"
          onAction={onOpenCreateJob}
          icon={Briefcase}
        />
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onEdit={(j) => setEditingJob(j)}
                onDelete={handleDeleteJob}
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

      {/* Edit Job Modal */}
      {editingJob && (
        <EditJobModal
          isOpen={!!editingJob}
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onJobUpdated={(updated) => {
            setJobs(jobs.map((j) => (j._id === updated._id ? updated : j)));
            setEditingJob(null);
          }}
        />
      )}
    </div>
  );
};
