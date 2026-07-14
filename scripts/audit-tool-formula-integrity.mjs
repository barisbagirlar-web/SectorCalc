#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { basename, join, relative } from "node:path";

const ROOT = process.cwd();
const REPORT_DIR = join(ROOT, "artifacts", "formula-integrity-audit");
mkdirSync(REPORT_DIR, { recursive: true });

const CONFIG = [
  {
    tier: "free",
    schemaDir: "src/sectorcalc/schemas/free-v531",
    formulaDir: "src/sectorcalc/formulas/free-v531",
  },
  {
    tier: "pro",
    schemaDir: "src/sectorcalc/schemas/v531",
    formulaDir: "src/sectorcalc/formulas/pro-v531",
  },
];

const DEVELOPMENT_SCHEMAS_PATH = join(ROOT, "data/governance/v531-development-schemas.json");
const developmentToolKeys = new Set(
  existsSync(DEVELOPMENT_SCHEMAS_PATH)
    ? JSON.parse(readFileSync(DEVELOPMENT_SCHEMAS_PATH, "utf8"))
    : [],
);

const HARD_CODES = new Set([
  "SCHEMA_PARSE_ERROR",
  "MISSING_TOOL_KEY",
  "DUPLICATE_TOOL_KEY",
  "MISSING_FORMULA_MODULE",
  "FORMULA_TOOL_KEY_MISMATCH",
  "DUPLICATE_INPUT_ID",
  "DUPLICATE_NORMALIZED_INPUT_ID",
  "INPUT_NORMALIZED_ID_MISSING",
  "UI_FIELD_INPUT_MISSING",
  "INVALID_NUMERIC_RANGE",
  "DEFAULT_OUTSIDE_RANGE",
  "FORMULA_DECLARED_INPUT_NOT_IN_SCHEMA",
  "SCHEMA_REQUIRED_INPUT_NOT_IN_FORMULA",
  "OUTPUT_ID_DUPLICATE",
]);

const NON_UNIT_QUANTITY_KINDS = new Set([
  "count",
  "ratio",
  "ratio_or_percent",
  "percent",
  "dimensionless",
  "boolean",
  "categorical",
  "text",
  "currency",
]);

const findings = [];
const inventory = [];
const globalToolKeys = new Map();

function addFinding(severity, code, tier, toolKey, file, message, evidence = {}) {
  findings.push({ severity, code, tier, toolKey, file, message, evidence });
}

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function finiteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function parseJson(path, tier) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    addFinding("critical", "SCHEMA_PARSE_ERROR", tier, null, relative(ROOT, path), String(error));
    return null;
  }
}

function isActiveFreeSchema(path) {
  const numericPrefix = Number.parseInt(basename(path).split("-")[0] ?? "", 10);
  return Number.isInteger(numericPrefix) && numericPrefix >= 295 && numericPrefix <= 344;
}

