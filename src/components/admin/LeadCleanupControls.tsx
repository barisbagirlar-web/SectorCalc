"use client";

import {
 formatTestLeadConfidence,
 type LeadCleanupSummary,
 type TestLeadDetection,
} from "@/lib/leads/lead-cleanup";
import {
 LeadTestClassificationControls,
 type TestLeadClassificationPatch,
} from "@/components/admin/LeadTestClassificationControls";
import type { LeadIntent } from "@/lib/leads/types";

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
 <h2 className="text-sm font-bold text-ink-black">Lead Cleanup</h2>
 <p className="mt-1 text-xs text-text-secondary">
 Test/deneme kayıtlarını metriklerden hariç tut — tablo tüm lead&apos;leri gösterir.
 </p>
 </div>

 <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg border border-slate/20 bg-off-white/50 px-4 py-2">
 <input
 type="checkbox"
 checked={excludeTestLeadsFromMetrics}
 onChange={(event) => onExcludeTestLeadsChange(event.target.checked)}
 className="h-4 w-4 rounded border-slate/30 text-ink-black focus:ring-ink-black/30"
 />
 <span className="text-sm font-medium text-ink-black">
 Test lead&apos;leri metriklerden hariç tut
 </span>
 </label>
 </div>

 <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
 <div className="rounded-lg border border-slate/15 bg-off-white/40 px-4 py-3">
 <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
 Toplam test lead
 </p>
 <p className="mt-1 text-xl font-bold tabular-nums text-ink-black">
 {loading ? "…" : summary.testLeadCount}
 </p>
 </div>
 <div className="rounded-lg border border-slate/15 bg-off-white/40 px-4 py-3">
 <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
 Hariç tutulan
 </p>
 <p className="mt-1 text-xl font-bold tabular-nums text-ink-black">
 {loading ? "…" : summary.excludedFromMetricsCount}
 </p>
 </div>
 <div className="rounded-lg border border-slate/15 bg-off-white/40 px-4 py-3">
 <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
 Metrikte kullanılan
 </p>
 <p className="mt-1 text-xl font-bold tabular-nums text-ink-black">
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

 const label = detection.isManualMark ? "Test Lead (Manuel)" : "Test Lead";

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
 label="Test lead mi?"
 value={detection.isTestLead ? "Evet" : "Hayır"}
 />
 <DetailRow
 label="Manuel işaret"
 value={
 detection.isManualMark
 ? "Evet"
 : detection.manualOverrideNotTest
 ? "Hayır (admin onayı)"
 : "—"
 }
 />
 <DetailRow
 label="Güven seviyesi"
 value={
 detection.isTestLead
 ? formatTestLeadConfidence(detection.confidence)
 : "—"
 }
 />
 <div className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:gap-3">
 <dt className="font-medium text-text-secondary">Tespit nedenleri</dt>
 <dd className="break-words text-ink-black">
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
 <dd className="break-words text-ink-black">{value}</dd>
 </div>
 );
}
