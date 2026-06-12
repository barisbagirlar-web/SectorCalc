#!/usr/bin/env node
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const failures = [];

const required = [
  "src/lib/decision-engine/decision-engine-types.ts",
  "src/lib/decision-engine/tool-archetypes.ts",
  "src/lib/decision-engine/decision-level-resolver.ts",
  "src/lib/decision-engine/case-state-builder.ts",
  "src/lib/decision-engine/trust-trace-builder.ts",
  "src/lib/decision-engine/decision-engine-resolver.ts",
  "src/lib/decision-engine/decision-engine-audit.ts",
  "src/components/tools/ToolDecisionGovernance.tsx",
];

for (const rel of required) {
  if (!existsSync(join(ROOT, rel))) {
    failures.push(`missing ${rel}`);
  }
}

const resolver = readFileSync(join(ROOT, "src/lib/decision-engine/decision-engine-resolver.ts"), "utf8");
if (!resolver.includes("resolveDecisionEngineContext")) {
  failures.push("decision-engine-resolver missing resolveDecisionEngineContext");
}

try {
  execSync(
    `npx tsx -e "import { auditDecisionEngineCoverage } from './src/lib/decision-engine/decision-engine-audit.ts'; const r = auditDecisionEngineCoverage('en'); if (r.issues.length) { console.error(r.issues.slice(0,5)); process.exit(1);} console.log('coverage', r.totalTools);"`,
    { cwd: ROOT, stdio: "pipe", encoding: "utf8" },
  );
} catch (error) {
  failures.push("decision engine coverage audit failed");
}

console.log("audit:decision-engine");
if (failures.length) {
  console.error(`FAIL — ${failures.length} issue(s):`);
  for (const line of failures) console.error(`  - ${line}`);
  process.exit(1);
}
console.log("PASS — decision engine core present and resolves catalog tools");
process.exit(0);
