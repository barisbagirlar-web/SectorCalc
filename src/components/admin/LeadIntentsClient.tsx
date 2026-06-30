"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminAuthBar } from "@/components/admin/AdminAuthPanel";
import { LeadConversionMetrics } from "@/components/admin/LeadConversionMetrics";
import { LeadDashboardSummary } from "@/components/admin/LeadDashboardSummary";
import { LeadDetailDrawer } from "@/components/admin/LeadDetailDrawer";
import { LeadExportButton } from "@/components/admin/LeadExportButton";
import {
 LeadActionBadge,
} from "@/components/admin/LeadActionCenter";
import {
 LeadFollowUpSlaBadge,
 LeadFollowUpSlaSection,
} from "@/components/admin/LeadFollowUpSla";
import {
 LeadQualityBadge,
 LeadQualitySection,
} from "@/components/admin/LeadQualityScore";
import { LeadSourceRoiSection } from "@/components/admin/LeadSourceRoi";
import {
 LeadCleanupControls,
 TestLeadBadge,
} from "@/components/admin/LeadCleanupControls";
import type { TestLeadClassificationPatch } from "@/components/admin/LeadTestClassificationControls";
import { LeadContactCell } from "@/components/admin/LeadContactCell";
import {
 LeadPipelineControls,
 type LeadPipelinePatch,
} from "@/components/admin/LeadPipelineControls";
import { LeadPriorityBadge } from "@/components/admin/LeadPriorityBadge";
import { LeadStatusBadge } from "@/components/admin/LeadStatusBadge";
import { LEAD_INDUSTRY_OPTIONS } from "@/data/lead-options";
import { useAdminAuth } from "@/lib/features/admin/use-admin-auth";
import {
 ANALYTICS_EVENTS,
 trackEvent,
} from "@/lib/infrastructure/analytics/events";
import { isFirebaseConfigured } from "@/lib/infrastructure/firebase/client";
import { formatLocalDateTime } from "@/lib/core/format/datetime";
import { computeLeadDashboardStats } from "@/lib/features/leads/admin-dashboard";
import { computeLeadConversionMetrics } from "@/lib/features/leads/conversion-metrics";
import { computeFollowUpSlaSummary, resolveLeadFollowUpSla } from "@/lib/features/leads/follow-up-sla";
import {
 computeLeadQualityScore,
 computeLeadQualitySummary,
} from "@/lib/features/leads/lead-quality-score";
import { resolveLeadActionRecommendation } from "@/lib/features/leads/lead-action-center";
import { computeLeadSourceRoi } from "@/lib/features/leads/source-roi";
import {
 computeLeadCleanupSummary,
 detectTestLead,
 filterLeadsForMetrics,
} from "@/lib/features/leads/lead-cleanup";
import {
 formatLeadIntentSummary,
 matchesPipelineStatusFilter,
 PIPELINE_STATUS_TABS,
 resolveLeadStatus,
 type PipelineStatusFilter,
} from "@/lib/features/leads/lead-pipeline";
import { listLeadIntents } from "@/lib/features/leads/list-lead-intents";
import type { LeadIntent, LeadPlan, LeadSource } from "@/lib/features/leads/types";

const ALL_FILTER = "";

const SOURCE_OPTIONS: { value: LeadSource | typeof ALL_FILTER; label: string }[] =
 [
 { value: ALL_FILTER, label: "All sources" },
 { value: "premium_unlock", label: "Premium unlock" },
 { value: "pricing", label: "Pricing" },
 { value: "export", label: "Export" },
 { value: "sample_report", label: "Sample report" },
 { value: "unknown", label: "Unknown" },
 ];

const PLAN_OPTIONS: { value: LeadPlan | typeof ALL_FILTER; label: string }[] = [
 { value: ALL_FILTER, label: "All plans" },
 { value: "single_report", label: "Single report" },
 { value: "sector_pass", label: "Sector pass" },
 { value: "pro", label: "Pro" },
 { value: "free", label: "Free" },
 { value: "unknown", label: "Unknown" },
];

