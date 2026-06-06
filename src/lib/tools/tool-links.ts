import type { RevenueTool } from "@/lib/tools/revenue-tools";

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

export function getAccountHref(): string {
  return "/account";
}

export function getReportsHref(): string {
  return "/account/reports";
}

export function getPremiumToolsNavHref(): string {
  return "/pricing#premium-tools";
}

export function getLoginHref(nextPath: string): string {
  return `/login?next=${encodeURIComponent(nextPath)}`;
}
