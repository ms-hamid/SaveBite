import React from "react";

type PageHeaderProps = {
  title: string;
  showFilter?: boolean;
  onFilterClick?: () => void;
  showBack?: boolean;
  onBackClick?: () => void;
  className?: string;
};

export function PageHeader({
  title,
  showFilter = false,
  onFilterClick,
  showBack = false,
  onBackClick,
  className = "",
}: PageHeaderProps) {
  return (
    <header
      className={`flex items-center justify-between px-6 pt-[24px] pb-4 bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10 ${className}`}
    >
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={onBackClick}
            aria-label="Go back"
            className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-[24px] text-slate-900 dark:text-white">
              arrow_back
            </span>
          </button>
        )}
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>
      </div>
      {showFilter && (
        <button
          onClick={onFilterClick}
          className="w-[40px] h-[40px] rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">tune</span>
        </button>
      )}
    </header>
  );
}
