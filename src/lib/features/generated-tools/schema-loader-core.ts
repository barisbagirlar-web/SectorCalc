import * as fs from "fs";
import * as path from "path";
import { normalizeGeneratedI18nText } from "@/lib/features/generated-tools/resolve-i18n-text";
import { normalizeRawGeneratedSchema } from "@/lib/features/generated-tools/normalize-schema";
import { translateTurkishToEnglish, containsTurkish } from "@/lib/core/schema/schema-loader";
import type { GeneratedToolInput, GeneratedToolSchema } from "@/lib/features/generated-tools/types";

/**
 * Recursively translate all Turkish string values in a raw schema object.
 * Walks toolName, title, description, label, helper, businessContext, sector,
 * categoryName and all nested fields.
 */
function translateSchemaTurkish(obj: unknown): void {
  if (!obj || typeof obj !== "object") return;
  if (Array.isArray(obj)) {
    for (const item of obj) translateSchemaTurkish(item);
    return;
  }
  const record = obj as Record<string, unknown>;

  // Fields most likely to contain Turkish text
  const textFields = [
    "toolName", "title", "description", "label", "helper", "hint",
    "placeholder", "businessContext", "sector", "categoryName",
    "subCategory", "categoryLabel", "longDescription", "metaDescription",
    "unitLabel", "group", "eyebrow", "unit", "resultLabel",
  ];
  for (const field of textFields) {
    if (typeof record[field] === "string") {
      const val = record[field] as string;
      if (containsTurkish(val)) {
        // Extract ID for fallback naming
        const id = typeof record.id === "string" ? record.id : undefined;
        record[field] = translateTurkishToEnglish(val, id);
      }
    }
  }

  // Recurse into known nested structures
  for (const key of ["inputs", "outputs", "options", "formulas", "examples", "faq", "aboutContents"]) {
    if (Array.isArray(record[key])) {
      for (const item of record[key] as unknown[]) translateSchemaTurkish(item);
    }
  }
}

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

function schemaPathForSlug(slug: string): string {
  // Schemas are organized in subdirectories by first character (a/, b/, c/…)
  const firstChar = slug.charAt(0).toLowerCase();
  const subDir = /[a-z0-9]/.test(firstChar) ? firstChar : "other";
  const directPath = path.join(SCHEMAS_DIR, `${slug}-schema.json`);
  if (fs.existsSync(directPath)) {
    return directPath;
  }
  return path.join(SCHEMAS_DIR, subDir, `${slug}-schema.json`);
}

function normalizeGeneratedToolInput(input: GeneratedToolInput): GeneratedToolInput {
  const label = input.label.trim();
  const businessContext = input.businessContext.trim();

  return {
    ...input,
    label,
    businessContext,
    label_i18n: normalizeGeneratedI18nText(input.label_i18n, label),
    businessContext_i18n: normalizeGeneratedI18nText(input.businessContext_i18n, businessContext),
  };
}

function normalizeGeneratedToolSchema(schema: GeneratedToolSchema): GeneratedToolSchema {
  return {
    ...schema,
    inputs: schema.inputs.map(normalizeGeneratedToolInput),
  };
}

export function listGeneratedToolSchemaSlugs(): string[] {
  if (!fs.existsSync(SCHEMAS_DIR)) {
    return [];
  }
  // Use recursive readdir to find all schema files in subdirectories
  return (fs.readdirSync(SCHEMAS_DIR, { recursive: true }) as string[])
    .filter((name) => name.endsWith("-schema.json"))
    .map((name) => path.basename(name).replace(/-schema\.json$/, ""))
    .sort((left, right) => left.localeCompare(right));
}

export function getGeneratedToolSchema(slug: string): GeneratedToolSchema | null {
  const schemaPath = schemaPathForSlug(slug);
  if (!fs.existsSync(schemaPath)) {
    return null;
  }
  const raw = JSON.parse(fs.readFileSync(schemaPath, "utf-8")) as unknown;

  // ── Layer 1: Auto-translate all Turkish content → English ──
  translateSchemaTurkish(raw);

  const normalized = normalizeRawGeneratedSchema(raw, slug);
  if (!normalized) {
    return null;
  }
  return normalizeGeneratedToolSchema(normalized);
}

export function generatedToolDiagramPublicPath(slug: string): string {
  // Diagrams follow same subdirectory pattern as schemas
  const firstChar = slug.charAt(0).toLowerCase();
  const subDir = /[a-z0-9]/.test(firstChar) ? firstChar : "other";
  return `/generated/schemas/${subDir}/${slug}-diagram.svg`;
}

export function generatedToolDiagramExists(slug: string): boolean {
  const firstChar = slug.charAt(0).toLowerCase();
  const subDir = /[a-z0-9]/.test(firstChar) ? firstChar : "other";
  const sourcePath = path.join(SCHEMAS_DIR, subDir, `${slug}-diagram.svg`);
  const publicPath = path.join(process.cwd(), "public", "generated", "schemas", subDir, `${slug}-diagram.svg`);
  return fs.existsSync(sourcePath) || fs.existsSync(publicPath);
}
