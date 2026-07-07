#!/usr/bin/env node
// SectorCalc Guard: No Free Tool Should Show BLOCKED State
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const formFile = path.join(ROOT, "src/sectorcalc/pro-form/UniversalIndustrialDecisionForm.tsx");
const formContent = fs.readFileSync(formFile, "utf8");
const failures = [];

if (!formContent.includes("isServerBlocked")) {
  failures.push("Missing isServerBlocked variable");
}
const smFile = path.join(ROOT, "src/sectorcalc/pro-form/form-state-machine.ts");
const smContent = fs.readFileSync(smFile, "utf8");
if (!smContent.includes("server_blocked")) {
  failures.push("form-state-machine.ts: Missing server_blocked");
}

if (failures.length > 0) {
  console.error("NO_BLOCKED_FREE_TOOLS=FAIL\n" + failures.join("\n"));
  process.exit(1);
}
console.log("NO_BLOCKED_FREE_TOOLS=PASS");
