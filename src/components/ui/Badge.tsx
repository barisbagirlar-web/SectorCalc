import type { ReactNode } from "react";

type BadgeVariant = "default" | "free" | "premium" | "new" | "muted";

interface BadgeProps {
 children: ReactNode;
 variant?: BadgeVariant;
 className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
 default: "bg-ink-black/10 text-ink-black border border-ink-black/15",
 free: "bg-bg-subtle text-text-secondary border border-border-subtle",
 premium: "bg-amber/10 text-amber border border-amber/25",
 new: "bg-ink-black/10 text-ink-black border border-ink-black/15",
 muted: "bg-bg-subtle text-text-secondary border border-border-subtle",
};

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
 return (
 <span
 className={`inline-flex items-center rounded-sm px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${variantClasses[variant]} ${className}`}
 >
 {children}
 </span>
 );
}
