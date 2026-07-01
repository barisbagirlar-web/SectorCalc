/**
 * Auto-fix premium schema broken inputMap bindings.
 *
 * Algorithm for each broken binding:
 * 1. Check if sourceKey fuzzy-matches a schema input ID → fix
 * 2. Check if formula parameter name (key) matches a prior outputId → fix using parameter name as source
 * 3. Check if sourceKey is the formula parameter name but written differently → check input IDs
 * 4. Otherwise → keep (report as manual)
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

function isSimilar(a, b) {
  if (a === b) return true;
  const aLow = a.toLowerCase(), bLow = b.toLowerCase();
  if (aLow === bLow) return true;
  // Remove underscores, hyphens, digits
  const norm = (s) => s.replace(/[_-]/g, "").replace(/\d+/g, "").toLowerCase();
  const na = norm(a), nb = norm(b);
  if (na === nb) return true;
  if (na.includes(nb) || nb.includes(na)) return true;
  // Levenshtein
  const maxLen = Math.max(a.length, b.length);
  if (maxLen < 3) return false;
  const dist = levenshtein(aLow, bLow);
  return dist / maxLen < 0.35;
}

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => i);
  for (let j = 0; j < n; j++) {
    let prev = dp[0];
    dp[0] = dp[0] + 1;
    for (let i = 0; i < m; i++) {
      const temp = dp[i + 1];
      dp[i + 1] = b[j] === a[i] ? prev : Math.min(prev, dp[i], dp[i + 1]) + 1;
      prev = temp;
    }
  }
  return dp[m];
}

function extractInputMapBlock(stepStr) {
  const m = stepStr.match(/(inputMap\s*:\s*\{[\s\S]*?\})/);
  return m ? m[1] : null;
}

const allFiles = readdirSync(SCHEMAS_DIR)
  .filter((f) => f.endsWith(".ts"))
  .map((f) => join(SCHEMAS_DIR, f));

let totalFixed = 0;
let totalManual = 0;
const manualItems = [];

for (const file of allFiles) {
  let content = readFileSync(file, "utf-8");
  const inputIds = extractInputIds(content);
  const stepStrs = extractPipelineSteps(content);
  if (stepStrs.length === 0) continue;

  const inputIdArr = [...inputIds];
  const computedIds = new Set(["hiddenMultiplierConst", "excessKwhDerived", "varianceRatio"]);
  const steps = stepStrs.map((s) => parseStep(s));
  let fileChanged = false;

  for (let si = 0; si < steps.length; si++) {
    const step = steps[si];
    // Build prior outputIds for this step
    const priorOutputIds = new Set();
    for (let pi = 0; pi < si; pi++) {
      priorOutputIds.add(steps[pi].outputId);
    }
    const allValid = new Set([...inputIds, ...priorOutputIds, ...computedIds]);

    // Check each entry
    const originalStepStr = stepStrs[si];
    const imBlock = extractInputMapBlock(originalStepStr);
    if (!imBlock) continue;

    let newImBlock = imBlock;
    let stepFixed = false;

    for (const entry of step.entries) {
      if (allValid.has(entry.sourceKey)) continue; // already valid

      // Try to find the correct sourceKey
      let bestMatch = null;

      // 1. Check if formula param name matches an input ID
      if (inputIds.has(entry.param)) {
        bestMatch = entry.param;
      }
      // 2. Check if sourceKey fuzzy-matches an input ID
      if (!bestMatch) {
        for (const inpId of inputIdArr) {
          if (isSimilar(entry.sourceKey, inpId)) {
            bestMatch = inpId;
            break;
          }
        }
      }
      // 3. Check if sourceKey (or param) fuzzy-matches a prior outputId
      if (!bestMatch) {
        for (const outId of priorOutputIds) {
          if (isSimilar(entry.sourceKey, outId) || isSimilar(entry.param, outId)) {
            bestMatch = outId;
            break;
          }
        }
      }

      if (bestMatch) {
        // Fix: replace the value in the inputMap
        const oldVal = entry.sourceKey;
        // Build regex to match `param: "oldVal"` or `param: oldVal`
        const fixRe = new RegExp(
          `(${entry.param}\\s*:\\s*)["']?${oldVal}["']?`,
        );
        newImBlock = newImBlock.replace(fixRe, `$1"${bestMatch}"`);
        totalFixed++;
        stepFixed = true;
        console.log(`FIXED ${file.replace(SCHEMAS_DIR, "")} :: ${entry.formulaId || step.formulaId} "${entry.sourceKey}" → "${bestMatch}"`);
      } else {
        totalManual++;
        manualItems.push({
          file: file.replace(SCHEMAS_DIR, ""),
          formulaId: step.formulaId,
          param: entry.param,
          sourceKey: entry.sourceKey,
        });
      }
    }

    if (stepFixed) {
      // Replace the inputMap block in the step string, then in the content
      content = content.replace(imBlock, newImBlock);
      fileChanged = true;
    }
  }

  if (fileChanged) {
    writeFileSync(file, content, "utf-8");
  }
}

console.log(`\n=== FIX SUMMARY ===`);
console.log(`Auto-fixed: ${totalFixed}`);
console.log(`Needs manual review: ${totalManual}`);

if (manualItems.length > 0) {
  console.log(`\n--- Manual review needed ---`);
  for (const item of manualItems) {
    console.log(`${item.file} :: formula="${item.formulaId}" param="${item.param}" sourceKey="${item.sourceKey}"`);
  }
}