const pipelineTabClass =
 "inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-lg border px-3.5 text-sm font-medium transition-colors";
const pipelineTabActiveClass =
 "border-professional-blue bg-professional-blue text-white";
const pipelineTabIdleClass =
 "border-slate/25 bg-white text-deep-navy hover:border-professional-blue/40 hover:bg-off-white";

const filterSelectClass =
 "w-full min-h-[44px] rounded-lg border border-slate/25 bg-white px-3 text-sm text-deep-navy focus:border-professional-blue focus:outline-none focus:ring-2 focus:ring-professional-blue/20";

function matchesSearch(lead: LeadIntent, query: string): boolean {
 const q = query.trim().toLowerCase();
 if (!q) return true;
 const haystack = [
 lead.company,
 lead.email,
 lead.toolRequested,
 lead.name,
 ]
 .join(" ")
 .toLowerCase();
 return haystack.includes(q);
}

export function LeadIntentsClient() {
 const { loading: authLoading, isAdmin } = useAdminAuth();
 const [leads, setLeads] = useState<LeadIntent[]>([]);
 const [loading, setLoading] = useState(false);
 const [loadError, setLoadError] = useState<string | null>(null);
 const [detailLeadId, setDetailLeadId] = useState<string | null>(null);

 const [industryFilter, setIndustryFilter] = useState(ALL_FILTER);
 const [sourceFilter, setSourceFilter] = useState<LeadSource | typeof ALL_FILTER>(
 ALL_FILTER
 );
 const [planFilter, setPlanFilter] = useState<LeadPlan | typeof ALL_FILTER>(
 ALL_FILTER
 );
 const [pipelineFilter, setPipelineFilter] =
 useState<PipelineStatusFilter>("all");
 const [search, setSearch] = useState("");
 const [excludeTestLeadsFromMetrics, setExcludeTestLeadsFromMetrics] =
 useState(true);

 const firebaseConfigured = isFirebaseConfigured;
 const canLoadData = !authLoading && isAdmin;

 const loadLeads = useCallback(async () => {
 if (!isAdmin) {
 return;
 }

 setLoading(true);
 setLoadError(null);
 try {
 const data = await listLeadIntents();
 setLeads(data);
 } catch {
 setLoadError("Failed to load lead data. Please refresh the page.");
 } finally {
 setLoading(false);
 }
 }, [isAdmin]);

 useEffect(() => {
 if (authLoading) {
 return;
 }

 if (!isAdmin) {
 setLeads([]);
 setLoadError(null);
 setLoading(false);
 setDetailLeadId(null);
 return;
 }

 void loadLeads();
 trackEvent(ANALYTICS_EVENTS.admin_leads_viewed, {
 firebaseConfigured,
 });
 }, [authLoading, isAdmin, loadLeads, firebaseConfigured]);

 const filteredLeads = useMemo(() => {
 return leads.filter((lead) => {
 if (industryFilter && lead.industry !== industryFilter) return false;
 if (sourceFilter && lead.source !== sourceFilter) return false;
 if (planFilter && lead.plan !== planFilter) return false;
 if (!matchesPipelineStatusFilter(lead, pipelineFilter)) return false;
 return matchesSearch(lead, search);
 });
 }, [leads, industryFilter, sourceFilter, planFilter, pipelineFilter, search]);

 const cleanupSummary = useMemo(
 () =>
 computeLeadCleanupSummary(leads, {
 excludeTestLeads: excludeTestLeadsFromMetrics,
 }),
 [leads, excludeTestLeadsFromMetrics]
 );

 const metricLeads = useMemo(
 () =>
 filterLeadsForMetrics(leads, {
 excludeTestLeads: excludeTestLeadsFromMetrics,
 }),
 [leads, excludeTestLeadsFromMetrics]
 );

 const dashboardStats = useMemo(
 () => computeLeadDashboardStats(metricLeads),
 [metricLeads]
 );

 const conversionMetrics = useMemo(
 () => computeLeadConversionMetrics(metricLeads),
 [metricLeads]
 );

 const followUpSlaSummary = useMemo(
 () => computeFollowUpSlaSummary(metricLeads),
 [metricLeads]
 );

 const qualitySummary = useMemo(
 () => computeLeadQualitySummary(metricLeads),
 [metricLeads]
 );

 const sourceRoi = useMemo(() => computeLeadSourceRoi(metricLeads), [metricLeads]);

 const detailLead = useMemo(() => {
 if (!detailLeadId) {
 return null;
 }
 return (
 filteredLeads.find((lead) => lead.id === detailLeadId) ??
 leads.find((lead) => lead.id === detailLeadId) ??
 null
 );
 }, [detailLeadId, filteredLeads, leads]);

 const emitFilterChange = useCallback(() => {
 trackEvent(ANALYTICS_EVENTS.admin_lead_filter_changed, {
 industry: industryFilter || ALL_FILTER,
 source: sourceFilter || ALL_FILTER,
 plan: planFilter || ALL_FILTER,
 status: pipelineFilter,
 hasSearch: search.trim().length > 0,
 });
 }, [industryFilter, sourceFilter, planFilter, pipelineFilter, search]);

 useEffect(() => {
 if (!canLoadData || loading) return;
 emitFilterChange();
 }, [
 industryFilter,
 sourceFilter,
 planFilter,
 pipelineFilter,
 search,
 canLoadData,
 loading,
 emitFilterChange,
 ]);

 const handleLeadPatched = useCallback((leadId: string, patch: LeadPipelinePatch) => {
 setLeads((current) =>
 current.map((item) =>
 item.id === leadId
 ? {
 ...item,
 status: patch.status,
 adminNote: patch.adminNote,
 updatedAt: patch.updatedAt,
 }
 : item
 )
 );
 }, []);

 const handleLeadTestClassificationPatched = useCallback(
 (leadId: string, patch: TestLeadClassificationPatch) => {
 setLeads((current) =>
 current.map((item) =>
 item.id === leadId
 ? {
 ...item,
 isTestLead: patch.isTestLead,
 testLeadReason: patch.testLeadReason,
 testLeadMarkedAt: patch.testLeadMarkedAt,
 testLeadMarkedByUid: patch.testLeadMarkedByUid,
 testLeadMarkedByEmail: patch.testLeadMarkedByEmail,
 updatedAt: patch.updatedAt ?? item.updatedAt,
 }
 : item
 )
 );
 },
 []
 );

 const openDetail = (id: string) => {
 setDetailLeadId(id);
 };

 const closeDetail = () => {
 setDetailLeadId(null);
 };

 if (authLoading) {
 return (
 <div className="space-y-4">
 <AdminAuthBar />
 </div>
 );
 }

 if (!isAdmin) {
 return (
 <div className="space-y-4">
 <AdminAuthBar />
 </div>
 );
 }

 return (
 <div className="space-y-8">
 <AdminAuthBar />

 {!firebaseConfigured && (
 <div
 className="rounded-sm border border-professional-blue/20 bg-professional-blue/5 px-5 py-4 text-sm text-deep-navy"
 role="status"
 >
 Firebase is not configured. Showing leads from this browser&apos;s
 localStorage only ({`sectorcalc:lead-intents`}). Configure public Firebase
 env vars to sync with Firestore.
 </div>
 )}

 <LeadCleanupControls
 summary={cleanupSummary}
 excludeTestLeadsFromMetrics={excludeTestLeadsFromMetrics}
 onExcludeTestLeadsChange={setExcludeTestLeadsFromMetrics}
 loading={loading}
 />

 <LeadDashboardSummary stats={dashboardStats} loading={loading} />

 <LeadConversionMetrics metrics={conversionMetrics} loading={loading} />

 <LeadFollowUpSlaSection summary={followUpSlaSummary} loading={loading} />

 <LeadQualitySection summary={qualitySummary} loading={loading} />

 <LeadSourceRoiSection roi={sourceRoi} loading={loading} />

 <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
 <LeadExportButton
 leads={filteredLeads}
 disabled={loading || filteredLeads.length === 0}
 />
 </div>

 <section
 className="rounded-sm border border-slate/20 bg-white p-5 shadow-card sm:p-6"
 aria-label="Lead pipeline"
 >
 <h2 className="text-lg font-bold text-deep-navy">Lead pipeline</h2>
 <p className="mt-1 text-sm text-text-secondary">
 Sales tracking — filter by status (client-side).
 </p>
 <div
 className="mt-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
 role="tablist"
 >
 {PIPELINE_STATUS_TABS.map((tab) => {
 const active = pipelineFilter === tab.filter;
 return (
 <button
 key={tab.filter}
 type="button"
 role="tab"
 aria-selected={active}
 onClick={() => setPipelineFilter(tab.filter)}
 className={`${pipelineTabClass} ${
 active ? pipelineTabActiveClass : pipelineTabIdleClass
 }`}
 >
 {tab.label}
 </button>
 );
 })}
 </div>
 </section>

 <section className="rounded-sm border border-slate/20 bg-white p-5 shadow-card sm:p-6">
 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
 <h2 className="text-lg font-bold text-deep-navy">Filters</h2>
 <button
 type="button"
 onClick={() => void loadLeads()}
 disabled={loading}
 className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-slate/25 px-4 text-sm font-medium text-deep-navy transition-colors hover:border-professional-blue/40 hover:bg-off-white disabled:opacity-50"
 >
 {loading ? "Refreshing…" : "Refresh"}
 </button>
 </div>
 <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
 <label className="space-y-1.5">
 <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">
 Industry
 </span>
 <select
 value={industryFilter}
 onChange={(e) => setIndustryFilter(e.target.value)}
 className={filterSelectClass}
 >
 <option value={ALL_FILTER}>All industries</option>
 {LEAD_INDUSTRY_OPTIONS.map((opt) => (
 <option key={opt.value} value={opt.value}>
 {opt.label}
 </option>
 ))}
 </select>
 </label>
 <label className="space-y-1.5">
 <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">
 Source
 </span>
 <select
 value={sourceFilter}
 onChange={(e) =>
 setSourceFilter(e.target.value as LeadSource | typeof ALL_FILTER)
 }
 className={filterSelectClass}
 >
 {SOURCE_OPTIONS.map((opt) => (
 <option key={opt.value || "all"} value={opt.value}>
 {opt.label}
 </option>
 ))}
 </select>
 </label>
 <label className="space-y-1.5">
 <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">
 Plan
 </span>
 <select
 value={planFilter}
 onChange={(e) =>
 setPlanFilter(e.target.value as LeadPlan | typeof ALL_FILTER)
 }
 className={filterSelectClass}
 >
 {PLAN_OPTIONS.map((opt) => (
 <option key={opt.value || "all"} value={opt.value}>
 {opt.label}
 </option>
 ))}
 </select>
 </label>
 <label className="space-y-1.5 sm:col-span-2 lg:col-span-2">
 <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">
 Search
 </span>
 <input
 type="search"
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 placeholder="Company, email, tool…"
 className={filterSelectClass}
 />
 </label>
 </div>
 </section>

 {loadError && (
 <p className="rounded-lg border border-amber/30 bg-amber/[0.06] px-4 py-3 text-sm text-amber" role="alert">
 {loadError}
 </p>
 )}

 {loading ? (
 <p className="text-sm text-text-secondary">Loading lead intents…</p>
 ) : filteredLeads.length === 0 ? (
 <div className="rounded-sm border border-dashed border-slate/25 bg-white px-6 py-12 text-center shadow-card">
 <p className="text-lg font-semibold text-deep-navy">No lead intents yet.</p>
 <p className="mt-2 text-sm text-text-secondary">
 Submit a test lead from a premium tool or the pricing page, then refresh.
 </p>
 </div>
 ) : (
 <>
 <div className="hidden overflow-x-auto rounded-sm border border-slate/20 bg-white shadow-card md:block">
 <table className="w-full min-w-[1280px] text-left text-sm">
 <thead>
 <tr className="border-b border-slate/15 bg-off-white text-xs font-semibold uppercase tracking-wider text-text-secondary">
 <th className="px-4 py-3">Created</th>
 <th className="px-4 py-3">Lead</th>
 <th className="px-4 py-3">Intent</th>
 <th className="px-4 py-3">Tool</th>
 <th className="px-4 py-3">Priority</th>
 <th className="px-4 py-3">Quality</th>
 <th className="px-4 py-3">Status</th>
 <th className="px-4 py-3">SLA</th>
 <th className="px-4 py-3">Recommended action</th>
 <th className="px-4 py-3">Contact</th>
 <th className="px-4 py-3">Pipeline</th>
 <th className="px-4 py-3" />
 </tr>
 </thead>
 <tbody>
 {filteredLeads.map((lead) => (
 <LeadTableRow
 key={lead.id}
 lead={lead}
 onOpenDetail={() => openDetail(lead.id)}
 onLeadPatched={handleLeadPatched}
 />
 ))}
 </tbody>
 </table>
 </div>

 <div className="space-y-4 md:hidden">
 {filteredLeads.map((lead) => (
 <LeadMobileCard
 key={lead.id}
 lead={lead}
 onOpenDetail={() => openDetail(lead.id)}
 onLeadPatched={handleLeadPatched}
 />
 ))}
 </div>
 </>
 )}

 <LeadDetailDrawer
 lead={detailLead}
 open={detailLead !== null}
 onClose={closeDetail}
 onLeadPatched={handleLeadPatched}
 onLeadTestClassificationPatched={handleLeadTestClassificationPatched}
 />
 </div>
 );
}

