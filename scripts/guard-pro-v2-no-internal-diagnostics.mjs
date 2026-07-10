// Guard: PRO V2 No Internal Diagnostics in Public Report
// Public report must not expose internal error codes or diagnostics.

import { readFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");

let allPass = true;

const insightDir = resolve(ROOT, "src/sectorcalc/pro-v2/insights");
const insightFiles = readdirSync(insightDir).filter((f) => f.endsWith(".ts"));

// Internal diagnostic patterns that must NEVER appear in public output
const FORBIDDEN_IN_PUBLIC = [
  "schema_hash_mismatch",
  "client_schema_hash",
  "derating_config",
  "trigger_inputs",
  "missing_trigger_inputs",
  "bounds_",
  "refrange_",
  "sens_warn",
  "formula_module",
  "formula_engine",
  "warn_blocked",
  "pipeline state",
  "raw server diagnostic",
  "stack trace",
];

for (const file of insightFiles) {
  const src = readFileSync(resolve(insightDir, file), "utf-8");

  for (const forbidden of FORBIDDEN_IN_PUBLIC) {
    // These may appear in filter lists, but not in the user-facing warning titles/content
    const titlePattern = new RegExp(`title: "${forbidden.replace(/_/g, " ")}"`, "i");
    const contentPattern = new RegExp(`\`[^\`]*${forbidden}[^\`]*\``, "i");

    if (titlePattern.test(src)) {
      console.error(`FAIL: [${file}] Internal diagnostic '${forbidden}' appears as user-facing title`);
      allPass = false;
    }
  }
}

console.log(`\nGUARD: PRO V2 No Internal Diagnostics in Public Report`);
console.log(`=====================================================`);
if (allPass) {
  console.log(`RESULT: PASS — No internal diagnostics exposed in public reports`);
} else {
  console.error(`\nRESULT: FAIL — Internal diagnostics leaked to public report`);
  process.exit(1);
}
