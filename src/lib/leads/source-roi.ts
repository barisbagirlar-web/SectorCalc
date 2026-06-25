import { formatLeadPlan } from "@/lib/leads/admin-metrics";
import { resolveLeadFollowUpSla } from "@/lib/leads/follow-up-sla";
import { computeLeadQualityScore } from "@/lib/leads/lead-quality-score";
import { resolveLeadStatus } from "@/lib/leads/lead-pipeline";
import { resolveLeadAttribution } from "@/lib/leads/source-attribution";
import type { LeadIntent } from "@/lib/leads/types";

export type SourceRoiGroupType =
 | "attribution"
 | "industry"
 | "plan"
 | "tool"
 | "page";

export type SourceRoiEfficiencyLevel = "strong" | "watch" | "weak";

export interface SourceRoiRow {
 sourceLabel: string;
 groupType: SourceRoiGroupType;
 total: number;
 averageQualityScore: number;
 highQualityCount: number;
 contactedCount: number;
 qualifiedCount: number;
 convertedCount: number;
 lostCount: number;
 urgentFollowUpCount: number;
 contactRate: number;
 qualificationRate: number;
 conversionRate: number;
 lostRate: number;
 urgentRatio: number;
 efficiencyScore: number;
 efficiencyLevel: SourceRoiEfficiencyLevel;
 recommendation: string;
}

export interface LeadSourceRoiResult {
 rows: SourceRoiRow[];
 topRows: SourceRoiRow[];
 strongestSource: SourceRoiRow | null;
 weakestSource: SourceRoiRow | null;
 highestUrgentSource: SourceRoiRow | null;
 totalLeads: number;
 showLowSampleWarning: boolean;
}

const LOW_SAMPLE_LEAD_THRESHOLD = 10;
const MIN_GROUP_SIZE_FOR_HIGHLIGHT = 1;

function safeRate(numerator: number, denominator: number): number {
 if (denominator <= 0 || !Number.isFinite(numerator)) {
 return 0;
 }
 const rate = numerator / denominator;
 return Number.isFinite(rate) ? rate : 0;
}

function clampScore(value: number): number {
 if (!Number.isFinite(value)) {
 return 0;
 }
 return Math.min(100, Math.max(0, Math.round(value)));
}

function resolveEfficiencyLevel(score: number): SourceRoiEfficiencyLevel {
 if (score >= 60) {
 return "strong";
 }
 if (score >= 30) {
 return "watch";
 }
 return "weak";
}

function buildRecommendation(row: {
 efficiencyLevel: SourceRoiEfficiencyLevel;
 urgentFollowUpCount: number;
 urgentRatio: number;
 total: number;
}): string {
 const parts: string[] = [];

 const urgentHeavy =
 row.urgentFollowUpCount >= 2 ||
 (row.total >= 2 && row.urgentRatio >= 0.25);

 if (urgentHeavy && row.urgentFollowUpCount > 0) {
   parts.push("Clear follow-up backlog first");
 }

 if (row.efficiencyLevel === "strong") {
   parts.push("Focus on this source");
 } else if (row.efficiencyLevel === "watch") {
   parts.push("Monitor, improve quality");
 } else {
   parts.push("Filter test records or change CTA");
 }

 return parts.join(" · ");
}

function computeEfficiencyScore(input: {
 averageQualityScore: number;
 qualificationRate: number;
 conversionRate: number;
 contactRate: number;
 lostRate: number;
 urgentRatio: number;
}): number {
 const raw =
 input.averageQualityScore * 0.45 +
 input.qualificationRate * 25 +
 input.conversionRate * 20 +
 input.contactRate * 10 +
 input.lostRate * -15 +
 input.urgentRatio * -10;

 return clampScore(raw);
}

function labelOrUnknown(value: string | undefined): string {
 const trimmed = value?.trim();
 return trimmed ? trimmed : "Unknown";
}

function resolveGroupKey(
 lead: LeadIntent,
 groupType: SourceRoiGroupType
): string {
 const attribution = resolveLeadAttribution(lead);

 switch (groupType) {
 case "attribution":
 return attribution.attributionLabel;
 case "industry":
 return attribution.industryLabel;
 case "plan":
 return formatLeadPlan(lead.plan) || attribution.planLabel;
 case "tool":
 return (
 lead.sourceTool?.trim() ||
 lead.toolRequested.trim() ||
 attribution.sourceToolLabel
 );
 case "page":
 return (
 lead.sourcePath?.trim() ||
 lead.path?.trim() ||
 lead.pagePath.trim() ||
 attribution.sourcePageLabel
 );
 default:
 return attribution.attributionLabel;
 }
}

