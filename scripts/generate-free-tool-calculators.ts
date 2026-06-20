/**
 * Generates .ts calculator modules for free tools that only have JSON schemas.
 * Reads generated/schemas/*-schema.json and creates generated/{slug}.ts
 * with a Zod input schema and calculate function.
 */
import fs from "fs";
import path from "path";

const SCHEMAS_DIR = path.join(process.cwd(), "generated", "schemas");
const OUTPUT_DIR = path.join(process.cwd(), "generated");

/* ── Helper: replicate export-names.ts logic ── */

const TR_CHAR_MAP: Record<string, string> = {
  ğ: "g", Ğ: "G", ü: "u", Ü: "U", ş: "s", Ş: "S",
  ı: "i", İ: "I", ö: "o", Ö: "O", ç: "c", Ç: "C",
};

function normalizeAscii(str: string): string {
  return str.replace(/[ğĞüÜşŞıİöÖçÇ]/g, (char) => TR_CHAR_MAP[char] ?? char);
}

function toSafeVarName(str: string): string {
  const normalized = normalizeAscii(str.trim());
  const safe = normalized.replace(/[^a-zA-Z0-9]/g, "_");
  return /^(\d)/.test(safe) ? `_${safe}` : safe;
}

function toGeneratedExportBaseName(slug: string): string {
  const safe = toSafeVarName(slug);
  return safe.charAt(0).toUpperCase() + safe.slice(1);
}

/* ── Zod type generation ── */

function zodTypeForInput(input: Record<string, unknown>): string {
  const type = input.type as string;
  const def = input.default;
  const min = input.min;
  const max = input.max;

  let chain = "";

  if (type === "boolean") {
    chain = "z.boolean()";
    if (def !== undefined) chain += `.default(${String(def)})`;
    else chain += ".default(false)";
  } else if (type === "select" || type === "enum") {
    const options = (input.options ?? input.enumValues) as string[] | undefined;
    if (options && options.length > 0) {
      chain = `z.enum([${options.map((o) => JSON.stringify(o)).join(", ")}])`;
      if (def !== undefined) chain += `.default(${JSON.stringify(def)})`;
      else chain += `.default(${JSON.stringify(options[0])})`;
    } else {
      chain = "z.string().default('')";
    }
  } else {
    // number
    chain = "z.number()";
    if (typeof min === "number" && isFinite(min)) chain += `.min(${min})`;
    if (typeof max === "number" && isFinite(max)) chain += `.max(${max})`;
    if (typeof def === "number") chain += `.default(${def})`;
    else if (typeof def === "string" && !isNaN(Number(def))) chain += `.default(${Number(def)})`;
    else chain += ".default(0)";
  }

  return chain;
}

function tsTypeForInput(input: Record<string, unknown>): string {
  const type = input.type as string;
  if (type === "boolean") return "boolean";
  if (type === "select" || type === "enum") return "string";
  return "number";
}

/* ── Formula sanitization ── */

function sanitizeFormula(expr: string): string {
  // Fix common JS syntax errors in generated formulas
  let s = expr;
  // !=== → !== (cleanup any 4-char artifact)
  s = s.replace(/!===/g, "!==");
  // Protect !== from the ==→=== step below (== matches inside !==)
  s = s.replace(/!==/g, "__STRICT_NEQ__");
  // == → === (but only bare == not protected !==)
  s = s.replace(/===/g, "__STRICT_EQ__");
  s = s.replace(/==/g, "===");
  s = s.replace(/__STRICT_EQ__/g, "===");
  // !== from schema -> ! !== becomes !== (keep strict);
  // restore protected !==
  s = s.replace(/__STRICT_NEQ__/g, "!==");
  // Remove trailing operators that would cause parse errors
  s = s.replace(/[\+\-\*\/]\s*$/, "");
  return s;
}

/* ── Formula evaluation ── */

function buildFormulaExpression(
  formula: string,
  inputIds: string[],
  formulaKeys: string[] = [],
  currentKey: string = "",
): string {
  // Sanitize formula first
  let expr = sanitizeFormula(formula);
  // Build lookup sets
  const fkSet = new Set(formulaKeys);
  const fkBeforeCurrent = formulaKeys.filter(k => k !== currentKey);
  const fkBeforeCurrentSet = new Set(fkBeforeCurrent);
  // 1) Replace formula result keys FIRST (higher priority).
  //    When an identifier is both an input ID and a formula key,
  //    the formula key wins (we want results["key"], not input["key"]).
  for (const fk of fkBeforeCurrent) {
    const escaped = fk.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    expr = expr.replace(new RegExp(`\\b${escaped}\\b`, "g"), `results[${JSON.stringify(fk)}]`);
  }
  // 2) Replace bare input IDs — skip ones already replaced as formula keys
  const sortedInputs = [...inputIds].sort((a, b) => b.length - a.length);
  for (const id of sortedInputs) {
    if (fkBeforeCurrentSet.has(id)) continue; // already handled as formula key
    const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    expr = expr.replace(new RegExp(`\\b${escaped}\\b`, "g"), `input["${id}"]`);
  }
  return expr;
}

function extractFormulaStrings(formulas: Record<string, unknown>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(formulas)) {
    if (typeof value === "string") {
      result[key] = value;
    } else if (typeof value === "object" && value !== null) {
      // breakdown is a Record<string, string> of sub-formulas
      for (const [subKey, subValue] of Object.entries(value as Record<string, unknown>)) {
        if (typeof subValue === "string") {
          result[subKey] = subValue;
        }
      }
    }
  }
  return result;
}

