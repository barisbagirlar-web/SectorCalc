import type { ReactNode } from "react";

type BadgeVariant = "default" | "free" | "premium" | "new" | "muted";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-accent-teal/10 text-accent-teal",
  free: "bg-emerald/10 text-emerald",
  premium: "bg-amber/10 text-amber",
  new: "bg-accent-teal/10 text-accent-teal",
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
