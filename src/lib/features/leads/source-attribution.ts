import { getIndustryNameBySlug } from "@/data/lead-options";
import { formatLeadSource } from "@/lib/features/leads/admin-metrics";
import type { LeadIntent, LeadPlan, LeadSource } from "@/lib/features/leads/types";

export interface LeadSourceAttribution {
 attributionLabel: string;
 sourcePageLabel: string;
 sourceToolLabel: string;
 toolTierLabel: string;
 industryLabel: string;
 planLabel: string;
 ctaLabel: string;
 referrerLabel: string;
 utmSummary: string;
}

const UNKNOWN = "Unknown";

function coalesceString(...values: (string | undefined)[]): string | undefined {
 for (const value of values) {
 const trimmed = value?.trim();
 if (trimmed) {
 return trimmed;
 }
 }
 return undefined;
}

function labelOrUnknown(value: string | undefined): string {
 return value?.trim() ? value.trim() : UNKNOWN;
}

function humanizeToken(value: string): string {
 return value
 .replace(/[_-]+/g, " ")
 .replace(/\s+/g, " ")
 .trim()
 .replace(/\b\w/g, (char) => char.toUpperCase());
}

function inferToolSlugFromPagePath(pagePath: string): string | undefined {
 const match = pagePath.match(/^\/tools\/(?:free|premium)\/([^/?#]+)/i);
 return match?.[1];
}

function inferTierFromPath(pagePath: string): string | undefined {
 if (/\/tools\/free\//i.test(pagePath)) {
 return "free";
 }
 if (/\/tools\/premium\//i.test(pagePath)) {
 return "premium";
 }
 return undefined;
}

function resolvePagePath(lead: LeadIntent): string | undefined {
 return coalesceString(lead.sourcePath, lead.path, lead.pagePath);
}

function resolveToolSlug(lead: LeadIntent, pagePath: string): string | undefined {
 return (
 coalesceString(lead.toolSlug) ?? inferToolSlugFromPagePath(pagePath)
 );
}

function resolveSourceToolLabel(
 lead: LeadIntent,
 toolSlug: string | undefined
): string {
 const explicit = lead.sourceTool?.trim();
 if (explicit) {
 return explicit;
 }
 if (toolSlug) {
 return humanizeToken(toolSlug);
 }
 const requested = lead.toolRequested.trim();
 if (requested) {
 return requested;
 }
 return UNKNOWN;
}

function resolveSourcePageLabel(pagePath: string | undefined): string {
 return labelOrUnknown(pagePath);
}

function resolveToolTierLabel(lead: LeadIntent, pagePath: string): string {
 const tier = coalesceString(lead.tier)?.toLowerCase();
 const inferred = tier ?? inferTierFromPath(pagePath);

 if (inferred === "free") {
 return "Free Tool";
 }
 if (inferred === "premium") {
 return "Premium Tool";
 }
 if (tier) {
 return humanizeToken(tier);
 }
 return UNKNOWN;
}

function resolveIndustryLabel(lead: LeadIntent): string {
 const industry = lead.industry.trim();
 if (!industry) {
 return UNKNOWN;
 }

 const fromSlug = getIndustryNameBySlug(industry.toLowerCase());
 if (fromSlug) {
 return fromSlug;
 }

 return industry;
}

function resolvePlanLabel(plan: LeadPlan | undefined): string {
 switch (plan) {
 case "free":
 return "Free";
 case "pro":
 return "Pro";
 case "single_report":
 case "sector_pass":
 return "Premium";
 case "unknown":
 return "Unknown";
 default:
 return UNKNOWN;
 }
}

function resolveCtaLabel(source: LeadSource, cta: string | undefined): string {
 if (cta?.trim()) {
 return humanizeToken(cta);
 }

 const fromSource = formatLeadSource(source);
 if (fromSource && fromSource !== "—") {
 return humanizeToken(fromSource);
 }

 return UNKNOWN;
}

function simplifyReferrer(referrer: string | undefined): string {
 const value = referrer?.trim();
 if (!value) {
 return UNKNOWN;
 }

 try {
 const url = new URL(value.includes("://") ? value : `https://${value}`);
 return url.hostname.replace(/^www\./i, "") || UNKNOWN;
 } catch {
 return value.length > 80 ? `${value.slice(0, 77)}…` : value;
 }
}

function resolveUtmSummary(lead: LeadIntent): string {
 const parts: string[] = [];

 const source = coalesceString(lead.utmSource);
 const medium = coalesceString(lead.utmMedium);
 const campaign = coalesceString(lead.utmCampaign);

 if (source) {
 parts.push(`source=${source}`);
 }
 if (medium) {
 parts.push(`medium=${medium}`);
 }
 if (campaign) {
 parts.push(`campaign=${campaign}`);
 }

 return parts.length > 0 ? parts.join(" · ") : UNKNOWN;
}

function buildAttributionLabel(parts: {
 sourceToolLabel: string;
 sourcePageLabel: string;
 planLabel: string;
 ctaLabel: string;
 industryLabel: string;
}): string {
 const segments = [
 parts.ctaLabel !== UNKNOWN ? parts.ctaLabel : null,
 parts.sourceToolLabel !== UNKNOWN ? parts.sourceToolLabel : null,
 parts.planLabel !== UNKNOWN ? parts.planLabel : null,
 parts.sourcePageLabel !== UNKNOWN ? parts.sourcePageLabel : null,
 parts.industryLabel !== UNKNOWN ? parts.industryLabel : null,
 ].filter((segment): segment is string => segment !== null);

 if (segments.length > 0) {
 return segments.join(" · ");
 }

 return UNKNOWN;
}

export function resolveLeadAttribution(lead: LeadIntent): LeadSourceAttribution {
 const pagePath = resolvePagePath(lead);
 const toolSlug = resolveToolSlug(lead, pagePath ?? lead.pagePath);

 const sourceToolLabel = resolveSourceToolLabel(lead, toolSlug);
 const sourcePageLabel = resolveSourcePageLabel(pagePath);
 const toolTierLabel = resolveToolTierLabel(lead, pagePath ?? lead.pagePath);
 const industryLabel = resolveIndustryLabel(lead);
 const planLabel = resolvePlanLabel(lead.plan);
 const ctaLabel = resolveCtaLabel(lead.source, lead.cta);
 const referrerLabel = simplifyReferrer(lead.referrer);
 const utmSummary = resolveUtmSummary(lead);

 const attributionLabel = buildAttributionLabel({
 sourceToolLabel,
 sourcePageLabel,
 planLabel,
 ctaLabel,
 industryLabel,
 });

 return {
 attributionLabel,
 sourcePageLabel,
 sourceToolLabel,
 toolTierLabel,
 industryLabel,
 planLabel,
 ctaLabel,
 referrerLabel,
 utmSummary,
 };
}

export function getAttributionDistributionKey(lead: LeadIntent): string {
 return resolveLeadAttribution(lead).attributionLabel;
}
