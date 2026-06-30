"use client";

import { AdminMetricCard } from "@/components/admin/AdminMetricCard";
import {
 type LeadQualityLevel,
 type LeadQualityScore as LeadQualityScoreData,
 type LeadQualitySummary,
} from "@/lib/features/leads/lead-quality-score";

const levelClasses: Record<LeadQualityLevel, string> = {
 high: "border-border-subtle bg-bg-subtle text-deep-navy",
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
 label: "High Quality Leads",
 value: loading ? "…" : String(summary.highCount),
 hint: "Score ≥ 80",
 },
 {
 label: "Medium Quality Leads",
 value: loading ? "…" : String(summary.mediumCount),
 hint: "Score 50–79",
 },
 {
 label: "Low Quality Leads",
 value: loading ? "…" : String(summary.lowCount),
 hint: "Score < 50",
 },
 {
 label: "Average Score",
 value: loading ? "…" : String(summary.averageScore),
 hint: "Range 0–100",
 },
 ];

 return (
 <section className="space-y-4" aria-label="Lead Quality">
 <div>
 <h2 className="text-lg font-bold text-deep-navy">Lead Quality</h2>
 <p className="mt-1 text-sm text-text-secondary">
 Quality score — helps determine which lead to follow up first.
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
 <dd className="tabular-nums text-deep-navy">{quality.score} / 100</dd>
 </div>
 <div className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:items-center sm:gap-3">
 <dt className="font-medium text-text-secondary">Seviye</dt>
 <dd>
 <LeadQualityBadge quality={quality} />
 </dd>
 </div>
 <div className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:gap-3">
 <dt className="font-medium text-text-secondary">Nedenler</dt>
 <dd className="break-words text-deep-navy">
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
 <dt className="font-medium text-text-secondary">Warnings</dt>
 <dd className="break-words text-deep-navy">
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
