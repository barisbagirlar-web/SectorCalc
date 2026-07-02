import "server-only";

import fs from "fs";
import * as path from "path";
import schemaCatalogMetadata from "@/data/schema-catalog-metadata.generated.json";
import { buildCategorizedToolIndex, type CategorizedToolItem } from "@/lib/catalog/build-categorized-tool-index";
import { PREMIUM_CALCULATOR_SCHEMAS } from "@/lib/features/premium-schema/schema-registry";
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
import { normalizeRawGeneratedSchema } from "@/lib/features/generated-tools/normalize-schema";
import {
  resolveGeneratedToolTitle,
  resolveGeneratedToolDescription,
} from "@/lib/features/generated-tools/resolve-tool-display";
import { translateCalculatorPhrase } from "@/lib/infrastructure/i18n/calculator-phrase-translate";
import type { GeneratedToolSchema } from "@/lib/features/generated-tools/types";
import { resolveGeneratedToolPath } from "@/lib/features/tools/paths";
import {
  resolveSchemaCatalogCategoryLabel,
  resolveSchemaCatalogSectorLabel,
} from "@/lib/infrastructure/i18n/schema-catalog-sidebar-labels";
import {
  resolveSchemaCategoryKey,
  resolveSchemaSectorKey,
} from "@/lib/features/tools/schema-catalog-label-keys";
import { getPremiumCategorySlugForTool } from "@/data/premium-tool-category-map";
import { resolvePremiumCategoryTitle } from "@/data/premium-categories";
import type { PremiumCategorySlug } from "@/data/premium-categories";
import {
  SECTOR_SLUG_OVERRIDES,
  SLUG_TOKEN_SECTOR_HINTS,
  SECTORS,
} from "@/lib/features/tools/taxonomy";

/** Resolve generated schemas directory - tries multiple deployment paths. */
function resolveSchemasDir(): string {
  const candidates = [
    // Local dev / standard
    path.join(process.cwd(), "generated", "schemas"),
    // Firebase SSR function (.next/server is deployed alongside)
    path.join(process.cwd(), ".next", "server", "generated", "schemas"),
    // Firebase framework-managed function (standalone)
    path.join(process.cwd(), ".next", "standalone", "generated", "schemas"),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return candidates[0];
}
const SCHEMAS_DIR = resolveSchemasDir();
const DEFAULT_LABEL = "Other";

/** Module-level cache keyed by locale: tools are built at cold start and stable for the lifetime of the server.
 *  Prevents flickering caused by redundant filesystem reads during ISR revalidation. */
const toolsCache = new Map<string, ToolData[]>();

type RawSchemaRecord = Readonly<Record<string, unknown>>;

type SchemaCatalogEntry = {
  readonly categorySlug?: string;
  readonly sectorSlug?: string;
  readonly catalogCategory?: string;
};

const SCHEMA_CATALOG_MAP = schemaCatalogMetadata as Readonly<Record<string, SchemaCatalogEntry>>;

export type ToolData = {
  readonly slug: string;
  readonly name: string;
  readonly category: string;
  readonly categoryKey: string;
  readonly sector: string;
  readonly sectorKey: string;
  readonly description: string;
  readonly premiumRequired: boolean;
  readonly premiumCategorySlug?: PremiumCategorySlug;
  readonly premiumCategory?: string;
  readonly href: string;
};

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function humanizeSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function slugFromFileName(fileName: string): string | null {
  const baseName = path.basename(fileName);
  const match = baseName.match(/^(.+)-schema\.json$/);
  return match?.[1] ?? null;
}

function resolveSlug(fileName: string, raw: RawSchemaRecord): string | null {
  return slugFromFileName(fileName) || asString(raw.toolName) || asString(raw.slug) || null;
}

function readSchemaFile(fileName: string): RawSchemaRecord | null {
  try {
    const parsed: unknown = JSON.parse(fs.readFileSync(path.join(SCHEMAS_DIR, fileName), "utf-8"));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }
    return parsed as RawSchemaRecord;
  } catch {
    return null;
  }
}

function resolveToolTitle(
  slug: string,
  raw: RawSchemaRecord,
  normalized: GeneratedToolSchema | null,
  locale: string,
): string {
  if (normalized) {
    return resolveGeneratedToolTitle(slug, normalized, locale);
  }

  const rawTitle =
    asString(raw.title) ||
    asString(raw.name) ||
    asString(raw.toolName) ||
    humanizeSlug(slug);

  // Apply locale glossary translation to fallback title
  if (locale !== "en" && rawTitle.trim()) {
    const translated = translateCalculatorPhrase(rawTitle, locale);
    if (translated.trim() && translated !== rawTitle) {
      return translated;
    }
  }

  return rawTitle;
}

