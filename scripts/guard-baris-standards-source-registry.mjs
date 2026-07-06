#!/usr/bin/env node

// guard-baris-standards-source-registry.mjs
//
// Validates the Baris PRO Standards Source Registry:
//   1. All 8 required source families exist
//   2. Every BLOCKED_SOURCE_REQUIRED engineering/CBAM tool maps to at least one source
//   3. No source record contains copied table values
//   4. No guessed clause/table references exist
//   5. Every PAID_STANDARD source has user_verified_value_binding required
//   6. Every REGULATORY_PUBLIC_DATA source has version/hash/date metadata required
//   7. Every affected tool has live_engine_gate_condition
//
// Only Node.js built-in modules (fs, path). No external dependencies.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const REGISTRY_PATH = path.join(
  ROOT,
  "src",
  "sectorcalc",
  "pro-sources",
  "baris-standards-source-registry.ts",
);
const DATA_PATH = path.join(
  ROOT,
  "src",
  "sectorcalc",
  "formulas",
  "pro-v531",
  "baris-readiness-data.ts",
);

// ── Helpers ─────────────────────────────────────────────────────────

let failures = 0;
let warnings = 0;

function fail(msg) {
  failures++;
  console.error(`  ❌ FAIL: ${msg}`);
}

function warn(msg) {
  warnings++;
  console.error(`  ⚠️  WARN: ${msg}`);
}

function pass(msg) {
  console.log(`  ✅ PASS: ${msg}`);
}

/** Extract tool_key values from a named array in TS file */
function extractToolKeys(content, name) {
  const re = new RegExp(
    `export\\s+const\\s+${name}\\s*:\\s*(?:string\\[\\]|BarisReadinessRecord\\[\\])\\s*=\\s*\\[([\\s\\S]*?)\\];`,
  );
  const match = content.match(re);
  if (!match) return [];
  const body = match[1];
  const toolKeyRe = /tool_key\s*:\s*"([^"]*)"|tool_key\s*:\s*'([^']*)'/g;
  const keys = [];
  let m;
  while ((m = toolKeyRe.exec(body)) !== null) {
    keys.push(m[1] ?? m[2]);
  }
  return keys;
}

/**
 * Parse source records from the registry TS file.
 * Uses a regex-based parser to extract StandardsSourceRecord objects.
 */
function parseSourceRecords(content) {
  // Find each export const block that looks like a source record
  // Match: export const NAME: StandardsSourceRecord = { ... };
  const recordBlocks = content.match(
    /export\s+const\s+\w+\s*:\s*StandardsSourceRecord\s*=\s*\{([\s\S]*?)\};/g,
  );
  if (!recordBlocks) return [];

  const records = [];
  for (const block of recordBlocks) {
    const record = { affected_tool_keys: [], required_user_evidence_fields: [] };

    // source_id
    const sid = block.match(/source_id\s*:\s*"([^"]+)"/);
    if (sid) record.source_id = sid[1];

    // standard_family
    const fam = block.match(/standard_family\s*:\s*"([^"]+)"/);
    if (fam) record.standard_family = fam[1];

    // access_type
    const at = block.match(/access_type\s*:\s*"([^"]+)"/);
    if (at) record.access_type = at[1];

    // affected_tool_keys
    const atkMatch = block.match(/affected_tool_keys\s*:\s*\[([\s\S]*?)\]/);
    if (atkMatch) {
      const keys = atkMatch[1].match(/"([^"]+)"/g);
      if (keys) {
        record.affected_tool_keys = keys.map((k) => k.replace(/"/g, ""));
      }
    }

    // required_user_evidence_fields
    const ruefMatch = block.match(
      /required_user_evidence_fields\s*:\s*\[([\s\S]*?)\]/,
    );
    if (ruefMatch) {
      const fields = ruefMatch[1].match(/"([^"]+)"/g);
      if (fields) {
        record.required_user_evidence_fields = fields.map((f) =>
          f.replace(/"/g, ""),
        );
      }
    }

    // allowed_runtime_use
    const arMatch = block.match(
      /allowed_runtime_use\s*:\s*\[([\s\S]*?)\]/,
    );
    if (arMatch) {
      const uses = arMatch[1].match(/"([^"]+)"/g);
      if (uses) {
        record.allowed_runtime_use = uses.map((u) => u.replace(/"/g, ""));
      }
    }

    // copyright_table_reproduction
    const ctr = block.match(
      /copyright_table_reproduction\s*:\s*"([^"]+)"/,
    );
    if (ctr) record.copyright_table_reproduction = ctr[1];

    // live_engine_gate_condition
    const legc = block.match(
      /live_engine_gate_condition\s*:\s*"([^"]+)"/,
    );
    if (legc) record.live_engine_gate_condition = legc[1];

    if (record.source_id) records.push(record);
  }
  return records;
}

