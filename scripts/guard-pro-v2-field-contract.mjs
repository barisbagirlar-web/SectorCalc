#!/usr/bin/env node
// Guard: PRO V2 Field Contract Validation
// Ensures select-only fields do not define unitFamily/defaultUnit.
// Ensures numeric unit fields define unitFamily.
// Dimensional contract guard:
//   - Hourly rate fields must NOT use plain currency family
//   - Quantity scale labels must be explicit (no "hundred"/"thousand")
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
  // Scan line by line, counting braces to detect field object boundaries
  const lines = content.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Detect start of a field object: a line ending with "{" at the right indentation level
    // Fields have "id:" and "type:" properties
    if (line.trim() === "{" && i + 1 < lines.length && lines[i + 1].includes("id:")) {
      // Collect all lines of this field object by tracking brace depth
      const fieldLines = [];
      let depth = 0;
      let j = i;

      while (j < lines.length) {
        const fl = lines[j];
        fieldLines.push(fl);
        depth += (fl.match(/\{/g) || []).length;
        depth -= (fl.match(/\}/g) || []).length;
        if (depth <= 0) break;
        j++;
      }

      const fieldText = fieldLines.join("\n");
      analyzeField(fieldText, filename);
      i = j; // Skip to end of this field
    }
    i++;
  }
}

function regexExtract(text, pattern) {
  const match = text.match(pattern);
  return match ? match[1] : null;
}

function regexExtractAll(text, patternStr) {
  const results = [];
  const regex = new RegExp(patternStr, "g");
  let match;
  while ((match = regex.exec(text)) !== null) {
    results.push(match[1]);
  }
  return results;
}

function analyzeField(fieldText, filename) {
  const id = regexExtract(fieldText, /id:\s*"([^"]+)"/) || "unknown";
  const type = regexExtract(fieldText, /type:\s*"([^"]+)"/) || "unknown";
  const label = regexExtract(fieldText, /label:\s*"([^"]+)"/) || "";
  checks++;

  const hasUnitFamily = fieldText.includes("unitFamily:");
  const hasDefaultUnit = fieldText.includes("defaultUnit:");
  const hasAllowedUnits = fieldText.includes("allowedUnits:");
  const hasOptions = fieldText.includes("options:");

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

  // Dimensional guard: hourly rate fields must NOT use plain currency
  const idLower = (id || "").toLowerCase();
  const labelLower = (label || "").toLowerCase();
  const isRateField =
    labelLower.includes("hourly rate") ||
    labelLower.includes("rate per hour") ||
    idLower.includes("rate_per_hour") ||
    idLower.includes("hourly_rate");

  if (isRateField && type === "number") {
    const unitFamily = regexExtract(fieldText, /unitFamily:\s*"([^"]+)"/) || "";
    if (unitFamily === "currency") {
      fail(`${filename}: "${id}" (${label}) is an hourly rate field but uses plain currency family. Must use shop_rate or cost_rate with per-hour units.`);
    }
    // Check at least one allowed unit ends with /h
    const allowedUnitValues = regexExtractAll(fieldText, 'unit:\\s*"([^"]+)"');
    const hasPerHourUnit = allowedUnitValues.some((u) => /^[A-Z]{3}\/h$/.test(u));
    if (!hasPerHourUnit) {
      fail(`${filename}: "${id}" (${label}) is an hourly rate field but has no per-hour unit (e.g. USD/h). Allowed units found: ${allowedUnitValues.join(", ") || "(none)"}`);
    }
  }

  // Dimensional guard: quantity scale labels must be explicit (check the display label, not unit value)
  if (type === "number") {
    // Extract label-value pairs from allowedUnits
    const unitLabelPairs = [];
    const pairRegex = /unit:\s*"([^"]+)"[^}]*?label:\s*"([^"]+)"/g;
    let pairMatch;
    while ((pairMatch = pairRegex.exec(fieldText)) !== null) {
      unitLabelPairs.push({ unit: pairMatch[1], label: pairMatch[2] });
    }
    for (const { unit: unitVal, label: labelVal } of unitLabelPairs) {
      if ((unitVal === "hundred" || unitVal === "thousand") && (labelVal === "hundred" || labelVal === "thousand")) {
        fail(`${filename}: "${id}" (${label}) uses ambiguous scale label "${labelVal}" for unit "${unitVal}" — use explicit label like "100 units" or "1,000 units"`);
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
