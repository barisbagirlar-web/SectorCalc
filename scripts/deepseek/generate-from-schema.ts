import fs from "node:fs";
import path from "node:path";
import { compileFormulaExpression } from "@/lib/generated-tools/compile-formula-expression";
import { isSafeCompiledFormulaExpression } from "@/lib/generated-tools/compile-formula-safety";
import { toGeneratedExportBaseName, toSafeVarName } from "@/lib/generated-tools/export-names";
import { normalizeRawGeneratedSchema } from "@/lib/generated-tools/normalize-schema";
import type { GeneratedToolSchema } from "@/lib/generated-tools/types";
import type { FormulaFailureAccumulator } from "@/lib/generated-tools/formula-failure-catalog";

function ensureString(val: unknown, defaultValue = ""): string {
  if (typeof val === "string") {
    return val;
  }
  if (val && typeof val === "object") {
    const record = val as Record<string, unknown>;
    if (typeof record.en === "string") {
      return record.en;
    }
    const firstKey = Object.keys(record)[0];
    return firstKey ? String(record[firstKey]) : defaultValue;
  }
  if (val === undefined || val === null) {
    return defaultValue;
  }
  return String(val);
}

function generateZodSchema(schema: GeneratedToolSchema): string {
  const shape: string[] = [];
  for (const input of schema.inputs) {
    const safeId = toSafeVarName(input.id);
    const type = input.type;
    if (type === "number") {
      let zod = "z.number()";
      if (typeof input.min === "number") {
        zod += `.min(${input.min})`;
      }
      if (typeof input.max === "number") {
        zod += `.max(${input.max})`;
      }
      if (input.default !== undefined && typeof input.default === "number") {
        zod += `.default(${input.default})`;
      }
      shape.push(`  ${safeId}: ${zod},`);
    } else if (type === "select" && Array.isArray(input.options)) {
      const optionValues = input.options.map((option) =>
        `'${ensureString(option, "unknown").replace(/'/g, "\\'")}'`,
      );
      let zod = `z.enum([${optionValues.join(", ")}])`;
      if (input.default !== undefined) {
        zod += `.default('${ensureString(input.default, "").replace(/'/g, "\\'")}')`;
      }
      shape.push(`  ${safeId}: ${zod},`);
    } else if (type === "boolean") {
      let zod = "z.boolean()";
      if (input.default !== undefined) {
        zod += `.default(${input.default})`;
      }
      shape.push(`  ${safeId}: ${zod},`);
    } else {
      shape.push(`  ${safeId}: z.string().default(''),`);
    }
  }
  return `z.object({\n${shape.join("\n")}\n})`;
}

function generateTypeInterface(schema: GeneratedToolSchema, exportBase: string): string {
  const fields: string[] = [];
  for (const input of schema.inputs) {
    const id = toSafeVarName(input.id);
    let tsType = "string";
    if (input.type === "number") {
      tsType = "number";
    } else if (input.type === "boolean") {
      tsType = "boolean";
    }
    fields.push(`  ${id}: ${tsType};`);
  }
  fields.push("  dataConfidence?: number;");
  return `export interface ${exportBase}Input {\n${fields.join("\n")}\n}`;
}

function generateOutputType(schema: GeneratedToolSchema, exportBase: string): string {
  const breakdownKeys = Object.keys(schema.outputs.breakdown);
  return `
export interface ${exportBase}Output {
  totalWasteCost: number;
  breakdown: { ${breakdownKeys.map((key) => `${key}: number`).join("; ")} };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}`;
}

