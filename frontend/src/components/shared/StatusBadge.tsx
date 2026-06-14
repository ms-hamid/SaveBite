'use client';

interface StatusBadgeProps {
  status: 'upcoming' | 'ready' | 'completed' | 'cancelled';
  label: string;
  className?: string;
}

export function StatusBadge({ status, label, className = '' }: StatusBadgeProps) {
  const statusStyles = {
    upcoming: 'bg-primary/10 text-emerald-700 dark:text-primary',
    ready: 'bg-blue-100/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    completed: 'bg-green-100/50 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    cancelled: 'bg-red-100/50 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  };

  const dotColors = {
    upcoming: 'bg-emerald-500 dark:bg-primary',
    ready: 'bg-blue-500 dark:bg-blue-400',
    completed: 'bg-green-500 dark:bg-green-400',
    cancelled: 'bg-red-500 dark:bg-red-400',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[status]} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[status]} mr-2`}></span>
      {label}
    </span>
  );
}
