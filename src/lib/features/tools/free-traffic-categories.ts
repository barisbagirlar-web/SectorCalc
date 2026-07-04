/**
 * Free traffic categories - permanently purged.
 */

export const DEFAULT_FREE_TRAFFIC_CATEGORY = "";

export type FreeTrafficCategoryMeta = Record<string, any>;

export function countToolsInCategory(
  _tools: readonly any[],
  _category: string,
): number {
  return 0;
}

export function getOrderedFreeTrafficCategories(): FreeTrafficCategoryMeta[] {
  return [];
}