function resolveCategorySlugFallback(
  slug: string,
  raw: RawSchemaRecord,
  normalized: GeneratedToolSchema | null,
  categorySlugFromIndex?: string,
): string | undefined {
  return (
    normalized?.categorySlug ||
    asString(raw.categorySlug) ||
    SCHEMA_CATALOG_MAP[slug]?.categorySlug ||
    categorySlugFromIndex
  );
}

function resolveSectorSlugFallback(
  slug: string,
  raw: RawSchemaRecord,
  normalized: GeneratedToolSchema | null,
): string | undefined {
  return normalized?.sectorSlug || asString(raw.sectorSlug) || SCHEMA_CATALOG_MAP[slug]?.sectorSlug;
}

function resolveCategoryKey(
  slug: string,
  raw: RawSchemaRecord,
  normalized: GeneratedToolSchema | null,
  _categorySlugFromIndex?: string,
): string {
  // Prefer canonical global category slug (e.g. "project-construction-management")
  // over generic categoryId (e.g. "engineering") for consistent taxonomy matching.
  const categorySlug = resolveCategorySlugFallback(slug, raw, normalized, _categorySlugFromIndex);
  if (categorySlug) {
    return categorySlug;
  }

  const categoryId = asString(raw.categoryId) || normalized?.categoryId;
  if (categoryId && categoryId !== "diger") {
    return categoryId;
  }

  const schemaCategory = asString(raw.category);
  if (schemaCategory && schemaCategory !== DEFAULT_LABEL) {
    return resolveSchemaCategoryKey(schemaCategory);
  }

  return categoryId || "diger";
}

/** Set of valid taxonomy sector IDs for validation. */
const TAXONOMY_SECTOR_IDS = new Set(SECTORS.map((s) => s.id));

function resolveSectorKey(
  slug: string,
  raw: RawSchemaRecord,
  normalized: GeneratedToolSchema | null,
): string {
  // Prefer sectorSlug (e.g. "cnc-manufacturing") over generic sectorId
  // (e.g. "makine") for consistent taxonomy matching.
  const sectorSlug = resolveSectorSlugFallback(slug, raw, normalized);
  if (sectorSlug && TAXONOMY_SECTOR_IDS.has(sectorSlug)) {
    return sectorSlug;
  }

  const schemaSectorId = asString(raw.sectorId) || normalized?.sectorId;
  if (schemaSectorId && TAXONOMY_SECTOR_IDS.has(schemaSectorId)) {
    return schemaSectorId;
  }

  const schemaSector = asString(raw.sector);
  if (schemaSector && schemaSector !== DEFAULT_LABEL) {
    const mapped = resolveSchemaSectorKey(schemaSector);
    if (TAXONOMY_SECTOR_IDS.has(mapped)) return mapped;
  }

  // Try exact slug override
  const override = SECTOR_SLUG_OVERRIDES[slug];
  if (override) return override;

  // Try token-based slug hints (e.g. "drywall-calculator" → "insaat")
  const slugTokens = slug.split("-");
  for (const token of slugTokens) {
    const hint = SLUG_TOKEN_SECTOR_HINTS[token];
    if (hint) return hint;
  }

  return "diger";
}

function resolveCategory(
  slug: string,
  raw: RawSchemaRecord,
  normalized: GeneratedToolSchema | null,
  locale: string,
  categorySlugFromIndex?: string,
): Pick<ToolData, "category" | "categoryKey"> {
  const categoryKey = resolveCategoryKey(slug, raw, normalized, categorySlugFromIndex);
  return {
    categoryKey,
    category: resolveSchemaCatalogCategoryLabel(categoryKey, locale),
  };
}

function resolveSector(
  slug: string,
  raw: RawSchemaRecord,
  normalized: GeneratedToolSchema | null,
  locale: string,
): Pick<ToolData, "sector" | "sectorKey"> {
  const sectorKey = resolveSectorKey(slug, raw, normalized);
  return {
    sectorKey,
    sector: resolveSchemaCatalogSectorLabel(sectorKey, locale),
  };
}

