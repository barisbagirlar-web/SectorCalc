import type { LeadIntent, LeadPriority, LeadStatus } from "@/lib/features/leads/types";

export type PipelineStatusFilter = "all" | LeadStatus;

export interface PipelineStatusTab {
 filter: PipelineStatusFilter;
 label: string;
}

export const PIPELINE_STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
 { value: "new", label: "New" },
 { value: "reviewed", label: "Reviewed" },
 { value: "contacted", label: "Contacted" },
 { value: "qualified", label: "Qualified Lead" },
 { value: "converted", label: "Converted" },
 { value: "lost", label: "Lost" },
];

export const PIPELINE_STATUS_TABS: PipelineStatusTab[] = [
 { filter: "all", label: "All" },
 { filter: "new", label: "New" },
 { filter: "reviewed", label: "Reviewed" },
 { filter: "contacted", label: "Contacted" },
 { filter: "qualified", label: "Qualified Lead" },
 { filter: "converted", label: "Converted" },
 { filter: "lost", label: "Lost" },
];

const LEGACY_CLOSED_STATUS = "closed";

function leadContextText(lead: LeadIntent): string {
 return [
 lead.intendedUse,
 lead.toolRequested,
 lead.sourceTool ?? "",
 lead.source,
 lead.message ?? "",
 lead.pagePath,
 lead.industry,
 ]
 .join(" ")
 .toLowerCase();
}

function matchesAny(haystack: string, terms: string[]): boolean {
 return terms.some((term) => haystack.includes(term));
}

/** Normalizes stored status; legacy `closed` maps to `lost`. */
export function resolveLeadStatus(lead: LeadIntent): LeadStatus {
 const raw = String(lead.status ?? "").trim();
 if (!raw) {
 return "new";
 }
 if (raw === LEGACY_CLOSED_STATUS) {
 return "lost";
 }
 if (isLeadStatus(raw)) {
 return raw;
 }
 return "new";
}

export function isLeadStatus(value: string): value is LeadStatus {
 const statuses: LeadStatus[] = [
 "new",
 "reviewed",
 "contacted",
 "qualified",
 "converted",
 "lost",
 ];
 return (statuses as string[]).includes(value);
}

export function resolveLeadPriority(lead: LeadIntent): LeadPriority {
 const score = lead.leadScore;
 if (typeof score !== "number" || Number.isNaN(score)) {
 return "warm";
 }
 if (score >= 70) return "hot";
 if (score >= 40) return "warm";
 return "cold";
}

export function resolveNextAction(lead: LeadIntent): string {
 if (lead.nextAction?.trim()) {
 return lead.nextAction.trim();
 }

 const ctx = leadContextText(lead);

 if (
 matchesAny(ctx, [
 "shop opening",
 "shop",
 "opening",
 "business",
 "calculator",
 "feasibility",
 "fizibilite",
 ])
 ) {
  return "Refer to feasibility study";
 }

 if (matchesAny(ctx, ["credit", "loan", "limit", "kredi", "financing"])) {
  return "Refer to credit/limit study";
 }

 if (matchesAny(ctx, ["export", "invoice", "fatura", "ihracat"])) {
  return "Follow up on financing eligibility";
 }

  return "Contact for preliminary review";
}

export function formatLeadIntentSummary(lead: LeadIntent): string {
 const use = lead.intendedUse.trim();
 if (use) return use;
 return lead.source.replace(/_/g, " ");
}

export function getLeadStatusLabel(status: LeadStatus): string {
 const match = PIPELINE_STATUS_OPTIONS.find((opt) => opt.value === status);
 return match?.label ?? status;
}

export function normalizePhoneForWhatsApp(phone: string): string | null {
 const digits = phone.replace(/\D/g, "");
 if (digits.length < 10) {
 return null;
 }
 return digits;
}

export function buildWhatsAppMessage(lead: LeadIntent): string {
 const intent = formatLeadIntentSummary(lead);
 const tool = lead.toolRequested.trim() || "-";
 const source = lead.source.replace(/_/g, " ");
 return (
   `Hello ${lead.name}, we are following up on your SectorCalc request.\n` +
   `Source: ${source}\n` +
   `Tool: ${tool}\n` +
   `Intent: ${intent}`
 );
}

export function buildWhatsAppUrl(lead: LeadIntent): string | null {
 const phone = lead.phone?.trim();
 if (!phone) {
 return null;
 }
 const normalized = normalizePhoneForWhatsApp(phone);
 if (!normalized) {
 return null;
 }
 const text = buildWhatsAppMessage(lead);
 return `https://wa.me/${normalized}?text=${encodeURIComponent(text)}`;
}

export function hasCallablePhone(lead: LeadIntent): boolean {
 return buildWhatsAppUrl(lead) !== null;
}

export function getLeadPriorityLabel(priority: LeadPriority): string {
 const labels: Record<LeadPriority, string> = {
  hot: "Hot",
  warm: "Warm",
  cold: "Cold",
 };
 return labels[priority];
}

export function matchesPipelineStatusFilter(
 lead: LeadIntent,
 filter: PipelineStatusFilter
): boolean {
 if (filter === "all") return true;
 return resolveLeadStatus(lead) === filter;
}
