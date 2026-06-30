/** Client-safe free-tools category filter helpers (URL params + legacy tab aliases). */

export const FREE_TOOLS_LEGACY_CATEGORY_ALIASES: Readonly<Record<string, string>> = {
  "cost-margin": "finance-business",
  "scrap-oee": "manufacturing-workshop",
  "energy-carbon": "energy-carbon",
  "routing-logistics": "logistics-travel",
  "construction-field": "construction-measurement",
  "daily-practical": "everyday-life",
};

export function resolveFreeToolsFilterCategoryId(
  categoryParam: string,
  allowedCategoryIds: ReadonlySet<string>,
  fallbackCategoryId?: string,
): string {
  const normalized = categoryParam.trim();
  if (normalized === "" || normalized === "all") {
    if (fallbackCategoryId && allowedCategoryIds.has(fallbackCategoryId)) {
      return fallbackCategoryId;
    }
    return "all";
  }

  if (allowedCategoryIds.has(normalized)) {
    return normalized;
  }

  const legacy = FREE_TOOLS_LEGACY_CATEGORY_ALIASES[normalized];
  if (legacy && allowedCategoryIds.has(legacy)) {
    return legacy;
  }

  return "all";
}
