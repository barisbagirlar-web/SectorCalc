import type { ToolSlug, ToolTier } from "@/data/tools";
import {
  isCanonicalFreeSlug,
  isCanonicalPremiumSlug,
} from "@/lib/tools/canonical-tool-slugs";

const LEGACY_FREE_TOOL_TIER_PATTERN = /^\/tools\/(?:free|free-traffic)\/([^/]+)$/;
const LEGACY_PREMIUM_TOOL_TIER_PATTERN = /^\/tools\/premium\/([^/]+)$/;

export function resolveGeneratedToolPath(slug: string): string {
  return `/tools/generated/${slug.replace(/-premium$/, "")}`;
}

export function resolvePremiumToolPath(slug: string): string {
  return `/tools/premium/${slug.replace(/-premium$/, "")}`;
}

export function migrateLegacyToolPath(pathname: string): string | null {
  const freeMatch = pathname.match(LEGACY_FREE_TOOL_TIER_PATTERN);
  if (freeMatch?.[1]) {
    const slug = freeMatch[1];
    if (isCanonicalFreeSlug(slug)) {
      return resolveGeneratedToolPath(slug);
    }
    return null;
  }

  const premiumMatch = pathname.match(LEGACY_PREMIUM_TOOL_TIER_PATTERN);
  if (premiumMatch?.[1]) {
    return resolvePremiumToolPath(premiumMatch[1]);
  }

  return null;
}

export function getToolHref(tier: ToolTier, slug: ToolSlug): string {
  if (tier === "free" && isCanonicalFreeSlug(slug)) {
    return resolveGeneratedToolPath(slug);
  }
  if (tier === "premium" && isCanonicalPremiumSlug(slug)) {
    return resolveGeneratedToolPath(slug);
  }
  if (tier === "premium") {
    return resolvePremiumToolPath(slug);
  }
  return `/tools/${tier}/${slug}`;
}

export function parseToolRoute(
  tier: string,
  slug: string,
): { tier: ToolTier; slug: ToolSlug } | null {
  if (tier !== "free" && tier !== "premium") {
    return null;
  }
  return { tier, slug: slug as ToolSlug };
}