function generateCalculateBody(formulas: Record<string, unknown>, inputIds: string[], exportBase: string, schema: Record<string, unknown>): string {
  const flatFormulas = extractFormulaStrings(formulas);
  const outputs = schema.outputs as Record<string, unknown> || {};
  const breakdownSchema = outputs.breakdown as Record<string, string> || {};
  const formulaKeys = Object.keys(flatFormulas);
  // Use outputs.primary as the user-facing primary key, fallback to first formula key
  const primaryKey = (outputs.primary as string) || formulaKeys[0] || "result";
  // The main formula key (for totalWasteCost) is the key that stores the primary formula
  const mainKey = formulaKeys.find(k => k === primaryKey) || formulaKeys[0] || "result";
  const hiddenLossDrivers = outputs.hiddenLossDrivers as string[] || [];
  const suggestedActions = outputs.suggestedActions as string[] || [];
  const premiumRequired = !!schema.premiumRequired;
  const premiumFeatures = schema.premiumFeatures as string[] || [];
  const unit = (outputs.unit as string) || "";

  // Build evaluateAllFormulas body
  const evalLines: string[] = [];
  for (const [key, expr] of Object.entries(flatFormulas)) {
    if (!expr.trim()) continue;
    const jsExpr = buildFormulaExpression(expr, inputIds, formulaKeys, key);
    evalLines.push(`  try { const v = ${jsExpr}; results[${JSON.stringify(key)}] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results[${JSON.stringify(key)}] = Number.NaN; }`);
  }

  const breakdownKeys = Object.keys(breakdownSchema).filter(k => k !== primaryKey);
  const breakdownLines = breakdownKeys.length > 0
    ? breakdownKeys.map(k => `    ${JSON.stringify(k)}: toNumericFormulaValue(values[${JSON.stringify(k)}])`).join(",\n")
    : "";

  return `function evaluateAllFormulas(input: ${exportBase}Input): Record<string, number> {
  const results: Record<string, number> = {};
${evalLines.join("\n")}
  return results;
}

export function calculate${exportBase}(input: ${exportBase}Input): ${exportBase}Output {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values[${JSON.stringify(mainKey)}]);
  const breakdown: Record<string, number> = {${
    breakdownLines ? "\n" + breakdownLines + "\n  " : ""
  }};
  const hiddenLossDrivers: string[] = ${JSON.stringify(hiddenLossDrivers)};
  const suggestedActions: string[] = ${JSON.stringify(suggestedActions)};
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    [${JSON.stringify(primaryKey)}]: totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    unit: ${JSON.stringify(unit)},
    premiumRequired: ${JSON.stringify(premiumRequired)},
    premiumFeatures: ${JSON.stringify(premiumFeatures)},
  };
}`;
}

/* ── Main ── */

function main() {
  if (!fs.existsSync(SCHEMAS_DIR)) {
    console.error(`Schemas dir not found: ${SCHEMAS_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(SCHEMAS_DIR).filter(f => f.endsWith("-schema.json"));
  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const file of files) {
    const slug = file.replace("-schema.json", "");
    const tsPath = path.join(OUTPUT_DIR, `${slug}.ts`);

    // Skip if .ts already exists
    if (fs.existsSync(tsPath)) {
      skipped++;
      continue;
    }

    try {
      const schemaPath = path.join(SCHEMAS_DIR, file);
      const schemaRaw = fs.readFileSync(schemaPath, "utf-8");
      const schema = JSON.parse(schemaRaw);

      const inputs = schema.inputs as Record<string, unknown>[] || [];
      const formulas = schema.formulas as Record<string, string> || {};
      const exportBase = toGeneratedExportBaseName(slug);
      const inputIds = inputs.map(i => i.id as string);
      const hasBoolean = inputs.some(i => i.type === "boolean");
      const hasSelect = inputs.some(i => i.type === "select" || i.type === "enum");

      // primaryKey from schema outputs.primary (e.g. "result"), fallback to first formula key
      const primaryKey = ((schema.outputs as Record<string, unknown>)?.primary as string) || Object.keys(extractFormulaStrings(formulas))[0] || "result";
      // breakdown keys: all flat formula keys except primary, plus any explicit breakdown key not in formulas
      const breakdownKeysArr = Object.keys(extractFormulaStrings(formulas)).filter(k => k !== "main" && k !== primaryKey);
      const interfaceFields = inputs.map(i => {
        const tsType = tsTypeForInput(i);
        return `  ${i.id as string}: ${tsType};`;
      }).join("\n");

      // Zod schema — fields are comma-separated (TypeScript syntax, not SQL)
      const zodFields = inputs.map(i => {
        const zodStr = zodTypeForInput(i);
        return `  ${i.id as string}: ${zodStr},`;
      }).join("\n");

      const tsContent = `// Auto-generated from ${file}
import * as z from 'zod';

export interface ${exportBase}Input {
  dataConfidence?: number;
${interfaceFields}${inputs.length > 0 ? "" : "  // no inputs defined"}
}

export const ${exportBase}InputSchema = z.object({
  dataConfidence: z.number().optional(),
${zodFields}
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

${generateCalculateBody(formulas, inputIds, exportBase, schema)}

export interface ${exportBase}Output {
  totalWasteCost: number;
  unit: string;
  breakdown: Record<string, number>;
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
  [key: string]: unknown;
}

export const ${exportBase}OutputMeta = {
  primaryKey: ${JSON.stringify(primaryKey)},
  unit: ${JSON.stringify(((schema.outputs as Record<string, unknown>)?.unit as string) || "")},
  breakdownKeys: ${JSON.stringify(breakdownKeysArr)},
} as const;
`;

      fs.writeFileSync(tsPath, tsContent, "utf-8");
      created++;
    } catch (err) {
      console.error(`  ERROR: ${file}: ${err}`);
      errors++;
    }
  }

  console.log(`Total schemas: ${files.length}, Created: ${created}, Skipped: ${skipped}, Errors: ${errors}`);
}

main();
