#!/usr/bin/env npx tsx
/**
 * Assign sector, profession, and category to generated schemas using taxonomy keywords.
 * Idempotent — safe to re-run.
 */
import fs from "node:fs";
import path from "node:path";
import { CATEGORIES, SECTORS } from "../src/lib/tools/taxonomy";

const SCHEMAS_DIR = path.join(process.cwd(), "generated", "schemas");
const FALLBACK_SECTOR_ID = "diger";
const FALLBACK_CATEGORY_ID = "diger";
const FALLBACK_SECTOR_LABEL = "Diğer";
const FALLBACK_CATEGORY_LABEL = "Diğer";
const FALLBACK_PROFESSION = "Genel Uzman";

type SchemaInput = {
  readonly label?: string;
  readonly businessContext?: string;
};

type ToolSchema = {
  toolName?: string;
  slug?: string;
  title?: string;
  description?: string;
  sector?: string;
  sectorId?: string;
  profession?: string;
  category?: string;
  categoryId?: string;
  inputs?: readonly SchemaInput[];
};

function normalizeHaystack(parts: readonly string[]): string {
  return parts
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ");
}

function keywordMatches(haystack: string, keyword: string): boolean {
  const normalizedKeyword = keyword.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  if (!normalizedKeyword) {
    return false;
  }
  if (normalizedKeyword.includes(" ")) {
    return haystack.includes(normalizedKeyword);
  }
  if (normalizedKeyword.length <= 3) {
    const escaped = normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(?:^|\\s)${escaped}(?:\\s|$)`).test(haystack);
  }
  return haystack.includes(normalizedKeyword);
}

function scoreKeywords(haystack: string, keywords: readonly string[]): number {
  let score = 0;
  for (const keyword of keywords) {
    if (keywordMatches(haystack, keyword)) {
      score += 1;
    }
  }
  return score;
}

function extractHaystack(schema: ToolSchema, fileSlug: string): string {
  return normalizeHaystack([
    fileSlug,
    schema.slug ?? "",
    schema.toolName ?? "",
    schema.title ?? "",
    schema.description ?? "",
    ...(schema.inputs ?? []).flatMap((input) => [
      input.label ?? "",
      input.businessContext ?? "",
    ]),
  ]);
}

function findBestSector(text: string): { sectorId: string; score: number } {
  let bestSectorId = FALLBACK_SECTOR_ID;
  let bestScore = 0;

  for (const sector of SECTORS) {
    const score = scoreKeywords(text, sector.keywords);
    if (score > bestScore) {
      bestScore = score;
      bestSectorId = sector.id;
    }
  }

  return { sectorId: bestSectorId, score: bestScore };
}

function findBestCategory(text: string): { categoryId: string; score: number } {
  let bestCategoryId = FALLBACK_CATEGORY_ID;
  let bestScore = 0;

  for (const category of CATEGORIES) {
    const score = scoreKeywords(text, category.keywords);
    if (score > bestScore) {
      bestScore = score;
      bestCategoryId = category.id;
    }
  }

  return { categoryId: bestCategoryId, score: bestScore };
}

function findBestProfession(text: string, sectorId: string): string {
  const sector = SECTORS.find((entry) => entry.id === sectorId);
  if (!sector || sector.professions.length === 0) {
    return FALLBACK_PROFESSION;
  }

  let bestProfession = sector.professions[0];
  let bestScore = 0;

  for (const profession of sector.professions) {
    const professionKeywords = profession
      .toLowerCase()
      .replace(/[^a-z0-9ğüşıöç]+/gi, " ")
      .split(/\s+/)
      .filter(Boolean);
    const score = scoreKeywords(text, professionKeywords);
    if (score > bestScore) {
      bestScore = score;
      bestProfession = profession;
    }
  }

  return bestProfession;
}

function resolveSectorLabel(sectorId: string): string {
  if (sectorId === FALLBACK_SECTOR_ID) {
    return FALLBACK_SECTOR_LABEL;
  }
  return SECTORS.find((sector) => sector.id === sectorId)?.label ?? FALLBACK_SECTOR_LABEL;
}

function resolveCategoryLabel(categoryId: string): string {
  if (categoryId === FALLBACK_CATEGORY_ID) {
    return FALLBACK_CATEGORY_LABEL;
  }
  return CATEGORIES.find((category) => category.id === categoryId)?.label ?? FALLBACK_CATEGORY_LABEL;
}

function fileSlugFromName(fileName: string): string {
  return fileName.replace(/-schema\.json$/i, "");
}

function main(): void {
  console.log("Scanning schemas...");

  if (!fs.existsSync(SCHEMAS_DIR)) {
    console.error(`Schemas directory not found: ${SCHEMAS_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(SCHEMAS_DIR).filter((file) => file.endsWith(".json"));
  console.log(`Found ${files.length} schemas.`);

  let assigned = 0;
  let skipped = 0;

  for (const file of files) {
    const filePath = path.join(SCHEMAS_DIR, file);
    let schema: ToolSchema;

    try {
      schema = JSON.parse(fs.readFileSync(filePath, "utf-8")) as ToolSchema;
    } catch {
      console.warn(`Skipped invalid JSON: ${file}`);
      skipped += 1;
      continue;
    }

    const fileSlug = fileSlugFromName(file);
    const text = extractHaystack(schema, fileSlug);

    const sectorResult = findBestSector(text);
    const categoryResult = findBestCategory(text);
    const sectorLabel = resolveSectorLabel(sectorResult.sectorId);
    const categoryLabel = resolveCategoryLabel(categoryResult.categoryId);
    const profession = findBestProfession(text, sectorResult.sectorId);

    schema.sector = sectorLabel;
    schema.sectorId = sectorResult.sectorId;
    schema.profession = profession;
    schema.category = categoryLabel;
    schema.categoryId = categoryResult.categoryId;

    try {
      fs.writeFileSync(filePath, `${JSON.stringify(schema, null, 2)}\n`);
      assigned += 1;
      console.log(
        `${file} -> ${sectorLabel} / ${profession} / ${categoryLabel} (scores: ${sectorResult.score}, ${categoryResult.score})`,
      );
    } catch (error) {
      console.error(`Failed to write ${file}:`, error);
      skipped += 1;
    }
  }

  console.log("");
  console.log("Done.");
  console.log(`Assigned: ${assigned}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Total: ${files.length}`);
}

main();
