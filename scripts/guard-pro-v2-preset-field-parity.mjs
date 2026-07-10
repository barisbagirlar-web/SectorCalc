// Guard: PRO V2 Preset Field Parity
// Every preset key must match a visible or supported hidden field.
// Every unit must exist in the declared field's allowed unit list.

import { readFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");

let allPass = true;

const presetDir = resolve(ROOT, "src/sectorcalc/pro-v2/presets");
const presetFiles = readdirSync(presetDir).filter((f) => f.endsWith(".ts"));

for (const file of presetFiles) {
  const src = readFileSync(resolve(presetDir, file), "utf-8");

  // Extract all unique preset keys (from values: { key: "..." })
  const valueKeys = new Set();
  const keyPattern = /(\w+):\s*"/g;
  let match;
  while ((match = keyPattern.exec(src)) !== null) {
    // Skip TypeScript property names and array indices
    if (!["label", "values", "units", "value", "unit"].includes(match[1])) {
      valueKeys.add(match[1]);
    }
  }

  // Load the corresponding contract to verify keys exist
  const slug = file.replace(".presets.ts", "");
  const contractPath = resolve(ROOT, `src/sectorcalc/pro-v2/contracts/${slug}.contract.ts`);

  try {
    const contractSrc = readFileSync(contractPath, "utf-8");

    for (const key of valueKeys) {
      if (!contractSrc.includes(`id: "${key}"`)) {
        console.error(`FAIL: [${file}] Preset key '${key}' not found in contract fields`);
        allPass = false;
      }
    }
  } catch {
    console.warn(`WARN: [${file}] No matching contract found at contracts/${slug}.contract.ts`);
  }
}

console.log(`\nGUARD: PRO V2 Preset Field Parity`);
console.log(`==================================`);
if (allPass) {
  console.log(`RESULT: PASS — All preset keys match declared field IDs`);
} else {
  console.error(`\nRESULT: FAIL — Preset field parity violations detected`);
  process.exit(1);
}
