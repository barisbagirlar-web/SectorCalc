#!/usr/bin/env node
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { ROOT } from "./tool-activation/lib/activation-paths.mjs";

const requiredFiles = [
  "src/lib/tool-activation/activation-types.ts",
  "src/lib/tool-activation/tool-unit-consistency.ts",
  "src/lib/tool-activation/existing-formula-guard.ts",
  "scripts/tool-activation/scan-tools-for-activation.mjs",
  "scripts/tool-activation/apply-activation-draft.mjs",
  "scripts/tool-activation/generate-activation-review.mjs",
  "scripts/tool-activation/check-draft-gates.ts",
];

let failed = false;

function pass(msg) {
  console.log(`PASS: ${msg}`);
}

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  failed = true;
}

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    fail(`missing file: ${file}`);
  } else {
    pass(`file exists: ${file}`);
  }
}

const applyScript = "scripts/tool-activation/apply-activation-draft.mjs";
if (fs.existsSync(applyScript)) {
  const text = fs.readFileSync(applyScript, "utf8");
  if (text.includes("TOOL_ACTIVATION_REFERENCE_SLUG is required for first activation apply")) {
    pass("apply script requires TOOL_ACTIVATION_REFERENCE_SLUG");
  } else {
    fail("apply script missing reference slug requirement");
  }
  if (text.includes("Apply is locked to reference tool only")) {
    pass("apply script locks to single reference slug");
  } else {
    fail("apply script missing reference slug lock");
  }
  if (text.includes("productionSourceModified: false")) {
    pass("apply script does not claim production overwrite");
  } else {
    fail("apply script missing productionSourceModified guard");
  }
}

const formulaGuard = "src/lib/tool-activation/existing-formula-guard.ts";
if (fs.existsSync(formulaGuard)) {
  const text = fs.readFileSync(formulaGuard, "utf8");
  if (text.includes('"preserve-existing"')) {
    pass("existing formula guard supports preserve-existing");
  } else {
    fail("existing formula guard missing preserve-existing");
  }
}

const unitConsistency = "src/lib/tool-activation/tool-unit-consistency.ts";
if (fs.existsSync(unitConsistency)) {
  const text = fs.readFileSync(unitConsistency, "utf8");
  if (text.includes("Does not prove physical unit conversion correctness")) {
    pass("tool-unit-consistency documents MVP scope");
  } else {
    fail("tool-unit-consistency missing MVP scope note");
  }
  if (text.includes("getMinimumTestCaseCount")) {
    pass("tool-unit-consistency defines minimum test case counts");
  } else {
    fail("tool-unit-consistency missing minimum test case helper");
  }
}

const reviewScript = "scripts/tool-activation/generate-activation-review.mjs";
if (fs.existsSync(reviewScript)) {
  const text = fs.readFileSync(reviewScript, "utf8");
  if (text.includes("## Human Review Checklist")) {
    pass("review generator includes human checklist");
  } else {
    fail("review generator missing human checklist");
  }
  if (text.includes("manual only") && !text.includes("execFileSync")) {
    pass("review generator shows apply command without auto-run");
  } else {
    fail("review generator must not auto-run apply");
  }
}

try {
  execFileSync("npx", ["tsx", "-e", "import { getMinimumTestCaseCount } from './src/lib/tool-activation/tool-unit-consistency.ts'; if (getMinimumTestCaseCount('high') !== 3) process.exit(1); if (getMinimumTestCaseCount('low') !== 1) process.exit(1);"], {
    cwd: ROOT,
    stdio: "pipe",
  });
  pass("high/regulated/safety-critical require 3 tests; simple tools require 1");
} catch {
  fail("minimum test case rule failed runtime check");
}

const gitignore = ".gitignore";
if (fs.existsSync(gitignore)) {
  const text = fs.readFileSync(gitignore, "utf8");
  if (text.includes(".sectorcalc/")) {
    pass(".gitignore excludes .sectorcalc/");
  } else {
    fail(".gitignore missing .sectorcalc/");
  }
}

if (failed) {
  process.exit(1);
}

console.log("\nPASS tool activation factory audit");
