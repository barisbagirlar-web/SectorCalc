#!/usr/bin/env npx tsx
import fs from "node:fs";
import path from "node:path";
import { PROJECT_ROOT } from "./load-env";
import {
  buildSlugCategoryMap,
  defaultListFilePath,
  parseCalculatorListEntries,
  resolveSectionCategory,
} from "./parse-calculator-list";
import { normalizeRawGeneratedSchema } from "@/lib/generated-tools/normalize-schema";

const SCHEMAS_DIR = path.join(PROJECT_ROOT, "generated", "schemas");
const FREE_SLUGS_PATH = path.join(PROJECT_ROOT, "free-slugs.json");
const CATEGORY_MAP_PATH = path.join(
  PROJECT_ROOT,
  "src/data/free-traffic-slug-categories.generated.json",
);

function readFreeSlugs(): string[] {
  if (!fs.existsSync(FREE_SLUGS_PATH)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(FREE_SLUGS_PATH, "utf-8")) as string[];
}

function isFreeSchema(slug: string): boolean {
  const schemaPath = path.join(SCHEMAS_DIR, `${slug}-schema.json`);
  const raw = JSON.parse(fs.readFileSync(schemaPath, "utf-8")) as unknown;
  const schema = normalizeRawGeneratedSchema(raw, slug);
  return schema !== null && schema.premiumRequired !== true;
}

function main(): void {
  const existing = new Set(readFreeSlugs());
  if (fs.existsSync(SCHEMAS_DIR)) {
    for (const file of fs.readdirSync(SCHEMAS_DIR)) {
      if (!file.endsWith("-schema.json")) continue;
      const slug = file.replace(/-schema\.json$/, "");
      if (isFreeSchema(slug)) existing.add(slug);
    }
  }

  const listPath = defaultListFilePath();
  const listEntries = fs.existsSync(listPath) ? parseCalculatorListEntries(listPath) : [];
  const categoryMap = buildSlugCategoryMap(listEntries);
  for (const slug of existing) {
    if (!categoryMap[slug]) {
      categoryMap[slug] = resolveSectionCategory("GENERAL");
    }
  }

  const mergedSlugs = [...existing].sort((a, b) => a.localeCompare(b));
  fs.writeFileSync(FREE_SLUGS_PATH, `${JSON.stringify(mergedSlugs, null, 2)}\n`);
  fs.writeFileSync(CATEGORY_MAP_PATH, `${JSON.stringify(categoryMap, null, 2)}\n`);

  console.log(`free-slugs.json → ${mergedSlugs.length} slugs`);
  console.log(`category map → ${Object.keys(categoryMap).length} entries`);
  console.log(`expansion list → ${listEntries.length} calculators`);
}

main();
