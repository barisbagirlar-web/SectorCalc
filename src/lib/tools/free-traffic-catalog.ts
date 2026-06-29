/**
 * Free traffic catalog — canonical free-slugs.json only (regeneration baseline).
 */

import {
  CANONICAL_FREE_SLUGS,
  CANONICAL_TRAFFIC_FREE_SLUGS,
  humanizeCanonicalSlug,
} from "@/lib/tools/canonical-tool-slugs";
import slugCategoryMap from "@/data/free-traffic-slug-categories.generated.json";
import schemaCatalogMetadata from "@/data/schema-catalog-metadata.generated.json";
import {
  inferFreeTrafficCategory,
  type FreeTrafficCategory,
} from "@/lib/tools/free-traffic-infer";
import { resolveFreeToolDisplayTitle } from "@/lib/i18n/free-tool-i18n";

export type { FreeTrafficCategory } from "@/lib/tools/free-traffic-infer";
export { inferFreeTrafficCategory } from "@/lib/tools/free-traffic-infer";

export type FreeTrafficInput = {
  readonly key: string;
  readonly label: string;
  readonly unit: string;
  readonly type: "number" | "select";
  readonly options?: readonly { readonly label: string; readonly value: string }[];
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly defaultValue?: number | string;
  readonly helper: string;
};

export type FreeTrafficResultType =
  | "quantity"
  | "cost"
  | "ratio"
  | "conversion"
  | "time"
  | "health"
  | "statistics";

export type FreeTrafficTool = {
  readonly slug: string;
  readonly title: string;
  readonly category: FreeTrafficCategory;
  readonly description: string;
  readonly seoTitle: string;
  readonly seoDescription: string;
  readonly inputs: readonly FreeTrafficInput[];
  readonly resultType: FreeTrafficResultType;
  readonly relatedPremiumSlug?: string;
  readonly relatedIndustrySlug?: string;
  readonly missingFactors: readonly string[];
};

/** @deprecated All catalog tools are active; kept for backward compatibility */
export type FreeTrafficToolInput = FreeTrafficInput;

const FREE_TRAFFIC_CATEGORY_IDS: readonly FreeTrafficCategory[] = [
  "construction-measurement",
  "finance-business",
  "manufacturing-workshop",
  "energy-carbon",
  "logistics-travel",
  "agriculture-food",
  "food-cooking",
  "everyday-life",
  "math-statistics",
  "conversion",
  "health-body",
  "physics-science",
  "chemistry-science",
  "engineering-science",
  "date-time",
  "education-academic",
  "ecology-environment",
  "gaming-entertainment",
  "hobbies-diy",
] as const;

const SLUG_CATEGORY_MAP = slugCategoryMap as Readonly<Record<string, string>>;
const SCHEMA_CATALOG_MAP = schemaCatalogMetadata as Readonly<
  Record<string, { readonly catalogCategory?: string }>
>;

function resolveCategoryForSlug(slug: string): FreeTrafficCategory {
  const fromSchema = SCHEMA_CATALOG_MAP[slug]?.catalogCategory;
  if (fromSchema && (FREE_TRAFFIC_CATEGORY_IDS as readonly string[]).includes(fromSchema)) {
    return fromSchema as FreeTrafficCategory;
  }
  const mapped = SLUG_CATEGORY_MAP[slug];
  if (mapped && (FREE_TRAFFIC_CATEGORY_IDS as readonly string[]).includes(mapped)) {
    return mapped as FreeTrafficCategory;
  }
  return inferFreeTrafficCategory(slug);
}

function buildCatalogEntry(slug: string): FreeTrafficTool {
  const title = humanizeCanonicalSlug(slug);
  return {
    slug,
    title,
    category: resolveCategoryForSlug(slug),
    description: "",
    seoTitle: title,
    seoDescription: "",
    inputs: [],
    resultType: "quantity",
    missingFactors: [],
  };
}

export const FREE_TRAFFIC_TOOLS: readonly FreeTrafficTool[] = CANONICAL_FREE_SLUGS.map((slug) =>
  buildCatalogEntry(slug),
);

export const FREE_TRAFFIC_CATEGORIES: readonly FreeTrafficCategory[] = FREE_TRAFFIC_CATEGORY_IDS;

export const FEATURED_TRAFFIC_SLUGS: readonly string[] = [
  "margin-calculator",
  "mortgage-calculator",
  "concrete-volume-calculator",
  "percentage-calculator",
  "compound-interest-calculator",
  "carbon-footprint-calculator",
  "kwh-cost-calculator",
  "cm-to-inches-converter",
].filter((slug) => CANONICAL_FREE_SLUGS.includes(slug));

/** Resolve a tool title with locale-aware fallback (messages, catalog i18n, glossary, English). */
export function resolveFreeTrafficToolDisplayTitle(slug: string, locale: string): string {
  if (locale === "en") return humanizeCanonicalSlug(slug);
  return resolveFreeToolDisplayTitle(slug, locale, humanizeCanonicalSlug(slug));
}

export function getFreeTrafficToolBySlug(slug: string): FreeTrafficTool | undefined {
  return FREE_TRAFFIC_TOOLS.find((tool) => tool.slug === slug);
}

export function getFreeTrafficToolBySlugLocalized(
  slug: string,
  locale: string,
): FreeTrafficTool | undefined {
  const tool = FREE_TRAFFIC_TOOLS.find((t) => t.slug === slug);
  if (!tool) return undefined;
  return { ...tool, title: resolveFreeTrafficToolDisplayTitle(slug, locale) };
}

export function listFreeTrafficToolsByCategory(
  category: FreeTrafficCategory,
): readonly FreeTrafficTool[] {
  return FREE_TRAFFIC_TOOLS.filter((tool) => tool.category === category);
}

export function listRelatedTrafficTools(
  tool: FreeTrafficTool,
  limit = 6,
): readonly FreeTrafficTool[] {
  return FREE_TRAFFIC_TOOLS.filter(
    (candidate) => candidate.category === tool.category && candidate.slug !== tool.slug,
  ).slice(0, limit);
}

export function listFreeTrafficSlugs(): string[] {
  return FREE_TRAFFIC_TOOLS.map((t) => t.slug);
}

export function listTrafficOnlyFreeSlugs(): readonly string[] {
  return [...CANONICAL_TRAFFIC_FREE_SLUGS];
}

export function listPublicFreeTrafficTools(): readonly FreeTrafficTool[] {
  return FREE_TRAFFIC_TOOLS;
}

export function getFreeTrafficCategoryLabelKey(category: FreeTrafficCategory): string {
  return `categories.${category}`;
}
