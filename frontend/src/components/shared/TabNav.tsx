import React from "react";

type TabNavProps = {
  tabs: Array<{
    id: string;
    label: string;
  }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
};

export function TabNav({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}: TabNavProps) {
  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);

  return (
    <div
      className={`relative flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl ${className}`}
    >
      {/* Animated slider */}
      <div
        className="absolute top-1 bottom-1 rounded-lg bg-white dark:bg-slate-700 shadow-sm transition-all duration-300"
        style={{
          width: `calc(${100 / tabs.length}% - 0.5rem)`,
          transform: `translateX(calc(${activeIndex * 100}% + ${
            activeIndex * 0.5
          }rem))`,
        }}
      />

      {/* Buttons */}
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative z-10 flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
              isActive
                ? "text-primary font-semibold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}