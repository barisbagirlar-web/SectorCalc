import "server-only";

import * as fs from "fs";
import * as path from "path";
import type { GlobalToolCategorySlug } from "@/lib/catalog/global-tool-category-taxonomy";
import { CATALOG_CATEGORY_TO_SECTOR_SLUG, type SchemaCatalogMetadata } from "@/lib/catalog/catalog-category-mappings";
import {
  FREE_TRAFFIC_CATEGORY_TO_GLOBAL,
  resolveToolCategory,
} from "@/lib/catalog/resolve-tool-category";
import type { FreeTrafficCategory } from "@/lib/features/tools/free-traffic-infer";
import { inferFreeTrafficCategory } from "@/lib/features/tools/free-traffic-infer";
import { FREE_TOOLS_LEGACY_CATEGORY_ALIASES } from "@/lib/catalog/free-tools-category-filter";

const SCHEMAS_DIR = path.join(process.cwd(), "generated", "schemas");

const FREE_TRAFFIC_CATEGORY_IDS = new Set<string>([
  "construction-measurement",
  "finance-business",
  "manufacturing-workshop",
  "energy-carbon",
  "logistics-travel",
  "agriculture-food",
  "everyday-life",
  "math-statistics",
  "conversion",
  "health-body",
  "physics-science",
  "chemistry-science",
  "engineering-science",
  "food-cooking",
  "date-time",
  "education-academic",
  "ecology-environment",
  "gaming-entertainment",
  "hobbies-diy",
]);

function schemaPathForSlug(slug: string): string {
  return path.join(SCHEMAS_DIR, `${slug}-schema.json`);
}

function isFreeTrafficCategory(value: string): value is FreeTrafficCategory {
  return FREE_TRAFFIC_CATEGORY_IDS.has(value);
}

function readRawSchema(slug: string): Record<string, unknown> | null {
  const schemaPath = schemaPathForSlug(slug);
  if (!fs.existsSync(schemaPath)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(schemaPath, "utf-8")) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function resolveSectorSlug(
  catalogCategory: FreeTrafficCategory,
  rawSector: string | undefined,
): string {
  if (rawSector && rawSector.trim()) {
    return rawSector.trim();
  }
  return CATALOG_CATEGORY_TO_SECTOR_SLUG[catalogCategory];
}

function resolveGlobalCategorySlug(
  slug: string,
  catalogCategory: FreeTrafficCategory,
  rawCategorySlug: string | undefined,
  premiumRequired: boolean,
): GlobalToolCategorySlug {
  if (rawCategorySlug && rawCategorySlug.trim()) {
    return rawCategorySlug.trim() as GlobalToolCategorySlug;
  }

  const fromTraffic = FREE_TRAFFIC_CATEGORY_TO_GLOBAL[catalogCategory];
  if (fromTraffic) {
    return fromTraffic;
  }

  return resolveToolCategory({
    slug,
    tier: premiumRequired ? "premium" : "free",
    source: premiumRequired ? "existing-premium" : "existing-free",
    freeTrafficCategory: catalogCategory,
  });
}

export function resolveCatalogCategoryFromSlug(
  slug: string,
  fallback?: FreeTrafficCategory,
): FreeTrafficCategory {
  const raw = readRawSchema(slug);
  const fromSchema = typeof raw?.catalogCategory === "string" ? raw.catalogCategory.trim() : "";
  if (isFreeTrafficCategory(fromSchema)) {
    return fromSchema;
  }
  if (fallback && isFreeTrafficCategory(fallback)) {
    return fallback;
  }
  return inferFreeTrafficCategory(slug);
}

export function getSchemaCatalogMetadata(slug: string): SchemaCatalogMetadata | null {
  const raw = readRawSchema(slug);
  if (!raw) {
    return null;
  }

  const catalogCategory = resolveCatalogCategoryFromSlug(slug);
  const premiumRequired = raw.premiumRequired === true;
  const rawSector = typeof raw.sectorSlug === "string" ? raw.sectorSlug : undefined;
  const rawCategorySlug =
    typeof raw.categorySlug === "string" ? raw.categorySlug : undefined;

  return {
    catalogCategory,
    sectorSlug: resolveSectorSlug(catalogCategory, rawSector),
    categorySlug: resolveGlobalCategorySlug(
      slug,
      catalogCategory,
      rawCategorySlug,
      premiumRequired,
    ),
  };
}
