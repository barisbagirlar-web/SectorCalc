import type { RevenueTool } from "@/lib/tools/revenue-tools";
import type { IndustrySlug } from "@/lib/tools/industry-registry";

export function getFreeToolHref(tool: RevenueTool): string {
 return `/tools/free/${tool.freeSlug}`;
}

export function getPremiumToolHref(tool: RevenueTool): string {
 return `/tools/premium/${tool.paidSlug}`;
}

export function getPricingHref(tool?: RevenueTool, planId?: string): string {
 const params = new URLSearchParams();
 if (tool) {
 params.set("tool", tool.paidSlug);
 }
 if (planId) {
 params.set("plan", planId);
 }
 const query = params.toString();
 return query ? `/pricing?${query}` : "/pricing";
}

export function getSingleVerdictPricingHref(tool?: RevenueTool): string {
 return getPricingHref(tool, "single-verdict");
}

export function getSampleReportHref(): string {
 return "/reports/sample-decision-report";
}

export function getFreeToolsHref(): string {
 return "/free-tools";
}

export function getPremiumToolsHref(): string {
 return "/premium-tools";
}

/** @deprecated Use getPremiumToolsHref */
export function getPremiumToolsNavHref(): string {
 return getPremiumToolsHref();
}

export function getIndustryHref(slug: IndustrySlug | string): string {
 return `/industries/${slug}`;
}

export function getAccountHref(): string {
 return "/account";
}

export function getReportsHref(): string {
 return "/account/reports";
}

export function getArchiveHref(): string {
 return "/account/archive";
}

export function getLoginHref(nextPath: string): string {
 return `/login?next=${encodeURIComponent(nextPath)}`;
}
