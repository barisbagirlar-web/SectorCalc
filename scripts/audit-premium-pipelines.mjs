/**
 * v2: Robust premium pipeline audit.
 * Uses character-level scanning of formulaPipeline arrays.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const SCHEMAS_DIR = resolve(__dirname, "../src/lib/features/premium-schema/schemas");

const AUTO_KEYS = new Set(["hiddenMultiplierConst", "excessKwhDerived", "varianceRatio"]);

function extractInputIds(content) {
  const ids = new Set();
  // Find the inputs: [ ... ] array
  const inpMatch = content.match(/inputs\s*:\s*\[([\s\S]*?)\]/);
  if (!inpMatch) return ids;
  const inpBlock = inpMatch[1];
  // Each input object has id: "..."
  const re = /id:\s*["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(inpBlock)) !== null) ids.add(m[1]);
  return ids;
}

function extractPipelineSteps(content) {
  const steps = [];
  const pipeMatch = content.match(/formulaPipeline\s*:\s*\[([\s\S]*?)\]\s*[,;]/);
  if (!pipeMatch) return steps;

  const block = pipeMatch[1];
  // Split into step objects: find { ... } at depth 0
  let depth = 0;
  let start = -1;
  for (let i = 0; i < block.length; i++) {
    const ch = block[i];
    if (ch === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0 && start >= 0) {
        const stepStr = block.slice(start + 1, i);
        steps.push(parseStep(stepStr));
        start = -1;
      }
    }
  }
  return steps;
}

function parseStep(stepStr) {
  const formulaId = stepStr.match(/formulaId\s*:\s*["']([^"']+)["']/)?.[1] || "";
  const outputId = stepStr.match(/outputId\s*:\s*["']([^"']+)["']/)?.[1] || "";
  const inputMapEntries = [];

  // Extract inputMap: { ... }
  const imMatch = stepStr.match(/inputMap\s*:\s*\{([\s\S]*?)\}/);
  if (imMatch) {
    const mapStr = imMatch[1];
    // Match key: "value" or key: value (without quotes)
    const entryRe = /([a-zA-Z_]\w*)\s*:\s*["']?([a-zA-Z_]\w*)["']?\s*[,}]/g;
    let m;
    while ((m = entryRe.exec(mapStr)) !== null) {
      const param = m[1];
      const sourceKey = m[2];
      // Exclude formulaId, outputId, inputMap keys
      if (param !== "formulaId" && param !== "outputId" && param !== "inputMap") {
        inputMapEntries.push({ param, sourceKey });
      }
    }
  }

  return { formulaId, outputId, inputMapEntries };
}

const allFiles = readdirSync(SCHEMAS_DIR)
  .filter((f) => f.endsWith(".ts"))
  .map((f) => join(SCHEMAS_DIR, f));

let totalBroken = 0;
const brokenByKey = {}; // sourceKey → [{ file, formulaId }]

for (const file of allFiles) {
  const content = readFileSync(file, "utf-8");
  const inputIds = extractInputIds(content);
  const steps = extractPipelineSteps(content);
  if (steps.length === 0) continue;

  // Build set of prior outputIds at each step
  const computedIds = new Set([...AUTO_KEYS]);

  for (const step of steps) {
    for (const entry of step.inputMapEntries) {
      if (!computedIds.has(entry.sourceKey) && !inputIds.has(entry.sourceKey)) {
        totalBroken++;
        const shortFile = file.replace(SCHEMAS_DIR, "");
        const key = entry.sourceKey;
        if (!brokenByKey[key]) brokenByKey[key] = [];
        brokenByKey[key].push({
          file: shortFile,
          formulaId: step.formulaId,
          param: entry.param,
          outputId: step.outputId,
        });
      }
    }
    if (step.outputId) computedIds.add(step.outputId);
  }
}

console.log(`\n=== PREMIUM SCHEMA PIPELINE AUDIT ===\n`);
console.log(`Files scanned: ${allFiles.length}`);
console.log(`Broken bindings: ${totalBroken}`);

if (totalBroken > 0) {
  console.log(`\n--- Missing keys ---`);
  for (const [key, instances] of Object.entries(brokenByKey)) {
    console.log(`\n"${key}" (${instances.length} occurrences):`);
    for (const inst of instances) {
      console.log(`   ${inst.file} :: formula="${inst.formulaId}" param="${inst.param}" outputId="${inst.outputId}"`);
    }
  }
}

console.log(`\n=== DONE ===`);
