"use client";

import { AdminMetricCard } from "@/components/admin/AdminMetricCard";
import {
 formatSourceRoiGroupType,
 type LeadSourceRoiResult,
 type SourceRoiEfficiencyLevel,
 type SourceRoiRow,
} from "@/lib/features/leads/source-roi";

interface LeadSourceRoiProps {
 roi: LeadSourceRoiResult;
 loading?: boolean;
}

const cardClass =
 "rounded-sm border border-slate/20 bg-white p-4 shadow-card sm:p-5";

const efficiencyClasses: Record<SourceRoiEfficiencyLevel, string> = {
 strong: "border-border-subtle bg-bg-subtle text-deep-navy",
 watch: "border-amber/30 bg-amber/10 text-amber",
 weak: "border-slate/25 bg-off-white text-text-secondary",
};

function formatHighlight(row: SourceRoiRow | null, loading?: boolean): string {
 if (loading) {
 return "…";
 }
 if (!row) {
 return "—";
 }
 return `${row.sourceLabel} (${row.efficiencyScore})`;
}

function formatHighlightHint(row: SourceRoiRow | null): string | undefined {
 if (!row) {
 return undefined;
 }
 return `${formatSourceRoiGroupType(row.groupType)} · ${row.total} lead`;
}

function SourceRoiRowCard({ row, loading }: { row: SourceRoiRow; loading?: boolean }) {
 return (
 <article className="rounded-lg border border-slate/15 bg-off-white/40 p-4">
 <div className="flex flex-wrap items-start justify-between gap-2">
 <div className="min-w-0 flex-1">
 <p className="break-words font-semibold text-deep-navy">
 {row.sourceLabel}
 </p>
 <p className="mt-0.5 text-xs text-text-secondary">
 {formatSourceRoiGroupType(row.groupType)}
 </p>
 </div>
 <span
 className={`inline-flex shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${efficiencyClasses[row.efficiencyLevel]}`}
 >
 {loading ? "…" : row.efficiencyScore}
 </span>
 </div>
 <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
 <div>
 <dt className="text-xs text-text-secondary">Leads</dt>
 <dd className="tabular-nums font-medium text-deep-navy">
 {loading ? "…" : row.total}
 </dd>
 </div>
 <div>
 <dt className="text-xs text-text-secondary">Avg Quality</dt>
 <dd className="tabular-nums font-medium text-deep-navy">
 {loading ? "…" : row.averageQualityScore}
 </dd>
 </div>
 <div>
 <dt className="text-xs text-text-secondary">Qualified</dt>
 <dd className="tabular-nums text-deep-navy">
 {loading ? "…" : row.qualifiedCount}
 </dd>
 </div>
 <div>
 <dt className="text-xs text-text-secondary">Converted</dt>
 <dd className="tabular-nums text-deep-navy">
 {loading ? "…" : row.convertedCount}
 </dd>
 </div>
 <div>
 <dt className="text-xs text-text-secondary">Urgent</dt>
 <dd className="tabular-nums text-deep-navy">
 {loading ? "…" : row.urgentFollowUpCount}
 </dd>
 </div>
 <div>
 <dt className="text-xs text-text-secondary">Efficiency</dt>
 <dd>
 <span
 className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${efficiencyClasses[row.efficiencyLevel]}`}
 >
 {row.efficiencyLevel}
 </span>
 </dd>
 </div>
 </dl>
 <p className="mt-3 break-words text-xs text-text-secondary">{row.recommendation}</p>
 </article>
 );
}

export function LeadSourceRoiSection({ roi, loading }: LeadSourceRoiProps) {
 const summaryCards = [
 {
 label: "Strongest Source",
 value: formatHighlight(roi.strongestSource, loading),
 hint: formatHighlightHint(roi.strongestSource),
 },
 {
 label: "Weakest Source",
 value: formatHighlight(roi.weakestSource, loading),
 hint: formatHighlightHint(roi.weakestSource),
 },
 {
 label: "Highest Follow-up Delay",
 value: formatHighlight(roi.highestUrgentSource, loading),
 hint: roi.highestUrgentSource
 ? `${roi.highestUrgentSource.urgentFollowUpCount} delayed leads`
 : undefined,
 },
 ];

 return (
 <section className="space-y-4" aria-label="Source ROI">
 <div>
 <h2 className="text-lg font-bold text-deep-navy">Source ROI</h2>
 <p className="mt-1 text-sm text-text-secondary">
 Source efficiency score — based on quality, conversion, and follow-up health (not monetary ROI).
 </p>
 </div>

 {roi.showLowSampleWarning ? (
 <p
 className="rounded-lg border border-amber/30 bg-amber/5 px-4 py-3 text-sm text-deep-navy"
 role="status"
 >
 These scores are calculated from the loaded lead data; with low samples, consider them directional.
 </p>
 ) : null}

 <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
 {summaryCards.map((card) => (
 <AdminMetricCard
 key={card.label}
 label={card.label}
 value={card.value}
 hint={card.hint}
 />
 ))}
 </div>

 <div className={cardClass}>
 <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
 Top 10 Sources
 </h3>

 {roi.topRows.length === 0 ? (
 <p className="mt-3 text-sm text-text-secondary">No source data yet.</p>
 ) : (
 <>
 <div className="mt-4 hidden md:block">
 <table className="w-full table-fixed text-left text-sm">
 <thead>
 <tr className="border-b border-slate/15 text-xs font-semibold uppercase tracking-wide text-text-secondary">
 <th className="py-2 pr-3">Source</th>
 <th className="py-2 px-2">Type</th>
 <th className="py-2 px-2 text-right">Leads</th>
 <th className="py-2 px-2 text-right">Avg Quality</th>
 <th className="py-2 px-2 text-right">Qualified</th>
 <th className="py-2 px-2 text-right">Converted</th>
 <th className="py-2 px-2 text-right">Urgent</th>
 <th className="py-2 px-2 text-right">Efficiency</th>
 <th className="py-2 pl-2">Recommendation</th>
 </tr>
 </thead>
 <tbody>
 {roi.topRows.map((row) => (
 <tr
 key={`${row.groupType}-${row.sourceLabel}`}
 className="border-b border-slate/10 last:border-0"
 >
 <td className="py-2.5 pr-3 break-words text-deep-navy">
 {loading ? "…" : row.sourceLabel}
 </td>
 <td className="py-2.5 px-2 text-text-secondary">
 {formatSourceRoiGroupType(row.groupType)}
 </td>
 <td className="py-2.5 px-2 text-right tabular-nums">
 {loading ? "…" : row.total}
 </td>
 <td className="py-2.5 px-2 text-right tabular-nums">
 {loading ? "…" : row.averageQualityScore}
 </td>
 <td className="py-2.5 px-2 text-right tabular-nums">
 {loading ? "…" : row.qualifiedCount}
 </td>
 <td className="py-2.5 px-2 text-right tabular-nums">
 {loading ? "…" : row.convertedCount}
 </td>
 <td className="py-2.5 px-2 text-right tabular-nums">
 {loading ? "…" : row.urgentFollowUpCount}
 </td>
 <td className="py-2.5 px-2 text-right">
 <span
 className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold tabular-nums ${efficiencyClasses[row.efficiencyLevel]}`}
 >
 {loading ? "…" : row.efficiencyScore}
 </span>
 </td>
 <td className="py-2.5 pl-2 break-words text-xs text-text-secondary">
 {row.recommendation}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 <div className="mt-4 space-y-3 md:hidden">
 {roi.topRows.map((row) => (
 <SourceRoiRowCard key={`${row.groupType}-${row.sourceLabel}`} row={row} loading={loading} />
 ))}
 </div>
 </>
 )}
 </div>
 </section>
 );
}
