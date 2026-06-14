import React from "react";
import { Button } from "./Button";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: string; // Material icon or custom SVG element
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: string;
  };
  className?: string;
};

export function EmptyState({
  title,
  description,
  icon = "inbox",
  actionButton,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center px-6 w-full py-12 ${className}`}>
      {/* Icon or SVG */}
      {typeof icon === "string" ? (
        <div className="w-48 h-48 mb-6 relative flex items-center justify-center opacity-80">
          <div className="relative w-32 h-40">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 border-4 border-primary/30 rounded-full clip-top" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border-2 border-primary/20 transform -rotate-3" />
            <div className="absolute inset-0 bg-white dark:bg-slate-800 rounded-2xl border-2 border-primary/20 shadow-lg flex items-center justify-center overflow-hidden">
              <div className="w-16 h-1 bg-slate-100 dark:bg-slate-700 rounded-full mb-2" />
              <div className="w-10 h-1 bg-slate-100 dark:bg-slate-700 rounded-full" />
              <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-primary/10 rounded-full" />
            </div>
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-12 border-t-4 border-l-4 border-r-4 border-primary rounded-t-full" />
          </div>
        </div>
      ) : (
        icon
      )}

      {/* Text Content */}
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 text-center">
        {title}
      </h2>
      <p className="text-slate-500 dark:text-slate-400 text-center text-sm leading-relaxed max-w-[280px] mb-8">
        {description}
      </p>

      {/* Action Button */}
      {actionButton && (
        <Button
          variant="primary"
          size="lg"
          onClick={actionButton.onClick}
          icon={actionButton.icon}
          className="w-full"
        >
          {actionButton.label}
        </Button>
      )}
    </div>
  );
}