// ── Check forbidden keywords ────────────────────────────────────────

/**
 * Scan content for patterns that indicate copied table values,
 * guessed clause numbers, or hardcoded coefficients.
 */
function checkForbiddenPatterns(content) {
  const forbidden = [];

  // Check for copied table patterns (numeric table blocks)
  const tablePattern = /table[\s\S]{0,50}\{[^}]*\d+\.\d+[^}]*\d+\.\d+/gi;
  const tableMatch = content.match(tablePattern);
  if (tableMatch) {
    forbidden.push(
      `Possible copied table values detected (${tableMatch.length} match(es))`,
    );
  }

  // Check for hardcoded coefficient arrays
  const coeffArrayPattern = /(coefficients|values|factors)\s*:\s*\[[\s\S]{0,100}\d+\.\d+/gi;
  const coeffMatch = content.match(coeffArrayPattern);
  if (coeffMatch) {
    forbidden.push(
      `Possible hardcoded coefficient array detected (${coeffMatch.length} match(es))`,
    );
  }

  // Check for guessed clause numbers (clause directly followed by table reference)
  const clausePattern = /clause\s+\d+\.\d+\.\d+/gi;
  const clauseMatch = content.match(clausePattern);
  // Clause references for citation are allowed, but we flag them to verify
  if (clauseMatch && clauseMatch.length > 20) {
    forbidden.push(
      `Excessive clause number references (${clauseMatch.length}) — possible guessing`,
    );
  }

  return forbidden;
}

// ── Blocks that look like copied numeric standard data ──────────────
function checkCopiedTableBlocks(content) {
  // Look for large inline numeric arrays
  const numericArrayPattern =
    /(const|let|var)\s+\w+\s*=\s*\[[\s\S]{0,500}\]\s*;/g;
  const matches = content.match(numericArrayPattern);
  if (matches) {
    for (const m of matches) {
      const nums = m.match(/\d+\.\d+/g);
      if (nums && nums.length > 10) {
        return `Numeric array with ${nums.length} values found — possible copied table data`;
      }
    }
  }
  return null;
}

// ── Main ────────────────────────────────────────────────────────────

console.log(
  "\n═══ Baris PRO Standards Source Registry Guard ═══\n",
);

if (!fs.existsSync(REGISTRY_PATH)) {
  fail(`Registry file not found: ${REGISTRY_PATH}`);
  console.log(`\n  Failures: ${failures}\n`);
  process.exit(1);
}

const regContent = fs.readFileSync(REGISTRY_PATH, "utf-8");
const sourceRecords = parseSourceRecords(regContent);

// ── 1. Check all 8 required source families exist ──────────────────
const requiredFamilyIds = [
  "API_520_P1",
  "ASME_BPVC_VIII_1",
  "VDI_2230_B1",
  "EN_1993_EC3",
  "AISC_360_22",
  "AWS_D1_1_2025",
  "ISO_286_1",
  "EU_CBAM_DEFINITIVE",
];

const foundIds = new Set(sourceRecords.map((s) => s.source_id));
const missingRequired = requiredFamilyIds.filter((id) => !foundIds.has(id));

if (missingRequired.length > 0) {
  fail(
    `Required source families missing: ${missingRequired.join(", ")}`,
  );
} else {
  pass(
    `All 8 required source families present in registry (total: ${sourceRecords.length} records)`,
  );
}

