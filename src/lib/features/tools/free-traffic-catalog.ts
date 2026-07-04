/**
 * Free traffic catalog - permanently purged. All exports return empty.
 */

export type FreeTrafficCategory = string;
export type FreeTrafficTool = any;
export type FreeTrafficInput = any;

export const FREE_TRAFFIC_TOOLS: readonly FreeTrafficTool[] = [];
export const FREE_TRAFFIC_CATEGORIES: readonly any[] = [];
export const FEATURED_TRAFFIC_SLUGS: readonly string[] = [];

export function getFreeTrafficToolBySlug(_slug: string): FreeTrafficTool | undefined { return undefined; }
export function getFreeTrafficToolBySlugLocalized(_slug: string, _locale: string): FreeTrafficTool | undefined { return undefined; }
export function listFreeTrafficToolsByCategory(_category: any): readonly FreeTrafficTool[] { return []; }
export function listRelatedTrafficTools(_tool: any, _limit?: number): readonly FreeTrafficTool[] { return []; }
export function listFreeTrafficSlugs(): string[] { return []; }
export function listTrafficOnlyFreeSlugs(): readonly string[] { return []; }
export function listPublicFreeTrafficTools(): readonly FreeTrafficTool[] { return []; }
export function getFreeTrafficCategoryLabelKey(_category: any): string { return ""; }
export function inferFreeTrafficCategory(_slug: string): FreeTrafficCategory { return "other"; }
export function resolveFreeTrafficToolDisplayTitle(_slug: string, _locale: string): string { return ""; }