function LeadCreatedAt({ createdAt }: { createdAt: string }) {
 return (
 <div className="space-y-0.5">
 <span className="block text-[10px] font-medium uppercase tracking-wide text-slate/80">
 Local time
 </span>
 <time dateTime={createdAt} title={createdAt} className="text-deep-navy">
 {formatLocalDateTime(createdAt)}
 </time>
 </div>
 );
}

function LeadTableRow({
 lead,
 onOpenDetail,
 onLeadPatched,
}: {
 lead: LeadIntent;
 onOpenDetail: () => void;
 onLeadPatched: (leadId: string, patch: LeadPipelinePatch) => void;
}) {
 const status = resolveLeadStatus(lead);
 const sla = resolveLeadFollowUpSla(lead);
 const quality = computeLeadQualityScore(lead);
 const action = resolveLeadActionRecommendation(lead);
 const testDetection = detectTestLead(lead);
 const intent = formatLeadIntentSummary(lead);

 return (
 <tr className="border-b border-slate/10 last:border-0 hover:bg-off-white/50">
 <td className="px-4 py-3 whitespace-nowrap align-top">
 <LeadCreatedAt createdAt={lead.createdAt} />
 </td>
 <td className="max-w-[160px] px-4 py-3 align-top">
 <p className="font-medium text-deep-navy">{lead.name}</p>
 <p className="mt-0.5 truncate text-xs text-text-secondary" title={lead.company}>
 {lead.company}
 </p>
 <div className="mt-1">
 <TestLeadBadge detection={testDetection} />
 </div>
 </td>
 <td className="max-w-[180px] px-4 py-3 align-top">
 <p className="line-clamp-2 text-text-secondary" title={intent}>
 {intent}
 </p>
 </td>
 <td className="max-w-[140px] px-4 py-3 align-top">
 <p className="truncate" title={lead.toolRequested}>
 {lead.toolRequested}
 </p>
 </td>
 <td className="px-4 py-3 align-top">
 <LeadPriorityBadge lead={lead} />
 </td>
 <td className="max-w-[180px] px-4 py-3 align-top">
 <LeadQualityBadge quality={quality} />
 </td>
 <td className="px-4 py-3 align-top">
 <LeadStatusBadge status={status} />
 </td>
 <td className="max-w-[160px] px-4 py-3 align-top">
 <LeadFollowUpSlaBadge sla={sla} showAge />
 </td>
 <td className="max-w-[200px] px-4 py-3 align-top">
 <LeadActionBadge recommendation={action} />
 </td>
 <td className="max-w-[200px] px-4 py-3 align-top">
 <LeadContactCell lead={lead} />
 </td>
 <td className="max-w-[200px] px-4 py-3 align-top">
 <LeadPipelineControls
 lead={lead}
 layout="table"
 onSaved={onLeadPatched}
 />
 </td>
 <td className="px-4 py-3 align-top">
 <button
 type="button"
 onClick={onOpenDetail}
 className="min-h-[44px] rounded-lg border border-slate/20 px-3 text-xs font-semibold text-professional-blue transition-colors hover:border-professional-blue/40 hover:bg-off-white"
 >
 Detay
 </button>
 </td>
 </tr>
 );
}