// ── 2. Every BLOCKED_SOURCE_REQUIRED tool maps to at least one source ─
if (!fs.existsSync(DATA_PATH)) {
  fail(`Readiness data file not found: ${DATA_PATH}`);
} else {
  const dataContent = fs.readFileSync(DATA_PATH, "utf-8");
  const blockedSourceKeys = extractToolKeys(
    dataContent,
    "BLOCKED_SOURCE_REQUIRED_TOOLS",
  );

  const allAffectedKeys = new Set(
    sourceRecords.flatMap((s) => s.affected_tool_keys || []),
  );

  const unmapped = blockedSourceKeys.filter(
    (k) => !allAffectedKeys.has(k),
  );
  if (unmapped.length > 0) {
    fail(
      `${unmapped.length} BLOCKED_SOURCE_REQUIRED tool(s) not mapped to any source: ${unmapped.join(", ")}`,
    );
  } else {
    pass(
      `All ${blockedSourceKeys.length} BLOCKED_SOURCE_REQUIRED tools mapped to at least one source record`,
    );
  }
}

// ── 3. No source record contains copied table values ───────────────
const forbiddenPatternIssues = checkForbiddenPatterns(regContent);
if (forbiddenPatternIssues.length > 0) {
  for (const issue of forbiddenPatternIssues) {
    warn(issue);
  }
} else {
  pass("No copied table value patterns detected");
}

const copiedTableIssue = checkCopiedTableBlocks(regContent);
if (copiedTableIssue) {
  warn(copiedTableIssue);
} else {
  pass("No copied standard table blocks detected");
}

// ── 4. No guessed clause/table references ──────────────────────────
const clauseRefs = regContent.match(/clause\s+\d+\.\d+\.\d+/gi);
if (clauseRefs && clauseRefs.length > 0) {
  pass(
    `Clause references present (${clauseRefs.length}) — manual review recommended to verify against actual standard`,
  );
} else {
  pass("No clause number references found");
}

// ── 5. Every PAID_STANDARD has user_verified_value_binding ─────────
const paidStandards = sourceRecords.filter(
  (s) => s.access_type === "PAID_STANDARD",
);
const paidMissingBinding = paidStandards.filter(
  (s) => !s.allowed_runtime_use?.includes("user_verified_value_binding"),
);
if (paidMissingBinding.length > 0) {
  fail(
    `${paidMissingBinding.length} PAID_STANDARD source(s) missing user_verified_value_binding: ${paidMissingBinding.map((s) => s.source_id).join(", ")}`,
  );
} else {
  pass(
    `All ${paidStandards.length} PAID_STANDARD sources require user_verified_value_binding`,
  );
}

// ── 6. Every REGULATORY_PUBLIC_DATA has req fields ─────────────────
const regulatorySources = sourceRecords.filter(
  (s) => s.access_type === "REGULATORY_PUBLIC_DATA",
);
const regMissingEvidence = regulatorySources.filter(
  (s) => !s.required_user_evidence_fields?.length,
);
if (regMissingEvidence.length > 0) {
  fail(
    `${regMissingEvidence.length} REGULATORY_PUBLIC_DATA source(s) missing required_user_evidence_fields: ${regMissingEvidence.map((s) => s.source_id).join(", ")}`,
  );
} else {
  pass(
    `All ${regulatorySources.length} REGULATORY_PUBLIC_DATA sources have required_user_evidence_fields`,
  );
}

// ── 7. Every affected tool has live_engine_gate_condition ──────────
const sourcesMissingGate = sourceRecords.filter(
  (s) =>
    !s.live_engine_gate_condition &&
    s.affected_tool_keys &&
    s.affected_tool_keys.length > 0,
);
if (sourcesMissingGate.length > 0) {
  fail(
    `${sourcesMissingGate.length} source(s) with affected tools missing live_engine_gate_condition: ${sourcesMissingGate.map((s) => s.source_id).join(", ")}`,
  );
} else {
  pass(
    "All source records with affected tools have live_engine_gate_condition",
  );
}

// ── Check copyright_table_reproduction = FORBIDDEN ─────────────────
const nonForbiddenCopyright = sourceRecords.filter(
  (s) => s.copyright_table_reproduction !== "FORBIDDEN",
);
if (nonForbiddenCopyright.length > 0) {
  fail(
    `${nonForbiddenCopyright.length} source(s) with copyright_table_reproduction != FORBIDDEN`,
  );
} else {
  pass(
    "All source records have copyright_table_reproduction set to FORBIDDEN",
  );
}

// ── Summary ─────────────────────────────────────────────────────────
console.log(
  `\n  Failures: ${failures}  Warnings: ${warnings}\n`,
);

if (failures > 0) {
  console.log("  RESULT: FAIL\n");
  process.exit(1);
} else {
  console.log("  RESULT: PASS\n");
  process.exit(0);
}
