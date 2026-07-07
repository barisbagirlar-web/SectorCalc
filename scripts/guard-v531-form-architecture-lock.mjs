#!/usr/bin/env node

import { readFileSync, existsSync } from "node:fs";
import { join, extname } from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();

const REQUIRED = [
  "src/sectorcalc/pro-form/UniversalIndustrialDecisionForm.tsx",
  "src/sectorcalc/pro-form/useUniversalIndustrialDecisionFormMachine.ts",
  "src/sectorcalc/pro-form/form-state-machine.ts",
  "src/sectorcalc/pro-form/contract-types.ts",
  "src/sectorcalc/pro-form/universal-industrial-decision-form.css",
];

const FORBIDDEN = [
  "PremiumSchemaToolForm",
  "FreeToolForm",
  "ProToolForm",
  "LegacyCalculatorForm",
  "dynamic-form-v2",
  "FreeToolPremiumCalculator",
  "FreeToolPage",
  "calculateFreeToolResult(",
  "areFreeToolInputsValid(",
  "runFreeFullLoopCalculation(",
  "free-tool-form.css",
  "free-tool-premium.css",
  "sc-universal-dtf-shell",
  "sc-premium-dtf-container",
  "onClick={() => {}}",
];

const CLIENT_FORBIDDEN = [
  "formula-registry",
  "formulaRegistry",
  "private formula registry",
  "checker-trace",
  "eval(",
  "new Function(",
];

const CSS_FORBIDDEN = [
  ".free-tool-form",
  ".sc-premium",
  ".sc-universal-dtf-shell",
  ".sc-premium-dtf-container",
  ".pro-form",
];

const SCAN_ROOTS = ["src", "app", "generated", "data"];
const SCAN_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".css", ".json"]);

// Utility/library paths that may contain legacy calculation functions
// (not form components — these are excluded from form-architecture checks)
const UTILITY_PATH_PREFIXES = [
  "src/lib/",
  "src/components/admin/",
  "src/sectorcalc/pro-form/__tests__/",
  "src/sectorcalc/runtime/__tests__/",
  "src/sectorcalc/pro-form/__tests__/superv4",
  "src/lib/features/reports/__tests__/",
];

const failures = [];

function trackedFiles() {
  const out = execFileSync("git", ["ls-files"], {
    cwd: ROOT,
    encoding: "utf8",
  }).trim();

  return out ? out.split("\n").filter(Boolean) : [];
}

function shouldScan(file) {
  if (!SCAN_ROOTS.some((root) => file === root || file.startsWith(`${root}/`))) return false;
  if (file.includes(".next/")) return false;
  if (file.includes("node_modules/")) return false;
  return SCAN_EXT.has(extname(file));
}

function read(file) {
  return readFileSync(join(ROOT, file), "utf8");
}

function exists(file) {
  return existsSync(join(ROOT, file));
}

function isClient(text) {
  return /^\s*["']use client["'];/m.test(text);
}

for (const file of REQUIRED) {
  if (!exists(file)) {
    failures.push(`${file}: required canonical form file missing`);
  }
}

if (exists("src/sectorcalc/pro-form/UniversalIndustrialDecisionForm.tsx")) {
  const text = read("src/sectorcalc/pro-form/UniversalIndustrialDecisionForm.tsx");

  for (const token of [
    "useUniversalIndustrialDecisionFormMachine",
    "machine.submitServerExecution",
    "machine.runClientPrecheck",
    "machine.resetInputs",
    "state.serverResponseState.response",
  ]) {
    if (!text.includes(token)) {
      failures.push(`UniversalIndustrialDecisionForm.tsx: missing required machine token: ${token}`);
    }
  }
}

if (exists("src/sectorcalc/pro-form/universal-industrial-decision-form.css")) {
  const css = read("src/sectorcalc/pro-form/universal-industrial-decision-form.css");

  for (const token of [".sc-v531-shell", "#F0EEE6", "#FAF9F5", "#1A1915", "#BD5D3A", "375px"]) {
    if (!css.includes(token)) {
      failures.push(`universal-industrial-decision-form.css: missing locked CSS token: ${token}`);
    }
  }

  for (const token of CSS_FORBIDDEN) {
    if (css.includes(token)) {
      failures.push(`universal-industrial-decision-form.css: forbidden legacy selector: ${token}`);
    }
  }

  if (css.includes(":root")) {
    failures.push("universal-industrial-decision-form.css: :root is forbidden");
  }

  if (/prefers-color-scheme\s*:\s*dark/i.test(css)) {
    failures.push("universal-industrial-decision-form.css: dark mode override forbidden");
  }

  const radiusPattern = /border-radius\s*:\s*([^;]+);/g;
  let radiusMatch;
  while ((radiusMatch = radiusPattern.exec(css)) !== null) {
    const value = radiusMatch[1].trim();
    if (!/^(0|0px|0rem|0em)$/.test(value)) {
      failures.push(`universal-industrial-decision-form.css: non-zero border-radius forbidden: ${radiusMatch[0]}`);
    }
  }
}

for (const file of trackedFiles().filter(shouldScan)) {
  if (!exists(file)) continue; // skip deleted files
  const text = read(file);
  const isGuardScript = file === "scripts/guard-v531-form-architecture-lock.mjs";

  if (isGuardScript) continue;

  // Skip utility/library paths: they may contain legacy calc functions
  // but are not form components. Route/form files must not use legacy tokens.
  const isUtilityPath = UTILITY_PATH_PREFIXES.some((prefix) => file.startsWith(prefix));
  if (isUtilityPath) continue;

  for (const token of FORBIDDEN) {
    if (text.includes(token)) {
      failures.push(`${file}: forbidden legacy form token: ${token}`);
    }
  }

  if (isClient(text)) {
    const nonImportLines = text.split("\n").filter((line) => !line.trimStart().startsWith("import "));
    const nonImportText = nonImportLines.join("\n");
    for (const token of CLIENT_FORBIDDEN) {
      if (nonImportText.includes(token)) {
        failures.push(`${file}: forbidden client formula/internal token: ${token}`);
      }
    }
  }

  const isToolSlugRoute =
    (file.includes("/tools/generated/[slug]/") || file.includes("/tools/pro/[slug]/")) &&
    !file.includes("/print/");

  if (isToolSlugRoute && file.endsWith(".tsx")) {
    // Skip Next.js framework files — loading, error, layout don't render the form
    const basename = file.split("/").pop() || "";
    if (["loading.tsx", "error.tsx", "layout.tsx", "not-found.tsx"].includes(basename)) {
      // skip — no form component needed
    } else {
      const usesCanonical =
        text.includes("UniversalIndustrialDecisionForm") ||
        text.includes("ProToolSessionWrapper");

      if (!usesCanonical) {
        failures.push(`${file}: tool route must use UniversalIndustrialDecisionForm or ProToolSessionWrapper`);
      }
    }
  }
}

if (failures.length > 0) {
  console.error("V531_FORM_ARCHITECTURE_LOCK=FAIL");
  console.error(`failure_count=${failures.length}`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("V531_FORM_ARCHITECTURE_LOCK=PASS");
console.log("canonical_renderer=UniversalIndustrialDecisionForm");
console.log("legacy_forms=ABSENT");
console.log("client_formula_execution=ABSENT");
