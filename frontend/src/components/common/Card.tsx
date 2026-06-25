import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated";
  accent?: boolean;
}

export function Card({
  children,
  className,
  variant = "default",
  accent = false,
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-slate-200 bg-white transition-shadow",
        variant === "default" &&
          "shadow-card hover:shadow-card-hover",
        variant === "elevated" &&
          "shadow-elevated",
        accent && "border-t-2 border-t-brand-500",
        className
      )}
    >
      {children}
    </div>
  );
}
