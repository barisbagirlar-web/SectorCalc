import type { RevenueTool } from "@/lib/tools/revenue-tools";
import type { IndustrySlug } from "@/lib/tools/industry-registry";
import { PREMIUM_SCHEMA_SLUG_MAP } from "@/lib/premium-schema/schema-registry";
import { resolvePremiumToolPath } from "@/lib/tools/paths";

export function getFreeToolHref(tool: RevenueTool): string {
  return `/tools/generated/${tool.freeSlug}`;
}

export function getPremiumToolHref(tool: RevenueTool): string {
 return resolvePremiumToolHref(tool.paidSlug);
}

export function getPremiumSchemaToolHref(schemaSlug: string): string {
  return `/tools/premium-schema/${schemaSlug}`;
}

export function resolvePremiumToolHref(paidSlug: string): string {
  const mapped = PREMIUM_SCHEMA_SLUG_MAP[paidSlug];
  if (mapped) {
    return getPremiumSchemaToolHref(mapped);
  }
  return resolvePremiumToolPath(paidSlug);
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
 return "/pro-tools";
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
