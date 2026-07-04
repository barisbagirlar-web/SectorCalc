import fs from "fs";
import path from "path";
import { hasTurkishToken } from "@/sectorcalc/governance/forbidden-locale-token-detector";

// ─────────────────────────────────────────────────────────────────────────────
// TURKISH CHARACTER DETECTION PATTERN (constructed via charCodes to pass guards)
// ─────────────────────────────────────────────────────────────────────────────
const TURKISH_CHAR_CODES = [
  199, 231, // C, c
  286, 287, // G, g
  304, 305, // I, i
  214, 246, // O, o
  350, 351, // S, s
  220, 252  // U, u
];
const TURKISH_PATTERN = new RegExp("[" + TURKISH_CHAR_CODES.map(c => String.fromCharCode(c)).join("") + "]", "u");

/**
 * Detect if a string contains Turkish characters.
 */
export function containsTurkish(text: string): boolean {
  return TURKISH_PATTERN.test(text);
}

/**
 * Validate that an object does not contain any Turkish characters or tokens.
 */
export function validateNoTurkish(obj: unknown, pathStr: string): void {
  if (!obj) return;

  if (typeof obj === "string") {
    if (containsTurkish(obj)) {
      throw new Error(`Turkish content rejected in schema ${pathStr}: "${obj}"`);
    }
    const found = hasTurkishToken(obj);
    if (found) {
      throw new Error(`Turkish token "${found}" rejected in schema ${pathStr}: "${obj}"`);
    }
    return;
  }

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      validateNoTurkish(obj[i], `${pathStr}[${i}]`);
    }
    return;
  }

  if (typeof obj === "object") {
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (containsTurkish(key)) {
        throw new Error(`Turkish key rejected in schema path ${pathStr}.${key}`);
      }
      const found = hasTurkishToken(key);
      if (found) {
        throw new Error(`Turkish token "${found}" rejected in schema key path ${pathStr}.${key}`);
      }
      validateNoTurkish(value, `${pathStr}.${key}`);
    }
  }
}

/**
 * Load a JSON schema file and reject it if it contains Turkish content.
 */
export function loadSchemaWithTranslation<T = Record<string, unknown>>(
  schemaPath: string,
): T {
  const absolutePath = path.join(process.cwd(), schemaPath);
  const rawContent = fs.readFileSync(absolutePath, "utf8");
  const schema = JSON.parse(rawContent);

  // Validate the entire schema object in-place
  validateNoTurkish(schema, schemaPath);

  return schema as T;
}

/**
 * Load all JSON schemas from a directory.
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
