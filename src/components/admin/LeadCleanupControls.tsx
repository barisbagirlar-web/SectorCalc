"use client";

import {
 formatTestLeadConfidence,
 type LeadCleanupSummary,
 type TestLeadDetection,
} from "@/lib/features/leads/lead-cleanup";
import {
 LeadTestClassificationControls,
 type TestLeadClassificationPatch,
} from "@/components/admin/LeadTestClassificationControls";
import type { LeadIntent } from "@/lib/features/leads/types";

interface LeadCleanupControlsProps {
 summary: LeadCleanupSummary;
 excludeTestLeadsFromMetrics: boolean;
 onExcludeTestLeadsChange: (value: boolean) => void;
 loading?: boolean;
}

export function LeadCleanupControls({
 summary,
 excludeTestLeadsFromMetrics,
 onExcludeTestLeadsChange,
 loading,
}: LeadCleanupControlsProps) {
 return (
 <section
 className="rounded-sm border border-slate/20 bg-white p-4 shadow-card sm:p-5"
 aria-label="Lead cleanup controls"
 >
 <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
 <div>
 <h2 className="text-sm font-bold text-deep-navy">Lead Cleanup</h2>
 <p className="mt-1 text-xs text-text-secondary">
 Exclude test/trial records from metrics — table shows all leads.
 </p>
 </div>

 <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg border border-slate/20 bg-off-white/50 px-4 py-2">
 <input
 type="checkbox"
 checked={excludeTestLeadsFromMetrics}
 onChange={(event) => onExcludeTestLeadsChange(event.target.checked)}
 className="h-4 w-4 rounded border-slate/30 text-professional-blue focus:ring-professional-blue/30"
 />
 <span className="text-sm font-medium text-deep-navy">
 Exclude test leads from metrics
 </span>
 </label>
 </div>

 <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
 <div className="rounded-lg border border-slate/15 bg-off-white/40 px-4 py-3">
 <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
 Total Test Leads
 </p>
 <p className="mt-1 text-xl font-bold tabular-nums text-deep-navy">
 {loading ? "…" : summary.testLeadCount}
 </p>
 </div>
 <div className="rounded-lg border border-slate/15 bg-off-white/40 px-4 py-3">
 <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
 Excluded from Metrics
 </p>
 <p className="mt-1 text-xl font-bold tabular-nums text-deep-navy">
 {loading ? "…" : summary.excludedFromMetricsCount}
 </p>
 </div>
 <div className="rounded-lg border border-slate/15 bg-off-white/40 px-4 py-3">
 <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
 Used in Metrics
 </p>
 <p className="mt-1 text-xl font-bold tabular-nums text-deep-navy">
 {loading ? "…" : summary.metricsLeadCount}
 </p>
 </div>
 </div>
 </section>
 );
}

interface TestLeadBadgeProps {
 detection: TestLeadDetection;
}

export function TestLeadBadge({ detection }: TestLeadBadgeProps) {
 if (!detection.isTestLead) {
 return null;
 }

 const label = detection.isManualMark ? "Test Lead (Manual)" : "Test Lead";

 return (
 <span
 className="inline-flex max-w-full items-center rounded-full border border-slate/30 bg-slate/10 px-2.5 py-0.5 text-xs font-semibold text-text-secondary"
 title={detection.reasons.join(" · ")}
 >
 {label}
 </span>
 );
}

interface LeadDataQualityDetailProps {
 detection: TestLeadDetection;
 lead?: LeadIntent;
 onSaved?: (leadId: string, patch: TestLeadClassificationPatch) => void;
}

export function LeadDataQualityDetail({
 detection,
 lead,
 onSaved,
}: LeadDataQualityDetailProps) {
 return (
 <div className="space-y-3">
 <DetailRow
 label="Is test lead?"
 value={detection.isTestLead ? "Yes" : "No"}
 />
 <DetailRow
 label="Manual mark"
 value={
 detection.isManualMark
 ? "Yes"
 : detection.manualOverrideNotTest
 ? "No (admin override)"
 : "—"
 }
 />
 <DetailRow
 label="Confidence level"
 value={
 detection.isTestLead
 ? formatTestLeadConfidence(detection.confidence)
 : "—"
 }
 />
 <div className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:gap-3">
 <dt className="font-medium text-text-secondary">Detection reasons</dt>
 <dd className="break-words text-deep-navy">
 {detection.reasons.length > 0 ? (
 <ul className="list-inside list-disc space-y-1">
 {detection.reasons.map((reason) => (
 <li key={reason}>{reason}</li>
 ))}
 </ul>
 ) : (
 "—"
 )}
 </dd>
 </div>
 {lead && onSaved ? (
 <LeadTestClassificationControls
 lead={lead}
 detection={detection}
 onSaved={onSaved}
 />
 ) : null}
 </div>
 );
}

function DetailRow({ label, value }: { label: string; value: string }) {
 return (
 <div className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:gap-3">
 <dt className="font-medium text-text-secondary">{label}</dt>
 <dd className="break-words text-deep-navy">{value}</dd>
 </div>
 );
}
