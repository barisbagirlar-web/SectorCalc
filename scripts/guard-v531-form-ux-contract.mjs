#!/usr/bin/env node
// SectorCalc V5.3.1 Form UX Contract Guard
// Checks source code for forbidden UX anti-patterns in the form renderer.
// Source-level check only; live DOM smoke must be run separately.

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const SCAN_FILES = [
  "src/sectorcalc/pro-form/UniversalIndustrialDecisionForm.tsx",
  "src/sectorcalc/pro-form/form-render-helpers.ts",
  "src/sectorcalc/pro-form/universal-industrial-decision-form.css",
];

// Forbidden patterns — these must never appear in source
// IMPORTANT: "Result cards" as a section TITLE is fine post-execution.
// The forbidden patterns are the PLACEHOLDER/EMPTY STATE strings that were
// previously rendered unconditionally before server response.
const FORBIDDEN_PATTERNS = [
  {
    pattern: />\s*Not specified\s*</,
    description: "\"Not specified\" rendered as visible default context tile value",
    note: "ContextItem must return null when value is empty",
  },
  {
    pattern: /[`"']No reference values[`"']/,
    description: "\"No reference values\" as a large default card string",
    note: "Use compact muted reference line instead",
  },
  {
    pattern: /Base preview.*Pending/,
    description: "\"Base preview: Pending\" — null base value shown as Pending",
    note: "safeBasePreview() must return \"—\" for null values",
  },
  {
    pattern: /Pending\s+min\b/,
    description: "\"Pending min\" — raw unit placeholder in base preview",
    note: "formatSafeValue() must never return \"Pending\"",
  },
  {
    pattern: /Pending\s+%/,
    description: "\"Pending %\" — raw percentage placeholder in base preview",
    note: "formatSafeValue() must never return \"Pending\"",
  },
  {
    pattern: /[`"']categories\.[a-z]/,
    description: "\"categories.\" prefix as a string literal in source",
    note: "Never render raw category key strings",
  },
  {
    pattern: /[`"']Daily Renovation[`"']/,
    description: "\"Daily Renovation\" hardcoded wrong category display value",
    note: "safeDisplayCategory() must reject this value",
  },
  {
    // Only forbidden if it appears as the SECTION aria-label before execution
    // The guard checks for the old placeholder text that rendered before server response
    pattern: /aria-label="Result cards"/,
    description: "aria-label=\"Result cards\" — old section label from unconditional pre-execution render",
    note: "Results section must be conditionally rendered and use aria-label=\"Server results\"",
  },
  {
    pattern: /aria-label="Hidden risk panel"/,
    description: "aria-label=\"Hidden risk panel\" — old section label from unconditional pre-execution render",
    note: "Hidden risk section must be conditionally rendered",
  },
  {
    pattern: /aria-label="Business impact panel"/,
    description: "aria-label=\"Business impact panel\" — old section label from unconditional pre-execution render",
    note: "Business impact section must be conditionally rendered",
  },
  {
    pattern: /aria-label="FMEA panel"/,
    description: "aria-label=\"FMEA panel\" — old section label from unconditional pre-execution render",
    note: "FMEA section must be conditionally rendered",
  },
  {
    pattern: /Audit seal appears after deterministic server execution/,
    description: "Audit seal placeholder text shown before server response",
    note: "Audit seal panel must be conditionally rendered (shouldShowAuditSealPanel)",
  },
  {
    pattern: /Exports unlock after a public-safe redacted server response/,
    description: "Export panel placeholder text shown before server response",
    note: "Export panel must be conditionally rendered (shouldShowExportPanel)",
  },
  {
    // formatValue returning "Pending" for null — the old implementation
    pattern: /return\s+"Pending"/,
    description: "return \"Pending\" — formatValue() must not return Pending for null values",
    note: "formatSafeValue() must return \"—\" for null/undefined",
  },
  {
    // ContextItem fallback to "Not specified"
    pattern: /\|\|\s*"Not specified"/,
    description: "|| \"Not specified\" — ContextItem fallback must not render this text",
    note: "ContextItem must return null when value is empty",
  },
];

function readFile(relPath) {
  const full = path.join(ROOT, relPath);
  if (!fs.existsSync(full)) return null;
  return fs.readFileSync(full, "utf8");
}

const failures = [];
const fileResults = [];

for (const relPath of SCAN_FILES) {
  const content = readFile(relPath);
  if (content === null) {
    failures.push(`FILE MISSING: ${relPath}`);
    continue;
  }

  const fileFailures = [];
  // Check line by line, skipping pure comment lines (// ... or * ...)
  const lines = content.split("\n");
  for (const { pattern, description, note } of FORBIDDEN_PATTERNS) {
    // Find matching lines, excluding those that are pure comments
    const matchingLines = lines.filter((line) => {
      const trimmed = line.trim();
      // Skip pure single-line comment lines
      if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) return false;
      return pattern.test(line);
    });
    if (matchingLines.length > 0) {
      const matchText = matchingLines[0].trim().slice(0, 120).replace(/\n/g, " ");
      fileFailures.push({
        pattern: pattern.toString(),
        description,
        note,
        matchText,
      });
    }
  }

  fileResults.push({ file: relPath, failures: fileFailures });
  for (const f of fileFailures) {
    failures.push(`${relPath}: ${f.description}\n  Match: ${f.matchText}\n  Fix: ${f.note}`);
  }
}

// Additional check: verify key helper functions are present in form-render-helpers.ts
const helpersContent = readFile("src/sectorcalc/pro-form/form-render-helpers.ts");
if (helpersContent) {
  const REQUIRED_HELPERS = [
    "hasServerResponse",
    "hasDisplayableOutputs",
    "shouldShowResultPanel",
    "shouldShowHiddenRiskPanel",
    "shouldShowBusinessImpactPanel",
    "shouldShowFmeaPanel",
    "shouldShowAuditSealPanel",
    "shouldShowExportPanel",
    "safeBasePreview",
    "safeReferenceLabel",
    "safeDisplayCategory",
    "hasClientBlockers",
    "getPrimaryCtaLabel",
  ];
  for (const fn of REQUIRED_HELPERS) {
    if (!helpersContent.includes(`export function ${fn}`)) {
      failures.push(`form-render-helpers.ts: Missing required export: ${fn}`);
    }
  }
}

// Additional check: verify form uses hasServerResponse (not direct response !== null for panel gating)
const formContent = readFile("src/sectorcalc/pro-form/UniversalIndustrialDecisionForm.tsx");
if (formContent) {
  if (!formContent.includes("hasServerResponse")) {
    failures.push("UniversalIndustrialDecisionForm.tsx: Missing use of hasServerResponse from form-render-helpers");
  }
  if (!formContent.includes("shouldShowResultPanel")) {
    failures.push("UniversalIndustrialDecisionForm.tsx: Missing use of shouldShowResultPanel from form-render-helpers");
  }
  if (!formContent.includes("getPrimaryCtaLabel")) {
    failures.push("UniversalIndustrialDecisionForm.tsx: Missing use of getPrimaryCtaLabel from form-render-helpers");
  }
  if (!formContent.includes("safeBasePreview")) {
    failures.push("UniversalIndustrialDecisionForm.tsx: Missing use of safeBasePreview from form-render-helpers");
  }
  if (!formContent.includes("safeDisplayCategory")) {
    failures.push("UniversalIndustrialDecisionForm.tsx: Missing use of safeDisplayCategory from form-render-helpers");
  }
}

// Report
if (failures.length > 0) {
  console.error("V531_FORM_UX_CONTRACT_GUARD=FAIL");
  console.error(`\nFound ${failures.length} violation(s):\n`);
  for (const f of failures) {
    console.error(`FAIL: ${f}\n`);
  }
  process.exit(1);
}

console.log("V531_FORM_UX_CONTRACT_GUARD=PASS");
console.log(`Scanned ${SCAN_FILES.length} files — no forbidden UX patterns found.`);
console.log("NOTE: Run live DOM smoke for full acceptance:");
console.log("  BASE_URL=https://www.sectorcalc.com node scripts/smoke-page-runtime.mjs");
