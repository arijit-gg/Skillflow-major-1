import { ApplicantStatus } from '../types';

export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const getStatusBadgeClass = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'applied':
      return 'badge-applied';
    case 'screening':
      return 'badge-screening';
    case 'interviewing':
      return 'badge-interviewing';
    case 'offered':
      return 'badge-offered';
    case 'hired':
      return 'badge-hired';
    case 'rejected':
      return 'badge-rejected';
    case 'active':
      return 'badge-active';
    case 'closed':
      return 'badge-closed';
    case 'draft':
      return 'badge-draft';
    default:
      return 'badge-applied';
  }
};

export const downloadBlobFile = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
