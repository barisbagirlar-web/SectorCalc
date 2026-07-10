#!/usr/bin/env node
// Guard: PRO V2 Field Contract Validation
// Ensures select-only fields do not define unitFamily/defaultUnit.
// Ensures numeric unit fields define unitFamily.
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const contractsDir = join(__dirname, "..", "src", "sectorcalc", "pro-v2", "contracts");

let failures = 0;
let checks = 0;

function fail(msg) {
  console.error(`  FAIL: ${msg}`);
  failures++;
}

function loadContracts(dir) {
  const files = readdirSync(dir).filter((f) => f.endsWith(".contract.ts") || f.endsWith(".contract.tsx"));
  for (const file of files) {
    const content = readFileSync(join(dir, file), "utf-8");
    scanContract(content, file);
  }
}

function scanContract(content, filename) {
  // Extract all field objects by finding "type:" assignments
  const fieldPattern = /\{[^}]*(?:type:\s*"(select|number|text)")[^}]*\}/g;
  let match;
  while ((match = fieldPattern.exec(content)) !== null) {
    const block = match[0];
    const type = match[1];
    checks++;

    const idMatch = block.match(/id:\s*"([^"]+)"/);
    const id = idMatch ? idMatch[1] : "unknown";

    const hasUnitFamily = block.includes("unitFamily:");
    const hasDefaultUnit = block.includes("defaultUnit:");
    const hasAllowedUnits = block.includes("allowedUnits:");
    const hasOptions = block.includes("options:");

    if (type === "select") {
      if (hasUnitFamily) {
        fail(`${filename}: select field "${id}" must not define unitFamily`);
      }
      if (hasDefaultUnit) {
        fail(`${filename}: select field "${id}" must not define defaultUnit`);
      }
    } else if (type === "number") {
      if (hasAllowedUnits && !hasUnitFamily) {
        fail(`${filename}: numeric field "${id}" has allowedUnits but no unitFamily`);
      }
    }
  }
}

loadContracts(contractsDir);

console.log(`\nField Contract Guard: ${checks} fields checked, ${failures} failures`);
if (failures > 0) {
  process.exit(1);
} else {
  console.log("GUARD PASS: All field contracts valid\n");
}
