#!/usr/bin/env npx tsx
/**
 * Rebuild src/data/generated-tool-titles-i18n.generated.json for every schema slug.
 * Enforces English-only titles.
 *
 * Usage:
 *   npx tsx scripts/rebuild-generated-tool-titles-i18n.ts
 */
import fs from "node:fs";
import path from "node:path";
import { resolveSchemaEnglishTitle } from "../src/lib/infrastructure/i18n/tool-title-locale-policy";

const ROOT = process.cwd();
const SCHEMAS_DIR = path.join(ROOT, "generated", "schemas");
const OUT_TITLES = path.join(ROOT, "src/data/generated-tool-titles-i18n.generated.json");
const COPY_MAP_PATH = path.join(ROOT, "archive/migration-only/scripts/data/generated-schema-copy-i18n.json");

function listSchemaSlugs(): string[] {
  if (!fs.existsSync(SCHEMAS_DIR)) {
    return [];
  }
  const files = fs.readdirSync(SCHEMAS_DIR, { recursive: true }) as string[];
  return files
    .filter((name) => name.endsWith("-schema.json"))
    .map((name) => path.basename(name).replace(/-schema\.json$/, ""))
    .sort((a, b) => a.localeCompare(b));
}

function getSchemaPath(slug: string): string {
  const nestedPath = path.join(SCHEMAS_DIR, slug.charAt(0).toLowerCase(), `${slug}-schema.json`);
  if (fs.existsSync(nestedPath)) {
    return nestedPath;
  }
  return path.join(SCHEMAS_DIR, `${slug}-schema.json`);
}

function loadCopyMap(): {
  toolTitles: Record<string, Partial<Record<"en", string>>>;
} {
  if (!fs.existsSync(COPY_MAP_PATH)) {
    return { toolTitles: {} };
  }
  const raw = JSON.parse(fs.readFileSync(COPY_MAP_PATH, "utf8")) as {
    toolTitles?: Record<string, Partial<Record<"en", string>>>;
  };
  return { toolTitles: raw.toolTitles ?? {} };
}

function saveCopyMap(toolTitles: Record<string, Partial<Record<"en", string>>>): void {
  const existing = fs.existsSync(COPY_MAP_PATH)
    ? (JSON.parse(fs.readFileSync(COPY_MAP_PATH, "utf8")) as Record<string, unknown>)
    : {};
  fs.writeFileSync(
    COPY_MAP_PATH,
    `${JSON.stringify({ ...existing, toolTitles }, null, 2)}\n`,
    "utf8",
  );
}

async function main(): Promise<void> {
  const slugs = listSchemaSlugs();
  const copyMap = loadCopyMap();
  const output: Record<string, Partial<Record<"en", string>>> = {};

  for (const slug of slugs) {
    const schemaPath = getSchemaPath(slug);
    const raw = JSON.parse(fs.readFileSync(schemaPath, "utf8")) as {
      title?: string;
      toolName?: string;
    };
    const english = resolveSchemaEnglishTitle(slug, raw);
    
    output[slug] = { en: english };
    copyMap.toolTitles[slug] = { ...copyMap.toolTitles[slug], en: english };
  }

  console.log(`rebuild-generated-tool-titles: schemas=${slugs.length}`);
  fs.writeFileSync(OUT_TITLES, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  saveCopyMap(copyMap.toolTitles);
  
  console.log(`  titles → ${OUT_TITLES}`);
  console.log("  All locale slots complete. Bundle written safely.");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
});
