import React from 'react';
import { getStatusBadgeClass } from '../utils/formatters';
import { CheckCircle2, Clock, UserCheck, XCircle, Award, FileText } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getIcon = () => {
    switch (status.toLowerCase()) {
      case 'applied':
        return <FileText size={12} />;
      case 'screening':
        return <Clock size={12} />;
      case 'interviewing':
        return <UserCheck size={12} />;
      case 'offered':
        return <Award size={12} />;
      case 'hired':
      case 'active':
        return <CheckCircle2 size={12} />;
      case 'rejected':
      case 'closed':
        return <XCircle size={12} />;
      default:
        return <FileText size={12} />;
    }
  };

  return (
    <span className={`badge ${getStatusBadgeClass(status)}`}>
      {getIcon()}
      <span>{status}</span>
    </span>
  );
};
