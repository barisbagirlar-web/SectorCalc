#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const GENERATED_SCHEMAS_DIR = path.join(ROOT, "generated", "schemas");

const TURKISH_UNICODE_RE = /[çğıöşüÇĞİÖŞÜ]/;
const TURKISH_ASCII_TOKENS = [
  "sonuc",
  "sonuç",
  "yatirilan",
  "yatırılan",
  "sermaye",
  "ozsermaye",
  "özsermaye",
  "piyasaDegeri",
  "piyasa_degeri",
  "mevcutHisse",
  "mevcut_hisse",
  "yeniHisse",
  "yeni_hisse",
  "insaat",
  "inşaat",
  "para",
  "finansal",
  "gayrimenkul",
  "lojistik",
  "krediTutari",
  "kredi_tutari",
  "kalinlik",
  "kalınlık",
  "yogunluk",
  "yoğunluk",
  "suratme",
  "sürtünme",
  "ilerleme",
];

const ALLOWED_IDENTIFIER_WORDS = new Set([
  "Math",
  "min",
  "max",
  "abs",
  "sqrt",
  "pow",
  "round",
  "floor",
  "ceil",
  "log",
  "exp",
  "sin",
  "cos",
  "tan",
  "PI",
  "E",
  "true",
  "false",
  "null",
  "undefined",
  "if",
  "then",
  "else",
  "and",
  "or",
  "not",
  "INTERNAL_SERVER_ONLY_EXPRESSION_NOT_FOR_PUBLIC_UI",
]);

function walkJsonFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walkJsonFiles(full, out);
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".json")) {
      out.push(full);
    }
  }

  return out;
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    return {
      __parseError: String(error && error.message ? error.message : error),
    };
  }
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") return Object.values(value);
  return [];
}

function asRecord(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value;
}

function collectIds(items) {
  const ids = new Set();

  for (const item of asArray(items)) {
    if (!item || typeof item !== "object") continue;

    const candidates = [
      item.id,
      item.key,
      item.name,
      item.normalized_id,
      item.normalizedId,
      item.output,
      item.formula_source,
      item.formulaSource,
    ];

    for (const candidate of candidates) {
      if (typeof candidate === "string" && candidate.trim()) {
        ids.add(candidate.trim());
      }
    }
  }

  return ids;
}

function collectFormulaIds(formulas) {
  const ids = new Set();

  for (const formula of asArray(formulas)) {
    if (!formula || typeof formula !== "object") continue;

    const id = formula.id ?? formula.key ?? formula.name;
    if (typeof id === "string" && id.trim()) ids.add(id.trim());
  }

  return ids;
}

function getToolKey(schema, file) {
  const fallback = path.basename(file).replace(/-schema\.json$/, "").replace(/\.schema\.json$/, "");
  return String(schema.tool_key ?? schema.toolKey ?? schema.slug ?? fallback);
}

function containsForbiddenTurkish(value) {
  const text = JSON.stringify(value);

  if (TURKISH_UNICODE_RE.test(text)) {
    return "Turkish Unicode character found";
  }

  const lower = text.toLowerCase();

  for (const token of TURKISH_ASCII_TOKENS) {
    if (lower.includes(token.toLowerCase())) {
      return `Forbidden Turkish/transliterated token found: ${token}`;
    }
  }

  return null;
}

function extractIdentifierCandidates(expression) {
  if (typeof expression !== "string") return [];

  const matches = expression.match(/\b[A-Za-z_][A-Za-z0-9_]*\b/g);
  return matches ? Array.from(new Set(matches)) : [];
}

