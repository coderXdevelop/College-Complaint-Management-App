import React from 'react';

const StatusBadge = ({ status }) => {
  const normalizedStatus = status?.toUpperCase() || 'PENDING';
  
  let styles = {
    bg: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-500/30',
    dot: 'bg-amber-500 animate-pulse shadow-sm shadow-amber-500/50',
    label: 'Pending'
  };

  if (normalizedStatus === 'IN_PROGRESS') {
    styles = {
      bg: 'bg-primary-500/10 text-primary-700 dark:text-primary-400 border-primary-200/50 dark:border-primary-500/30',
      dot: 'bg-primary-500 animate-pulse shadow-sm shadow-primary-500/50',
      label: 'In Progress'
    };
  } else if (normalizedStatus === 'RESOLVED') {
    styles = {
      bg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-500/30',
      dot: 'bg-emerald-500 shadow-sm shadow-emerald-500/50',
      label: 'Resolved'
    };
  } else if (normalizedStatus === 'REJECTED') {
    styles = {
      bg: 'bg-danger-500/10 text-danger-700 dark:text-danger-400 border-danger-200/50 dark:border-danger-500/30',
      dot: 'bg-danger-500 shadow-sm shadow-danger-500/50',
      label: 'Rejected'
    };
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles.bg}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`}></span>
      {styles.label}
    </span>
  );
};

export default StatusBadge;
