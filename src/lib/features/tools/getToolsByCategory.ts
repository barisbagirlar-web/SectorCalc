/**
 * Get tools by category - Free tools permanently purged.
 */

export interface ToolCategoryEntry {
  slug: string;
  name?: string;
  title: string;
  tier: "free" | "premium";
  sectorKey: string;
  href: string;
  isPremium?: boolean;
  categorySlug?: string;
  previewImage?: string;
}

export type ToolListItem = ToolCategoryEntry;

export function getToolsByCategory(_category: string): ToolCategoryEntry[] {
  return [];
}

export function getAllToolsGroupedByCategory(
  _locale?: string,
): Record<string, ToolCategoryEntry[]> {
  return {};
}

export function getOrderedCategorySlugsWithTools(
  _grouped?: Record<string, ToolCategoryEntry[]>,
): string[] {
  return [];
}
