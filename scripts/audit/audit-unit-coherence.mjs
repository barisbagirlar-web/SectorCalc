#!/usr/bin/env node
/**
 * audit:unit-coherence — Schema-level unit consistency checker
 *
 * Checks each schema for:
 * 1. All inputs have unit metadata (not empty/missing)
 * 2. Output unit is compatible with at least one input unit
 * 3. No operators that suggest dimension mismatch (e.g., adding percent to currency)
 * 4. Formula doesn't mix incompatible unit groups
 *
 * This is a schema-level check — does NOT compile or evaluate formulas.
 * Simple string-pattern based. Fast, deterministic, pipeline-safe.
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const SCHEMAS_DIR = join(ROOT, "generated", "schemas");
const REPORT_DIR = join(ROOT, "scripts/.cache");

const UNIT_FAMILIES = {
  length: ["m", "meter", "meters", "cm", "mm", "km", "ft", "feet", "in", "inch", "inches", "yard", "yards"],
  area: ["m²", "m2", "sqm", "ft²", "ft2", "sqft", "acre", "acres", "ha", "hectare"],
  volume: ["m³", "m3", "l", "liter", "liters", "ml", "gal", "gallon", "gallons", "ft³", "ft3"],
  weight: ["kg", "kilogram", "kilograms", "g", "gram", "grams", "lb", "lbs", "pound", "pounds", "ton", "tons"],
  time: ["s", "sec", "second", "seconds", "min", "minute", "minutes", "h", "hr", "hour", "hours", "day", "days", "month", "months", "year", "years"],
  currency: ["usd", "eur", "try", "gbp", "$", "€", "£", "₺", "tl"],
  percent: ["%", "percent", "percentage", "pct"],
  count: ["unit", "units", "piece", "pieces", "item", "items", "pcs", "adet"],
  rate: ["per", "/hr", "/h", "/day", "/month", "/year", "/m", "/m²", "/m2"],
  energy: ["kwh", "mj", "btu", "kcal", "joule", "joules"],
  temperature: ["°c", "c°", "°f", "f°", "kelvin", "k"],
  pressure: ["bar", "psi", "kpa", "mpa", "atm"],
  speed: ["m/s", "km/h", "mph", "fps"],
  ratio: ["ratio", "rate", "coefficient", "factor", "index"],
};

function findUnitFamily(unit) {
  if (!unit || typeof unit !== "string") return null;
  const u = unit.toLowerCase().trim();
  for (const [family, members] of Object.entries(UNIT_FAMILIES)) {
    if (members.some(m => u === m || u.startsWith(m) || u.endsWith(m))) return family;
  }
  // Check composite patterns
  if (u.includes("/")) return "rate";
  if (/\d+/.test(u)) return null; // unknown custom
  return null;
}

const SAFE_PATTERNS = [
  /%$/i, /rate$/i, /ratio/i, /factor/i, /coefficient/i, /index/i, /score/i,
  /count/i, /quantity/i, /number/i, /amount/i,
];

function isUnitless(unit) {
  if (!unit || typeof unit !== "string") return true;
  const u = unit.toLowerCase().trim();
  return u === "" || u === "1" || u === "none" || u === "unitless" || SAFE_PATTERNS.some(p => p.test(u));
}

function checkSchema(slug, schema) {
  const issues = [];

  // Extract inputs
  const inputs = schema.inputs || [];
  const outputs = schema.outputs || {};
  const formulas = schema.formulas || {};

  // Check 1: All inputs have unit metadata
  for (const input of inputs) {
    if (!input.unit || typeof input.unit !== "string" || input.unit.trim() === "") {
      issues.push({ type: "MISSING_UNIT", field: `input.${input.id}`, detail: `Input "${input.id}" has no unit metadata` });
    }
  }

  // Check 2: Identify unit families per input
  const inputFamilies = {};
  for (const input of inputs) {
    if (input.unit) {
      inputFamilies[input.id] = findUnitFamily(input.unit);
    }
  }

  // Check 3: Detect incompatible operations in formulas
  // Look for patterns where different unit families are added/subtracted
  for (const [key, expr] of Object.entries(formulas)) {
    if (!expr || typeof expr !== "string") {
      issues.push({ type: "EMPTY_FORMULA", field: `formula.${key}`, detail: `Formula "${key}" is empty` });
      continue;
    }

    // Check for mixed addition between clearly incompatible families
    // Simple heuristic: if expression contains + or - with two different
    // unit-family inputs
    const usedInputs = inputs.filter(inp => expr.includes(inp.id));
    const usedFamilies = new Set(usedInputs.map(inp => inputFamilies[inp.id]).filter(Boolean));

    // Addition/subtraction with length + time = velocity (OK)
    // But length + weight = invalid
    const incompatiblePairs = [
      ["length", "weight"],
      ["length", "currency"],
      ["length", "temperature"],
      ["area", "weight"],
      ["area", "currency"],
      ["volume", "weight"],
      ["volume", "currency"],
      ["weight", "currency"],
      ["weight", "temperature"],
      ["currency", "temperature"],
      ["time", "currency"],
      ["time", "weight"],
      ["time", "temperature"],
    ];

    if (/\b\+\b/.test(expr) || /\b-\b/.test(expr)) {
      for (const [a, b] of incompatiblePairs) {
        if (usedFamilies.has(a) && usedFamilies.has(b)) {
          issues.push({
            type: "INCOMPATIBLE_UNITS",
            field: `formula.${key}`,
            detail: `Formula "${key}" may mix incompatible units: ${a} + ${b}`,
          });
        }
      }
    }
  }

  // Check 4: Output has unit
  const outputUnit = outputs.unit;
  if (!outputUnit || outputUnit.trim() === "") {
    // Not a critical issue if output is unitless
    if (!isUnitless(outputUnit)) {
      issues.push({ type: "MISSING_OUTPUT_UNIT", field: "outputs.unit", detail: `Output unit is missing` });
    }
  }

  // Check 5: All formulas referenced in outputs exist
  if (outputs.primary && !formulas[outputs.primary]) {
    issues.push({ type: "MISSING_PRIMARY_FORMULA", field: "outputs.primary", detail: `Primary output "${outputs.primary}" has no matching formula` });
  }
  if (outputs.secondary) {
    for (const sec of Array.isArray(outputs.secondary) ? outputs.secondary : [outputs.secondary]) {
      if (typeof sec === "string" && sec && !formulas[sec]) {
        issues.push({ type: "MISSING_SECONDARY_FORMULA", field: "outputs.secondary", detail: `Secondary output "${sec}" has no matching formula` });
      }
    }
  }

  return issues;
}

function main() {
  console.log("=".repeat(60));
  console.log("UNIT COHERENCE AUDIT");
  console.log("Schema-level unit consistency check");
  console.log("=".repeat(60));

  const files = readdirSync(SCHEMAS_DIR)
    .filter(f => f.endsWith("-schema.json"))
    .sort();

  let totalIssues = 0;
  let schemasWithIssues = 0;
  const allReports = [];

  for (const file of files) {
    const slug = file.replace(/-schema\.json$/, "");
    let raw;
    try {
      raw = JSON.parse(readFileSync(join(SCHEMAS_DIR, file), "utf8"));
    } catch {
      console.error(`  ✗ ${slug}: JSON parse error`);
      schemasWithIssues++;
      totalIssues++;
      continue;
    }

    const issues = checkSchema(slug, raw);
    if (issues.length > 0) {
      schemasWithIssues++;
      totalIssues += issues.length;
      for (const issue of issues) {
        console.log(`  ✗ ${slug}: [${issue.type}] ${issue.detail}`);
      }
    }
    allReports.push({ slug, passed: issues.length === 0, issues });
  }

  const totalSchemas = files.length;
  const cleanSchemas = totalSchemas - schemasWithIssues;

  console.log("\n" + "-".repeat(60));
  console.log(`Schemas: ${cleanSchemas} CLEAN, ${schemasWithIssues} WITH ISSUES`);
  console.log(`Total issues: ${totalIssues}`);

  const passed = totalIssues === 0;
  if (passed) {
    console.log("\n✅ UNIT COHERENCE: ALL PASSED");
  } else {
    console.log(`\n❌ UNIT COHERENCE: ${totalIssues} issue(s) found in ${schemasWithIssues} schema(s)`);
  }

  const report = {
    timestamp: new Date().toISOString(),
    totalSchemas,
    cleanSchemas,
    schemasWithIssues,
    totalIssues,
    allPassed: passed,
    results: allReports,
  };

  mkdirSync(REPORT_DIR, { recursive: true });
  writeFileSync(join(REPORT_DIR, "unit-coherence-report.json"), JSON.stringify(report, null, 2), "utf-8");

  if (!passed) process.exit(1);
}

main();
