import "server-only";

import fs from "fs";
import path from "path";
import schemaCatalogMetadata from "@/data/schema-catalog-metadata.generated.json";
import { buildCategorizedToolIndex } from "@/lib/catalog/build-categorized-tool-index";
import { normalizeRawGeneratedSchema } from "@/lib/generated-tools/normalize-schema";
import { resolveGeneratedToolTitle } from "@/lib/generated-tools/resolve-tool-display";
import type { GeneratedToolSchema } from "@/lib/generated-tools/types";
import { resolveGeneratedToolPath } from "@/lib/tools/paths";
import {
  resolveSchemaCatalogCategoryLabel,
  resolveSchemaCatalogSectorLabel,
} from "@/lib/i18n/schema-catalog-sidebar-labels";
import {
  resolveSchemaCategoryKey,
  resolveSchemaSectorKey,
} from "@/lib/tools/schema-catalog-label-keys";
import { getPremiumCategorySlugForTool } from "@/data/premium-tool-category-map";
import { resolvePremiumCategoryTitle } from "@/data/premium-categories";
import type { PremiumCategorySlug } from "@/data/premium-categories";

const SCHEMAS_DIR = path.join(process.cwd(), "generated", "schemas");
const DEFAULT_LABEL = "Diğer";

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
  const match = fileName.match(/^(.+)-schema\.json$/);
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

  return (
    asString(raw.title) ||
    asString(raw.name) ||
    asString(raw.toolName) ||
    humanizeSlug(slug)
  );
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

function resolveSectorKey(
  slug: string,
  raw: RawSchemaRecord,
  normalized: GeneratedToolSchema | null,
): string {
  // Prefer sectorSlug (e.g. "cnc-manufacturing") over generic sectorId
  // (e.g. "makine") for consistent taxonomy matching.
  const sectorSlug = resolveSectorSlugFallback(slug, raw, normalized);
  if (sectorSlug) {
    return sectorSlug;
  }

  const schemaSectorId = asString(raw.sectorId) || normalized?.sectorId;
  if (schemaSectorId) {
    return schemaSectorId;
  }

  const schemaSector = asString(raw.sector);
  if (schemaSector && schemaSector !== DEFAULT_LABEL) {
    return resolveSchemaSectorKey(schemaSector);
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

export function getAllTools(locale = "tr"): ToolData[] {
  const categorized = new Map(
    buildCategorizedToolIndex().map((item) => [item.slug, item] as const),
  );

  if (!fs.existsSync(SCHEMAS_DIR)) {
    return [];
  }

  return fs
    .readdirSync(SCHEMAS_DIR)
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

      const toolData: ToolData = {
        slug,
        name: resolveToolTitle(slug, raw, normalized, locale),
        ...category,
        ...sector,
        premiumRequired: isPremiumTool(raw, normalized, catalogItem?.tier),
        premiumCategorySlug: getPremiumCategorySlugForTool(slug),
        premiumCategory: resolvePremiumCategoryTitle(getPremiumCategorySlugForTool(slug), locale),
        href: catalogItem?.routePath ?? resolveGeneratedToolPath(slug),
      };
      return toolData;
    })
    .filter((item): item is ToolData => item !== null)
    .sort((left, right) => left.name.localeCompare(right.name, locale));
}

export function getFreeTools(locale = "tr"): ToolData[] {
  return getAllTools(locale).filter((tool) => !tool.premiumRequired);
}

export function getPremiumTools(locale = "tr"): ToolData[] {
  return getAllTools(locale).filter((tool) => tool.premiumRequired);
}

export function getToolsByCategory(categoryKey: string, locale = "tr"): ToolData[] {
  return getAllTools(locale).filter((tool) => tool.categoryKey === categoryKey);
}

export function getToolsBySector(sectorKey: string, locale = "tr"): ToolData[] {
  return getAllTools(locale).filter((tool) => tool.sectorKey === sectorKey);
}