function isPremiumTool(
  raw: RawSchemaRecord,
  normalized: GeneratedToolSchema | null,
  tier: ReturnType<typeof buildCategorizedToolIndex>[number]["tier"] | undefined,
): boolean {
  if (raw.premiumRequired === true || normalized?.premiumRequired === true) {
    return true;
  }
  return tier === "premium" || tier === "premium-schema";
}

export function getAllTools(_locale = "en"): ToolData[] {
  // Force English - no Turkish content allowed in UI
  const locale = "en";
  const cached = toolsCache.get(locale);
  if (cached) {
    return cached;
  }

  const categorized = new Map(
    buildCategorizedToolIndex().map((item) => [item.slug, item] as const),
  );

  // When schema files are not on the filesystem (e.g. Firebase Cloud Function
  // where generated/schemas/ may not be bundled), build ToolData from the
  // compile-time categorized index. This always works because free-slugs.json
  // + premium-slugs.json are imported at build time, not read at runtime.
  if (!fs.existsSync(SCHEMAS_DIR)) {
    const fallback: ToolData[] = [...categorized.values()]
      .map((item) => {
        const title = item.title?.en ?? humanizeSlug(item.slug);
        const desc = item.description?.en ?? "";
        const sectorKey = resolveSchemaCatalogSectorLabel(item.categorySlug, locale);
        return {
          slug: item.slug,
          name: title,
          category: resolveSchemaCatalogCategoryLabel(item.categorySlug, locale),
          categoryKey: item.categorySlug,
          sector: sectorKey,
          sectorKey,
          description: desc,
          premiumRequired: item.tier !== "free",
          premiumCategorySlug: getPremiumCategorySlugForTool(item.slug),
          premiumCategory: resolvePremiumCategoryTitle(getPremiumCategorySlugForTool(item.slug), locale),
          href: item.routePath ?? resolveGeneratedToolPath(item.slug),
        };
      })
      .sort((left, right) => left.name.localeCompare(right.name, "en"));
    toolsCache.set(locale, fallback);
    return fallback;
  }

  const tools = (fs.readdirSync(SCHEMAS_DIR, { recursive: true }) as string[])
    .filter((fileName) => fileName.endsWith(".json"))
    .map((fileName) => {
      const raw = readSchemaFile(fileName);
      if (!raw) {
        return null;
      }

      const slug = resolveSlug(fileName, raw);
      if (!slug) {
        return null;
      }

      const normalized = normalizeRawGeneratedSchema(raw, slug);
      const catalogItem = categorized.get(slug);
      const category = resolveCategory(
        slug,
        raw,
        normalized,
        locale,
        catalogItem?.categorySlug,
      );
      const sector = resolveSector(slug, raw, normalized, locale);

      const description = normalized
        ? resolveGeneratedToolDescription(slug, normalized, locale)
        : "";

      const toolData: ToolData = {
        slug,
        name: resolveToolTitle(slug, raw, normalized, locale),
        ...category,
        ...sector,
        description,
        premiumRequired: isPremiumTool(raw, normalized, catalogItem?.tier),
        premiumCategorySlug: getPremiumCategorySlugForTool(slug),
        premiumCategory: resolvePremiumCategoryTitle(getPremiumCategorySlugForTool(slug), locale),
        href: catalogItem?.routePath ?? resolveGeneratedToolPath(slug),
      };
      return toolData;
    })
    .filter((item): item is ToolData => item !== null)
    .sort((left, right) => left.name.localeCompare(right.name, locale));

  toolsCache.set(locale, tools);
  return tools;
}

export function getFreeTools(_locale = "en"): ToolData[] {
  const locale = "en";
  return getAllTools(locale).filter((tool) => !tool.premiumRequired);
}

/** Map premium schema sectorSlug → taxonomy sector ID for sector grid display. */
const PREMIUM_SECTOR_SLUG_TO_TAXONOMY: Record<string, string> = {
  "general": "diger",
  "sheet-metal": "metal",
  "financial-planning": "finans",
  "hvac": "enerji",
  "cnc-additive-manufacturing": "makine",
  "metal-fabrication": "metal",
  "manufacturing": "makine",
  "logistics": "lojistik",
  "lean-production": "makine",
  "it-cloud": "bilisim",
  "auto-repair": "otomotiv",
  "cnc-manufacturing": "makine",
  "construction": "insaat",
  "ecommerce": "perakende",
  "energy-carbon": "enerji",
  "energy-consumption": "enerji",
  "food": "gida",
  "legal-tax": "finans",
  "logistics-transport": "lojistik",
  "quality": "makine",
  "textile": "tekstil",
};

