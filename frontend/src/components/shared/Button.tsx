import React from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string; // Material icon name
  iconPosition?: "left" | "right";
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  className = "",
  disabled = false,
  onClick,
  type = "button",
  ariaLabel,
  ...props
}: ButtonProps) {
  const baseStyles = "font-semibold rounded-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-primary hover:bg-emerald-600 text-white shadow-lg shadow-primary/20",
    secondary: "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white",
    ghost: "bg-transparent text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800",
    outline: "border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800",
  };

  const sizes = {
    sm: "py-2 px-4 text-sm",
    md: "py-3 px-6 text-base",
    lg: "py-3.5 px-6 text-base",
  };

  const variantStyles = variants[variant];
  const sizeStyles = sizes[size];

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {icon && iconPosition === "left" && (
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === "right" && (
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      )}
    </button>
  );
}
