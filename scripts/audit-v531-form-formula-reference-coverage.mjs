#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();

const PRO_DIR = path.join(ROOT, "src/sectorcalc/schemas/v531");
const FREE_DIR = path.join(ROOT, "src/sectorcalc/schemas/free-v531");
const OUT_DIR = path.join(ROOT, "audit-output");
const OUT_JSON = path.join(OUT_DIR, "v531-form-formula-reference-audit.json");
const OUT_CSV = path.join(OUT_DIR, "v531-form-formula-reference-audit.csv");

const IGNORE_IDENTIFIERS = new Set([
  "Math", "min", "max", "abs", "round", "floor", "ceil", "sqrt", "pow", "log", "ln",
  "exp", "sin", "cos", "tan", "PI", "E", "true", "false", "null", "undefined",
  "if", "else", "return", "let", "const", "var", "number", "string", "boolean",
]);

const FIELD_ARRAY_KEYS = new Set([
  "inputs",
  "fields",
  "parameters",
  "inputFields",
  "formFields",
  "input_schema",
  "inputSchema",
]);

const ID_KEYS = ["id", "key", "name", "slug", "field", "input", "inputKey"];
const LABEL_KEYS = ["label", "title", "name"];
const UNIT_KEYS = ["unit", "unitLabel", "displayUnit", "baseUnit"];
const DEFAULT_KEYS = ["default", "defaultValue", "value", "example", "sampleValue"];
const REFERENCE_KEYS = [
  "reference",
  "references",
  "referenceValue",
  "defaultReference",
  "referenceDefault",
  "recommended",
  "recommendedValue",
  "typical",
  "typicalValue",
  "baseline",
  "baselineValue",
  "nominal",
  "nominalValue",
  "industrialReference",
  "engineeringReference",
  "fieldReference",
  "referenceStrip",
];
const TOLERANCE_KEYS = [
  "tolerance",
  "tolerances",
  "allowedTolerance",
  "uncertainty",
  "sigma",
  "margin",
  "safetyMargin",
];
const OPTIONS_KEYS = [
  "options",
  "values",
  "acceptedValues",
  "allowedValues",
  "enum",
  "choices",
];
const RANGE_KEYS = [
  "min",
  "max",
  "minimum",
  "maximum",
  "range",
  "allowedRange",
  "recommendedRange",
];

function walk(dir, exts, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, exts, out);
    } else if (entry.isFile() && exts.includes(path.extname(entry.name))) {
      out.push(full);
    }
  }
  return out;
}

function deepValues(obj, out = []) {
  if (!obj || typeof obj !== "object") return out;
  if (Array.isArray(obj)) {
    for (const item of obj) deepValues(item, out);
    return out;
  }
  for (const [key, value] of Object.entries(obj)) {
    out.push({ key, value });
    if (value && typeof value === "object") deepValues(value, out);
  }
  return out;
}

function firstValue(obj, keys) {
  if (!obj || typeof obj !== "object") return undefined;
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) return obj[key];
  }
  return undefined;
}

function hasAnyKey(obj, keys) {
  if (!obj || typeof obj !== "object") return false;
  const seen = deepValues(obj);
  return seen.some(({ key, value }) => keys.includes(key) && value !== undefined && value !== null && value !== "");
}

function hasNumericLikeValue(obj, keys) {
  if (!obj || typeof obj !== "object") return false;
  const seen = deepValues(obj);
  return seen.some(({ key, value }) => {
    if (!keys.includes(key)) return false;
    if (typeof value === "number" && Number.isFinite(value)) return true;
    if (typeof value === "string" && /[-+]?\d+(?:[.,]\d+)?/.test(value)) return true;
    if (Array.isArray(value)) return value.some((v) => typeof v === "number" || (typeof v === "string" && /\d/.test(v)));
    if (value && typeof value === "object") return JSON.stringify(value).match(/[-+]?\d+(?:[.,]\d+)?/);
    return false;
  });
}