/** Map FormulaFamilyId → FreeToolCategorySlug for category grouping on pro-tools. */
const FORMULA_CATEGORY_TO_CATALOG: Record<string, string> = {
  measurement: "conversion-measurement",
  calibration: "quality-six-sigma",
  scrap: "quality-six-sigma",
  oee: "digital-factory-automation",
  time: "lean-production",
  route: "procurement-supply-chain",
  cost: "finance-sales-working-capital",
  energy: "electrical-power-systems",
  carbon: "sustainability-resource-esg",
  benchmark: "quality-six-sigma",
  finance: "finance-sales-working-capital",
  fluid: "mechanical-hvac-energy-loss",
  lean: "lean-production",
};

function resolvePremiumSectorKey(sectorSlug: string): string {
  return PREMIUM_SECTOR_SLUG_TO_TAXONOMY[sectorSlug] ?? "diger";
}

function schemaToToolData(schema: PremiumCalculatorSchema, locale: string): ToolData {
  const title = schema.name_i18n?.[locale] ?? schema.name;
  const desc = schema.painStatement_i18n?.[locale] ?? schema.painStatement;
  const sectorKey = resolvePremiumSectorKey(schema.sectorSlug);
  const catalogCategory = FORMULA_CATEGORY_TO_CATALOG[schema.category] ?? "other";
  return {
    slug: schema.id,
    name: title,
    category: resolveSchemaCatalogCategoryLabel(catalogCategory, locale),
    categoryKey: catalogCategory,
    sector: resolveSchemaCatalogSectorLabel(sectorKey, locale),
    sectorKey,
    description: desc,
    premiumRequired: true,
    href: `/tools/premium-schema/${schema.id}`,
  };
}
function categorizedToToolData(
  item: CategorizedToolItem,
  locale: string,
): ToolData {
  const title = item.title?.[locale] ?? item.title?.en ?? humanizeSlug(item.slug);
  const desc = item.description?.[locale] ?? item.description?.en ?? "";
  let sectorKey = resolvePremiumSectorKey(item.categorySlug);
  // Fallback: try slug-based sector hints only if premium map returned non-taxonomy
  if (!TAXONOMY_SECTOR_IDS.has(sectorKey)) {
    const override = SECTOR_SLUG_OVERRIDES[item.slug];
    if (override) {
      sectorKey = override;
    } else {
      const slugTokens = item.slug.split("-");
      for (const token of slugTokens) {
        const hint = SLUG_TOKEN_SECTOR_HINTS[token];
        if (hint) { sectorKey = hint; break; }
      }
    }
  }
  return {
    slug: item.slug,
    name: title,
    category: resolveSchemaCatalogCategoryLabel(item.categorySlug, locale),
    categoryKey: item.categorySlug,
    sector: resolveSchemaCatalogSectorLabel(sectorKey, locale),
    sectorKey,
    description: desc,
    premiumRequired: true,
    href: item.routePath ?? `/tools/generated/${item.slug}`,
  };
}

export function getPremiumTools(_locale = "en"): ToolData[] {
  const locale = "en";
  const bySlug = new Map<string, ToolData>();

  // 1. Premium schemas from schema-registry - these are the user's premium
  //    calculator pages with working implementations at /tools/premium-schema/{id}.
  for (const schema of PREMIUM_CALCULATOR_SCHEMAS) {
    bySlug.set(schema.id, schemaToToolData(schema, locale));
  }

  // 2. Premium-152 seed items with a routePath (e.g. batch-active tools that
  //    have a premium-schema page). These supplement the schema list.
  const index = buildCategorizedToolIndex();
  for (const item of index) {
    if ((item.tier === "premium" || item.tier === "premium-schema") && item.routePath !== null) {
      if (!bySlug.has(item.slug)) {
        bySlug.set(item.slug, categorizedToToolData(item, locale));
      }
    }
  }

  return [...bySlug.values()].sort((a, b) => a.name.localeCompare(b.name, locale));
}

export function getToolsByCategory(categoryKey: string, _locale = "en"): ToolData[] {
  const locale = "en";
  return getAllTools(locale).filter((tool) => tool.categoryKey === categoryKey);
}

export function getToolsBySector(sectorKey: string, _locale = "en"): ToolData[] {
  const locale = "en";
  return getAllTools(locale).filter((tool) => tool.sectorKey === sectorKey);
}
