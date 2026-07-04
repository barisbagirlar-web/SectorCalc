/**
 * Free tool categories - permanently purged. All exports return empty.
 */

export const FREE_TOOL_CATEGORIES: readonly any[] = [];

export type FreeToolCategorySlug = string;

export function listFreeToolCategories(): readonly any[] { return []; }
export function getFreeToolCategoryBySlug(_slug: string): undefined { return undefined; }
