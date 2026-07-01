/**
 * Pass 2: Add missing inputs for remaining broken bindings where param == sourceKey.
 * These are cases where the formula expects an input that doesn't exist in the schema.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const SCHEMAS_DIR = resolve(__dirname, "../src/lib/features/premium-schema/schemas");

function extractInputIds(content) {
  const ids = new Set();
  const inpMatch = content.match(/inputs\s*:\s*\[([\s\S]*?)\]/);
  if (!inpMatch) return ids;
  const re = /id:\s*["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(inpMatch[1])) !== null) ids.add(m[1]);
  return ids;
}

function extractPipelineSteps(content) {
  const steps = [];
  const pipeMatch = content.match(/formulaPipeline\s*:\s*\[([\s\S]*?)\]\s*[,;]/);
  if (!pipeMatch) return steps;
  const block = pipeMatch[1];
  let depth = 0, start = -1;
  for (let i = 0; i < block.length; i++) {
    if (block[i] === "{") { if (depth === 0) start = i; depth++; }
    else if (block[i] === "}") {
      depth--;
      if (depth === 0 && start >= 0) {
        steps.push(block.slice(start + 1, i));
        start = -1;
      }
    }
  }
  return steps;
}

function parseStep(stepStr) {
  const formulaId = stepStr.match(/formulaId\s*:\s*["']([^"']+)["']/)?.[1] || "";
  const outputId = stepStr.match(/outputId\s*:\s*["']([^"']+)["']/)?.[1] || "";
  const entries = [];
  const imMatch = stepStr.match(/inputMap\s*:\s*\{([\s\S]*?)\}/);
  if (imMatch) {
    const entryRe = /([a-zA-Z_]\w*)\s*:\s*["']?([a-zA-Z_]\w*)["']?\s*[,}]/g;
    let m;
    while ((m = entryRe.exec(imMatch[1])) !== null) {
      const param = m[1], sourceKey = m[2];
      if (param !== "formulaId" && param !== "outputId" && param !== "inputMap")
        entries.push({ param, sourceKey });
    }
  }
  return { formulaId, outputId, entries };
}

function toLabel(id) {
  return id
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .replace(/[_-]/g, " ")
    .trim();
}

function guessUnit(id) {
  if (/price|cost|wage|revenue|income|expense|fee|rate/i.test(id)) return "USD";
  if (/weight|mass|kg|ton/i.test(id)) return "kg";
  if (/pct|percent|rate|ratio/i.test(id)) return "%";
  if (/time|hour|day|duration/i.test(id)) return "hours";
  if (/qty|quantity|count|num|workers|unit|size/i.test(id)) return "units";
  if (/distance|length|km|m/i.test(id)) return "km";
  if (/power|energy|kw|kwh/i.test(id)) return "kW";
  if (/area|volume|m3|m2/i.test(id)) return "m³";
  return "unit";
}

function guessDefault(id) {
  if (/rate|ratio|pct|percent/i.test(id)) return 10;
  if (/cost|price|fee|wage|expense/i.test(id)) return 100;
  if (/qty|count|num|workers|unit/i.test(id)) return 10;
  if (/time|hour|duration|day/i.test(id)) return 8;
  if (/weight|mass|kg|ton/i.test(id)) return 500;
  if (/distance|km|length/i.test(id)) return 100;
  return 1;
}

function guessMin(id) {
  return /rate|ratio|pct|percent/i.test(id) ? 0 : 0;
}

function guessMax(id) {
  if (/pct|percent/i.test(id)) return 100;
  return undefined;
}

const allFiles = readdirSync(SCHEMAS_DIR)
  .filter((f) => f.endsWith(".ts"))
  .map((f) => join(SCHEMAS_DIR, f));

let totalAdded = 0;
const addedInputs = {};

for (const file of allFiles) {
  let content = readFileSync(file, "utf-8");
  const inputIds = extractInputIds(content);
  const stepStrs = extractPipelineSteps(content);
  if (stepStrs.length === 0) continue;

  const steps = stepStrs.map(parseStep);
  const computedIds = new Set(["hiddenMultiplierConst", "excessKwhDerived", "varianceRatio"]);
  let fileChanged = false;

  // Collect missing inputs
  const missingInputs = new Set();
  for (let si = 0; si < steps.length; si++) {
    const priorOutputIds = new Set(
      steps.slice(0, si).map((s) => s.outputId).filter(Boolean)
    );
    const allValid = new Set([...inputIds, ...priorOutputIds, ...computedIds]);

    for (const entry of steps[si].entries) {
      if (allValid.has(entry.sourceKey)) continue;
      // Only fix param == sourceKey cases (self-reference)
      if (entry.param !== entry.sourceKey) continue;
      missingInputs.add(entry.sourceKey);
    }
  }

  if (missingInputs.size === 0) continue;

  // Find the inputs array end
  const inputsMatch = content.match(/(inputs\s*:\s*\[)([\s\S]*?)(\]\s*[,;])/);
  if (!inputsMatch) continue;

  for (const id of missingInputs) {
    if (inputIds.has(id)) continue; // already exists (shouldn't happen)
    const newInput = `\n    { id: "${id}", label: "${toLabel(id)}", type: "number", unit: "${guessUnit(id)}", required: true, smartDefault: ${guessDefault(id)}, validation: { min: ${guessMin(id)}${guessMax(id) !== undefined ? `, max: ${guessMax(id)}` : ""} }, helper: "", expertMeaning: "${toLabel(id)}" },`;
    // Insert before the closing ]
    const lastBracketIndex = inputsMatch[0].lastIndexOf("]");
    const before = inputsMatch[0].slice(0, lastBracketIndex);
    const after = inputsMatch[0].slice(lastBracketIndex);
    const newContent = before + newInput + after;

    content = content.replace(inputsMatch[0], newContent);
    inputIds.add(id);

    if (!addedInputs[file.replace(SCHEMAS_DIR, "")]) addedInputs[file.replace(SCHEMAS_DIR, "")] = [];
    addedInputs[file.replace(SCHEMAS_DIR, "")].push(id);
    totalAdded++;
    fileChanged = true;
  }

  if (fileChanged) {
    writeFileSync(file, content, "utf-8");
    console.log(`ADDED inputs to ${file.replace(SCHEMAS_DIR, "")}: ${[...missingInputs].join(", ")}`);
  }
}

console.log(`\n=== PASS 2 SUMMARY ===`);
console.log(`Total missing inputs added: ${totalAdded}`);
