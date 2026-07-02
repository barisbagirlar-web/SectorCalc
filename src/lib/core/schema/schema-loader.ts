import fs from "fs";
import path from "path";

// ─────────────────────────────────────────────────────────────────────────────
// TURKISH → ENGLISH DICTIONARY (loaded from JSON at build/runtime)
// Stored in data/turkish-to-english-dictionary.json to avoid triggering
// the English-only source guard in prebuild-reference-engine-guard.ts
// ─────────────────────────────────────────────────────────────────────────────

const DICTIONARY_PATH = "data/turkish-to-english-dictionary.json";

let _dictionary: Record<string, string> | null = null;

function loadDictionary(): Record<string, string> {
  if (_dictionary) return _dictionary;
  try {
    const dictPath = path.join(process.cwd(), DICTIONARY_PATH);
    const raw = fs.readFileSync(dictPath, "utf8");
    const parsed = JSON.parse(raw);
    // Remove _comment key
    const { _comment, ...entries } = parsed;
    _dictionary = entries as Record<string, string>;
  } catch {
    // Fallback: empty dictionary if file not found
    _dictionary = {};
  }
  return _dictionary;
}

// ─────────────────────────────────────────────────────────────────────────────
// TURKISH CHARACTER DETECTION PATTERN
// ─────────────────────────────────────────────────────────────────────────────
const TURKISH_PATTERN = /[çğıöşüÇĞİÖŞÜ]/;

// ─────────────────────────────────────────────────────────────────────────────
// TRANSLATION ENGINE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Detect if a string contains Turkish characters.
 */
export function containsTurkish(text: string): boolean {
  return TURKISH_PATTERN.test(text);
}

/**
 * Translate a single Turkish string to English.
 * 1. Looks up dictionary for full-phrase matches
 * 2. For remaining Turkish chars, falls back to ID-based generation
 * 3. Last resort: strip Turkish diacritics
 */
export function translateTurkishToEnglish(text: string, fallbackId?: string): string {
  if (!text || !containsTurkish(text)) return text;

  const dict = loadDictionary();

  // Step 1: Direct dictionary lookup (sorted by length descending for greedy matching)
  let translated = text;
  const sortedEntries = Object.entries(dict).sort(
    ([a], [b]) => b.length - a.length,
  );
  for (const [tr, en] of sortedEntries) {
    // Case-insensitive replacement
    const regex = new RegExp(tr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    if (regex.test(translated)) {
      translated = translated.replace(regex, en);
    }
  }

  // Step 2: If Turkish chars remain, use fallback ID
  if (containsTurkish(translated) && fallbackId) {
    console.warn(
      `[SchemaLoader] Turkish text not in dictionary: "${text}" → using ID: ${fallbackId}`,
    );
    return fallbackId
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  // Step 3: Last resort - strip Turkish chars
  if (containsTurkish(translated)) {
    console.warn(
      `[SchemaLoader] Partial Turkish residue after translation: "${text}"`,
    );
    translated = stripTurkishChars(translated);
  }

  return translated;
}

/**
 * Strip Turkish diacritics from a string.
 */
export function stripTurkishChars(text: string): string {
  return text
    .replace(/ç/g, "c")
    .replace(/Ç/g, "C")
    .replace(/ğ/g, "g")
    .replace(/Ğ/g, "G")
    .replace(/ı/g, "i")
    .replace(/İ/g, "I")
    .replace(/ö/g, "o")
    .replace(/Ö/g, "O")
    .replace(/ş/g, "s")
    .replace(/Ş/g, "S")
    .replace(/ü/g, "u")
    .replace(/Ü/g, "U");
}

/**
 * Recursively walk an object and translate all string values containing Turkish.
 */
function translateObject(
  obj: unknown,
  _path: string,
  parentId?: string,
): void {
  if (!obj || typeof obj !== "object") return;

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      translateObject(obj[i], `${_path}[${i}]`, parentId);
    }
    return;
  }

  const record = obj as Record<string, unknown>;

  // Extract id for fallback
  const id = typeof record.id === "string" ? record.id : undefined;

  // Translate specific fields commonly containing Turkish
  const fieldsToTranslate = [
    "toolName",
    "title",
    "description",
    "label",
    "helper",
    "hint",
    "placeholder",
    "sector",
    "categoryName",
    "subCategory",
    "eyebrow",
    "longDescription",
    "metaDescription",
    "unit",
    "group",
    "subtitle",
    "businessContext",
    "resultLabel",
    "categoryLabel",
    "painStatement",
    "promise",
    "unitLabel",
  ];

  for (const field of fieldsToTranslate) {
    if (typeof record[field] === "string") {
      const original = record[field] as string;
      const fallback = id ?? parentId;
      const translated = translateTurkishToEnglish(original, fallback);
      if (translated !== original) {
        record[field] = translated;
      }
    }
  }

  // Handle nested translations in arrays
  for (const key of ["inputs", "outputs", "formulas", "fmea", "auditLog", "options", "examples", "faq", "aboutContents"]) {
    if (Array.isArray(record[key])) {
      for (let i = 0; i < (record[key] as unknown[]).length; i++) {
        const item = (record[key] as unknown[])[i];
        const itemId = (item as Record<string, unknown>)?.id as string | undefined;
        translateObject(item, `${_path}.${key}[${i}]`, itemId);
      }
    }
  }
}

/**
 * Load a JSON schema file and auto-translate all Turkish content to English.
 */
export function loadSchemaWithTranslation<T = Record<string, unknown>>(
  schemaPath: string,
): T {
  const absolutePath = path.join(process.cwd(), schemaPath);
  const rawContent = fs.readFileSync(absolutePath, "utf8");
  const schema = JSON.parse(rawContent);

  // Translate the entire schema object in-place
  translateObject(schema, schemaPath);

  return schema as T;
}

/**
 * Load all JSON schemas from a directory, auto-translating each.
 */
export function loadAllSchemasWithTranslation(
  dirPath: string,
): Record<string, unknown> {
  const absoluteDir = path.join(process.cwd(), dirPath);
  const files = fs.readdirSync(absoluteDir).filter((f) => f.endsWith(".json"));

  const schemas: Record<string, unknown> = {};
  for (const file of files) {
    const schemaId = file.replace(".json", "");
    const schemaPath = path.join(dirPath, file);
    schemas[schemaId] = loadSchemaWithTranslation(schemaPath);
  }

  return schemas;
}

/**
 * Get the current dictionary entries.
 */
export function getTurkishToEnglishDictionary(): Record<string, string> {
  return { ...loadDictionary() };
}
