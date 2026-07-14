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

const HARD = new Set([
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
  "FORMULA_INPUT_MISSING",
  "OUTPUT_ID_DUPLICATE",
  "FORMULA_OUTPUT_MISSING",
  "FORMULA_REQUIRED_INPUT_NOT_IN_SCHEMA",
]);

const findings = [];
const inventory = [];
const toolKeys = new Map();

function finding(severity, code, tier, toolKey, file, message, evidence = {}) {
  findings.push({ severity, code, tier, toolKey, file, message, evidence });
}

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function parseJson(path, tier) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    finding("critical", "SCHEMA_PARSE_ERROR", tier, null, relative(ROOT, path), String(error));
    return null;
  }
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function finiteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function collectFormulaFiles(dir) {
  const map = new Map();
  for (const file of walk(dir).filter((p) => p.endsWith(".formula.ts") || p.endsWith(".formula.js"))) {
    const source = readFileSync(file, "utf8");
    const exportMatch = source.match(/export\s+const\s+toolKey\s*=\s*["'`]([^"'`]+)["'`]/);
    const inferred = basename(file).replace(/\.formula\.(ts|js)$/, "");
    map.set(inferred, { file, source, exportedToolKey: exportMatch?.[1] ?? null });
  }
  return map;
}

function extractFormulaInputRefs(source) {
  const refs = new Set();
  const patterns = [
    /\binputs?\.([A-Za-z_$][\w$]*)/g,
    /\bnormalizedInputs?\.([A-Za-z_$][\w$]*)/g,
    /\binput\[["'`]([^"'`]+)["'`]\]/g,
    /\binputs?\[["'`]([^"'`]+)["'`]\]/g,
    /\bnormalizedInputs?\[["'`]([^"'`]+)["'`]\]/g,
    /const\s*\{([^}]+)\}\s*=\s*(?:inputs?|normalizedInputs?)/g,
  ];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(source))) {
      if (pattern === patterns[5]) {
        for (const token of match[1].split(",")) {
          const name = token.trim().split(":")[0]?.trim();
          if (/^[A-Za-z_$][\w$]*$/.test(name)) refs.add(name);
        }
      } else if (match[1]) refs.add(match[1]);
    }
  }
  return refs;
}

function extractFormulaOutputRefs(source) {
  const refs = new Set();
  for (const pattern of [
    /\boutputs?\.([A-Za-z_$][\w$]*)/g,
    /\bresult\.([A-Za-z_$][\w$]*)/g,
    /["'`]([A-Za-z_$][\w$]*)["'`]\s*:/g,
  ]) {
    let match;
    while ((match = pattern.exec(source))) if (match[1]) refs.add(match[1]);
  }
  return refs;
}

function collectSchemaInputRefs(schema) {
  const direct = new Set(asArray(schema.inputs).map((i) => i?.id).filter(Boolean));
  const normalized = new Set(asArray(schema.normalized_inputs).map((i) => i?.id).filter(Boolean));
  return { direct, normalized, all: new Set([...direct, ...normalized]) };
}

function validateInput(input, context) {
  const { tier, toolKey, file } = context;
  const id = input?.id ?? "<missing-id>";
  const min = input?.min ?? input?.minimum ?? input?.validation?.min ?? input?.physical_min;
  const max = input?.max ?? input?.maximum ?? input?.validation?.max ?? input?.physical_max;
  const defaultValue = input?.default ?? input?.default_value ?? input?.reference_value;

  if (finiteNumber(min) && finiteNumber(max) && min > max) {
    finding("critical", "INVALID_NUMERIC_RANGE", tier, toolKey, file, `Input ${id} has min > max`, { min, max });
  }
  if (finiteNumber(defaultValue) && finiteNumber(min) && defaultValue < min) {
    finding("critical", "DEFAULT_OUTSIDE_RANGE", tier, toolKey, file, `Input ${id} default is below min`, { defaultValue, min });
  }
  if (finiteNumber(defaultValue) && finiteNumber(max) && defaultValue > max) {
    finding("critical", "DEFAULT_OUTSIDE_RANGE", tier, toolKey, file, `Input ${id} default is above max`, { defaultValue, max });
  }

  const unit = input?.unit ?? input?.display_unit ?? input?.units?.default;
  if (!unit && ["number", "numeric", "integer", "decimal"].includes(String(input?.type ?? "").toLowerCase())) {
    finding("warning", "NUMERIC_INPUT_WITHOUT_UNIT", tier, toolKey, file, `Numeric input ${id} has no explicit unit`);
  }

  const reference = input?.reference_value ?? input?.reference_range ?? input?.advisory_range ?? input?.help_text;
  if (reference == null) {
    finding("info", "INPUT_WITHOUT_REFERENCE_GUIDANCE", tier, toolKey, file, `Input ${id} has no explicit reference/advisory guidance`);
  }
}

for (const cfg of CONFIG) {
  const schemaRoot = join(ROOT, cfg.schemaDir);
  const formulaRoot = join(ROOT, cfg.formulaDir);
  const formulaFiles = collectFormulaFiles(formulaRoot);
  const schemaFiles = walk(schemaRoot).filter((p) => p.endsWith(".json"));

  for (const schemaPath of schemaFiles) {
    const schema = parseJson(schemaPath, cfg.tier);
    if (!schema) continue;
    const file = relative(ROOT, schemaPath);
    const toolKey = schema.tool_key;
    if (!toolKey) {
      finding("critical", "MISSING_TOOL_KEY", cfg.tier, null, file, "Schema has no tool_key");
      continue;
    }
    if (toolKeys.has(toolKey)) {
      finding("critical", "DUPLICATE_TOOL_KEY", cfg.tier, toolKey, file, "tool_key is duplicated", { other: toolKeys.get(toolKey) });
    } else toolKeys.set(toolKey, file);

    const inputs = asArray(schema.inputs);
    const normalizedInputs = asArray(schema.normalized_inputs);
    const outputs = asArray(schema.outputs);
    const inputIds = inputs.map((i) => i?.id).filter(Boolean);
    const normalizedIds = normalizedInputs.map((i) => i?.id).filter(Boolean);
    const outputIds = outputs.map((o) => o?.id).filter(Boolean);

    for (const [ids, code, label] of [
      [inputIds, "DUPLICATE_INPUT_ID", "input"],
      [normalizedIds, "DUPLICATE_NORMALIZED_INPUT_ID", "normalized input"],
      [outputIds, "OUTPUT_ID_DUPLICATE", "output"],
    ]) {
      const seen = new Set();
      for (const id of ids) {
        if (seen.has(id)) finding("critical", code, cfg.tier, toolKey, file, `Duplicate ${label} id: ${id}`);
        seen.add(id);
      }
    }

    const normalizedSet = new Set(normalizedIds);
    for (const input of inputs) {
      validateInput(input, { tier: cfg.tier, toolKey, file });
      if (input?.normalized_id && !normalizedSet.has(input.normalized_id)) {
        finding("critical", "INPUT_NORMALIZED_ID_MISSING", cfg.tier, toolKey, file, `Input ${input.id} points to missing normalized_id ${input.normalized_id}`);
      }
    }

    const inputSet = new Set(inputIds);
    for (const group of asArray(schema?.ui_contract?.input_groups)) {
      for (const field of asArray(group?.fields)) {
        if (!inputSet.has(field)) {
          finding("critical", "UI_FIELD_INPUT_MISSING", cfg.tier, toolKey, file, `UI group ${group?.id ?? "<unknown>"} references missing input ${field}`);
        }
      }
    }

    let formula = formulaFiles.get(toolKey) ?? null;
    if (cfg.tier === "pro" && !formula) {
      finding("critical", "MISSING_FORMULA_MODULE", cfg.tier, toolKey, file, `No formula module found for ${toolKey}`);
    }
    if (formula?.exportedToolKey && formula.exportedToolKey !== toolKey) {
      finding("critical", "FORMULA_TOOL_KEY_MISMATCH", cfg.tier, toolKey, relative(ROOT, formula.file), `Formula exports ${formula.exportedToolKey}`);
    }

    const refs = formula ? extractFormulaInputRefs(formula.source) : new Set();
    const schemaRefs = collectSchemaInputRefs(schema);
    for (const ref of refs) {
      if (!schemaRefs.all.has(ref)) {
        finding("critical", "FORMULA_REQUIRED_INPUT_NOT_IN_SCHEMA", cfg.tier, toolKey, relative(ROOT, formula.file), `Formula references input ${ref} absent from inputs/normalized_inputs`);
      }
    }

    const formulaOutputRefs = formula ? extractFormulaOutputRefs(formula.source) : new Set();
    const outputSet = new Set(outputIds);
    for (const ref of formulaOutputRefs) {
      if (ref.startsWith("to") || ref === "map" || ref === "length") continue;
      if (!outputSet.has(ref) && outputIds.length > 0) {
        finding("warning", "FORMULA_OUTPUT_UNDECLARED", cfg.tier, toolKey, relative(ROOT, formula.file), `Formula may emit undeclared output ${ref}`);
      }
    }

    const schemaFormulaInputs = new Set();
    for (const f of asArray(schema.formulas)) {
      for (const id of asArray(f?.input_ids ?? f?.inputs ?? f?.required_inputs)) schemaFormulaInputs.add(id);
    }
    for (const id of schemaFormulaInputs) {
      if (!schemaRefs.all.has(id)) {
        finding("critical", "FORMULA_INPUT_MISSING", cfg.tier, toolKey, file, `Schema formula requires missing input ${id}`);
      }
    }

    inventory.push({
      tier: cfg.tier,
      toolKey,
      toolName: schema.tool_name ?? null,
      category: schema.category ?? null,
      schemaFile: file,
      formulaFile: formula ? relative(ROOT, formula.file) : null,
      inputCount: inputIds.length,
      normalizedInputCount: normalizedIds.length,
      outputCount: outputIds.length,
      formulaInputRefs: [...refs].sort(),
      schemaFormulaInputRefs: [...schemaFormulaInputs].sort(),
    });
  }
}

const hardFindings = findings.filter((f) => HARD.has(f.code));
const summary = {
  generatedAt: new Date().toISOString(),
  tools: inventory.length,
  freeTools: inventory.filter((i) => i.tier === "free").length,
  proTools: inventory.filter((i) => i.tier === "pro").length,
  findings: findings.length,
  critical: findings.filter((f) => f.severity === "critical").length,
  warnings: findings.filter((f) => f.severity === "warning").length,
  info: findings.filter((f) => f.severity === "info").length,
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
  `- Tools: ${summary.tools} (Free ${summary.freeTools}, Pro ${summary.proTools})`,
  `- Critical: ${summary.critical}`,
  `- Warnings: ${summary.warnings}`,
  `- Informational: ${summary.info}`,
  `- Hard failures: ${summary.hardFailures}`,
  "",
  "## Findings",
  "",
  ...findings.map((f) => `- **${f.severity.toUpperCase()} ${f.code}** \`${f.toolKey ?? "n/a"}\` — ${f.message} (\`${f.file}\`)`),
  "",
  "## Inventory",
  "",
  "| Tier | Tool | Inputs | Normalized | Outputs | Formula |",
  "|---|---|---:|---:|---:|---|",
  ...inventory.map((i) => `| ${i.tier} | ${i.toolKey} | ${i.inputCount} | ${i.normalizedInputCount} | ${i.outputCount} | ${i.formulaFile ?? "embedded/missing"} |`),
  "",
].join("\n");
writeFileSync(join(REPORT_DIR, "formula-integrity-report.md"), markdown);

console.log(JSON.stringify(summary, null, 2));
if (hardFindings.length > 0) process.exit(1);
