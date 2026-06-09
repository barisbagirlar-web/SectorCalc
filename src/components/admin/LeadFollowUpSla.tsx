"use client";

import { AdminMetricCard } from "@/components/admin/AdminMetricCard";
import {
 type FollowUpSlaLevel,
 type FollowUpSlaSummary,
 type LeadFollowUpSla,
} from "@/lib/leads/follow-up-sla";

const slaLevelClasses: Record<FollowUpSlaLevel, string> = {
 ok: "border-slate/20 bg-off-white/80 text-text-secondary",
 watch: "border-amber/30 bg-amber/10 text-amber",
 urgent: "border-amber/30 bg-amber/10 text-amber",
 done: "border-border-subtle bg-bg-subtle text-ink-black",
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
 label: "Geciken Lead",
 value: loading ? "…" : String(summary.overdueCount),
 hint: "24+ saat yanıtsız veya acil takip",
 },
 {
 label: "Bugün Dönülecek",
 value: loading ? "…" : String(summary.dueTodayCount),
 hint: "Takip / dönüş zamanı geldi",
 },
 {
 label: "Takipte",
 value: loading ? "…" : String(summary.inProgressCount),
 hint: "SLA içinde aktif lead",
 },
 {
 label: "Tamamlanan/Kapanan",
 value: loading ? "…" : String(summary.completedCount),
 hint: "Dönüşüm veya kayıp",
 },
 ];

 return (
 <section className="space-y-4" aria-label="Follow-up SLA">
 <div>
 <h2 className="text-lg font-bold text-ink-black">Follow-up SLA</h2>
 <p className="mt-1 text-sm text-text-secondary">
 Lead takip gecikmesi — son güncelleme veya oluşturma tarihine göre.
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
