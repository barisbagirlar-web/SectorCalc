#!/usr/bin/env npx tsx
/**
 * Backfill catalogCategory, sectorSlug, and categorySlug on all generated schemas.
 * ISO 9001 traceability — idempotent; safe to re-run.
 */
import fs from "node:fs";
import path from "node:path";
import { PROJECT_ROOT } from "./load-env";
import {
  buildSlugCategoryMap,
  defaultListFilePath,
  parseCalculatorListEntries,
  resolveSectionCategory,
} from "./parse-calculator-list";
import { inferFreeTrafficCategory } from "../../src/lib/features/tools/free-traffic-infer";
import { CATALOG_CATEGORY_TO_SECTOR_SLUG, type SchemaCatalogMetadata } from "../../src/lib/catalog/catalog-category-mappings";
import { FREE_TRAFFIC_CATEGORY_TO_GLOBAL } from "../../src/lib/catalog/resolve-tool-category";
import type { FreeTrafficCategory } from "../../src/lib/features/tools/free-traffic-infer";
import type { GlobalToolCategorySlug } from "../../src/lib/catalog/global-tool-category-taxonomy";
import { resolveToolCategory } from "../../src/lib/catalog/resolve-tool-category";

const SCHEMAS_DIR = path.join(PROJECT_ROOT, "generated", "schemas");

const FREE_TRAFFIC_IDS = new Set<string>(Object.keys(CATALOG_CATEGORY_TO_SECTOR_SLUG));

function isFreeTrafficCategory(value: string): value is FreeTrafficCategory {
  return FREE_TRAFFIC_IDS.has(value);
}

function resolveCatalogCategory(
  slug: string,
  listMap: Record<string, string>,
  existing: string | undefined,
): FreeTrafficCategory {
  if (existing && isFreeTrafficCategory(existing)) {
    return existing;
  }
  const fromList = listMap[slug];
  if (fromList && isFreeTrafficCategory(fromList)) {
    return fromList;
  }
  return inferFreeTrafficCategory(slug);
}

function resolveGlobalSlug(
  slug: string,
  catalogCategory: FreeTrafficCategory,
  premiumRequired: boolean,
  existing: string | undefined,
): GlobalToolCategorySlug {
  if (existing?.trim()) {
    return existing.trim() as GlobalToolCategorySlug;
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

function main(): void {
  if (!fs.existsSync(SCHEMAS_DIR)) {
    console.error(`Schemas directory missing: ${SCHEMAS_DIR}`);
    process.exit(1);
  }

  const listPath = defaultListFilePath();
  const listEntries = fs.existsSync(listPath) ? parseCalculatorListEntries(listPath) : [];
  const listMap = buildSlugCategoryMap(listEntries);

  let updated = 0;
  let skipped = 0;
  const metadata: Record<string, SchemaCatalogMetadata> = {};

  const files = fs.readdirSync(SCHEMAS_DIR, { recursive: true }) as string[];
  for (const file of files) {
    if (!file.endsWith("-schema.json")) continue;
    const slug = path.basename(file).replace(/-schema\.json$/, "");
    const filePath = path.join(SCHEMAS_DIR, file);
    const raw = JSON.parse(fs.readFileSync(filePath, "utf-8")) as Record<string, unknown>;

    const premiumRequired = raw.premiumRequired === true;
    const catalogCategory = resolveCatalogCategory(
      slug,
      listMap,
      typeof raw.catalogCategory === "string" ? raw.catalogCategory : undefined,
    );
    const sectorSlug =
      typeof raw.sectorSlug === "string" && raw.sectorSlug.trim()
        ? raw.sectorSlug.trim()
        : CATALOG_CATEGORY_TO_SECTOR_SLUG[catalogCategory];
    const categorySlug = resolveGlobalSlug(
      slug,
      catalogCategory,
      premiumRequired,
      typeof raw.categorySlug === "string" ? raw.categorySlug : undefined,
    );

    metadata[slug] = { catalogCategory, sectorSlug, categorySlug };

    const needsWrite =
      raw.catalogCategory !== catalogCategory ||
      raw.sectorSlug !== sectorSlug ||
      raw.categorySlug !== categorySlug;

    if (!needsWrite) {
      skipped += 1;
      continue;
    }

    raw.catalogCategory = catalogCategory;
    raw.sectorSlug = sectorSlug;
    raw.categorySlug = categorySlug;
    fs.writeFileSync(filePath, `${JSON.stringify(raw, null, 2)}\n`);
    updated += 1;
    console.log(`✅ ${file} → ${catalogCategory} / ${sectorSlug} / ${categorySlug}`);
  }

  const metadataPath = path.join(PROJECT_ROOT, "src/data/schema-catalog-metadata.generated.json");
  fs.writeFileSync(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`);

  console.log(`\nSchemas updated: ${updated}, unchanged: ${skipped}`);
  console.log(`Metadata index → ${metadataPath} (${Object.keys(metadata).length} tools)`);
}

main();
