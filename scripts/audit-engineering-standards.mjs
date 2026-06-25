#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const failures = [];

const required = [
  "src/lib/standards/engineering-standards-types.ts",
  "src/lib/standards/standard-system-resolver.ts",
  "src/lib/standards/material-crosswalk.ts",
  "src/lib/standards/thread-standard-crosswalk.ts",
  "src/lib/standards/pressure-vessel-standard-map.ts",
  "src/lib/standards/welding-standard-map.ts",
  "src/lib/standards/gdt-standard-map.ts",
  "src/lib/standards/steel-section-standard-map.ts",
  "src/components/standards/StandardSystemSelector.tsx",
];

for (const rel of required) {
  if (!existsSync(join(ROOT, rel))) failures.push(`missing ${rel}`);
}

const systems = ["AWS", "ISO_EN", "JIS", "ASME_BPVC", "PED_EN_13445", "ASTM_AISI", "EUROCODE"];
const blob = readFileSync(join(ROOT, "src/lib/standards/standard-system-resolver.ts"), "utf8");
for (const system of systems) {
  if (!blob.includes(system)) failures.push(`standard resolver missing ${system}`);
}

// TR locale removed — English-only

console.log("audit:engineering-standards");
if (failures.length) {
  console.error(`FAIL — ${failures.length} issue(s):`);
  for (const line of failures) console.error(`  - ${line}`);
  process.exit(1);
}
console.log("PASS — engineering standards layer present");
process.exit(0);
