"use client";

import { AdminMetricCard } from "@/components/admin/AdminMetricCard";
import {
 type LeadQualityLevel,
 type LeadQualityScore as LeadQualityScoreData,
 type LeadQualitySummary,
} from "@/lib/leads/lead-quality-score";

const levelClasses: Record<LeadQualityLevel, string> = {
 high: "border-border-subtle bg-bg-subtle text-ink-black",
 medium: "border-amber/30 bg-amber/10 text-amber",
 low: "border-slate/25 bg-off-white text-text-secondary",
};

interface LeadQualitySectionProps {
 summary: LeadQualitySummary;
 loading?: boolean;
}

export function LeadQualitySection({
 summary,
 loading,
}: LeadQualitySectionProps) {
 const cards = [
 {
 label: "Yüksek kalite lead",
 value: loading ? "…" : String(summary.highCount),
 hint: "Skor ≥ 80",
 },
 {
 label: "Orta kalite lead",
 value: loading ? "…" : String(summary.mediumCount),
 hint: "Skor 50–79",
 },
 {
 label: "Düşük kalite lead",
 value: loading ? "…" : String(summary.lowCount),
 hint: "Skor < 50",
 },
 {
 label: "Ortalama skor",
 value: loading ? "…" : String(summary.averageScore),
 hint: "0–100 arası",
 },
 ];

 return (
 <section className="space-y-4" aria-label="Lead Quality">
 <div>
 <h2 className="text-lg font-bold text-ink-black">Lead Quality</h2>
 <p className="mt-1 text-sm text-text-secondary">
 Kalite skoru — hangi lead&apos;e önce dönüleceğini belirlemeye yardımcı olur.
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

interface LeadQualityBadgeProps {
 quality: LeadQualityScoreData;
}

export function LeadQualityBadge({ quality }: LeadQualityBadgeProps) {
 return (
 <span
 className={`inline-flex max-w-full flex-wrap items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${levelClasses[quality.level]}`}
 title={[...quality.reasons, ...quality.warnings].join(" · ")}
 >
 <span className="tabular-nums">{quality.score}</span>
 <span className="font-normal opacity-90">· {quality.label}</span>
 </span>
 );
}

interface LeadQualityDetailProps {
 quality: LeadQualityScoreData;
}

export function LeadQualityDetail({ quality }: LeadQualityDetailProps) {
 return (
 <div className="space-y-3">
 <div className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:items-center sm:gap-3">
 <dt className="font-medium text-text-secondary">Skor</dt>
 <dd className="tabular-nums text-ink-black">{quality.score} / 100</dd>
 </div>
 <div className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:items-center sm:gap-3">
 <dt className="font-medium text-text-secondary">Seviye</dt>
 <dd>
 <LeadQualityBadge quality={quality} />
 </dd>
 </div>
 <div className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:gap-3">
 <dt className="font-medium text-text-secondary">Nedenler</dt>
 <dd className="break-words text-ink-black">
 {quality.reasons.length > 0 ? (
 <ul className="list-inside list-disc space-y-1">
 {quality.reasons.map((reason) => (
 <li key={reason}>{reason}</li>
 ))}
 </ul>
 ) : (
 "—"
 )}
 </dd>
 </div>
 <div className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:gap-3">
 <dt className="font-medium text-text-secondary">Uyarılar</dt>
 <dd className="break-words text-ink-black">
 {quality.warnings.length > 0 ? (
 <ul className="list-inside list-disc space-y-1 text-text-secondary">
 {quality.warnings.map((warning) => (
 <li key={warning}>{warning}</li>
 ))}
 </ul>
 ) : (
 "—"
 )}
 </dd>
 </div>
 </div>
 );
}
