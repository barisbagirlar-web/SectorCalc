import { resolveLeadStatus } from "@/lib/features/leads/lead-pipeline";
import { resolveLeadAttribution } from "@/lib/features/leads/source-attribution";
import type { LeadIntent, LeadStatus } from "@/lib/features/leads/types";

export interface ConversionFunnelStep {
 status: LeadStatus;
 label: string;
 count: number;
}

export interface AttributionConversionRow {
 sourceLabel: string;
 total: number;
 contacted: number;
 qualified: number;
 converted: number;
 lost: number;
 conversionRate: number;
}

export interface Last7DaysSummary {
 total: number;
 contacted: number;
 qualified: number;
 converted: number;
}

export interface LeadConversionMetrics {
 totalLeads: number;
 newLeads: number;
 reviewedLeads: number;
 contactedLeads: number;
 qualifiedLeads: number;
 convertedLeads: number;
 lostLeads: number;
 followUpNeeded: number;
 openPipeline: number;
 contactRate: number;
 qualificationRate: number;
 conversionRate: number;
 lossRate: number;
 last7DaysTotal: number;
 last7DaysContacted: number;
 last7DaysQualified: number;
 last7DaysConverted: number;
 funnel: ConversionFunnelStep[];
 attribution: AttributionConversionRow[];
 last7Days: Last7DaysSummary;
}

const FUNNEL_STEPS: { status: LeadStatus; label: string }[] = [
 { status: "new", label: "New" },
 { status: "reviewed", label: "Reviewed" },
 { status: "contacted", label: "Contacted" },
 { status: "qualified", label: "Qualified Lead" },
 { status: "converted", label: "Converted" },
 { status: "lost", label: "Lost" },
];

function safeRate(numerator: number, denominator: number): number {
 if (denominator <= 0 || !Number.isFinite(numerator)) {
 return 0;
 }
 const rate = numerator / denominator;
 return Number.isFinite(rate) ? rate : 0;
}

function isWithinLast7Days(createdAt: string, referenceDate: Date): boolean {
 const created = new Date(createdAt);
 if (Number.isNaN(created.getTime())) {
 return false;
 }

 const cutoff = new Date(referenceDate);
 cutoff.setDate(cutoff.getDate() - 7);
 return created >= cutoff;
}

function hasContactProgress(status: LeadStatus): boolean {
 return status === "contacted" || status === "qualified" || status === "converted";
}

function hasQualificationProgress(status: LeadStatus): boolean {
 return status === "qualified" || status === "converted";
}

export function formatConversionPercent(rate: number): string {
 const normalized = Number.isFinite(rate) ? rate : 0;
 return `${(normalized * 100).toFixed(1)}%`;
}

export function computeLeadConversionMetrics(
 leads: LeadIntent[],
 referenceDate: Date = new Date()
): LeadConversionMetrics {
 const statusCounts: Record<LeadStatus, number> = {
 new: 0,
 reviewed: 0,
 contacted: 0,
 qualified: 0,
 converted: 0,
 lost: 0,
 };

 const attributionMap = new Map<
 string,
 {
 total: number;
 contacted: number;
 qualified: number;
 converted: number;
 lost: number;
 }
 >();

 let last7DaysTotal = 0;
 let last7DaysContacted = 0;
 let last7DaysQualified = 0;
 let last7DaysConverted = 0;

 for (const lead of leads) {
 const status = resolveLeadStatus(lead);
 statusCounts[status] += 1;

 const sourceLabel = resolveLeadAttribution(lead).attributionLabel;
 const bucket = attributionMap.get(sourceLabel) ?? {
 total: 0,
 contacted: 0,
 qualified: 0,
 converted: 0,
 lost: 0,
 };

 bucket.total += 1;
 if (status === "contacted") bucket.contacted += 1;
 if (status === "qualified") bucket.qualified += 1;
 if (status === "converted") bucket.converted += 1;
 if (status === "lost") bucket.lost += 1;
 attributionMap.set(sourceLabel, bucket);

 if (isWithinLast7Days(lead.createdAt, referenceDate)) {
 last7DaysTotal += 1;
 if (hasContactProgress(status)) last7DaysContacted += 1;
 if (hasQualificationProgress(status)) last7DaysQualified += 1;
 if (status === "converted") last7DaysConverted += 1;
 }
 }

 const totalLeads = leads.length;
 const newLeads = statusCounts.new;
 const reviewedLeads = statusCounts.reviewed;
 const contactedLeads = statusCounts.contacted;
 const qualifiedLeads = statusCounts.qualified;
 const convertedLeads = statusCounts.converted;
 const lostLeads = statusCounts.lost;

 const followUpNeeded = newLeads + reviewedLeads;
 const openPipeline =
 newLeads + reviewedLeads + contactedLeads + qualifiedLeads;

 const contactNumerator =
 contactedLeads + qualifiedLeads + convertedLeads;
 const qualificationNumerator = qualifiedLeads + convertedLeads;

 const attribution: AttributionConversionRow[] = [...attributionMap.entries()]
 .map(([sourceLabel, row]) => ({
 sourceLabel,
 total: row.total,
 contacted: row.contacted,
 qualified: row.qualified,
 converted: row.converted,
 lost: row.lost,
 conversionRate: safeRate(row.converted, row.total),
 }))
 .sort(
 (a, b) =>
 b.total - a.total ||
 b.conversionRate - a.conversionRate ||
 a.sourceLabel.localeCompare(b.sourceLabel)
 );

 return {
 totalLeads,
 newLeads,
 reviewedLeads,
 contactedLeads,
 qualifiedLeads,
 convertedLeads,
 lostLeads,
 followUpNeeded,
 openPipeline,
 contactRate: safeRate(contactNumerator, totalLeads),
 qualificationRate: safeRate(qualificationNumerator, totalLeads),
 conversionRate: safeRate(convertedLeads, totalLeads),
 lossRate: safeRate(lostLeads, totalLeads),
 last7DaysTotal,
 last7DaysContacted,
 last7DaysQualified,
 last7DaysConverted,
 funnel: FUNNEL_STEPS.map((step) => ({
 status: step.status,
 label: step.label,
 count: statusCounts[step.status],
 })),
 attribution,
 last7Days: {
 total: last7DaysTotal,
 contacted: last7DaysContacted,
 qualified: last7DaysQualified,
 converted: last7DaysConverted,
 },
 };
}
