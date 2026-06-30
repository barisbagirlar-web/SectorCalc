import { resolveLeadStatus } from "@/lib/features/leads/lead-pipeline";
import type { LeadIntent } from "@/lib/features/leads/types";

export interface LeadAdminMetrics {
 total: number;
 newCount: number;
 topIndustry: string;
 topSource: string;
}

function topValue(
 items: LeadIntent[],
 pick: (lead: LeadIntent) => string
): string {
 const counts = new Map<string, number>();
 for (const item of items) {
 const key = pick(item).trim() || "—";
 counts.set(key, (counts.get(key) ?? 0) + 1);
 }

 let best = "—";
 let bestCount = 0;
 for (const [key, count] of counts) {
 if (count > bestCount) {
 best = key;
 bestCount = count;
 }
 }
 return best;
}

export function computeLeadAdminMetrics(leads: LeadIntent[]): LeadAdminMetrics {
 return {
 total: leads.length,
 newCount: leads.filter((lead) => resolveLeadStatus(lead) === "new").length,
 topIndustry: topValue(leads, (lead) => lead.industry),
 topSource: topValue(leads, (lead) => lead.source),
 };
}

export function formatLeadSource(source: string): string {
 if (source === "—") return source;
 return source.replace(/_/g, " ");
}

export function formatLeadPlan(plan: string | undefined): string {
 if (!plan) return "—";
 return plan.replace(/_/g, " ");
}
