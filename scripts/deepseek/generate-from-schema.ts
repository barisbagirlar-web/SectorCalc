import * as fs from "node:fs";
import * as path from "node:path";
import { PROJECT_ROOT } from "./load-env";
import type { IndustrialToolSchema } from "./types";

const SCHEMAS_DIR = path.join(PROJECT_ROOT, "generated", "schemas");
const OUTPUT_DIR = path.join(PROJECT_ROOT, "generated");

function toCamelCase(str: string): string {
  return str.replace(/[-_\s]+(.)?/g, (_, c: string | undefined) =>
    c ? c.toUpperCase() : "",
  );
}

function toPascalCase(str: string): string {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
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
    const idCamel = toCamelCase(input.id);
    if (input.type === "number") {
      let zod = "z.number()";
      if (input.min != null) zod += `.min(${input.min})`;
      if (input.max != null) zod += `.max(${input.max})`;
      if (input.default !== undefined) zod += `.default(${input.default})`;
      shape.push(`  ${idCamel}: ${zod},`);
    } else if (input.type === "select" && input.options) {
      let zod = `z.enum([${input.options.map((o) => `'${o}'`).join(", ")}])`;
      if (input.default !== undefined) zod += `.default('${input.default}')`;
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
    const idCamel = toCamelCase(input.id);
    let tsType: string;
    if (input.type === "number") tsType = "number";
    else if (input.type === "boolean") tsType = "boolean";
    else if (input.type === "select") {
      tsType = input.options?.map((o) => `'${o}'`).join(" | ") || "string";
    } else tsType = "unknown";
    fields.push(`  ${idCamel}: ${tsType};`);
  }
  return `export interface ${pascalName}Input {\n${fields.join("\n")}\n}`;
}

function transformFormulaExpression(
  formula: string,
  inputIds: readonly string[],
  formulaKeys: readonly string[],
): string {
  let jsFormula = formula;
  const sortedFormulaKeys = [...formulaKeys].sort((a, b) => b.length - a.length);
  for (const key of sortedFormulaKeys) {
    jsFormula = jsFormula.replace(
      new RegExp(`\\b${escapeRegExp(key)}\\b`, "g"),
      `results.${key}`,
    );
  }
  const sortedInputIds = [...inputIds].sort((a, b) => b.length - a.length);
  for (const id of sortedInputIds) {
    jsFormula = jsFormula.replace(
      new RegExp(`\\b${escapeRegExp(id)}\\b`, "g"),
      `input.${toCamelCase(id)}`,
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
  const inputIds = inputs.map((i) => i.id);
  const formulaKeys = sortFormulasByDependency(formulas);
  const assignments: string[] = [];

  for (const key of formulaKeys) {
    const jsFormula = transformFormulaExpression(formulas[key], inputIds, formulaKeys);
    assignments.push(`  results.${key} = ${jsFormula};`);
  }

  return `function evaluateFormulas(input: ${pascalName}Input): Record<string, number> {
  const results: Record<string, number> = {};
${assignments.join("\n")}
  return results;
}`;
}

function generateOutputType(schema: IndustrialToolSchema, pascalName: string): string {
  const breakdownFields = Object.keys(schema.outputs.breakdown)
    .map((key) => `    ${key}: number;`)
    .join("\n");
  const primaryKey = extractPrimaryFormulaKey(schema.outputs.primary);

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

function generateCalculateFunction(schema: IndustrialToolSchema, pascalName: string): string {
  const formulaKeys = Object.keys(schema.formulas);
  const primaryKey = extractPrimaryFormulaKey(schema.outputs.primary);
  const breakdownEntries = Object.keys(schema.outputs.breakdown)
    .map((key) => {
      const formulaKey = resolveBreakdownFormulaKey(key, formulaKeys);
      return `    ${key}: results.${formulaKey},`;
    })
    .join("\n");

  const dataConfidenceExpr = transformFormulaExpression(
    schema.outputs.dataConfidenceAdjusted,
    schema.inputs.map((input) => input.id),
    formulaKeys,
  );

  const thresholdComments = Object.entries(schema.validation.thresholds)
    .map(([key, rule]) => `  // threshold ${key}: ${rule}`)
    .join("\n");

  const validationComments = schema.validation.rules
    .map((rule) => `  // rule: ${rule}`)
    .join("\n");

  return `export function calculate${pascalName}(input: ${pascalName}Input): ${pascalName}Output {
  const results = evaluateFormulas(input);
  const ${primaryKey} = results.${primaryKey};
  const breakdown = {
${breakdownEntries}
  };

${validationComments}
${thresholdComments}
  const hiddenLossDrivers: string[] = ${JSON.stringify(schema.outputs.hiddenLossDrivers)};
  const suggestedActions: string[] = ${JSON.stringify(schema.outputs.suggestedActions)};
  const dataConfidenceAdjusted = ${dataConfidenceExpr};

  return {
    ${primaryKey},
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: ${schema.premiumRequired},
    premiumFeatures: ${JSON.stringify(schema.premiumFeatures)},
  };
}`;
}

export function generateFromSchemaFile(resolvedSchemaPath: string): string {
  const schemaContent = fs.readFileSync(resolvedSchemaPath, "utf-8");
  const schema = JSON.parse(schemaContent) as IndustrialToolSchema;

  const baseName = schemaBaseName(resolvedSchemaPath);
  const pascalName = toPascalCase(baseName);

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
    }
    return;
  }

  if (!schemaArg) {
    console.error("Usage:");
    console.error("  npm run generate:tool -- --schema=<path-to-schema.json>");
    console.error("  npm run generate:tool -- --all");
    process.exit(1);
  }

  const outFile = generateFromSchemaFile(path.resolve(schemaArg));
  console.log(`Generated ${outFile}`);
}

main();