function collectFormulaFiles(dir) {
  const formulas = new Map();
  for (const file of walk(dir).filter((path) => /\.formula\.(ts|js)$/.test(path))) {
    const source = readFileSync(file, "utf8");
    const inferredToolKey = basename(file).replace(/\.formula\.(ts|js)$/, "");
    const exportedToolKey =
      source.match(/export\s+const\s+toolKey\s*=\s*["'`]([^"'`]+)["'`]/)?.[1] ??
      source.match(/const\s+TOOL_KEY\s*=\s*["'`]([^"'`]+)["'`]/)?.[1] ??
      null;
    formulas.set(inferredToolKey, {
      file,
      source,
      exportedToolKey,
      declaredInputIds: extractDeclaredFormulaInputIds(source),
    });
  }
  return formulas;
}

function extractDeclaredFormulaInputIds(source) {
  const startMatch = /export\s+const\s+inputs\s*:[^=]*=\s*\[/.exec(source);
  if (!startMatch) return new Set();

  const start = startMatch.index + startMatch[0].length;
  let depth = 1;
  let cursor = start;
  let quote = null;
  let escaped = false;

  while (cursor < source.length && depth > 0) {
    const char = source[cursor];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = null;
    } else if (char === '"' || char === "'" || char === "`") quote = char;
    else if (char === "[") depth += 1;
    else if (char === "]") depth -= 1;
    cursor += 1;
  }

  const block = source.slice(start, Math.max(start, cursor - 1));
  const ids = new Set();
  for (const match of block.matchAll(/\bid\s*:\s*["'`]([^"'`]+)["'`]/g)) ids.add(match[1]);
  return ids;
}

function schemaInputSets(schema) {
  const direct = new Set(asArray(schema.inputs).map((input) => input?.id).filter(Boolean));
  const normalized = new Set(asArray(schema.normalized_inputs).map((input) => input?.id).filter(Boolean));
  return { direct, normalized, all: new Set([...direct, ...normalized]) };
}

function schemaRange(input) {
  const physical = input?.physical_bounds ?? input?.bounds ?? {};
  return {
    min:
      input?.min ??
      input?.minimum ??
      input?.validation?.min ??
      input?.physical_min ??
      physical?.min ??
      physical?.minimum,
    max:
      input?.max ??
      input?.maximum ??
      input?.validation?.max ??
      input?.physical_max ??
      physical?.max ??
      physical?.maximum,
  };
}

function explicitDefault(input) {
  if (input?.default_policy === "NO_DEFAULT" || input?.defaultPolicy === "NO_DEFAULT_ALLOWED") return undefined;
  return input?.default ?? input?.default_value ?? input?.defaultValue;
}

function hasReferenceGuidance(input) {
  return Boolean(
    input?.reference_values ??
      input?.reference_value ??
      input?.reference_range ??
      input?.advisory_range ??
      input?.evidence_requirement?.public_help_text ??
      input?.user_help_text ??
      input?.help_text ??
      input?.publicHelpText,
  );
}

function hasUnitContract(input) {
  const quantityKind = String(input?.quantity_kind ?? input?.quantityKind ?? "").toLowerCase();
  if (NON_UNIT_QUANTITY_KINDS.has(quantityKind)) return true;
  return Boolean(
    input?.base_unit ??
      input?.baseUnit ??
      input?.unit ??
      input?.display_unit ??
      asArray(input?.allowed_display_units).length ??
      asArray(input?.allowedDisplayUnits).length,
  );
}

function validateInput(input, context) {
  const { tier, toolKey, file } = context;
  const id = input?.id ?? "<missing-id>";
  const { min, max } = schemaRange(input);
  const defaultValue = explicitDefault(input);

  if (finiteNumber(min) && finiteNumber(max) && min > max) {
    addFinding("critical", "INVALID_NUMERIC_RANGE", tier, toolKey, file, `Input ${id} has min > max`, { min, max });
  }
  if (finiteNumber(defaultValue) && finiteNumber(min) && defaultValue < min) {
    addFinding("critical", "DEFAULT_OUTSIDE_RANGE", tier, toolKey, file, `Input ${id} default is below min`, { defaultValue, min });
  }
  if (finiteNumber(defaultValue) && finiteNumber(max) && defaultValue > max) {
    addFinding("critical", "DEFAULT_OUTSIDE_RANGE", tier, toolKey, file, `Input ${id} default is above max`, { defaultValue, max });
  }

  if (!hasUnitContract(input)) {
    addFinding("warning", "PHYSICAL_INPUT_WITHOUT_UNIT_CONTRACT", tier, toolKey, file, `Input ${id} has no explicit unit contract`);
  }
  if (!hasReferenceGuidance(input)) {
    addFinding("warning", "INPUT_WITHOUT_REFERENCE_GUIDANCE", tier, toolKey, file, `Input ${id} has no reference/advisory guidance`);
  }
}

for (const config of CONFIG) {
  const schemaRoot = join(ROOT, config.schemaDir);
  const formulaRoot = join(ROOT, config.formulaDir);
  const formulaFiles = collectFormulaFiles(formulaRoot);
  const schemaFiles = walk(schemaRoot)
    .filter((path) => path.endsWith(".json"))
    .filter((path) => config.tier !== "free" || isActiveFreeSchema(path));

  for (const schemaPath of schemaFiles) {
    const schema = parseJson(schemaPath, config.tier);
    if (!schema) continue;

    const file = relative(ROOT, schemaPath);
    const toolKey = schema.tool_key;
    if (!toolKey) {
      addFinding("critical", "MISSING_TOOL_KEY", config.tier, null, file, "Schema has no tool_key");
      continue;
    }

    if (globalToolKeys.has(toolKey)) {
      addFinding("critical", "DUPLICATE_TOOL_KEY", config.tier, toolKey, file, "tool_key is duplicated", {
        other: globalToolKeys.get(toolKey),
      });
    } else globalToolKeys.set(toolKey, file);

    const inputs = asArray(schema.inputs);
    const normalizedInputs = asArray(schema.normalized_inputs);
    const outputs = asArray(schema.outputs);
    const inputIds = inputs.map((input) => input?.id).filter(Boolean);
    const normalizedIds = normalizedInputs.map((input) => input?.id).filter(Boolean);
    const outputIds = outputs.map((output) => output?.id).filter(Boolean);

    for (const [ids, code, label] of [
      [inputIds, "DUPLICATE_INPUT_ID", "input"],
      [normalizedIds, "DUPLICATE_NORMALIZED_INPUT_ID", "normalized input"],
      [outputIds, "OUTPUT_ID_DUPLICATE", "output"],
    ]) {
      const seen = new Set();
      for (const id of ids) {
        if (seen.has(id)) addFinding("critical", code, config.tier, toolKey, file, `Duplicate ${label} id: ${id}`);
        seen.add(id);
      }
    }

    const normalizedSet = new Set(normalizedIds);
    for (const input of inputs) {
      validateInput(input, { tier: config.tier, toolKey, file });
      if (input?.normalized_id && !normalizedSet.has(input.normalized_id)) {
        addFinding(
          "critical",
          "INPUT_NORMALIZED_ID_MISSING",
          config.tier,
          toolKey,
          file,
          `Input ${input.id} points to missing normalized_id ${input.normalized_id}`,
        );
      }
    }

    const inputSet = new Set(inputIds);
    for (const group of asArray(schema?.ui_contract?.input_groups)) {
      for (const field of asArray(group?.fields)) {
        if (!inputSet.has(field)) {
          addFinding(
            "critical",
            "UI_FIELD_INPUT_MISSING",
            config.tier,
            toolKey,
            file,
            `UI group ${group?.id ?? "<unknown>"} references missing input ${field}`,
          );
        }
      }
    }

    const formula = formulaFiles.get(toolKey) ?? null;
    const developmentExempt = config.tier === "pro" && developmentToolKeys.has(toolKey);
    if (!formula && !developmentExempt) {
      addFinding("critical", "MISSING_FORMULA_MODULE", config.tier, toolKey, file, `No formula module found for ${toolKey}`);
    }
    if (formula?.exportedToolKey && formula.exportedToolKey !== toolKey) {
      addFinding(
        "critical",
        "FORMULA_TOOL_KEY_MISMATCH",
        config.tier,
        toolKey,
        relative(ROOT, formula.file),
        `Formula exports ${formula.exportedToolKey}`,
      );
    }

    const formulaDeclaredInputs = formula?.declaredInputIds ?? new Set();
    const schemaRefs = schemaInputSets(schema);
    for (const id of formulaDeclaredInputs) {
      if (!schemaRefs.direct.has(id)) {
        addFinding(
          "critical",
          "FORMULA_DECLARED_INPUT_NOT_IN_SCHEMA",
          config.tier,
          toolKey,
          relative(ROOT, formula.file),
          `Formula input contract declares ${id}, absent from schema.inputs`,
        );
      }
    }

    if (formula && formulaDeclaredInputs.size > 0) {
      for (const input of inputs.filter((item) => item?.required === true)) {
        if (!formulaDeclaredInputs.has(input.id)) {
          addFinding(
            "critical",
            "SCHEMA_REQUIRED_INPUT_NOT_IN_FORMULA",
            config.tier,
            toolKey,
            relative(ROOT, formula.file),
            `Required schema input ${input.id} is absent from formula input contract`,
          );
        }
      }
    }

    inventory.push({
      tier: config.tier,
      toolKey,
      toolName: schema.tool_name ?? null,
      category: schema.category ?? null,
      schemaFile: file,
      formulaFile: formula ? relative(ROOT, formula.file) : null,
      developmentExempt,
      inputCount: inputIds.length,
      normalizedInputCount: normalizedIds.length,
      outputCount: outputIds.length,
      formulaDeclaredInputCount: formulaDeclaredInputs.size,
    });
  }
}

const hardFindings = findings.filter((entry) => HARD_CODES.has(entry.code));
const summary = {
  generatedAt: new Date().toISOString(),
  tools: inventory.length,
  freeTools: inventory.filter((entry) => entry.tier === "free").length,
  proTools: inventory.filter((entry) => entry.tier === "pro").length,
  proDevelopmentExempt: inventory.filter((entry) => entry.developmentExempt).length,
  findings: findings.length,
  critical: findings.filter((entry) => entry.severity === "critical").length,
  warnings: findings.filter((entry) => entry.severity === "warning").length,
  hardFailures: hardFindings.length,
};

const report = { summary, inventory, findings };
writeFileSync(join(REPORT_DIR, "formula-integrity-report.json"), JSON.stringify(report, null, 2));

const markdown = [
  "# SectorCalc Tool / Formula / Input Integrity Audit",
  "",
  `Generated: ${summary.generatedAt}`,
  "",
  "## Summary",
  "",
  `- Audited tools: ${summary.tools} (Free ${summary.freeTools}, Pro ${summary.proTools})`,
  `- Pro development exemptions: ${summary.proDevelopmentExempt}`,
  `- Critical: ${summary.critical}`,
  `- Warnings: ${summary.warnings}`,
  `- Hard failures: ${summary.hardFailures}`,
  "",
  "## Findings",
  "",
  ...findings.map(
    (entry) =>
      `- **${entry.severity.toUpperCase()} ${entry.code}** \`${entry.toolKey ?? "n/a"}\` — ${entry.message} (\`${entry.file}\`)`,
  ),
  "",
  "## Inventory",
  "",
  "| Tier | Tool | Inputs | Formula inputs | Normalized | Outputs | Formula | Development exempt |",
  "|---|---|---:|---:|---:|---:|---|---|",
  ...inventory.map(
    (entry) =>
      `| ${entry.tier} | ${entry.toolKey} | ${entry.inputCount} | ${entry.formulaDeclaredInputCount} | ${entry.normalizedInputCount} | ${entry.outputCount} | ${entry.formulaFile ?? "missing/embedded"} | ${entry.developmentExempt ? "yes" : "no"} |`,
  ),
  "",
].join("\n");
writeFileSync(join(REPORT_DIR, "formula-integrity-report.md"), markdown);

console.log(JSON.stringify(summary, null, 2));
if (hardFindings.length > 0) process.exit(1);
