#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const failures = [];

const registry = readFileSync(join(ROOT, "src/lib/case-studies/case-study-registry.ts"), "utf8");
if (!registry.includes("evidenceLevel")) {
  failures.push("case study registry missing evidenceLevel");
}

const forbiddenClaims = [/kanıtladı/i, /garanti etti/i, /%40 azalttı/i, /₺127\.000/i];
const entries = registry.match(/problem:\s*\n\s*"([^"]+)"/g) ?? [];
for (const block of entries) {
  for (const pattern of forbiddenClaims) {
    if (pattern.test(block)) failures.push(`forbidden claim pattern in case study: ${pattern}`);
  }
}

const requiredSectors = [
  "construction",
  "sheet-metal",
  "cnc",
  "welding",
  "logistics",
  "energy",
];
for (const sector of requiredSectors) {
  if (!registry.includes(`sector: "${sector}"`)) {
    failures.push(`missing sector coverage: ${sector}`);
  }
}

console.log("audit:case-studies");
if (failures.length) {
  console.error(`FAIL — ${failures.length} issue(s):`);
  for (const line of failures) console.error(`  - ${line}`);
  process.exit(1);
}
console.log("PASS — case study evidence layer OK");
process.exit(0);
