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
/**
 * Known Turkish ASCII words that don't carry Turkish characters.
 * These are pure-ASCII strings that are Turkish words or Turkish-derived
 * and need runtime replacement.
 */
const TURKISH_ASCII_WORDS: Record<string, string> = {
  "IlkBoy": "Original Length (m)",
  "Son Boy (m)": "Final Length (m)",
};

/**
 * Turkish ASCII sector names mapped to canonical English.
 */
const SECTOR_ASCII_MAP: Record<string, string> = {
  "Makine Muhendisligi": "Mechanical Engineering",
  "Elektrik ve Elektronik": "Electrical and Electronics",
  "Insaaat ve Yapi": "Construction and Building",
  "Insaat ve Altyapi": "Construction and Infrastructure",
  "Isletme": "Business Management",
  "Tekstil ve Konfeksiyon": "Textile and Apparel",
  "Gida ve Tarim": "Food and Agriculture",
  "Kimya ve Proses": "Chemical and Process",
  "Enerji ve Guc Sistemleri": "Energy and Power Systems",
  "Lojistik ve Nakliye": "Logistics and Transportation",
  "Finans ve Yatirim": "Finance and Investment",
  "Yazilim ve Bilisim": "Software and IT",
  "Havacilik ve Denizcilik": "Aviation and Maritime",
  "Savunma ve Guvenlik": "Defense and Security",
  "Saglik ve Medikal": "Health and Medical",
  "Su ve Atik Yonetimi": "Water and Waste Management",
  "Tarim, Denizcilik ve Sondaj": "Agriculture, Maritime and Drilling",
};

function translateSchemaTurkish(obj: unknown): void {
  if (!obj || typeof obj !== "object") return;
  if (Array.isArray(obj)) {
    for (const item of obj) translateSchemaTurkish(item);
    return;
  }
  const record = obj as Record<string, unknown>;

  // Phase 1: When i18n.en exists for key fields, use it as the canonical value.
  // This covers schemas where raw label/businessContext is Turkish ASCII
  // that containsTurkish() cannot detect.
  for (const field of ["label", "businessContext"]) {
    const i18nKey = `${field}_i18n`;
    const i18n = record[i18nKey] as Record<string, string> | undefined;
    if (i18n?.en && typeof i18n.en === "string" && i18n.en.trim()) {
      record[field] = i18n.en.trim();
    }
  }

  // Phase 2: Catch remaining Turkish ASCII words (sector, label, businessContext)
  if (typeof record.sector === "string" && SECTOR_ASCII_MAP[record.sector]) {
    record.sector = SECTOR_ASCII_MAP[record.sector];
  }
  if (typeof record.label === "string" && TURKISH_ASCII_WORDS[record.label]) {
    record.label = TURKISH_ASCII_WORDS[record.label];
  }
  if (typeof record.businessContext === "string" && TURKISH_ASCII_WORDS[record.businessContext]) {
    record.businessContext = TURKISH_ASCII_WORDS[record.businessContext];
  }

  // Phase 3: Translate strings carrying actual Turkish characters
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
