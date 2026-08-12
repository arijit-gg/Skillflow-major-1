import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
      <button
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="btn btn-secondary btn-sm"
      >
        <ChevronLeft size={16} />
        <span>Prev</span>
      </button>

      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', padding: '0 0.75rem' }}>
        Page {currentPage} of {totalPages}
      </span>

      <button
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="btn btn-secondary btn-sm"
      >
        <span>Next</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
};
