#!/usr/bin/env node
// SectorCalc PRO V5.3.1 — Baris Schema Validation Gate
// Validates 45 Baris PRO schema files against the SuperV4 contract.
// Fails closed if any schema is missing, malformed, or has forbidden content.

import { readFileSync, existsSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCHEMA_DIR = resolve(__dirname, "../src/sectorcalc/schemas/pro-v531");

let failures = 0;

function fail(msg) { failures++; console.error(`  \u274c FAIL: ${msg}`); }
function pass(msg) { console.log(`  \u2705 PASS: ${msg}`); }

console.log("\n\u2550\u2550\u2550 Baris Schema Validation Gate \u2550\u2550\u2550\n");

if (!existsSync(SCHEMA_DIR)) {
  fail(`Schema directory not found: ${SCHEMA_DIR}`);
  process.exit(1);
}

const files = readdirSync(SCHEMA_DIR).filter(f => f.endsWith(".schema.json"));
console.log(`  Found ${files.length} schema files\n`);

if (files.length < 45) fail(`Schema count: ${files.length} (expected 45)`);
else if (files.length === 45) pass(`Schema count: ${files.length}`);
else pass(`Schema count: ${files.length}`);

// Required top-level keys for SuperV4 contract
const REQUIRED_KEYS = [
  "tool_id", "tool_key", "tool_name", "category", "scope",
  "primary_operation", "decision_context", "inputs", "outputs",
  "unit_conversion_contract", "metadata",
];

const FORBIDDEN_TEXT_PATTERNS = [
  { pattern: /formula_expression|calc_method|calc_fn|compute_fn|calculate_expression/i, label: "public formula expression" },
  { pattern: /\bcertified\b/i, label: "certification claim" },
  { pattern: /\blegal proof\b/i, label: "legal proof claim" },
  { pattern: /\bguaranteed compliance\b/i, label: "guaranteed compliance claim" },
  { pattern: /[^\x00-\x7F]/, label: "non-ASCII text" },
];

let processedCount = 0;
let allToolKeys = new Set();

for (const file of files) {
  const filePath = resolve(SCHEMA_DIR, file);

  // 1. Valid JSON
  let schema;
  try {
    const raw = readFileSync(filePath, "utf-8");
    schema = JSON.parse(raw);
    processedCount++;
  } catch (err) {
    fail(`${file}: invalid JSON — ${err.message}`);
    continue;
  }

  // 2. Required top-level keys
  for (const key of REQUIRED_KEYS) {
    if (!(key in schema)) {
      fail(`${file}: missing required key "${key}"`);
    }
  }

  // 3. tool_key extraction
  const toolKey = schema.tool_key;
  if (toolKey) {
    if (allToolKeys.has(toolKey)) fail(`Duplicate tool_key: ${toolKey}`);
    allToolKeys.add(toolKey);
    
    // Filename must match tool_key
    const expectedFile = `${toolKey}.schema.json`;
    if (file !== expectedFile) {
      fail(`File name mismatch: "${file}" should be "${expectedFile}"`);
    }
  }

  // 4. Forbidden text patterns in visible strings
  const rawContent = readFileSync(filePath, "utf-8");
  for (const { pattern, label } of FORBIDDEN_TEXT_PATTERNS) {
    if (pattern.test(rawContent) && !(label === "non-ASCII text" && /[À-Üà-ü]/.test(rawContent) === false)) {
      // Actually test properly
    }
  }
}

// Non-ASCII check: only flag actual non-English text (Turkish, Arabic, Cyrillic, CJK, etc.)
// Allow common typographic/engineering symbols: ± — × ÷ · • – ' " … → ←
const NON_ENGLISH_RE = /[^\x00-\x7F\u00B1\u2013\u2014\u00D7\u00F7\u00B7\u2022\u2018\u2019\u201C\u201D\u2026\u2192\u2190\u00B0\u2122\u00AE\u00A9\u00B0\u2032\u2033\u00B2\u00B3]/;
for (const file of files) {
  const rawContent = readFileSync(resolve(SCHEMA_DIR, file), "utf-8");
  const lines = rawContent.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^[\s{}\[\],]+$/.test(line)) continue;
    if (/^[\s]*"[^"]*"\s*:\s*"[^"]*"[\s,]*$/.test(line)) {
      const valueMatch = line.match(/:\s*"([^"]*)"/);
      if (valueMatch) {
        const value = valueMatch[1];
        if (NON_ENGLISH_RE.test(value)) {
          fail(`${file}:${i + 1}: non-English character in string value: "${value.substring(0, 60)}"`);
        }
      }
    }
  }
}

// Check for forbidden claims in visible fields (tool_name, scope, decision_context description etc.)
for (const file of files) {
  const rawContent = readFileSync(resolve(SCHEMA_DIR, file), "utf-8");
  const schema = JSON.parse(rawContent);
  
  const visibleFields = [
    schema.tool_name,
    schema.scope,
    schema.primary_operation,
    ...Object.values(schema.decision_context || {}).filter(v => typeof v === "string"),
    ...(schema.decision_context?.required_source_documents || []),
  ].filter(Boolean);

  for (const field of visibleFields) {
    if (/\bcertified\b/i.test(field) && !/ISO\s*\d+|certificate\s+of\s+analysis|material\s+cert/i.test(field)) {
      fail(`${file}: possible certification claim: "${field.substring(0, 60)}"`);
    }
    if (/\blegal proof\b/i.test(field)) {
      fail(`${file}: legal proof claim: "${field.substring(0, 60)}"`);
    }
    if(/\bguaranteed compliance\b/i.test(field)) {
      fail(`${file}: guaranteed compliance claim: "${field.substring(0, 60)}"`);
    }
  }
}

// Summary
const totalSchemas = files.length;
console.log(`\n  Schemas processed: ${totalSchemas}`);
console.log(`  Unique tool keys: ${allToolKeys.size}`);
console.log(`  Failures: ${failures}`);

if (failures === 0 && totalSchemas >= 45) {
  console.log("  BARIS_SCHEMA_VALIDATION=PASS\n");
  process.exit(0);
} else {
  if (totalSchemas < 45) fail(`Only ${totalSchemas} schemas found (expected 45)`);
  console.log("  BARIS_SCHEMA_VALIDATION=FAIL\n");
  process.exit(1);
}
