import {
  getLeadPriorityLabel,
  resolveLeadPriority,
} from "@/lib/leads/lead-pipeline";
import type { LeadIntent } from "@/lib/leads/types";

const priorityClasses = {
  hot: "bg-soft-red/10 text-soft-red",
  warm: "bg-amber/10 text-amber",
  cold: "bg-slate/10 text-slate",
} as const;

interface LeadPriorityBadgeProps {
  lead: LeadIntent;
}

export function LeadPriorityBadge({ lead }: LeadPriorityBadgeProps) {
  const priority = resolveLeadPriority(lead);
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${priorityClasses[priority]}`}
    >
      {getLeadPriorityLabel(priority)}
    </span>
  );
}
