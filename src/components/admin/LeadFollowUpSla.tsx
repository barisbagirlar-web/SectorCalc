"use client";

import { AdminMetricCard } from "@/components/admin/AdminMetricCard";
import {
 type FollowUpSlaLevel,
 type FollowUpSlaSummary,
 type LeadFollowUpSla,
} from "@/lib/features/leads/follow-up-sla";

const slaLevelClasses: Record<FollowUpSlaLevel, string> = {
 ok: "border-slate/20 bg-off-white/80 text-text-secondary",
 watch: "border-amber/30 bg-amber/10 text-amber",
 urgent: "border-amber/30 bg-amber/10 text-amber",
 done: "border-border-subtle bg-bg-subtle text-deep-navy",
};

interface LeadFollowUpSlaProps {
 summary: FollowUpSlaSummary;
 loading?: boolean;
}

export function LeadFollowUpSlaSection({
 summary,
 loading,
}: LeadFollowUpSlaProps) {
 const cards = [
 {
 label: "Overdue Leads",
 value: loading ? "…" : String(summary.overdueCount),
 hint: "24+ hours no response or urgent follow-up",
 },
 {
 label: "Due Today",
 value: loading ? "…" : String(summary.dueTodayCount),
 hint: "Follow-up / callback time reached",
 },
 {
 label: "In Progress",
 value: loading ? "…" : String(summary.inProgressCount),
 hint: "Active leads within SLA",
 },
 {
 label: "Completed/Closed",
 value: loading ? "…" : String(summary.completedCount),
 hint: "Converted or lost",
 },
 ];

 return (
 <section className="space-y-4" aria-label="Follow-up SLA">
 <div>
 <h2 className="text-lg font-bold text-deep-navy">Follow-up SLA</h2>
 <p className="mt-1 text-sm text-text-secondary">
 Lead follow-up delay — based on last update or creation date.
 </p>
 </div>

 <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
 {cards.map((card) => (
 <AdminMetricCard
 key={card.label}
 label={card.label}
 value={card.value}
 hint={card.hint}
 />
 ))}
 </div>
 </section>
 );
}

interface LeadFollowUpSlaBadgeProps {
 sla: LeadFollowUpSla;
 showAge?: boolean;
}

export function LeadFollowUpSlaBadge({
 sla,
 showAge = false,
}: LeadFollowUpSlaBadgeProps) {
 return (
 <span
 className={`inline-flex max-w-full flex-wrap items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${slaLevelClasses[sla.slaLevel]}`}
 title={sla.recommendedAction}
 >
 <span className="truncate">{sla.slaLabel}</span>
 {showAge ? (
 <span className="font-normal opacity-80">· {sla.ageLabel}</span>
 ) : null}
 </span>
 );
}
