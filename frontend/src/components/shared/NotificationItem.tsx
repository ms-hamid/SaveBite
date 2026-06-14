'use client';

interface NotificationItemProps {
  icon: string;
  title: string;
  description: string;
  timestamp: string;
  iconBgColor?: string;
  iconColor?: string;
  isRead?: boolean;
  onClick?: () => void;
}

export function NotificationItem({
  icon,
  title,
  description,
  timestamp,
  iconBgColor = 'bg-primary/10',
  iconColor = 'text-primary',
  isRead = true,
  onClick,
}: NotificationItemProps) {
  return (
    <div
      onClick={onClick}
      className="group relative flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-50 dark:border-gray-800/50 cursor-pointer"
    >
      <div className={`flex-shrink-0 w-12 h-12 rounded-full ${iconBgColor} flex items-center justify-center ${iconColor}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div className="flex-1 pr-4">
        <p className={`text-sm font-bold text-slate-900 dark:text-white mb-0.5 ${!isRead ? 'font-bold' : ''}`}>
          {title}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-snug">
          {description}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">
          {timestamp}
        </p>
      </div>
      <div className="flex items-center text-slate-300">
        <span className="material-symbols-outlined text-lg">chevron_right</span>
      </div>
    </div>
  );
}
