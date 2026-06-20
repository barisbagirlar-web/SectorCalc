#!/usr/bin/env node
/**
 * Post-generation fix: patches auto-generated TypeScript files in generated/
 * to eliminate TS2362 / TS2363 arithmetic type errors.
 *
 * Three patterns fixed (each conservatively scoped):
 * 1. Boolean field in arithmetic:  input.bool * x  →  (input.bool ? 1 : 0) * x
 * 2. String field in arithmetic:   input.str  * x  →  Number(input.str)  * x
 * 3. Simple comparison in arith:   (a > b) * x     →  Number(a > b)     * x
 *
 * Runs after generate:all in the prebuild pipeline.
 */
import { existsSync, readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = process.cwd();
const GENERATED_DIR = join(ROOT, "generated");

let fixedCount = 0;
let errorCount = 0;

function esc(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Extract boolean field names from interface + Zod schema. */
function findBooleanFields(content) {
  const fields = new Set();
  const re1 = /^\s+(\w+)\s*:\s*boolean\s*[;\n]/gm;
  let m;
  while ((m = re1.exec(content)) !== null) fields.add(m[1]);
  const re2 = /(\w+)\s*:\s*z\.boolean\(\)/g;
  while ((m = re2.exec(content)) !== null) fields.add(m[1]);
  return fields;
}

/** Extract string/enum field names from interface + Zod schema. */
function findStringFields(content) {
  const fields = new Set();
  const re1 = /^\s+(\w+)\s*:\s*string\s*[;\n]/gm;
  let m;
  while ((m = re1.exec(content)) !== null) fields.add(m[1]);
  const re2 = /(\w+)\s*:\s*z\.enum\(/g;
  while ((m = re2.exec(content)) !== null) fields.add(m[1]);
  return fields;
}

/**
 * Fix 1: Boolean field used in arithmetic context.
 *   input.bool * x  →  (input.bool ? 1 : 0) * x
 *   input.bool + x  →  (input.bool ? 1 : 0) + x
 */
function fixBooleanArithmetic(content, boolFields) {
  let result = content;
  let changed = false;

  for (const field of boolFields) {
    const alreadyWrapped = new RegExp(
      `\\(input\\.${esc(field)}\\s*\\?\\s*1\\s*:\\s*0\\)`,
    );
    if (alreadyWrapped.test(result)) continue;

    // Match input.field followed by arithmetic operator
    const pattern = new RegExp(
      `\\binput\\.${esc(field)}\\b(?=\\s*[\\+\\-\\*\\/\\%\\^\\)])`,
      "g",
    );
    if (!pattern.test(result)) continue;

    result = result.replace(
      new RegExp(`\\binput\\.${esc(field)}\\b`, "g"),
      `(input.${field} ? 1 : 0)`,
    );
    changed = true;
  }

  return { content: result, changed };
}

/**
 * Fix 2: String/enum field used in arithmetic context.
 *   input.str * x  →  Number(input.str) * x
 */
function fixStringArithmetic(content, strFields) {
  let result = content;
  let changed = false;

  for (const field of strFields) {
    const alreadyFixed = new RegExp(
      `Number\\(input\\.${esc(field)}\\)|\\(input\\.${esc(field)}\\s*\\?\\s*1\\s*:\\s*0\\)`,
    );
    if (alreadyFixed.test(result)) continue;

    const pattern = new RegExp(
      `\\binput\\.${esc(field)}\\b(?=\\s*[\\+\\-\\*\\/\\%\\^\\)])`,
      "g",
    );
    if (!pattern.test(result)) continue;

    result = result.replace(
      new RegExp(`\\binput\\.${esc(field)}\\b`, "g"),
      `Number(input.${field})`,
    );
    changed = true;
  }

  return { content: result, changed };
}

/**
 * Fix 3: Simple comparison expression in arithmetic context.
 *   (a > b) * x  →  Number(a > b) * x
 *   (a !== b) / c  →  Number(a !== b) / c
 *
 * SAFETY: ONLY matches single-level parens (no nesting) with a comparison
 * operator, immediately followed by arithmetic. This avoids corrupting
 * ternary expressions or nested formulas.
 */
const COMPARISON_OPS = ["!==", "===", ">=", "<=", "==", "!=", ">", "<"];
COMPARISON_OPS.sort((a, b) => b.length - a.length);

function fixComparisonArithmetic(content) {
  let result = content;
  let changed = false;

  for (const op of COMPARISON_OPS) {
    const processed = processSingleComparisonOp(result, op);
    if (processed !== result) {
      result = processed;
      changed = true;
    }
  }

  return { content: result, changed };
}

/** Process one comparison operator at a time — pure function, no mutation. */
function processSingleComparisonOp(content, op) {
  const escapedOp = esc(op);
  // Require whitespace around the operator to avoid matching <<, >>, >= being split.
  const pattern = new RegExp(
    `\\(([^()]+\\s${escapedOp}\\s[^()]+)\\)\\s*(?=[\\*\\/\\+\\-\\%])`,
    "g",
  );

  const segments = [];
  let lastIdx = 0;
  let m;

  while ((m = pattern.exec(content)) !== null) {
    const offset = m.index;
    const inner = m[1];
    const fullMatch = m[0];

      // Skip if already wrapped with Number() — check 6 chars before offset
      // (offset points to the `(` of the match, `Number` is 6 chars before it)
      const before = content.slice(Math.max(0, offset - 6), offset);
      if (before === "Number") continue;
    // Skip ternary expressions
    if (inner.includes("?") || inner.includes(":")) continue;

    segments.push(content.slice(lastIdx, offset));
    const closeParenIdx = fullMatch.lastIndexOf(")");
    const afterClose = fullMatch.slice(closeParenIdx + 1);
    segments.push(`Number(${inner})${afterClose}`);
    lastIdx = pattern.lastIndex;
  }

  if (segments.length > 0) {
    segments.push(content.slice(lastIdx));
    return segments.join("");
  }
  return content;
}

function processFile(filePath) {
  const content = readFileSync(filePath, "utf8");
  const boolFields = findBooleanFields(content);
  const strFields = findStringFields(content);

  const afterBool = fixBooleanArithmetic(content, boolFields);
  const afterStr = fixStringArithmetic(afterBool.content, strFields);
  const afterCmp = fixComparisonArithmetic(afterStr.content);

  if (afterBool.changed || afterStr.changed || afterCmp.changed) {
    writeFileSync(filePath, afterCmp.content, "utf8");
    const tags = [];
    if (afterBool.changed) tags.push("bool");
    if (afterStr.changed) tags.push("string");
    if (afterCmp.changed) tags.push("cmp");
    console.log(`  ✓ ${filePath.replace(GENERATED_DIR + "/", "")} [${tags.join(",")}]`);
    fixedCount++;
  }
}

function walk(dir) {
  if (!existsSync(dir)) return;
  const entries = readdirSync(dir).sort();
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (extname(entry) === ".ts") {
      try {
        const content = readFileSync(fullPath, "utf8");
        if (content.includes("evaluateAllFormulas")) {
          processFile(fullPath);
        }
      } catch (err) {
        console.error(`  ✗ ${entry}: ${err.message}`);
        errorCount++;
      }
    }
  }
}

console.log("\n🔧 fix-generated-boolean-arithmetic — scanning generated/ for type-safe arithmetic...");
walk(GENERATED_DIR);
console.log(
  `\n📊 Summary: ${fixedCount} file(s) fixed, ${errorCount} error(s)`,
);
if (fixedCount === 0 && errorCount === 0) {
  console.log(
    "  ℹ  No fixes needed. If the build fails with TS2362/TS2363 errors,",
  );
  console.log(
    "    the generated output format may have changed — check scripts/fix-generated-boolean-arithmetic.mjs.",
  );
}
console.log("");
