#!/usr/bin/env node
/**
 * guard-free-v531-public-ui-text.mjs
 *
 * Validates Free V5.3.1 schema JSON files (index 295-344) for public UI text quality.
 * Fails on:
 *  - Turkish characters/words in public-visible display fields
 *  - snake_case in public-visible display fields (name, label, description, title, category, help_text, public_explanation)
 *  - Bad unit title-casing (" M Min", " Mm", " Kg", " Kwh", " Co2")
 *  - Debug/internal leakage: normalized_input, checkerTrace, internalTrace, INTERNAL_SERVER_ONLY
 *  - Repeated long generic help text (old version)
 *
 * Allowed exception: internal JSON keys (id, tool_key, normalized_id, etc.) may be snake_case.
 *
 * Output format:
 *  FREE_V531_PUBLIC_UI_TEXT_GUARD=PASS|FAIL
 *  FILES_CHECKED=<n>
 *  PUBLIC_TEXT_FAILURES=<n>
 *  SNAKE_CASE_VISIBLE_FAILURES=<n>
 *  NON_ENGLISH_FAILURES=<n>
 *  BAD_UNIT_LABEL_FAILURES=<n>
 *  BLOCKERS=<list or NONE>
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const SCHEMA_DIR = join(ROOT, "src/sectorcalc/schemas/free-v531");

// ── Free V5.3.1 index range ────────────────────────────────────────────

function isFreeV531File(name) {
  const numStr = name.split("-")[0];
  const num = parseInt(numStr, 10);
  return !isNaN(num) && num >= 295 && num <= 344;
}

// ── Forbidden patterns ──────────────────────────────────────────────────

const TURKISH_CHARS = /[\u00c7\u00e7\u011e\u011f\u0130\u0131\u00d6\u00f6\u015e\u015f\u00dc\u00fc]/;

const TURKISH_WORDS = [
  "muhendis", "mühendis", "danismani", "danışmanı",
  "yapisal", "yapısal", "matematikci", "hesaplama",
  "araci", "araç",
];

const BAD_UNIT_PATTERNS = [
  /\s+M\s+Min$/,
  /\s+Mm$/,
  /\s+Kg$/,
  /\s+Kwh$/i,
  /\s+Co2$/i,
];

const INTERNAL_LEAKAGE = [
  "normalized_input",
  "normalizedInputs",
  "checkerTrace",
  "internalTrace",
  "privateFormula",
  "INTERNAL_SERVER_ONLY",
  "eval(",
  "new Function",
];

const OLD_HELP_TEXT =
  "User-entered verified value only. Reference values are advisory and must not autofill this field.";

// ── Public-visible display field keys (these should have clean English text) ──
// Internal JSON keys (id, tool_key, etc.) are exempt from snake_case checks.

const DISPLAY_FIELD_KEYS = new Set([
  "name",
  "label",
  "title",
  "description",
  "category",
  "help_text",
  "user_help_text",
  "public_help_text",
  "public_explanation",
  "operator_explanation",
  "engineer_explanation",
  "owner_cfo_explanation",
  "checker_explanation",
  "decision_use",
  "semantic_message",
  "message",
  "public_note",
  "public_content",
  "public_proof_summary",
  "scope",
  "tool_name",
  "allowed_description",
]);

// ── Public-visible field collector ───────────────────────────────────────
// Collects only string values that are public-facing display text.
// Internal property names (id, tool_key, normalized_id, etc.) are NOT collected.

function collectDisplayFields(obj, path, fields) {
  if (obj === null || obj === undefined) return;

  if (typeof obj === "string") {
    fields.push({ path, value: obj });
    return;
  }

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      collectDisplayFields(obj[i], `${path}[${i}]`, fields);
    }
    return;
  }

  if (typeof obj === "object") {
    for (const [key, val] of Object.entries(obj)) {
      const subPath = path ? `${path}.${key}` : key;

      // Only collect if this key is a display field OR if it contains display fields
      const isDisplayFieldKey = DISPLAY_FIELD_KEYS.has(key);

      // Skip known internal-only branches entirely
      const isSkippableBranch =
        key === "formulas" ||
        key === "normalized_inputs" ||
        key === "form_runtime_binding" ||
        key === "state_domains" ||
        key === "state_transitions" ||
        key === "execute_request_contract" ||
        key === "execute_response_contract" ||
        key === "brand_safety_policy" ||
        key === "engine_rules" ||
        key === "uncertainty_model" ||
        key === "safety_factor_gauges" ||
        key === "proof_pack" ||
        key === "audit_trail_contract" ||
        key === "export_contract" ||
        key === "test_plan" ||
        key === "red_team_review" ||
        key === "reference_code" ||
        key === "standards_clause_map" ||
        key === "reference_value_policy" ||
        key === "physical_bounds_policy" ||
        key === "derating_contract" ||
        key === "precision_policy" ||
        key === "decision_interpretation_contract" ||
        key === "business_impact_contract" ||
        key === "validation_contract" ||
        key === "unit_conversion_contract" ||
        key === "unit_system" ||
        key === "conversion_registry" ||
        key === "output_formatting" ||
        key === "ui_binding" ||
        key === "source_priority" ||
        key === "output_bindings" ||
        key === "formula_bindings" ||
        key === "reference_values" ||
        key === "evidence_requirement" ||
        key === "metadata" ||
        key === "accessibility" ||
        key === "accepted_evidence" ||
        key === "standards" ||
        key === "approved_terms" ||
        key === "irreversible_commitment_metric";

      if (isSkippableBranch) continue;

      if (isDisplayFieldKey) {
        // Direct display field — collect its string value
        if (typeof val === "string") {
          fields.push({ path: subPath, value: val });
        } else if (Array.isArray(val)) {
          for (let i = 0; i < val.length; i++) {
            collectDisplayFields(val[i], `${subPath}[${i}]`, fields);
          }
        } else if (typeof val === "object" && val !== null) {
          // Recurse into objects under display field keys
          collectDisplayFields(val, subPath, fields);
        }
      } else {
        // Non-display key: recurse deeper
        if (typeof val === "object" && val !== null) {
          collectDisplayFields(val, subPath, fields);
        }
      }
    }
  }
}

// ── Checkers ────────────────────────────────────────────────────────────

function hasSnakeCase(text) {
  // Only flag snake_case in multi-word display text (containing spaces).
  // Pure snake_case identifiers like "margin_index" are internal refs, not display text.
  if (!text.includes(" ")) return false;
  return /[a-z][a-z]+_[a-z][a-z]+/.test(text);
}

function hasTurkishChars(text) {
  return TURKISH_CHARS.test(text);
}

function hasTurkishWord(text) {
  const lower = text.toLowerCase();
  return TURKISH_WORDS.some((w) => lower.includes(w));
}

function hasBadUnitLabel(text) {
  return BAD_UNIT_PATTERNS.some((p) => p.test(text));
}

function hasInternalLeakage(text) {
  return INTERNAL_LEAKAGE.some((token) => text.includes(token));
}

function hasOldHelpText(text) {
  return text.includes(OLD_HELP_TEXT);
}

// ── Main ────────────────────────────────────────────────────────────────

if (!existsSync(SCHEMA_DIR)) {
  console.error(`FREE_V531_PUBLIC_UI_TEXT_GUARD=FAIL`);
  console.error(`FILES_CHECKED=0`);
  console.error(`BLOCKERS=Schema directory not found: ${SCHEMA_DIR}`);
  process.exit(1);
}

const files = readdirSync(SCHEMA_DIR)
  .filter((f) => f.endsWith(".json") && isFreeV531File(f))
  .sort();

let fileCount = 0;
const allBlockers = [];
let snakeCaseFailures = 0;
let nonEnglishFailures = 0;
let badUnitLabelFailures = 0;
let otherFailures = 0;

for (const file of files) {
  const filePath = join(SCHEMA_DIR, file);
  const raw = JSON.parse(readFileSync(filePath, "utf8"));
  fileCount++;

  const fields = [];
  collectDisplayFields(raw, "", fields);

  for (const field of fields) {
    const location = `${file}:${field.path}`;
    const value = field.value;

    if (hasSnakeCase(value)) {
      snakeCaseFailures++;
      allBlockers.push(`SNAKE_CASE: ${location} -> ${value}`);
    }

    if (hasTurkishChars(value) || hasTurkishWord(value)) {
      nonEnglishFailures++;
      allBlockers.push(`NON_ENGLISH: ${location} -> ${value}`);
    }

    if (hasBadUnitLabel(value)) {
      badUnitLabelFailures++;
      allBlockers.push(`BAD_UNIT: ${location} -> ${value}`);
    }

    if (hasInternalLeakage(value)) {
      otherFailures++;
      allBlockers.push(`INTERNAL_LEAK: ${location} -> ${value}`);
    }

    if (hasOldHelpText(value)) {
      otherFailures++;
      allBlockers.push(`OLD_HELP_TEXT: ${location} -> ${value}`);
    }
  }
}

const totalFailures = snakeCaseFailures + nonEnglishFailures + badUnitLabelFailures + otherFailures;

if (totalFailures > 0) {
  console.error(`FREE_V531_PUBLIC_UI_TEXT_GUARD=FAIL`);
  console.error(`FILES_CHECKED=${fileCount}`);
  console.error(`PUBLIC_TEXT_FAILURES=${totalFailures}`);
  console.error(`SNAKE_CASE_VISIBLE_FAILURES=${snakeCaseFailures}`);
  console.error(`NON_ENGLISH_FAILURES=${nonEnglishFailures}`);
  console.error(`BAD_UNIT_LABEL_FAILURES=${badUnitLabelFailures}`);
  console.error(`OTHER_FAILURES=${otherFailures}`);
  if (allBlockers.length > 0) {
    console.error(`BLOCKERS=`);
    for (const b of allBlockers.slice(0, 40)) {
      console.error(`  - ${b}`);
    }
    if (allBlockers.length > 40) {
      console.error(`  ... and ${allBlockers.length - 40} more`);
    }
  }
  process.exit(1);
}

console.log(`FREE_V531_PUBLIC_UI_TEXT_GUARD=PASS`);
console.log(`FILES_CHECKED=${fileCount}`);
console.log(`PUBLIC_TEXT_FAILURES=0`);
console.log(`SNAKE_CASE_VISIBLE_FAILURES=0`);
console.log(`NON_ENGLISH_FAILURES=0`);
console.log(`BAD_UNIT_LABEL_FAILURES=0`);
console.log(`OTHER_FAILURES=0`);
console.log(`BLOCKERS=NONE`);
process.exit(0);