function checkFormulaBindings({ schema, file, failures }) {
  const rel = path.relative(ROOT, file);
  const toolKey = getToolKey(schema, file);

  const inputs = asArray(schema.inputs);
  const normalizedInputs = asArray(schema.normalized_inputs ?? schema.normalizedInputs);
  const outputs = asArray(schema.outputs);
  const formulas = asArray(schema.formulas);

  const inputIds = collectIds(inputs);
  const normalizedInputIds = collectIds(normalizedInputs);
  const outputIds = collectIds(outputs);
  const formulaIds = collectFormulaIds(formulas);

  if (!toolKey || toolKey === "undefined") {
    failures.push(`${rel}: missing tool_key/toolKey`);
  }

  if (!String(schema.tool_name ?? schema.toolName ?? "").trim()) {
    failures.push(`${rel}: missing tool_name/toolName`);
  }

  if (inputs.length === 0) {
    failures.push(`${rel}: inputs is empty or missing`);
  }

  if (outputs.length === 0) {
    failures.push(`${rel}: outputs is empty or missing`);
  }

  const turkishProblem = containsForbiddenTurkish(schema);
  if (turkishProblem) {
    failures.push(`${rel}: ${turkishProblem}`);
  }

  for (const input of inputs) {
    if (!input || typeof input !== "object") continue;

    const inputId = String(input.id ?? "").trim();

    if (!inputId) {
      failures.push(`${rel}: input without id`);
      continue;
    }

    const formulaBindings = asArray(input.formula_bindings ?? input.formulaBindings);
    const outputBindings = asArray(input.output_bindings ?? input.outputBindings);
    const warningBindings = asArray(input.warning_bindings ?? input.warningBindings);

    for (const binding of formulaBindings) {
      if (typeof binding === "string" && formulaIds.size > 0 && !formulaIds.has(binding)) {
        failures.push(`${rel}: input ${inputId} references missing formula ${binding}`);
      }
    }

    for (const binding of outputBindings) {
      if (typeof binding === "string" && outputIds.size > 0 && !outputIds.has(binding)) {
        failures.push(`${rel}: input ${inputId} references missing output ${binding}`);
      }
    }

    for (const binding of warningBindings) {
      if (typeof binding === "string" && binding.toLowerCase().includes("sonuc")) {
        failures.push(`${rel}: input ${inputId} has Turkish warning binding ${binding}`);
      }
    }
  }

  for (const normalized of normalizedInputs) {
    if (!normalized || typeof normalized !== "object") continue;

    const normalizedId = String(normalized.id ?? "").trim();
    const fromInput = String(normalized.from_input ?? normalized.fromInput ?? "").trim();

    if (fromInput && inputIds.size > 0 && !inputIds.has(fromInput)) {
      failures.push(`${rel}: normalized input ${normalizedId || "(missing id)"} references missing input ${fromInput}`);
    }
  }

  for (const formula of formulas) {
    if (!formula || typeof formula !== "object") continue;

    const formulaId = String(formula.id ?? formula.key ?? formula.name ?? "").trim() || "(missing formula id)";

    const uses = asArray(formula.uses);
    const inputBindings = asArray(formula.input_bindings ?? formula.inputBindings);
    const normalizedBindings = asArray(formula.normalized_input_bindings ?? formula.normalizedInputBindings);
    const outputBindings = asArray(formula.output_bindings ?? formula.outputBindings);

    for (const binding of inputBindings) {
      if (typeof binding === "string" && inputIds.size > 0 && !inputIds.has(binding)) {
        failures.push(`${rel}: formula ${formulaId} references missing input ${binding}`);
      }
    }

    for (const binding of normalizedBindings) {
      if (typeof binding === "string" && normalizedInputIds.size > 0 && !normalizedInputIds.has(binding)) {
        failures.push(`${rel}: formula ${formulaId} references missing normalized input ${binding}`);
      }
    }

    for (const binding of outputBindings) {
      if (typeof binding === "string" && outputIds.size > 0 && !outputIds.has(binding)) {
        failures.push(`${rel}: formula ${formulaId} references missing output ${binding}`);
      }
    }

    const output = String(formula.output ?? "").trim();
    if (output && outputIds.size > 0 && !outputIds.has(output)) {
      failures.push(`${rel}: formula ${formulaId} output points to missing output ${output}`);
    }

    for (const used of uses) {
      if (typeof used !== "string") continue;

      const allowed =
        inputIds.has(used) ||
        normalizedInputIds.has(used) ||
        outputIds.has(used) ||
        formulaIds.has(used) ||
        ALLOWED_IDENTIFIER_WORDS.has(used);

      if (!allowed && TURKISH_ASCII_TOKENS.some((token) => used.toLowerCase().includes(token.toLowerCase()))) {
        failures.push(`${rel}: formula ${formulaId} uses forbidden Turkish/transliterated identifier ${used}`);
      }
    }

    const expression = String(formula.expression ?? "");
    for (const identifier of extractIdentifierCandidates(expression)) {
      if (ALLOWED_IDENTIFIER_WORDS.has(identifier)) continue;

      if (TURKISH_ASCII_TOKENS.some((token) => identifier.toLowerCase().includes(token.toLowerCase()))) {
        failures.push(`${rel}: formula ${formulaId} expression contains forbidden identifier ${identifier}`);
      }
    }
  }

  for (const output of outputs) {
    if (!output || typeof output !== "object") continue;

    const outputId = String(output.id ?? output.key ?? "").trim() || "(missing output id)";
    const formulaSource = String(output.formula_source ?? output.formulaSource ?? "").trim();
    const governingFormula = String(output.governing_formula ?? output.governingFormula ?? "").trim();

    if (formulaSource && formulaIds.size > 0 && !formulaIds.has(formulaSource)) {
      failures.push(`${rel}: output ${outputId} references missing formula_source ${formulaSource}`);
    }

    if (governingFormula && formulaIds.size > 0 && !formulaIds.has(governingFormula)) {
      failures.push(`${rel}: output ${outputId} references missing governing_formula ${governingFormula}`);
    }
  }

  const breakdown = asRecord(schema.breakdown);
  const breakdownUnits = asRecord(schema.breakdownUnits ?? schema.breakdown_units);

  for (const key of Object.keys(breakdownUnits)) {
    if (Object.keys(breakdown).length > 0 && !Object.prototype.hasOwnProperty.call(breakdown, key)) {
      failures.push(`${rel}: breakdownUnits key ${key} has no matching breakdown key`);
    }
  }
}

function main() {
  if (!fs.existsSync(GENERATED_SCHEMAS_DIR)) {
    console.log("GENERATED_SCHEMA_BINDINGS_GUARD=SKIP");
    console.log("generated/schemas directory not found");
    return;
  }

  const files = walkJsonFiles(GENERATED_SCHEMAS_DIR);
  const failures = [];

  for (const file of files) {
    const schema = readJson(file);

    if (schema.__parseError) {
      failures.push(`${path.relative(ROOT, file)}: JSON parse error: ${schema.__parseError}`);
      continue;
    }

    checkFormulaBindings({ schema, file, failures });
  }

  if (failures.length > 0) {
    console.error("GENERATED_SCHEMA_BINDINGS_GUARD=FAIL");
    console.error(`Checked files: ${files.length}`);
    for (const failure of failures) console.error("-", failure);
    process.exit(1);
  }

  console.log("GENERATED_SCHEMA_BINDINGS_GUARD=PASS");
  console.log(`Checked files: ${files.length}`);
}

main();