function LeadMobileCard({
 lead,
 onOpenDetail,
 onLeadPatched,
}: {
 lead: LeadIntent;
 onOpenDetail: () => void;
 onLeadPatched: (leadId: string, patch: LeadPipelinePatch) => void;
}) {
 const status = resolveLeadStatus(lead);
 const sla = resolveLeadFollowUpSla(lead);
 const quality = computeLeadQualityScore(lead);
 const action = resolveLeadActionRecommendation(lead);
 const testDetection = detectTestLead(lead);
 const intent = formatLeadIntentSummary(lead);

 return (
 <article className="overflow-hidden rounded-sm border border-slate/20 bg-white shadow-card">
 <div className="space-y-4 p-5">
 <div className="flex flex-wrap items-start justify-between gap-3">
 <div className="min-w-0 flex-1">
 <p className="font-bold text-deep-navy">{lead.name}</p>
 <p className="text-sm text-text-secondary">{lead.company}</p>
 </div>
 <div className="flex flex-wrap gap-2">
 <LeadPriorityBadge lead={lead} />
 <LeadQualityBadge quality={quality} />
 <LeadStatusBadge status={status} />
 <LeadFollowUpSlaBadge sla={sla} showAge />
 <TestLeadBadge detection={testDetection} />
 </div>
 </div>
 <dl className="grid grid-cols-[minmax(0,7rem)_1fr] gap-x-3 gap-y-3 text-sm">
 <dt className="text-text-secondary">Created</dt>
 <dd>
 <LeadCreatedAt createdAt={lead.createdAt} />
 </dd>
 <dt className="text-text-secondary">Intent</dt>
 <dd className="break-words text-deep-navy">{intent}</dd>
 <dt className="text-text-secondary">Tool</dt>
 <dd className="break-words">{lead.toolRequested}</dd>
 <dt className="text-text-secondary">Recommended action</dt>
 <dd>
 <LeadActionBadge recommendation={action} />
 </dd>
 <dt className="text-text-secondary">Contact</dt>
 <dd>
 <LeadContactCell lead={lead} />
 </dd>
 </dl>
 <LeadPipelineControls
 lead={lead}
 layout="mobile"
 onSaved={onLeadPatched}
 />
 <button
 type="button"
 onClick={onOpenDetail}
 className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg border border-slate/20 text-sm font-semibold text-professional-blue transition-colors hover:border-professional-blue/40 hover:bg-off-white"
 >
 Detay
 </button>
 </div>
 </article>
 );
}
