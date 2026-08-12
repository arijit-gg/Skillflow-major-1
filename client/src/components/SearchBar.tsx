import React from 'react';
import { Search, Filter, X } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
}

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  departmentFilter?: string;
  onDepartmentChange?: (value: string) => void;
  departments?: string[];
  statusFilter?: string;
  onStatusChange?: (value: string) => void;
  statuses?: string[];
  jobTypeFilter?: string;
  onJobTypeChange?: (value: string) => void;
  jobTypes?: string[];
  onClearFilters?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  placeholder = 'Search by title, keywords, name, or email...',
  departmentFilter,
  onDepartmentChange,
  departments = [],
  statusFilter,
  onStatusChange,
  statuses = [],
  jobTypeFilter,
  onJobTypeChange,
  jobTypes = [],
  onClearFilters,
}) => {
  const hasActiveFilters =
    searchTerm !== '' ||
    (departmentFilter && departmentFilter !== 'All') ||
    (statusFilter && statusFilter !== 'All') ||
    (jobTypeFilter && jobTypeFilter !== 'All');

  return (
    <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem', alignItems: 'center' }}>
        {/* Search Bar Input */}
        <div style={{ position: 'relative', flex: '1 1 280px' }}>
          <Search size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Department Filter */}
        {onDepartmentChange && departments.length > 0 && (
          <div style={{ flex: '0 1 180px' }}>
            <select
              className="form-select"
              value={departmentFilter || 'All'}
              onChange={(e) => onDepartmentChange(e.target.value)}
            >
              <option value="All">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Status Filter */}
        {onStatusChange && statuses.length > 0 && (
          <div style={{ flex: '0 1 160px' }}>
            <select
              className="form-select"
              value={statusFilter || 'All'}
              onChange={(e) => onStatusChange(e.target.value)}
            >
              <option value="All">All Statuses</option>
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Job Type Filter */}
        {onJobTypeChange && jobTypes.length > 0 && (
          <div style={{ flex: '0 1 160px' }}>
            <select
              className="form-select"
              value={jobTypeFilter || 'All'}
              onChange={(e) => onJobTypeChange(e.target.value)}
            >
              <option value="All">All Job Types</option>
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Clear Filters Button */}
        {hasActiveFilters && onClearFilters && (
          <button onClick={onClearFilters} className="btn btn-outline btn-sm">
            <X size={14} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