function normalizeId(value) {
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

function collectFieldObjects(obj) {
  const fields = [];
  const seen = new Set();

  function visit(node) {
    if (!node || typeof node !== "object") return;

    if (Array.isArray(node)) {
      for (const item of node) visit(item);
      return;
    }

    for (const [key, value] of Object.entries(node)) {
      if (FIELD_ARRAY_KEYS.has(key) && Array.isArray(value)) {
        for (const item of value) {
          if (!item || typeof item !== "object") continue;
          const id = normalizeId(firstValue(item, ID_KEYS));
          if (!id) continue;
          const sig = `${id}:${JSON.stringify(item).slice(0, 120)}`;
          if (!seen.has(sig)) {
            seen.add(sig);
            fields.push(item);
          }
        }
      }

      if (value && typeof value === "object") visit(value);
    }
  }

  visit(obj);
  return fields;
}

function collectFormulaStrings(obj) {
  const strings = [];
  const formulaKeyHints = /formula|expression|equation|calculation|compute|logic|exact_formula|formulaText/i;

  for (const { key, value } of deepValues(obj)) {
    if (typeof value !== "string") continue;
    if (formulaKeyHints.test(key) || /[+\-*/^=()]/.test(value)) {
      strings.push(value);
    }
  }

  return [...new Set(strings)];
}

function collectExplicitFormulaInputs(obj) {
  const out = new Set();
  const inputKeyHints = /formulaInputs|inputKeys|requiredInputs|variables|variableKeys|dependsOn|dependencies/i;

  for (const { key, value } of deepValues(obj)) {
    if (!inputKeyHints.test(key)) continue;

    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === "string") out.add(item);
        if (item && typeof item === "object") {
          const id = normalizeId(firstValue(item, ID_KEYS));
          if (id) out.add(id);
        }
      }
    }

    if (value && typeof value === "object" && !Array.isArray(value)) {
      for (const subKey of Object.keys(value)) out.add(subKey);
    }
  }

  return [...out];
}

function extractIdentifiers(formulaText) {
  const out = new Set();
  const re = /\b[A-Za-z_][A-Za-z0-9_]*\b/g;
  let m;
  while ((m = re.exec(formulaText))) {
    const id = m[0];
    if (!IGNORE_IDENTIFIERS.has(id)) out.add(id);
  }
  return [...out];
}

function collectFormulaIdentifiers(schema) {
  const explicit = collectExplicitFormulaInputs(schema);
  const formulaStrings = collectFormulaStrings(schema);
  const fromText = formulaStrings.flatMap(extractIdentifiers);

  return [...new Set([...explicit, ...fromText])];
}

async function loadSchemaFile(file) {
  if (file.endsWith(".json")) {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  }

  const mod = await import(pathToFileURL(file).href);
  const candidates = Object.values(mod).filter((v) => v && typeof v === "object");

  if (mod.default && typeof mod.default === "object") return mod.default;
  if (candidates.length === 1) return candidates[0];

  const schemaLike = candidates.find((v) => {
    const text = JSON.stringify(v).slice(0, 5000);
    return /inputs|fields|formula|slug|tool/i.test(text);
  });

  return schemaLike ?? candidates[0] ?? null;
}

function schemaSlug(schema, file) {
  const direct = firstValue(schema, ["slug", "id", "toolId", "tool_id", "key", "toolKey"]);
  if (direct) return String(direct);
  return path.basename(file).replace(/\.(json|ts|tsx|js|mjs)$/i, "");
}

