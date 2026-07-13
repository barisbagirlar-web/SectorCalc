// SectorCalc — Math Kernel Schema Guard
// Verifies that bounded result types contain all required fields
// (lower_bound, upper_bound, ulp_error_margin)
// at build time using static analysis.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

let exitCode = 0;

function fail(msg) {
  console.error(`[FAIL] math-kernel-schema: ${msg}`);
  exitCode = 1;
}

function pass(msg) {
  console.log(`[PASS] math-kernel-schema: ${msg}`);
}

// 1. Check TypeScript types have the required contract fields
const typesFile = path.join(root, "src/lib/core/math/bounded-result-types.ts");
if (!fs.existsSync(typesFile)) {
  fail(`Missing types file: ${typesFile}`);
} else {
  pass(`Types file exists: ${typesFile}`);
}

const content = fs.readFileSync(typesFile, "utf8");
const requiredFields = ["lower_bound", "upper_bound", "ulp_error_margin"];
for (const field of requiredFields) {
  if (content.includes(field)) {
    pass(`Required field '${field}' found in types`);
  } else {
    fail(`Required field '${field}' missing from ${typesFile}`);
  }
}

// 2. Check BoundedMetric interface has all 5 fields
const expectedBoundedMetric = [
  "value",
  "lower_bound",
  "upper_bound",
  "ulp_error_margin",
  "status",
];
for (const field of expectedBoundedMetric) {
  if (!content.includes(field)) {
    fail(`BoundedMetric missing field: ${field}`);
  }
}

// 3. Check Python files exist
const pythonFiles = [
  "math-kernel/interval_engine.py",
  "math-kernel/mms_generator.py",
  "math-kernel/api.py",
  "math-kernel/requirements.txt",
];
for (const pf of pythonFiles) {
  const fullPath = path.join(root, pf);
  if (fs.existsSync(fullPath)) {
    pass(`Python file exists: ${pf}`);
  } else {
    fail(`Missing Python file: ${pf}`);
  }
}

// 4. Check Python interval_engine.py has BoundedResult dataclass
const engineFile = path.join(root, "math-kernel/interval_engine.py");
if (fs.existsSync(engineFile)) {
  const engineContent = fs.readFileSync(engineFile, "utf8");
  if (engineContent.includes("class BoundedResult")) {
    pass("BoundedResult class found in interval_engine.py");
  } else {
    fail("BoundedResult class missing from interval_engine.py");
  }
  if (engineContent.includes("lower_bound")) {
    pass("lower_bound field found in interval_engine.py");
  } else {
    fail("lower_bound field missing from interval_engine.py");
  }
  if (engineContent.includes("upper_bound")) {
    pass("upper_bound field found in interval_engine.py");
  } else {
    fail("upper_bound field missing from interval_engine.py");
  }
}

// 5. Check GitHub Actions workflow exists
const workflowFile = path.join(root, ".github/workflows/math_verification.yml");
if (fs.existsSync(workflowFile)) {
  pass("Math verification workflow exists");
} else {
  fail("Math verification workflow missing");
}

process.exit(exitCode);