function toTypeScriptNumericExpression(compiled: string): string {
  let expr = compiled.trim();
  if (expr.endsWith("* 1")) {
    expr = expr.slice(0, -3).trim();
  }
  const isNumericTernary = /\?[^?]*\d[^?]*:/.test(expr);
  const isStringTernary = /\?\s*['"`]/.test(expr);
  const isBooleanLogic = /===|!==|&&|\|\|/.test(expr);
  if (isBooleanLogic && !isNumericTernary && !isStringTernary) {
    return `((${expr}) ? 1 : 0)`;
  }
  return expr;
}

function generateFormulaEvaluator(
  schema: GeneratedToolSchema,
  exportBase: string,
  failureAccumulator?: FormulaFailureAccumulator,
): { code: string; compileFailures: number } {
  const formulaEntries = Object.entries(schema.formulas);
  if (formulaEntries.length === 0) {
    return {
      code: `function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(_input: ${exportBase}Input): Record<string, number> {
  return {};
}`,
      compileFailures: 0,
    };
  }

  const formulaKeys = formulaEntries.map(([key]) => key);
  const inputIds = schema.inputs.map((input) => input.id);
  const lines: string[] = ["const results: Record<string, number | string> = {};"];
  let compileFailures = 0;

  for (const [key, expression] of formulaEntries) {
    const compiled = compileFormulaExpression(expression, {
      inputIds,
      inputToAccess: (inputId) => `input.${toSafeVarName(inputId)}`,
      formulaKeys,
      selfKey: key,
      failureAccumulator,
      schemaSlugForLog: exportBase,
    });

    if (!compiled || !isSafeCompiledFormulaExpression(compiled)) {
      compileFailures += 1;
      lines.push(`results[${JSON.stringify(key)}] = 0;`);
      continue;
    }

    const tsExpr = toTypeScriptNumericExpression(compiled);
    lines.push(
      `try { const v = ${tsExpr}; results[${JSON.stringify(key)}] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results[${JSON.stringify(key)}] = 0; }`,
    );
  }

  lines.push("return results;");

  return {
    compileFailures,
    code: `function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: ${exportBase}Input): Record<string, number> {
  ${lines.join("\n  ")}
}`,
  };
}

function resolveOutputFormulaFallbacks(
  schema: GeneratedToolSchema,
): {
  primary: Partial<Record<string, string>>;
  breakdown: Partial<Record<string, string>>;
} {
  const formulaIds = new Set(Object.keys(schema.formulas));
  const primary: Partial<Record<string, string>> = {};
  const breakdown: Partial<Record<string, string>> = {};

  const primaryKey = schema.outputs.primary;
  if (!formulaIds.has(primaryKey) && formulaIds.has("primary_result")) {
    primary[primaryKey] = "primary_result";
  }

  for (const key of Object.keys(schema.outputs.breakdown)) {
    if (formulaIds.has(key)) {
      continue;
    }
    const totalAlias = `total_${key}`;
    if (formulaIds.has(totalAlias)) {
      breakdown[key] = totalAlias;
    }
  }

  return { primary, breakdown };
}

function generateCalculateFunction(
  schema: GeneratedToolSchema,
  exportBase: string,
): string {
  const primaryKey = schema.outputs.primary;
  const breakdownKeys = Object.keys(schema.outputs.breakdown);
  const { primary: primaryFallbackByKey, breakdown: breakdownFallbackByKey } =
    resolveOutputFormulaFallbacks(schema);

  const resolvedPrimaryExpr = primaryFallbackByKey[primaryKey]
    ? `toNumericFormulaValue(values[${JSON.stringify(primaryKey)}] ?? values[${JSON.stringify(primaryFallbackByKey[primaryKey])}])`
    : `toNumericFormulaValue(values[${JSON.stringify(primaryKey)}])`;

  return `
function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculate${exportBase}(input: ${exportBase}Input): ${exportBase}Output {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = ${resolvedPrimaryExpr};
  const breakdown = {
    ${breakdownKeys
      .map((key) => {
        const fallback = breakdownFallbackByKey[key];
        return fallback
          ? `${key}: toNumericFormulaValue(values[${JSON.stringify(key)}] ?? values[${JSON.stringify(fallback)}])`
          : `${key}: toNumericFormulaValue(values[${JSON.stringify(key)}])`;
      })
      .join(",\n    ")}
  };
  const hiddenLossDrivers: string[] = ${JSON.stringify(schema.outputs.hiddenLossDrivers)};
  const suggestedActions: string[] = ${JSON.stringify(schema.outputs.suggestedActions)};
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: ${schema.premiumRequired === true},
    premiumFeatures: ${JSON.stringify(schema.premiumFeatures)},
  };
}`;
}

export function generateFromSchemaFile(
  schemaPath: string,
  outPath: string,
  failureAccumulator?: FormulaFailureAccumulator,
): number {
  const raw = JSON.parse(fs.readFileSync(schemaPath, "utf-8")) as unknown;
  const slug = path.basename(schemaPath, "-schema.json");
  const schema = normalizeRawGeneratedSchema(raw, slug);
  if (!schema) {
    throw new Error(`Schema could not be normalized: ${schemaPath}`);
  }

  const exportBase = toGeneratedExportBaseName(slug);
  const { code: formulaEvaluator, compileFailures } = generateFormulaEvaluator(schema, exportBase, failureAccumulator);

  const content = `// Auto-generated from ${path.basename(schemaPath)}
import * as z from 'zod';

${generateTypeInterface(schema, exportBase)}

export const ${exportBase}InputSchema = ${generateZodSchema(schema)};

${formulaEvaluator}

${generateCalculateFunction(schema, exportBase)}

${generateOutputType(schema, exportBase)}
`;

  fs.writeFileSync(outPath, content);
  if (compileFailures > 0) {
    console.warn(`⚠️ ${path.basename(schemaPath)}: ${compileFailures} formula(s) fell back to 0`);
  }
  console.log(`✅ Generated ${outPath}`);
  return compileFailures;
}

function main(): void {
  const args = process.argv.slice(2);
  const schemaPathArg = args.find((arg) => arg.startsWith("--schema="));
  if (!schemaPathArg) {
    console.error("Usage: npm run generate:tool -- --schema=<path-to-schema.json>");
    process.exit(1);
  }
  const schemaPath = schemaPathArg.split("=")[1];
  if (!schemaPath || !fs.existsSync(schemaPath)) {
    console.error(`Schema not found: ${schemaPath ?? ""}`);
    process.exit(1);
  }
  const toolName = path.basename(schemaPath, "-schema.json");
  const outDir = path.join(process.cwd(), "generated");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const outPath = path.join(outDir, `${toolName}.ts`);
  generateFromSchemaFile(schemaPath, outPath);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
