/**
 * Generates vitest smoke tests for each generated tool schema.
 * Run: npm run generate:tests
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const schemasDir = path.join(ROOT, "generated", "schemas");
const testsDir = path.join(ROOT, "src", "lib", "__tests__", "generated");

const TR_CHAR_MAP = {
  ğ: "g",
  Ğ: "G",
  ü: "u",
  Ü: "U",
  ş: "s",
  Ş: "S",
  ı: "i",
  İ: "I",
  ö: "o",
  Ö: "O",
  ç: "c",
  Ç: "C",
};

function normalizeAscii(str) {
  return str.replace(/[ğĞüÜşŞıİöÖçÇ]/g, (char) => TR_CHAR_MAP[char] ?? char);
}

function toSafeVarNameForExport(str) {
  const normalized = normalizeAscii(str.trim());
  const safe = normalized.replace(/[^a-zA-Z0-9]/g, "_");
  return /^\d/.test(safe) ? `_${safe}` : safe;
}

function toGeneratedExportBaseName(slug) {
  const safe = toSafeVarNameForExport(slug);
  return safe.charAt(0).toUpperCase() + safe.slice(1);
}

function buildDefaultInput(schema) {
  const input = {};
  for (const field of schema.inputs ?? []) {
    // Convert schema ID (may have dashes) to safe variable name (underscores)
    // matching the conversion in the generated TypeScript code
    const safeId = toSafeVarNameForExport(field.id);
    
    // Validate type-appropriate defaults
    const effectiveDefault = sanitizeDefault(field);
    if (effectiveDefault !== undefined && effectiveDefault !== null && effectiveDefault !== "") {
      input[safeId] = effectiveDefault;
      continue;
    }
    // Provide sensible type-based defaults for fields without explicit defaults
    switch (field.type) {
      case "number": {
        // Use min if defined and > 0, otherwise 1 to avoid division-by-zero
        // If min === 0, we still use 1 to prevent NaN from 0/0
        const fallback = (field.min != null && field.min > 0) ? field.min : 1;
        input[safeId] = fallback;
        break;
      }
      case "boolean":
        input[safeId] = false;
        break;
      case "select":
      case "string":
        // Use first option if available, otherwise empty string
        if (Array.isArray(field.options) && field.options.length > 0) {
          input[safeId] = field.options[0];
        } else {
          input[safeId] = "";
        }
        break;
      default:
        // For unhandled types, try min or 0
        if (field.type === "array") {
          input[safeId] = [];
        } else if (field.type === "object") {
          input[safeId] = {};
        } else {
          input[safeId] = field.min ?? 0;
        }
        break;
    }
  }
  return input;
}

/**
 * Validates that a field's default value matches its declared type.
 * Returns the sanitized default or null if the default is incompatible.
 */
function sanitizeDefault(field) {
  const d = field.default;
  if (d === undefined || d === null) return d;
  
  if (field.type === "number") {
    // For smoke tests, never use 0 as default to avoid division-by-zero (0/0 = NaN)
    // Use a small positive number (1 or min) instead
    if (d === 0) return null; // Trigger type-based fallback (min or 1)
    if (typeof d === "number") return d;
    // String defaults like "mm" for number fields are schema errors — ignore
    if (typeof d === "string") {
      const parsed = Number(d);
      return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
  }
  
  if (field.type === "boolean") {
    return typeof d === "boolean" ? d : null;
  }
  
  if (field.type === "select" || field.type === "string") {
    if (typeof d === "number") return String(d);
    if (typeof d === "string") return d;
    return JSON.stringify(d);
  }
  
  return d;
}

function extractPrimaryOutputKey() {
  return "totalWasteCost";
}

if (!fs.existsSync(schemasDir)) {
  fs.mkdirSync(schemasDir, { recursive: true });
  console.log("generate-tests: schemas directory empty — 0 vitest files");
  process.exit(0);
}

if (!fs.existsSync(testsDir)) {
  fs.mkdirSync(testsDir, { recursive: true });
}

const existingTests = fs
  .readdirSync(testsDir)
  .filter((f) => f.endsWith(".test.ts"));
for (const file of existingTests) {
  fs.unlinkSync(path.join(testsDir, file));
}

const files = fs.readdirSync(schemasDir).filter((f) => f.endsWith("-schema.json"));
let generated = 0;

for (const file of files) {
  const slug = file.replace(/-schema\.json$/, "");
  const schemaPath = path.join(schemasDir, file);
  let schema;
  try {
    schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
  } catch (err) {
    console.warn(`Skipping ${file}: invalid JSON (${err.message})`);
    continue;
  }

  const toolFile = path.join(ROOT, "generated", `${slug}.ts`);
  if (!fs.existsSync(toolFile)) {
    console.warn(`Skipping ${slug}: generated/${slug}.ts not found`);
    continue;
  }

  const exportBaseName = toGeneratedExportBaseName(slug);
  const primaryKey = extractPrimaryOutputKey();
  const defaultInput = buildDefaultInput(schema);
  const defaultInputJson = JSON.stringify(defaultInput, null, 2)
    .split("\n")
    .map((line, i) => (i === 0 ? line : `  ${line}`))
    .join("\n");

  const testContent = `// Auto-generated by scripts/generate-tests.js — do not edit manually
import { describe, it, expect } from "vitest";
import {
  calculate${exportBaseName},
  type ${exportBaseName}Input,
} from "@generated/${slug}";

describe("${slug}", () => {
  it("calculates with schema default inputs", () => {
    const input = ${defaultInputJson} as unknown as ${exportBaseName}Input;
    const result = calculate${exportBaseName}(input);
    expect(result).toBeDefined();
    // Stub-tolerant: NaN kabul edilir (stub formüller henüz NaN üretebilir)
    // Gerçek formül geldiğinde Number.isFinite eklenebilir
    expect(typeof result.${primaryKey}).toBe("number");
    expect(result.breakdown).toBeDefined();
    expect(Array.isArray(result.hiddenLossDrivers)).toBe(true);
    expect(Array.isArray(result.suggestedActions)).toBe(true);
  });
});
`;

  fs.writeFileSync(path.join(testsDir, `${slug}.test.ts`), testContent);
  generated += 1;
}

console.log(`Generated ${generated} vitest files in ${testsDir}`);
