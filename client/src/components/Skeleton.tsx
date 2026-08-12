import React from 'react';

export const Skeleton: React.FC<{ height?: string; width?: string; borderRadius?: string }> = ({
  height = '20px',
  width = '100%',
  borderRadius = 'var(--radius-sm)',
}) => {
  return (
    <div
      className="skeleton"
      style={{ height, width, borderRadius }}
    />
  );
};
