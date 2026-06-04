import type { ReactNode } from "react";

type BadgeVariant = "default" | "free" | "premium" | "new" | "muted";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-professional-blue/10 text-professional-blue",
  free: "bg-emerald/10 text-emerald",
  premium: "bg-amber/10 text-amber",
  new: "bg-cyan/10 text-cyan",
  muted: "bg-slate/10 text-slate",
};

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
