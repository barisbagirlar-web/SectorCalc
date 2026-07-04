/**
 * Free traffic categories - permanently purged. All exports return empty.
 */

export const FREE_TRAFFIC_CATEGORY_SLUGS: readonly string[] = [];
export const FREE_TRAFFIC_CATEGORY_IDS: readonly string[] = [];

export type FreeTrafficCategoryMeta = Record<string, never>;

export function listFreeTrafficCategorySlugs(): string[] { return []; }
export function isFreeTrafficCategorySlug(_slug: string): boolean { return false; }
export function getOrderedFreeTrafficCategories(): readonly any[] { return []; }
export const DEFAULT_FREE_TRAFFIC_CATEGORY = "";