export function computeSourceGroupRoi(
 groupedLeads: LeadIntent[],
 sourceLabel: string,
 groupType: SourceRoiGroupType,
 referenceDate: Date = new Date()
): SourceRoiRow {
 const total = groupedLeads.length;

 if (total === 0) {
 return {
 sourceLabel,
 groupType,
 total: 0,
 averageQualityScore: 0,
 highQualityCount: 0,
 contactedCount: 0,
 qualifiedCount: 0,
 convertedCount: 0,
 lostCount: 0,
 urgentFollowUpCount: 0,
 contactRate: 0,
 qualificationRate: 0,
 conversionRate: 0,
 lostRate: 0,
 urgentRatio: 0,
 efficiencyScore: 0,
 efficiencyLevel: "weak",
 recommendation: buildRecommendation({
 efficiencyLevel: "weak",
 urgentFollowUpCount: 0,
 urgentRatio: 0,
 total: 0,
 }),
 };
 }

 let qualitySum = 0;
 let highQualityCount = 0;
 let contactedCount = 0;
 let qualifiedCount = 0;
 let convertedCount = 0;
 let lostCount = 0;
 let urgentFollowUpCount = 0;

 for (const lead of groupedLeads) {
 const status = resolveLeadStatus(lead);
 const quality = computeLeadQualityScore(lead, referenceDate);
 const sla = resolveLeadFollowUpSla(lead, referenceDate);

 qualitySum += quality.score;
 if (quality.level === "high") {
 highQualityCount += 1;
 }

 if (status === "contacted") contactedCount += 1;
 if (status === "qualified") qualifiedCount += 1;
 if (status === "converted") convertedCount += 1;
 if (status === "lost") lostCount += 1;

 if (sla.slaLevel === "urgent" && status !== "converted" && status !== "lost") {
 urgentFollowUpCount += 1;
 }
 }

 const contactNumerator =
 contactedCount + qualifiedCount + convertedCount;
 const qualificationNumerator = qualifiedCount + convertedCount;

 const averageQualityScore = clampScore(qualitySum / total);
 const contactRate = safeRate(contactNumerator, total);
 const qualificationRate = safeRate(qualificationNumerator, total);
 const conversionRate = safeRate(convertedCount, total);
 const lostRate = safeRate(lostCount, total);
 const urgentRatio = safeRate(urgentFollowUpCount, total);

 const efficiencyScore = computeEfficiencyScore({
 averageQualityScore,
 qualificationRate,
 conversionRate,
 contactRate,
 lostRate,
 urgentRatio,
 });

 const efficiencyLevel = resolveEfficiencyLevel(efficiencyScore);

 const recommendation = buildRecommendation({
 efficiencyLevel,
 urgentFollowUpCount,
 urgentRatio,
 total,
 });

 return {
 sourceLabel: labelOrUnknown(sourceLabel),
 groupType,
 total,
 averageQualityScore,
 highQualityCount,
 contactedCount,
 qualifiedCount,
 convertedCount,
 lostCount,
 urgentFollowUpCount,
 contactRate,
 qualificationRate,
 conversionRate,
 lostRate,
 urgentRatio,
 efficiencyScore,
 efficiencyLevel,
 recommendation,
 };
}

function groupLeadsByType(
 leads: LeadIntent[],
 groupType: SourceRoiGroupType
): Map<string, LeadIntent[]> {
 const map = new Map<string, LeadIntent[]>();

 for (const lead of leads) {
 const key = resolveGroupKey(lead, groupType);
 const bucket = map.get(key) ?? [];
 bucket.push(lead);
 map.set(key, bucket);
 }

 return map;
}

function compareRows(a: SourceRoiRow, b: SourceRoiRow): number {
 return (
 b.efficiencyScore - a.efficiencyScore ||
 b.total - a.total ||
 b.averageQualityScore - a.averageQualityScore ||
 a.sourceLabel.localeCompare(b.sourceLabel)
 );
}

function pickStrongest(rows: SourceRoiRow[]): SourceRoiRow | null {
 const eligible = rows.filter((row) => row.total >= MIN_GROUP_SIZE_FOR_HIGHLIGHT);
 if (eligible.length === 0) {
 return null;
 }

 const attributionRows = eligible.filter((row) => row.groupType === "attribution");
 const pool = attributionRows.length > 0 ? attributionRows : eligible;

 return [...pool].sort(compareRows)[0] ?? null;
}

function pickWeakest(rows: SourceRoiRow[]): SourceRoiRow | null {
 const eligible = rows.filter((row) => row.total >= MIN_GROUP_SIZE_FOR_HIGHLIGHT);
 if (eligible.length === 0) {
 return null;
 }

 const attributionRows = eligible.filter((row) => row.groupType === "attribution");
 const pool = attributionRows.length > 0 ? attributionRows : eligible;

 return [...pool].sort((a, b) => compareRows(b, a))[0] ?? null;
}

function pickHighestUrgent(rows: SourceRoiRow[]): SourceRoiRow | null {
 const eligible = rows.filter(
 (row) => row.total >= MIN_GROUP_SIZE_FOR_HIGHLIGHT && row.urgentFollowUpCount > 0
 );
 if (eligible.length === 0) {
 return null;
 }

 return [...eligible].sort(
 (a, b) =>
 b.urgentFollowUpCount - a.urgentFollowUpCount ||
 b.urgentRatio - a.urgentRatio ||
 b.total - a.total
 )[0] ?? null;
}

const GROUP_TYPES: SourceRoiGroupType[] = [
 "attribution",
 "industry",
 "plan",
 "tool",
 "page",
];

export function computeLeadSourceRoi(
 leads: LeadIntent[],
 referenceDate: Date = new Date()
): LeadSourceRoiResult {
 const rows: SourceRoiRow[] = [];

 for (const groupType of GROUP_TYPES) {
 const groups = groupLeadsByType(leads, groupType);
 for (const [sourceLabel, groupedLeads] of groups.entries()) {
 rows.push(
 computeSourceGroupRoi(groupedLeads, sourceLabel, groupType, referenceDate)
 );
 }
 }

 const sortedRows = [...rows].sort(compareRows);
 const topRows = sortedRows.slice(0, 10);

 return {
 rows: sortedRows,
 topRows,
 strongestSource: pickStrongest(sortedRows),
 weakestSource: pickWeakest(sortedRows),
 highestUrgentSource: pickHighestUrgent(sortedRows),
 totalLeads: leads.length,
 showLowSampleWarning: leads.length < LOW_SAMPLE_LEAD_THRESHOLD,
 };
}

export function formatSourceRoiGroupType(groupType: SourceRoiGroupType): string {
 const labels: Record<SourceRoiGroupType, string> = {
 attribution: "Attribution",
 industry: "Industry",
 plan: "Plan",
 tool: "Tool",
 page: "Page",
 };
 return labels[groupType];
}