function auditSchema(schema, file, tier) {
  const slug = schemaSlug(schema, file);
  const fields = collectFieldObjects(schema);
  const inputIds = fields.map((f) => normalizeId(firstValue(f, ID_KEYS))).filter(Boolean);
  const uniqueInputIds = [...new Set(inputIds)];

  const formulaIdsRaw = collectFormulaIdentifiers(schema);
  const formulaIds = formulaIdsRaw.filter((id) => uniqueInputIds.includes(id));

  const formulaUnknownIds = formulaIdsRaw
    .filter((id) => !uniqueInputIds.includes(id))
    .filter((id) => !/^[A-Z_]+$/.test(id))
    .filter((id) => id.length > 1);

  const inputsNotUsedByFormula = uniqueInputIds.filter((id) => !formulaIds.includes(id));
  const formulaInputsMissingFromForm = formulaIds.filter((id) => !uniqueInputIds.includes(id));

  const fieldRows = fields.map((field) => {
    const id = normalizeId(firstValue(field, ID_KEYS));
    const label = firstValue(field, LABEL_KEYS);
    const hasUnit = hasAnyKey(field, UNIT_KEYS);
    const hasDefault = hasAnyKey(field, DEFAULT_KEYS);
    const hasNumericDefault = hasNumericLikeValue(field, DEFAULT_KEYS);
    const hasReference = hasAnyKey(field, REFERENCE_KEYS);
    const hasNumericReference = hasNumericLikeValue(field, REFERENCE_KEYS);
    const hasTolerance = hasAnyKey(field, TOLERANCE_KEYS);
    const hasNumericTolerance = hasNumericLikeValue(field, TOLERANCE_KEYS);
    const hasOptions = hasAnyKey(field, OPTIONS_KEYS);
    const hasRange = hasAnyKey(field, RANGE_KEYS);

    // V5.3.1: Metadata renderability flags
    // declaredReferenceMissing: field has NO default/nominal/typical value in schema
    const declaredReferenceMissing = !hasDefault && !hasNumericDefault && !hasReference && !hasNumericReference;
    // renderableReferenceAvailable: normalizer WILL produce a non-null value
    const renderableReferenceAvailable = hasDefault || hasNumericDefault || hasReference || hasNumericReference;
    // declaredToleranceMissing: field has NO tolerance/uncertainty/sigma/margin in schema
    const declaredToleranceMissing = !hasTolerance && !hasNumericTolerance;
    // renderableRangeAvailable: normalizer WILL produce a range string from min/max/range objects
    const renderableRangeAvailable = hasRange || hasAnyKey(field, ["physical_hard_bounds", "engineering_range", "engineering_reference_range"]);
    // defaultValueAvailable: field has a default value
    const defaultValueAvailable = hasDefault || hasNumericDefault;
    // enumOptionsAvailable: field has declared options array
    const enumOptionsAvailable = hasOptions;

    return {
      id,
      label: label ? String(label) : "",
      hasUnit,
      hasDefault,
      hasNumericDefault,
      hasReference,
      hasNumericReference,
      hasTolerance,
      hasNumericTolerance,
      hasOptions,
      hasRange,
      usedByFormula: formulaIds.includes(id),
      declaredReferenceMissing,
      renderableReferenceAvailable,
      declaredToleranceMissing,
      renderableRangeAvailable,
      defaultValueAvailable,
      enumOptionsAvailable,
    };
  });

  const missingReferenceFields = fieldRows.filter((f) => !f.hasReference).map((f) => f.id);
  const missingNumericReferenceFields = fieldRows.filter((f) => f.hasReference && !f.hasNumericReference).map((f) => f.id);
  const missingToleranceFields = fieldRows.filter((f) => !f.hasTolerance).map((f) => f.id);
  const missingUnitFields = fieldRows.filter((f) => !f.hasUnit).map((f) => f.id);
  const missingDefaultFields = fieldRows.filter((f) => !f.hasDefault).map((f) => f.id);

  // V5.3.1: Metadata renderability metrics
  const declaredReferenceMissingFields = fieldRows.filter((f) => f.declaredReferenceMissing).map((f) => f.id);
  const renderableReferenceAvailableFields = fieldRows.filter((f) => f.renderableReferenceAvailable).map((f) => f.id);
  const declaredToleranceMissingFields = fieldRows.filter((f) => f.declaredToleranceMissing).map((f) => f.id);
  const renderableRangeAvailableFields = fieldRows.filter((f) => f.renderableRangeAvailable).map((f) => f.id);
  const defaultValueAvailableFields = fieldRows.filter((f) => f.defaultValueAvailable).map((f) => f.id);
  const enumOptionsAvailableFields = fieldRows.filter((f) => f.enumOptionsAvailable).map((f) => f.id);

  // FAIL only if formula-input binding is broken (formula references input that form does not have)
  // Absent reference/tolerance metadata is informational, not a failure condition
  const status =
    formulaInputsMissingFromForm.length === 0
      ? "PASS"
      : "FORMULA_INPUT_MISSING";

  return {
    tier,
    slug,
    file: path.relative(ROOT, file),
    status,
    inputCount: uniqueInputIds.length,
    formulaMatchedInputCount: formulaIds.length,
    fields: fieldRows,
    missingReferenceFields,
    missingNumericReferenceFields,
    missingToleranceFields,
    missingUnitFields,
    missingDefaultFields,
    inputsNotUsedByFormula,
    formulaInputsMissingFromForm,
    formulaUnknownIds: [...new Set(formulaUnknownIds)].slice(0, 50),
    // V5.3.1: Metadata renderability
    declaredReferenceMissingFields,
    renderableReferenceAvailableFields,
    declaredToleranceMissingFields,
    renderableRangeAvailableFields,
    defaultValueAvailableFields,
    enumOptionsAvailableFields,
  };
}

