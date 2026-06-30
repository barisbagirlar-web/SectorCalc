import type { CatalogGroup, CatalogItemKind, CategoryExplorerVariant } from "@/lib/catalog/catalog-types";

export const CATALOG_SEARCH_MAX_RESULTS = 10;

export type CatalogSearchTier = "free" | "premium" | "industry" | "neutral";

export type CatalogSearchEntry = {
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly groupLabel: string;
  readonly slug: string;
  readonly meta?: string;
  readonly tier: CatalogSearchTier;
  readonly haystack: string;
};

export type CatalogSearchResult = {
  readonly visible: readonly CatalogSearchEntry[];
  readonly hiddenCount: number;
  readonly totalMatches: number;
};

export function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .trim();
}

export function extractSlugFromHref(href: string): string {
  const parts = href.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? "";
}

function resolveSearchTier(
  variant: CategoryExplorerVariant | "homepage",
  item: CatalogGroup["items"][number]
): CatalogSearchTier {
  if (variant === "free-tools") {
    return "free";
  }
  if (variant === "premium-tools") {
    return "premium";
  }
  if (variant === "industries") {
    return "industry";
  }
  if (item.itemKind === "premium-analyzer") {
    return "premium";
  }
  if (item.itemKind === "free-calculator") {
    return "free";
  }
  if (item.href.includes("/tools/premium")) {
    return "premium";
  }
  if (item.href.includes("/tools/free/")) {
    return "free";
  }
  return "neutral";
}

function buildHaystack(parts: readonly (string | undefined)[]): string {
  return normalizeSearchText(parts.filter(Boolean).join(" "));
}

function catalogItemToSearchEntry(
  item: CatalogGroup["items"][number],
  group: CatalogGroup,
  variant: CategoryExplorerVariant | "homepage"
): CatalogSearchEntry {
  const slug = extractSlugFromHref(item.href);
  const relatedPremiumText =
    item.relatedPremium?.map((related) => `${related.title} ${related.description ?? ""}`).join(" ") ??
    "";

  return {
    title: item.title,
    description: item.description,
    href: item.href,
    groupLabel: group.label,
    slug,
    meta: item.meta,
    tier: resolveSearchTier(variant, item),
    haystack: buildHaystack([
      item.title,
      item.description,
      group.label,
      group.description,
      item.meta,
      item.badge,
      slug,
      slug.replace(/-/g, " "),
      relatedPremiumText,
    ]),
  };
}

export function buildSearchEntriesFromGroups(
  groups: readonly CatalogGroup[],
  variant: CategoryExplorerVariant | "homepage"
): CatalogSearchEntry[] {
  return groups.flatMap((group) =>
    group.items.map((item) => catalogItemToSearchEntry(item, group, variant))
  );
}

export function mergeSearchEntries(
  ...entrySets: readonly (readonly CatalogSearchEntry[])[]
): CatalogSearchEntry[] {
  const seen = new Set<string>();
  const merged: CatalogSearchEntry[] = [];

  for (const entries of entrySets) {
    for (const entry of entries) {
      const key = `${entry.href}::${entry.title}`;
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      merged.push(entry);
    }
  }

  return merged;
}

function queryTokens(query: string): string[] {
  return normalizeSearchText(query)
    .split(/\s+/)
    .filter((token) => token.length > 0);
}

export function filterCatalogSearchEntries(
  entries: readonly CatalogSearchEntry[],
  query: string,
  maxResults: number = CATALOG_SEARCH_MAX_RESULTS
): CatalogSearchResult {
  const tokens = queryTokens(query);
  if (tokens.length === 0) {
    return { visible: [], hiddenCount: 0, totalMatches: 0 };
  }

  const matches = entries.filter((entry) => tokens.every((token) => entry.haystack.includes(token)));
  const visible = matches.slice(0, maxResults);

  return {
    visible,
    hiddenCount: Math.max(0, matches.length - visible.length),
    totalMatches: matches.length,
  };
}

export function inferItemKindFromTier(tier: CatalogSearchTier): CatalogItemKind | undefined {
  if (tier === "free") {
    return "free-calculator";
  }
  if (tier === "premium") {
    return "premium-analyzer";
  }
  return undefined;
}
