import { Lock } from "lucide-react";

export function ProBadge() {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 border border-technical-gray bg-industrial-matte px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-body-charcoal">
      <Lock className="h-3 w-3" aria-hidden />
      PRO
    </span>
  );
}