function csvEscape(value) {
  const s = Array.isArray(value) ? value.join("|") : String(value ?? "");
  return `"${s.replaceAll('"', '""')}"`;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const proFiles = walk(PRO_DIR, [".ts", ".tsx", ".js", ".mjs", ".json"]);
  const freeFiles = walk(FREE_DIR, [".json", ".ts", ".tsx", ".js", ".mjs"]);

  const results = [];

  for (const [tier, files] of [["PRO", proFiles], ["FREE", freeFiles]]) {
    for (const file of files) {
      try {
        const schema = await loadSchemaFile(file);
        if (!schema) throw new Error("schema export not found");
        results.push(auditSchema(schema, file, tier));
      } catch (err) {
        results.push({
          tier,
          slug: path.basename(file),
          file: path.relative(ROOT, file),
          status: "LOAD_FAIL",
          error: err.message,
        });
      }
    }
  }

  const summary = {
    totalSchemas: results.length,
    proSchemas: results.filter((r) => r.tier === "PRO").length,
    freeSchemas: results.filter((r) => r.tier === "FREE").length,
    pass: results.filter((r) => r.status === "PASS").length,
    needsMetadataFix: results.filter((r) => r.status !== "PASS" && r.status !== "LOAD_FAIL").length,
    loadFail: results.filter((r) => r.status === "LOAD_FAIL").length,
    proMissingReferenceSchemas: results.filter((r) => r.tier === "PRO" && r.missingReferenceFields?.length > 0).length,
    freeMissingReferenceSchemas: results.filter((r) => r.tier === "FREE" && r.missingReferenceFields?.length > 0).length,
    proMissingToleranceSchemas: results.filter((r) => r.tier === "PRO" && r.missingToleranceFields?.length > 0).length,
    freeMissingToleranceSchemas: results.filter((r) => r.tier === "FREE" && r.missingToleranceFields?.length > 0).length,
    formulaInputMissingFormSchemas: results.filter((r) => r.formulaInputsMissingFromForm?.length > 0).length,
    // V5.3.1: Metadata renderability metrics
    declaredReferenceMissingSchemas: results.filter((r) => r.declaredReferenceMissingFields?.length > 0).length,
    renderableReferenceAvailableSchemas: results.filter((r) => (r.renderableReferenceAvailableFields?.length ?? 0) > 0).length,
    declaredToleranceMissingSchemas: results.filter((r) => r.declaredToleranceMissingFields?.length > 0).length,
    renderableRangeAvailableSchemas: results.filter((r) => (r.renderableRangeAvailableFields?.length ?? 0) > 0).length,
    defaultValueAvailableSchemas: results.filter((r) => (r.defaultValueAvailableFields?.length ?? 0) > 0).length,
    enumOptionsAvailableSchemas: results.filter((r) => (r.enumOptionsAvailableFields?.length ?? 0) > 0).length,
  };

  fs.writeFileSync(OUT_JSON, JSON.stringify({ summary, results }, null, 2));

  const rows = [
    [
      "tier",
      "slug",
      "status",
      "inputCount",
      "formulaMatchedInputCount",
      "missingReferenceFields",
      "missingNumericReferenceFields",
      "missingToleranceFields",
      "missingUnitFields",
      "missingDefaultFields",
      "inputsNotUsedByFormula",
      "formulaInputsMissingFromForm",
      "file",
    ],
  ];

  for (const r of results) {
    rows.push([
      r.tier,
      r.slug,
      r.status,
      r.inputCount ?? "",
      r.formulaMatchedInputCount ?? "",
      r.missingReferenceFields ?? [],
      r.missingNumericReferenceFields ?? [],
      r.missingToleranceFields ?? [],
      r.missingUnitFields ?? [],
      r.missingDefaultFields ?? [],
      r.inputsNotUsedByFormula ?? [],
      r.formulaInputsMissingFromForm ?? [],
      r.file,
    ]);
  }

  fs.writeFileSync(OUT_CSV, rows.map((row) => row.map(csvEscape).join(",")).join("\n"));

  console.log("═══════════════════════════════════════════════════════");
  console.log("  V5.3.1 Form ↔ Formula ↔ Reference Coverage Audit");
  console.log("═══════════════════════════════════════════════════════");
  console.log(`TOTAL_SCHEMAS=${summary.totalSchemas}`);
  console.log(`PRO_SCHEMAS=${summary.proSchemas}`);
  console.log(`FREE_SCHEMAS=${summary.freeSchemas}`);
  console.log(`PASS=${summary.pass}`);
  console.log(`NEEDS_METADATA_FIX=${summary.needsMetadataFix}`);
  console.log(`LOAD_FAIL=${summary.loadFail}`);
  console.log(`PRO_MISSING_REFERENCE_SCHEMAS=${summary.proMissingReferenceSchemas}`);
  console.log(`FREE_MISSING_REFERENCE_SCHEMAS=${summary.freeMissingReferenceSchemas}`);
  console.log(`PRO_MISSING_TOLERANCE_SCHEMAS=${summary.proMissingToleranceSchemas}`);
  console.log(`FREE_MISSING_TOLERANCE_SCHEMAS=${summary.freeMissingToleranceSchemas}`);
  console.log(`FORMULA_INPUT_MISSING_FORM_SCHEMAS=${summary.formulaInputMissingFormSchemas}`);
  console.log(`DECLARED_REFERENCE_MISSING_SCHEMAS=${summary.declaredReferenceMissingSchemas}`);
  console.log(`RENDERABLE_REFERENCE_AVAILABLE_SCHEMAS=${summary.renderableReferenceAvailableSchemas}`);
  console.log(`DECLARED_TOLERANCE_MISSING_SCHEMAS=${summary.declaredToleranceMissingSchemas}`);
  console.log(`RENDERABLE_RANGE_AVAILABLE_SCHEMAS=${summary.renderableRangeAvailableSchemas}`);
  console.log(`DEFAULT_VALUE_AVAILABLE_SCHEMAS=${summary.defaultValueAvailableSchemas}`);
  console.log(`ENUM_OPTIONS_AVAILABLE_SCHEMAS=${summary.enumOptionsAvailableSchemas}`);
  console.log(`JSON_REPORT=${path.relative(ROOT, OUT_JSON)}`);
  console.log(`CSV_REPORT=${path.relative(ROOT, OUT_CSV)}`);
  console.log("═══════════════════════════════════════════════════════");

  if (summary.loadFail > 0 || summary.formulaInputMissingFormSchemas > 0) {
    process.exit(1);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
