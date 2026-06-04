import { getLeadStatusLabel } from "@/lib/leads/lead-pipeline";
import type { LeadStatus } from "@/lib/leads/types";

const statusClasses: Record<LeadStatus, string> = {
  new: "bg-cyan/10 text-cyan",
  reviewed: "bg-professional-blue/10 text-professional-blue",
  contacted: "bg-amber/10 text-amber",
  qualified: "bg-emerald-600/10 text-emerald-700",
  converted: "bg-professional-blue/15 text-deep-navy",
  lost: "bg-slate/10 text-slate",
};

interface LeadStatusBadgeProps {
  status: LeadStatus;
}

export function LeadStatusBadge({ status }: LeadStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusClasses[status]}`}
    >
      {getLeadStatusLabel(status)}
    </span>
  );
}
