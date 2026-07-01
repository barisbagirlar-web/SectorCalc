/**
 * Pass 4: For remaining param!=sourceKey cases, add formula param name as input,
 * then fix inputMap to use param as sourceKey.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const SCHEMAS_DIR = resolve(__dirname, "../src/lib/features/premium-schema/schemas");
const AUTO_KEYS = new Set(["hiddenMultiplierConst", "excessKwhDerived", "varianceRatio"]);

function extractInputIds(content) {
  const ids = new Set();
  const inpMatch = content.match(/inputs\s*:\s*\[([\s\S]*?)\]/);
  if (!inpMatch) return ids;
  const re = /id:\s*["']([^"']+)["']/g;
  let m; while ((m = re.exec(inpMatch[1])) !== null) ids.add(m[1]);
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
    else if (block[i] === "}") { depth--; if (depth === 0 && start >= 0) { steps.push(block.slice(start + 1, i)); start = -1; } }
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
    let m; while ((m = entryRe.exec(imMatch[1])) !== null) {
      if (m[1] !== "formulaId" && m[1] !== "outputId" && m[1] !== "inputMap")
        entries.push({ param: m[1], sourceKey: m[2] });
    }
  }
  return { formulaId, outputId, entries };
}

function toLabel(id) {
  return id.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase()).replace(/[_-]/g, " ").trim();
}
function guessUnit(id) {
  if (/price|cost|wage|fee|rate|revenue|income|expense/i.test(id)) return "USD";
  if (/weight|mass|kg|ton/i.test(id)) return "kg";
  if (/pct|percent|rate|ratio/i.test(id)) return "%";
  if (/time|hour|day|duration/i.test(id)) return "hours";
  if (/qty|quantity|count|num|workers|unit|size/i.test(id)) return "units";
  if (/distance|length|km|m/i.test(id)) return "km";
  if (/power|energy|kw|kwh/i.test(id)) return "kW";
  return "unit";
}
function guessDefault(id) {
  if (/rate|ratio|pct|percent/i.test(id)) return 10;
  if (/cost|price|fee|wage|expense/i.test(id)) return 100;
  if (/qty|count|num|workers|unit/i.test(id)) return 10;
  if (/time|hour|duration|day/i.test(id)) return 8;
  if (/weight|mass|kg|ton/i.test(id)) return 500;
  return 1;
}

const allFiles = readdirSync(SCHEMAS_DIR).filter(f => f.endsWith(".ts")).map(f => join(SCHEMAS_DIR, f));

let totalFixed = 0;
let totalAdded = 0;

for (const file of allFiles) {
  let content = readFileSync(file, "utf-8");
  const inputIds = extractInputIds(content);
  const stepStrs = extractPipelineSteps(content);
  if (stepStrs.length === 0) continue;

  const steps = stepStrs.map(s => parseStep(s));
  let newInputs = [];
  let inputsArrayUpdated = false;

  for (let si = 0; si < steps.length; si++) {
    const priorOutputIds = new Set(steps.slice(0, si).map(s => s.outputId).filter(Boolean));
    const allValid = new Set([...inputIds, ...priorOutputIds, ...AUTO_KEYS]);

    for (const entry of steps[si].entries) {
      if (allValid.has(entry.sourceKey)) continue;

      // Use formula param name as the sourceKey
      if (!allValid.has(entry.param) && !inputIds.has(entry.param) && !newInputs.includes(entry.param)) {
        newInputs.push(entry.param);
      }

      // Fix inputMap: replace sourceKey with param name
      const stepStr = stepStrs[si];
      const imBlock = stepStr.match(/inputMap\s*:\s*\{([\s\S]*?)\}/);
      if (imBlock) {
        const fixRe = new RegExp(`(${entry.param}\\s*:\\s*)["']?${entry.sourceKey}["']?`);
        const newImBlock = imBlock[0].replace(fixRe, `$1"${entry.param}"`);
        if (newImBlock !== imBlock[0]) {
          content = content.replace(imBlock[0], newImBlock);
          totalFixed++;
          console.log(`FIXED ${file.replace(SCHEMAS_DIR, "")} :: "${entry.sourceKey}" → "${entry.param}"`);
        }
      }
    }
  }

  // Add new inputs
  if (newInputs.length > 0) {
    const inputsMatch = content.match(/(inputs\s*:\s*\[)([\s\S]*?)(\]\s*[,;])/);
    if (inputsMatch) {
      for (const id of newInputs) {
        const newInput = `\n    { id: "${id}", label: "${toLabel(id)}", type: "number", unit: "${guessUnit(id)}", required: true, smartDefault: ${guessDefault(id)}, validation: { min: 0 }, helper: "", expertMeaning: "" },`;
        const lastBracketIndex = inputsMatch[0].lastIndexOf("]");
        content = content.slice(0, inputsMatch.index + inputsMatch[0].slice(0, lastBracketIndex).length) +
                  newInput +
                  content.slice(inputsMatch.index + lastBracketIndex);
      }
      totalAdded += newInputs.length;
      console.log(`ADDED inputs to ${file.replace(SCHEMAS_DIR, "")}: ${newInputs.join(", ")}`);
    }
  }

  if (newInputs.length > 0 || totalFixed > 0) {
    writeFileSync(file, content, "utf-8");
  }
}

console.log(`\n=== PASS 4 SUMMARY ===`);
console.log(`InputMap fixes: ${totalFixed}`);
console.log(`New inputs added: ${totalAdded}`);
