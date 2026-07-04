#!/usr/bin/env node
/**
 * Fix bad input IDs extracted from formula descriptions.
 * Some formulas contain solver/optimization text like "Rate where NPV = 0"
 * and the extractor incorrectly used "Rate", "where", "Year", etc. as input IDs.
 */
import { readFileSync, writeFileSync } from "node:fs";

const STOP_WORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "shall", "can", "need", "dare", "ought",
  "used", "to", "of", "in", "for", "on", "with", "at", "by", "from",
  "as", "into", "through", "during", "before", "after", "above", "below",
  "between", "out", "off", "over", "under", "again", "further", "then",
  "once", "here", "there", "when", "where", "why", "how", "all", "each",
  "every", "both", "few", "more", "most", "other", "some", "such", "no",
  "nor", "not", "only", "own", "same", "so", "than", "too", "very",
  "just", "because", "but", "and", "or", "if", "while", "that", "this",
  "these", "those", "it", "its", "rate", "year", "full", "recovery",
  "new", "old", "high", "low", "true", "false", "min", "max", "sum",
  "avg", "total", "SUBJECT", "TO", "where", "NPV", "IRR", "MIN",
  "MINIMUM", "MAXIMUM", "is", "are", "smallest", "largest",
  "before", "after",
]);

function isInputVariable(word) {
  if (STOP_WORDS.has(word)) return false;
  if (word.length < 2) return false;
  if (word !== word.normalize()) return false; // skip special chars
  return true;
}

const SLUG_FIXES = {
  "yg-ve-nbd": {
    removeInputs: ["Rate", "where", "Year", "before", "full", "recovery"],
  },
  "transfer-fiyatlandirmasi-optimize-edici": {
    removeInputs: ["Total", "Tax", "at", "Rate_Low", "Currency", "Pct_Group", "TaxDiff"],
  },
  "payment-vadesi-optimize-edici": {
    removeInputs: [],
  },
  "cbam-uyumluluk": {
    removeInputs: ["Proceed", "Reevaluate"],
  },
  "civate-torque": {
    removeInputs: ["FAIL", "PASS"],
  },
};

for (const [slug, fix] of Object.entries(SLUG_FIXES)) {
  const filePath = `generated/schemas/${slug}-schema.json`;
  const data = JSON.parse(readFileSync(filePath, "utf-8"));
  const removeSet = new Set(fix.removeInputs || []);

  const before = data.inputs.length;
  data.inputs = data.inputs.filter(inp => {
    if (removeSet.has(inp.id)) {
      console.log(`  REMOVE ${slug}/input: "${inp.id}" (label: "${inp.label}")`);
      return false;
    }
    if (!isInputVariable(inp.id)) {
      console.log(`  REMOVE ${slug}/input: "${inp.id}" (stop word)`);
      return false;
    }
    return true;
  });
  const after = data.inputs.length;

  if (before !== after) {
    writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    console.log(`  => ${slug}: ${before} → ${after} inputs (removed ${before - after})`);
  } else {
    console.log(`  => ${slug}: no input changes`);
  }
}

console.log("\nDone. Run npm run generate:all next.");
