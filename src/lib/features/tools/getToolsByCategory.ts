import "server-only";

import { getAllTools, getFreeTools, getPremiumTools } from "@/lib/features/tools/all-tools-data";
import type { ToolData } from "@/lib/features/tools/all-tools-data";
import {
  resolveCanonicalCategorySlug,
  resolveFreeToolCategoryTitle,
  getFreeToolCategoryBySlug,
  FREE_TOOL_CATEGORIES,
} from "@/lib/features/free-tools/free-tool-categories";

export interface ToolListItem {
  slug: string;
  title: string;
  href: string;
  isPremium: boolean;
  categorySlug: string;
  sectorKey: string;
}

/**
 * Resolve all tools filtered by premium status and grouped by canonical category.
 *
 * @param locale   Locale string (e.g. "tr", "en")
 * @param isPremium  undefined = all tools, true = only premium, false = only free
 */
export function getAllToolsGroupedByCategory(
  locale: string,
  isPremium?: boolean,
): Record<string, ToolListItem[]> {
  const source: ToolData[] =
    isPremium === true
      ? getPremiumTools(locale)
      : isPremium === false
        ? getFreeTools(locale)
        : getAllTools(locale);

  const groups: Record<string, ToolListItem[]> = {};

  for (const tool of source) {
    const canonicalSlug = resolveCanonicalCategorySlug(tool.categoryKey);
    if (!groups[canonicalSlug]) {
      groups[canonicalSlug] = [];
    }
    groups[canonicalSlug].push({
      slug: tool.slug,
      title: tool.name,
      href: tool.href,
      isPremium: tool.premiumRequired,
      categorySlug: canonicalSlug,
      sectorKey: tool.sectorKey,
    });
  }

  // Sort each category's tools alphabetically by title
  for (const slug of Object.keys(groups)) {
    groups[slug].sort((a, b) => a.title.localeCompare(b.title, locale));
  }

  return groups;
}

/**
 * Get tools for a single category, filtered by premium status.
 */
export function getToolsByCategory(
  categorySlug: string,
  locale: string,
  isPremium?: boolean,
): ToolListItem[] {
  const grouped = getAllToolsGroupedByCategory(locale, isPremium);
  const canonicalSlug = resolveCanonicalCategorySlug(categorySlug);
  return grouped[canonicalSlug] ?? [];
}

/**
 * Get ordered category slugs (matching FREE_TOOL_CATEGORIES order),
 * filtered to only include slugs that have tools in the given group.
 */
export function getOrderedCategorySlugsWithTools(
  grouped: Record<string, ToolListItem[]>,
): string[] {
  const result: string[] = [];
  const seen = new Set<string>();

  // Respect FREE_TOOL_CATEGORIES ordering
  for (const cat of FREE_TOOL_CATEGORIES) {
    if (grouped[cat.slug] && grouped[cat.slug].length > 0) {
      result.push(cat.slug);
      seen.add(cat.slug);
    }
  }

  // Any uncategorized groups not in FREE_TOOL_CATEGORIES
  for (const slug of Object.keys(grouped)) {
    if (!seen.has(slug) && grouped[slug].length > 0) {
      result.push(slug);
    }
  }

  return result;
}
