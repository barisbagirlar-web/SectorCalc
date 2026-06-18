#!/usr/bin/env npx tsx
/**
 * Assign sector, profession, and category to generated schemas using taxonomy keywords.
 * Idempotent — safe to re-run.
 */
import fs from "node:fs";
import path from "node:path";
import {
  CATEGORIES,
  SECTORS,
  SECTOR_SLUG_OVERRIDES,
  SECTOR_TO_CATEGORY,
  SLUG_TOKEN_CATEGORY_HINTS,
  SLUG_TOKEN_SECTOR_HINTS,
} from "../src/lib/tools/taxonomy";

const SCHEMAS_DIR = path.join(process.cwd(), "generated", "schemas");
const FALLBACK_SECTOR_ID = "diger";
const FALLBACK_CATEGORY_ID = "diger";
const FALLBACK_SECTOR_LABEL = "Diğer";
const FALLBACK_CATEGORY_LABEL = "Diğer";
const FALLBACK_PROFESSION = "Genel Uzman";

const SLUG_TOKEN_SCORE = 8;
const KEYWORD_SCORE = 1;

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

function transliterateTurkish(value: string): string {
  return value
    .replace(/ı/g, "i")
    .replace(/İ/g, "i")
    .replace(/ş/g, "s")
    .replace(/Ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/Ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/Ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/Ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/Ç/g, "c");
}

function normalizeHaystack(parts: readonly string[]): string {
  return transliterateTurkish(parts.join(" "))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function keywordMatches(haystack: string, keyword: string): boolean {
  const normalizedKeyword = transliterateTurkish(keyword)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
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
      score += KEYWORD_SCORE;
    }
  }
  return score;
}

function extractHaystack(schema: ToolSchema, fileSlug: string): string {
  const slug = fileSlug || schema.slug || schema.toolName || "";
  return normalizeHaystack([
    slug,
    slug,
    slug,
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

function scoreSlugTokens(fileSlug: string): Map<string, number> {
  const scores = new Map<string, number>();
  const tokens = normalizeHaystack([fileSlug]).split(" ").filter(Boolean);
  for (const token of tokens) {
    const hintedSector = SLUG_TOKEN_SECTOR_HINTS[token];
    if (hintedSector) {
      scores.set(hintedSector, (scores.get(hintedSector) ?? 0) + SLUG_TOKEN_SCORE);
    }
  }
  return scores;
}

function findBestSector(text: string, fileSlug: string): { sectorId: string; score: number } {
  const override = SECTOR_SLUG_OVERRIDES[fileSlug];
  if (override) {
    return { sectorId: override, score: 1000 };
  }

  const tokenScores = scoreSlugTokens(fileSlug);
  let bestSectorId = FALLBACK_SECTOR_ID;
  let bestScore = 0;

  for (const sector of SECTORS) {
    const keywordScore = scoreKeywords(text, sector.keywords);
    const tokenScore = tokenScores.get(sector.id) ?? 0;
    const score = keywordScore + tokenScore;
    if (score > bestScore) {
      bestScore = score;
      bestSectorId = sector.id;
    }
  }

  return { sectorId: bestSectorId, score: bestScore };
}

function scoreCategorySlugTokens(fileSlug: string): Map<string, number> {
  const scores = new Map<string, number>();
  const tokens = normalizeHaystack([fileSlug]).split(" ").filter(Boolean);
  for (const token of tokens) {
    const hintedCategory = SLUG_TOKEN_CATEGORY_HINTS[token];
    if (hintedCategory) {
      scores.set(hintedCategory, (scores.get(hintedCategory) ?? 0) + SLUG_TOKEN_SCORE);
    }
  }
  return scores;
}

function findBestCategory(
  text: string,
  fileSlug: string,
  sectorId: string,
): { categoryId: string; score: number } {
  const tokenScores = scoreCategorySlugTokens(fileSlug);
  let bestCategoryId = FALLBACK_CATEGORY_ID;
  let bestScore = 0;

  for (const category of CATEGORIES) {
    const keywordScore = scoreKeywords(text, category.keywords);
    const tokenScore = tokenScores.get(category.id) ?? 0;
    const score = keywordScore + tokenScore;
    if (score > bestScore) {
      bestScore = score;
      bestCategoryId = category.id;
    }
  }

  if (bestCategoryId === FALLBACK_CATEGORY_ID && sectorId !== FALLBACK_SECTOR_ID) {
    const fromSector = SECTOR_TO_CATEGORY[sectorId];
    if (fromSector) {
      return { categoryId: fromSector, score: 1 };
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
    const professionKeywords = transliterateTurkish(profession)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
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
  const sectorCounts = new Map<string, number>();
  const categoryCounts = new Map<string, number>();

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

    const sectorResult = findBestSector(text, fileSlug);
    const categoryResult = findBestCategory(text, fileSlug, sectorResult.sectorId);
    const sectorLabel = resolveSectorLabel(sectorResult.sectorId);
    const categoryLabel = resolveCategoryLabel(categoryResult.categoryId);
    const profession = findBestProfession(text, sectorResult.sectorId);

    schema.sector = sectorLabel;
    schema.sectorId = sectorResult.sectorId;
    schema.profession = profession;
    schema.category = categoryLabel;
    schema.categoryId = categoryResult.categoryId;

    sectorCounts.set(sectorResult.sectorId, (sectorCounts.get(sectorResult.sectorId) ?? 0) + 1);
    categoryCounts.set(categoryResult.categoryId, (categoryCounts.get(categoryResult.categoryId) ?? 0) + 1);

    try {
      fs.writeFileSync(filePath, `${JSON.stringify(schema, null, 2)}\n`);
      assigned += 1;
    } catch (error) {
      console.error(`Failed to write ${file}:`, error);
      skipped += 1;
    }
  }

  console.log("");
  console.log("Sector distribution:");
  const sorted = [...sectorCounts.entries()].sort((a, b) => b[1] - a[1]);
  for (const [sectorId, count] of sorted) {
    console.log(`  ${sectorId}: ${count}`);
  }

  console.log("");
  console.log("Category distribution:");
  for (const [categoryId, count] of [...categoryCounts.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${categoryId}: ${count}`);
  }

  const digerSectorCount = sectorCounts.get(FALLBACK_SECTOR_ID) ?? 0;
  const digerCategoryCount = categoryCounts.get(FALLBACK_CATEGORY_ID) ?? 0;
  console.log("");
  console.log("Done.");
  console.log(`Assigned: ${assigned}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Total: ${files.length}`);
  console.log(`Diğer sector (diger): ${digerSectorCount}`);
  console.log(`Diğer category (diger): ${digerCategoryCount}`);

  if (digerSectorCount > 0) {
    console.error(`FAIL: Diğer sector count ${digerSectorCount} must be 0.`);
    process.exit(1);
  }
  if (digerCategoryCount > 0) {
    console.error(`FAIL: Diğer category count ${digerCategoryCount} must be 0.`);
    process.exit(1);
  }
}

main();
