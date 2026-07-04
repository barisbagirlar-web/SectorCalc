/**
 * Free tool categories - permanently purged. All exports return empty.
 */

export const FREE_TOOL_CATEGORIES: readonly any[] = [];

export type FreeToolCategorySlug = string;
export type FreeToolCategoryEntry = any;

export function listFreeToolCategories(): readonly any[] { return []; }
export function getFreeToolCategoryBySlug(_slug: string): undefined { return undefined; }
export function resolveCanonicalCategorySlug(_slug: string): string { return ""; }
export function resolveFreeToolCategoryTitle(_slug: string, _locale: string): string { return ""; }
