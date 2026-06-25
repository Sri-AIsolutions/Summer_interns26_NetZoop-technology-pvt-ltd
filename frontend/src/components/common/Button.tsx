import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-button font-medium transition-colors focus-ring",
        size === "sm" && "px-3 py-1.5 text-xs",
        size === "md" && "px-4 py-2 text-sm",
        size === "lg" && "px-6 py-3 text-base",
        variant === "primary" &&
          "bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700",
        variant === "secondary" &&
          "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100",
        variant === "ghost" &&
          "text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200",
        variant === "danger" &&
          "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
        variant === "outline" &&
          "border border-brand-200 bg-white text-brand-600 hover:bg-brand-50 active:bg-brand-100",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
