import React from 'react';

const StatusBadge = ({ status }) => {
  const normalizedStatus = status?.toUpperCase() || 'PENDING';
  
  let styles = {
    bg: 'bg-amber-50 text-amber-700 border-amber-200/60',
    dot: 'bg-amber-500 animate-pulse',
    label: 'Pending'
  };

  if (normalizedStatus === 'IN_PROGRESS') {
    styles = {
      bg: 'bg-blue-50 text-blue-700 border-blue-200/60',
      dot: 'bg-blue-500 animate-pulse',
      label: 'In Progress'
    };
  } else if (normalizedStatus === 'RESOLVED') {
    styles = {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      dot: 'bg-emerald-500',
      label: 'Resolved'
    };
  } else if (normalizedStatus === 'REJECTED') {
    styles = {
      bg: 'bg-red-50 text-red-700 border-red-200/60',
      dot: 'bg-red-500',
      label: 'Rejected'
    };
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${styles.bg}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`}></span>
      {styles.label}
    </span>
  );
};

export default StatusBadge;
