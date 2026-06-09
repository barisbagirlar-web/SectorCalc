import { getLeadStatusLabel } from "@/lib/leads/lead-pipeline";
import type { LeadStatus } from "@/lib/leads/types";

const statusClasses: Record<LeadStatus, string> = {
 new: "bg-cyan/10 text-cyan",
 reviewed: "bg-ink-black/10 text-ink-black",
 contacted: "bg-amber/10 text-amber",
 qualified: "bg-bg-subtle text-text-secondary",
 converted: "bg-ink-black/15 text-ink-black",
 lost: "bg-slate/10 text-text-secondary",
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
