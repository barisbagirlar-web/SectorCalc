import * as fs from "node:fs";
import * as path from "node:path";
import { PROJECT_ROOT } from "./load-env";
import { generateDiagramForSchema } from "./generate-diagram";
import type { IndustrialToolSchema } from "./types";

const SCHEMAS_DIR = path.join(PROJECT_ROOT, "generated", "schemas");
const OUTPUT_DIR = path.join(PROJECT_ROOT, "generated");

const TR_CHAR_MAP: Readonly<Record<string, string>> = {
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

function normalizeAscii(str: string): string {
  return str.replace(/[ğĞüÜşŞıİöÖçÇ]/g, (char) => TR_CHAR_MAP[char] ?? char);
}

function toSafePascalCase(str: string): string {
  let name = normalizeAscii(str.trim())
    .replace(/[-_\s]+(.)?/g, (_, char?: string) => (char ? char.toUpperCase() : ""))
    .replace(/[^a-zA-Z0-9]/g, "");
  if (!name) {
    name = "Value";
  }
  if (/^\d/.test(name)) {
    name = `Tool${name}`;
  }
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function toSafeVarName(str: string): string {
  const pascal = toSafePascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function schemaBaseName(schemaPath: string): string {
  const base = path.basename(schemaPath);
  return base.replace(/-schema\.json$/i, "").replace(/\.json$/i, "");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractPrimaryFormulaKey(primary: string): string {
  const match = primary.match(/^([A-Za-z0-9_]+)/);
  return match?.[1] ?? primary.trim();
}

function isValidJsExpression(expr: string): boolean {
  const trimmed = expr.trim();
  if (!trimmed) {
    return false;
  }
  try {
    // eslint-disable-next-line no-new-func
    new Function(`return (${trimmed});`);
    return true;
  } catch {
    return false;
  }
}

function asFormulaString(value: unknown): string | null {
  if (typeof value === "string") {
    return value;
  }
  return null;
}

function normalizeFormulas(formulas: Record<string, unknown>): Record<string, string> {
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(formulas)) {
    const formula = asFormulaString(value);
    if (formula) {
      normalized[key] = formula;
    }
  }
  return normalized;
}

function buildFormulaKeyMap(formulas: Record<string, string>): Map<string, string> {
  const map = new Map<string, string>();
  const used = new Set<string>();
  for (const key of Object.keys(formulas)) {
    let safeKey = toSafeVarName(key);
    let candidate = safeKey;
    let suffix = 2;
    while (used.has(candidate)) {
      candidate = `${safeKey}${suffix}`;
      suffix += 1;
    }
    used.add(candidate);
    map.set(key, candidate);
  }
  return map;
}

const BREAKDOWN_SYNONYMS: Readonly<Record<string, readonly string[]>> = {
  overproduction: ["excessProductionWaste", "overproductionWaste"],
  waiting: ["waitingWaste"],
  transport: ["transportWaste"],
  inventory: ["inventoryWaste"],
  motion: ["motionWaste"],
  defects: ["defectWaste", "defectsWaste"],
  overprocessing: ["overprocessingWaste"],
};

function resolveBreakdownFormulaKey(
  breakdownKey: string,
  formulaKeys: readonly string[],
): string {
  const synonyms = BREAKDOWN_SYNONYMS[breakdownKey] ?? [];
  for (const candidate of [...synonyms, `${breakdownKey}Waste`, breakdownKey]) {
    if (formulaKeys.includes(candidate)) {
      return candidate;
    }
  }
  const lowerKey = breakdownKey.toLowerCase();
  const partial = formulaKeys.find((key) => key.toLowerCase().includes(lowerKey));
  return partial ?? breakdownKey;
}

function generateZodSchema(inputs: IndustrialToolSchema["inputs"]): string {
  const shape: string[] = [];
  for (const input of inputs) {
    const idCamel = toSafeVarName(input.id);
    if (input.type === "number") {
      let zod = "z.number()";
      if (input.min != null) zod += `.min(${input.min})`;
      if (input.max != null) zod += `.max(${input.max})`;
      if (input.default !== undefined) zod += `.default(${input.default})`;
      shape.push(`  ${idCamel}: ${zod},`);
    } else if (input.type === "select" && input.options) {
      const escapedOptions = input.options.map((option) =>
        `'${normalizeAscii(option).replace(/'/g, "\\'")}'`,
      );
      let zod = `z.enum([${escapedOptions.join(", ")}])`;
      if (input.default !== undefined) {
        zod += `.default('${normalizeAscii(String(input.default)).replace(/'/g, "\\'")}')`;
      }
      shape.push(`  ${idCamel}: ${zod},`);
    } else if (input.type === "boolean") {
      let zod = "z.boolean()";
      if (input.default !== undefined) zod += `.default(${input.default})`;
      shape.push(`  ${idCamel}: ${zod},`);
    }
  }
  return `z.object({\n${shape.join("\n")}\n})`;
}

function generateTypeInterface(
  inputs: IndustrialToolSchema["inputs"],
  pascalName: string,
): string {
  const fields: string[] = [];
  for (const input of inputs) {
    const idCamel = toSafeVarName(input.id);
    let tsType: string;
    if (input.type === "number") tsType = "number";
    else if (input.type === "boolean") tsType = "boolean";
    else if (input.type === "select") {
      tsType =
        input.options
          ?.map((option) => `'${normalizeAscii(option).replace(/'/g, "\\'")}'`)
          .join(" | ") || "string";
    } else tsType = "unknown";
    fields.push(`  ${idCamel}: ${tsType};`);
  }
  return `export interface ${pascalName}Input {\n${fields.join("\n")}\n}`;
}

function getNumericSelectInputIds(inputs: IndustrialToolSchema["inputs"]): Set<string> {
  const ids = new Set<string>();
  for (const input of inputs) {
    if (input.type !== "select" || !input.options?.length) {
      continue;
    }
    if (
      input.options.every(
        (option) => option.trim() !== "" && Number.isFinite(Number(option)),
      )
    ) {
      ids.add(input.id);
    }
  }
  return ids;
}

function inputRef(inputId: string, numericSelectIds: ReadonlySet<string>): string {
  const safeId = toSafeVarName(inputId);
  if (numericSelectIds.has(inputId)) {
    return `(Number(input.${safeId}) || 0)`;
  }
  return `input.${safeId}`;
}

function sanitizeInlineDivisions(formula: string): string {
  return formula.replace(
    /([A-Za-z0-9_.]+)\/\((Number\(input\.(\w+)\)\s*\|\|\s*0)\)/g,
    (_match, numerator: string, _denominatorExpr: string, safeId: string) =>
      `(Number(input.${safeId}) > 0 ? ${numerator} / (Number(input.${safeId}) || 0) : 0)`,
  );
}

function applyExplicitDivisionGuards(formula: string): string {
  const perUserMonthPattern =
    /^([\s\S]+?)\s\/\s\(\s*input\.numberOfUsers\s*\*\s*12\s*\)\s*$/;
  const perUserMonthMatch = formula.match(perUserMonthPattern);
  if (perUserMonthMatch) {
    const numerator = perUserMonthMatch[1].trim();
    return `input.numberOfUsers && input.numberOfUsers > 0 ? ${numerator} / (input.numberOfUsers * 12) : 0`;
  }

  const perUserPattern = /^([\s\S]+?)\s\/\s\(\s*input\.numberOfUsers\s*\)\s*$/;
  const perUserMatch = formula.match(perUserPattern);
  if (perUserMatch) {
    const numerator = perUserMatch[1].trim();
    return `input.numberOfUsers && input.numberOfUsers > 0 ? ${numerator} / input.numberOfUsers : 0`;
  }

  const divideByNumericSelectPattern =
    /^([\s\S]+?)\s\/\s\(Number\(input\.(\w+)\)\s*\|\|\s*0\)\s*$/;
  const divideByNumericSelectMatch = formula.match(divideByNumericSelectPattern);
  if (divideByNumericSelectMatch) {
    const numerator = divideByNumericSelectMatch[1].trim();
    const safeId = divideByNumericSelectMatch[2];
    return `(Number(input.${safeId}) > 0 ? ${numerator} / (Number(input.${safeId}) || 0) : 0)`;
  }

  return formula;
}

function wrapFormulaResult(formula: string): string {
  if (formula.includes("input.numberOfUsers && input.numberOfUsers > 0")) {
    return formula;
  }
  return `((): number => { try { const __v = ${formula}; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })()`;
}

function transformFormulaExpression(
  formula: string,
  inputIds: readonly string[],
  formulaKeyMap: ReadonlyMap<string, string>,
  numericSelectIds: ReadonlySet<string>,
): string {
  let jsFormula = normalizeAscii(formula.trim());
  if (/^\s*if\s*\(/i.test(jsFormula)) {
    return "0";
  }

  jsFormula = jsFormula
    .replace(/\bceil\s*\(/g, "Math.ceil(")
    .replace(/\bfloor\s*\(/g, "Math.floor(")
    .replace(/\bround\s*\(/g, "Math.round(")
    .replace(/\babs\s*\(/g, "Math.abs(")
    .replace(/\bmin\s*\(/g, "Math.min(")
    .replace(/\bmax\s*\(/g, "Math.max(")
    .replace(/\bsqrt\s*\(/g, "Math.sqrt(")
    .replace(/\bpow\s*\(/g, "Math.pow(");

  const sortedFormulaKeys = [...formulaKeyMap.keys()].sort(
    (left, right) => right.length - left.length,
  );
  for (const key of sortedFormulaKeys) {
    const safeKey = formulaKeyMap.get(key) ?? toSafeVarName(key);
    jsFormula = jsFormula.replace(
      new RegExp(`\\b${escapeRegExp(key)}\\b`, "g"),
      `results.${safeKey}`,
    );
  }

  const sortedInputIds = [...inputIds].sort((left, right) => right.length - left.length);
  for (const id of sortedInputIds) {
    jsFormula = jsFormula.replace(
      new RegExp(`\\b${escapeRegExp(id)}\\b`, "g"),
      inputRef(id, numericSelectIds),
    );
  }

  return jsFormula;
}

function sortFormulasByDependency(formulas: Record<string, string>): string[] {
  const keys = Object.keys(formulas);
  const sorted: string[] = [];
  const remaining = new Set(keys);

  while (remaining.size > 0) {
    let progress = false;
    for (const key of Array.from(remaining)) {
      const formula = formulas[key];
      const deps = keys.filter(
        (candidate) =>
          candidate !== key &&
          new RegExp(`\\b${escapeRegExp(candidate)}\\b`).test(formula),
      );
      if (deps.every((dep) => sorted.includes(dep))) {
        sorted.push(key);
        remaining.delete(key);
        progress = true;
      }
    }
    if (!progress) {
      sorted.push(...Array.from(remaining));
      break;
    }
  }
  return sorted;
}

function generateFormulaEvaluator(
  formulas: Record<string, string>,
  inputs: IndustrialToolSchema["inputs"],
  pascalName: string,
): string {
  const inputIds = inputs.map((input) => input.id);
  const numericSelectIds = getNumericSelectInputIds(inputs);
  const formulaKeyMap = buildFormulaKeyMap(formulas);
  const formulaKeys = sortFormulasByDependency(formulas);
  const assignments: string[] = [];

  for (const key of formulaKeys) {
    const safeKey = formulaKeyMap.get(key) ?? toSafeVarName(key);
    const jsFormula = sanitizeInlineDivisions(
      transformFormulaExpression(
        formulas[key],
        inputIds,
        formulaKeyMap,
        numericSelectIds,
      ),
    );
    const guardedFormula = applyExplicitDivisionGuards(jsFormula);
    const finalFormula = isValidJsExpression(guardedFormula) ? guardedFormula : "0";
    const wrappedFormula = wrapFormulaResult(finalFormula);
    assignments.push(`  results.${safeKey} = ${wrappedFormula};`);
  }

  return `function evaluateFormulas(input: ${pascalName}Input): Record<string, number> {
  const results: Record<string, number> = {};
${assignments.join("\n")}
  return results;
}`;
}

function generateOutputType(schema: IndustrialToolSchema, pascalName: string): string {
  const breakdownFields = Object.keys(schema.outputs.breakdown)
    .map((key) => `    ${toSafeVarName(key)}: number;`)
    .join("\n");
  const primaryKey = toSafeVarName(extractPrimaryFormulaKey(schema.outputs.primary));

  return `export interface ${pascalName}Output {
  ${primaryKey}: number;
  breakdown: {
${breakdownFields}
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}`;
}

const BREAKDOWN_ACTION_SUGGESTIONS: Readonly<
  Record<string, { threshold: number; message: string }>
> = {
  defects: {
    threshold: 0.25,
    message: "Kalite iyilestirme ekibi kurun ve kok neden analizi yapin.",
  },
  inventory: {
    threshold: 0.2,
    message: "Stok seviyelerini gozden gecirin, tam zamaninda (JIT) uygulayin.",
  },
  waiting: {
    threshold: 0.15,
    message: "Darbogazlari analiz edin ve SMED ile setup surelerini azaltin.",
  },
  overproduction: {
    threshold: 0.2,
    message: "Uretim planlamasini talebe gore optimize edin.",
  },
  transport: {
    threshold: 0.15,
    message: "Malzeme akisini yeniden duzenleyin ve tasima mesafelerini azaltin.",
  },
  motion: {
    threshold: 0.15,
    message: "5S ve ergonomi iyilestirmeleriyle gereksiz hareketleri azaltin.",
  },
  overprocessing: {
    threshold: 0.15,
    message: "Islem adimlarini gozden gecirin ve gereksiz kalite kontrollerini kaldirin.",
  },
};

function parseThresholdExpression(
  thresholdValue: unknown,
  thresholdKey: string,
): { condition: string; message: string } | null {
  if (typeof thresholdValue !== "string") {
    return null;
  }
  const raw = thresholdValue.trim();
  const arrowIndex = raw.indexOf("→");
  if (arrowIndex !== -1) {
    return {
      condition: raw.substring(0, arrowIndex).trim(),
      message: raw.substring(arrowIndex + 1).trim(),
    };
  }

  const ternaryMatch = raw.match(/^(.+?)\?\s*['"](.+?)['"]\s*:\s*['"]?\s*['"]?\s*$/s);
  if (ternaryMatch) {
    return {
      condition: ternaryMatch[1].trim(),
      message: ternaryMatch[2].trim(),
    };
  }

  const normalized = normalizeAscii(raw);
  if (/[<>=!]/.test(normalized) && isValidJsExpression(normalized)) {
    return { condition: raw, message: thresholdKey };
  }

  return null;
}

function transformThresholdCondition(
  condition: string,
  inputIds: readonly string[],
): string | null {
  let jsCondition = normalizeAscii(condition.trim());
  const questionIndex = jsCondition.indexOf("?");
  if (questionIndex !== -1) {
    jsCondition = jsCondition.substring(0, questionIndex).trim();
  }

  const sortedInputIds = [...inputIds].sort((left, right) => right.length - left.length);
  for (const id of sortedInputIds) {
    jsCondition = jsCondition.replace(
      new RegExp(`\\b${escapeRegExp(id)}\\b`, "g"),
      `input.${toSafeVarName(id)}`,
    );
  }

  if (!isValidJsExpression(jsCondition)) {
    return null;
  }
  return jsCondition;
}

function generateThresholdDriverCode(
  thresholds: Readonly<Record<string, string>>,
  inputs: IndustrialToolSchema["inputs"],
): string {
  const lines: string[] = [];
  const inputIds = inputs.map((input) => input.id);

  for (const [thresholdKey, expr] of Object.entries(thresholds)) {
    if (typeof expr !== "string") {
      lines.push(`  // threshold skipped (non-string): ${thresholdKey}`);
      continue;
    }
    const parsed = parseThresholdExpression(expr, thresholdKey);
    if (!parsed) {
      lines.push(`  // threshold skipped (non-JS): ${normalizeAscii(expr).replace(/"/g, '\\"')}`);
      continue;
    }

    const jsCondition = transformThresholdCondition(parsed.condition, inputIds);
    if (!jsCondition) {
      lines.push(
        `  // threshold skipped (invalid condition): ${normalizeAscii(parsed.condition).replace(/"/g, '\\"')}`,
      );
      continue;
    }

    const escapedMessage = normalizeAscii(parsed.message).replace(/"/g, '\\"');
    lines.push(`  if (${jsCondition}) hiddenLossDrivers.push("${escapedMessage}");`);
  }

  return lines.join("\n");
}

function generateSuggestedActionsCode(
  breakdownKeys: readonly string[],
  primaryKey: string,
): string {
  const lines: string[] = [];
  for (const key of breakdownKeys) {
    const suggestion = BREAKDOWN_ACTION_SUGGESTIONS[key];
    if (!suggestion) continue;
    const safeKey = toSafeVarName(key);
    lines.push(
      `  if (breakdown.${safeKey} > ${primaryKey} * ${suggestion.threshold}) suggestedActions.push("${suggestion.message}");`,
    );
  }
  return lines.join("\n");
}

function generateCalculateFunction(schema: IndustrialToolSchema, pascalName: string): string {
  const formulaKeyMap = buildFormulaKeyMap(schema.formulas);
  const numericSelectIds = getNumericSelectInputIds(schema.inputs);
  const formulaKeys = Object.keys(schema.formulas);
  const primaryKey = toSafeVarName(extractPrimaryFormulaKey(schema.outputs.primary));
  const breakdownKeys = Object.keys(schema.outputs.breakdown);
  const breakdownEntries = breakdownKeys
    .map((key) => {
      const formulaKey = resolveBreakdownFormulaKey(key, formulaKeys);
      const safeFormulaKey = formulaKeyMap.get(formulaKey) ?? toSafeVarName(formulaKey);
      return `    ${toSafeVarName(key)}: results.${safeFormulaKey},`;
    })
    .join("\n");

  const dataConfidenceExpr = transformFormulaExpression(
    schema.outputs.dataConfidenceAdjusted,
    schema.inputs.map((input) => input.id),
    formulaKeyMap,
    numericSelectIds,
  );
  const safeDataConfidenceExpr = isValidJsExpression(dataConfidenceExpr)
    ? dataConfidenceExpr
    : `${primaryKey}`;

  const validationComments = schema.validation.rules
    .map((rule) => `  // rule: ${normalizeAscii(rule)}`)
    .join("\n");

  const thresholdDriverCode = generateThresholdDriverCode(
    schema.validation.thresholds,
    schema.inputs,
  );
  const suggestedActionsCode = generateSuggestedActionsCode(breakdownKeys, primaryKey);

  return `export function calculate${pascalName}(input: ${pascalName}Input): ${pascalName}Output {
  const results = evaluateFormulas(input);
  const ${primaryKey} = results.${primaryKey} ?? 0;
  const breakdown = {
${breakdownEntries}
  };

${validationComments}
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
${thresholdDriverCode}
${suggestedActionsCode}
  const dataConfidenceAdjusted = (() => { try { return ${safeDataConfidenceExpr}; } catch { return ${primaryKey}; } })();

  return {
    ${primaryKey},
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: ${schema.premiumRequired},
    premiumFeatures: ${JSON.stringify(schema.premiumFeatures.map((feature) => normalizeAscii(feature)))},
  };
}`;
}

export function generateFromSchemaFile(resolvedSchemaPath: string): string {
  const schemaContent = fs.readFileSync(resolvedSchemaPath, "utf-8");
  const parsedSchema = JSON.parse(schemaContent) as IndustrialToolSchema;
  const schema: IndustrialToolSchema = {
    ...parsedSchema,
    formulas: normalizeFormulas(parsedSchema.formulas as unknown as Record<string, unknown>),
  };

  const baseName = schemaBaseName(resolvedSchemaPath);
  const pascalName = toSafePascalCase(baseName);

  const zodSchema = generateZodSchema(schema.inputs);
  const typeInterface = generateTypeInterface(schema.inputs, pascalName);
  const formulaEvaluator = generateFormulaEvaluator(schema.formulas, schema.inputs, pascalName);
  const outputType = generateOutputType(schema, pascalName);
  const calculateFunc = generateCalculateFunction(schema, pascalName);

  const output = `// Auto-generated from ${path.basename(resolvedSchemaPath)} by generate-from-schema.ts
import * as z from 'zod';

${typeInterface}

export const ${pascalName}InputSchema = ${zodSchema};

${outputType}

${formulaEvaluator}

${calculateFunc}
`;

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const outFile = path.join(OUTPUT_DIR, `${baseName}.ts`);
  fs.writeFileSync(outFile, output);
  return outFile;
}

function listSchemaFiles(): string[] {
  if (!fs.existsSync(SCHEMAS_DIR)) {
    return [];
  }
  return fs
    .readdirSync(SCHEMAS_DIR)
    .filter((name) => name.endsWith(".json"))
    .map((name) => path.join(SCHEMAS_DIR, name))
    .sort((left, right) => left.localeCompare(right));
}

function main(): void {
  const args = process.argv.slice(2);
  const all = args.includes("--all");
  const schemaArg = args.find((a) => a.startsWith("--schema="))?.split("=")[1];

  if (all) {
    const schemaFiles = listSchemaFiles();
    if (schemaFiles.length === 0) {
      console.error("No schema files found in generated/schemas/");
      process.exit(1);
    }
    for (const schemaPath of schemaFiles) {
      const outFile = generateFromSchemaFile(schemaPath);
      console.log(`Generated ${outFile}`);
      generateDiagramForSchema(schemaPath);
    }
    return;
  }

  if (!schemaArg) {
    console.error("Usage:");
    console.error("  npm run generate:tool -- --schema=<path-to-schema.json>");
    console.error("  npm run generate:tool -- --all");
    process.exit(1);
  }

  const resolvedSchemaPath = path.resolve(schemaArg);
  const outFile = generateFromSchemaFile(resolvedSchemaPath);
  console.log(`Generated ${outFile}`);
  generateDiagramForSchema(resolvedSchemaPath);
}

main();
