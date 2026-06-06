import type { RevenueTool } from "@/lib/tools/revenue-tools";
import type { IndustrySlug } from "@/lib/tools/industry-registry";

export function getFreeToolHref(tool: RevenueTool): string {
  return `/tools/free/${tool.freeSlug}`;
}

export function getPremiumToolHref(tool: RevenueTool): string {
  return `/tools/premium/${tool.paidSlug}`;
}

export function getPricingHref(tool?: RevenueTool): string {
  if (!tool) {
    return "/pricing";
  }

  return `/pricing?tool=${encodeURIComponent(tool.paidSlug)}`;
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

export function getLoginHref(nextPath: string): string {
  return `/login?next=${encodeURIComponent(nextPath)}`;
}
