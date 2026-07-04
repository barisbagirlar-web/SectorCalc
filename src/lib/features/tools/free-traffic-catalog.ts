/**
 * Free traffic catalog - permanently purged.
 */

export interface FreeTrafficInput {
  key: string;
  label: string;
  type: string;
  unit: string;
  required: boolean;
  helper: string;
  min?: number;
  max?: number;
  defaultValue?: string | number;
  options?: readonly { label: string; value: string }[];
}

export interface FreeTrafficTool {
  slug: string;
  title: string;
  description: string;
  seoDescription?: string;
  seoTitle?: string;
  category: string;
  inputs: FreeTrafficInput[];
  relatedPremiumSlug?: string;
  relatedIndustrySlug?: string;
}

export type FreeTrafficCategory = string;
export type FreeTrafficCategoryWithTools = Record<string, FreeTrafficTool[]>;

export const FREE_TRAFFIC_TOOLS: FreeTrafficTool[] = [];

export function getFreeTrafficCatalog(): FreeTrafficTool[] { return []; }
export function getFreeTrafficToolsByCategory(): FreeTrafficCategoryWithTools { return {}; }
export function getFreeTrafficToolBySlug(_slug: string): FreeTrafficTool | undefined { return undefined; }
export function listPublicFreeTrafficTools(): FreeTrafficTool[] { return []; }
