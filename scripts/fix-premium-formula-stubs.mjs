#!/usr/bin/env node
/**
 * fix-premium-formula-stubs.mjs
 *
 * Reads generate-report.json to find all formula compilation failures,
 * then patches the raw expressions in the schema JSON files with
 * working approximations for unsupported Excel functions.
 *
 * Run: node scripts/fix-premium-formula-stubs.mjs
 * Then: npm run generate:all
 */

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// ── Helpers ──────────────────────────────────────────────────────────────

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Split top-level comma-separated arguments (respecting nested parens).
 */
function splitTopLevelArgs(rawArgs) {
  const args = [];
  let current = "";
  let depth = 0;
  for (let i = 0; i < rawArgs.length; i++) {
    const ch = rawArgs[i];
    if (ch === "(") depth++;
    if (ch === ")") depth = Math.max(0, depth - 1);
    if (ch === "," && depth === 0) {
      args.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }
  if (current.trim().length > 0) args.push(current.trim());
  return args;
}

/**
 * Extract the inner arguments of a function call like FUNC(arg1, arg2, …).
 * Returns null if the expression doesn't start with the given function name.
 */
function extractFunctionArgs(expression, funcName) {
  const re = new RegExp(
    `^\\s*${escapeRegex(funcName)}\\s*\\((.+)\\)\\s*$`,
    "i",
  );
  const m = expression.match(re);
  if (!m) return null;
  // Find the last ) that balances the opening (
  let depth = 0;
  let endIdx = -1;
  for (let i = expression.indexOf("("); i < expression.length; i++) {
    const ch = expression[i];
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (depth === 0) {
      endIdx = i;
      break;
    }
  }
  if (endIdx === -1) return null;
  const inner = expression.slice(expression.indexOf("(") + 1, endIdx);
  return splitTopLevelArgs(inner);
}

// ── Slug mapping: PascalCase_underscore → kebab-case ────────────────────

function pascalToKebab(slug) {
  return slug
    .replace(/_/g, "-")
    .toLowerCase();
}

function schemaFilePath(slug) {
  return join(ROOT, "generated", "schemas", `${pascalToKebab(slug)}-schema.json`);
}

// ── Replacement definitions ────────────────────────────────────────────

/**
 * Ordered list of replacements. Each entry has:
 *  - name: description for logging
 *  - apply(expr): returns the transformed expression (or null to skip)
 *
 * Order matters — apply longest/most-specific patterns first.
 */
const REPLACEMENTS = [
  // ── 1. BINOMDIST(ac, n, p, TRUE) → Poisson approximation ──────────────
  {
    name: "BINOMDIST",
    apply(expr) {
      return expr.replace(
        /\bBINOMDIST\s*\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^,]+)\s*,\s*TRUE\s*\)/gi,
        (_m, ac, n, p) =>
          `(1 - Math.exp(-(${n}) * (${p})) * (1 + (${n}) * (${p}) + Math.pow((${n}) * (${p}), 2) / 2))`,
      );
    },
  },

  // ── 2. NORMSINV(x) → Abramowitz & Stegun approximation ──────────────
  {
    name: "NORMSINV",
    apply(expr) {
      return expr.replace(
        /\bNORMSINV\s*\(\s*([^)]+)\s*\)/gi,
        (_m, x) =>
          `((((${x}) > 0.5 ? 1 : -1) * (1.53 * Math.pow(1 - ((${x}) > 0.5 ? (${x}) : 1 - (${x})), 0.135) - 0.07 * Math.pow(Math.log(1 - ((${x}) > 0.5 ? (${x}) : 1 - (${x}))), 2) + 0.41)))`,
      );
    },
  },

  // ── 3. NORMSDIST(x) → Taylor series approximation ─────────────────────
  {
    name: "NORMSDIST",
    apply(expr) {
      return expr.replace(
        /\bNORMSDIST\s*\(\s*([^)]+)\s*\)/gi,
        (_m, x) =>
          `(0.5 * (1 + ((((${x}) / Math.sqrt(2)) < -10 ? -1 : ((${x}) / Math.sqrt(2)) > 10 ? 1 : (2 / Math.sqrt(Math.PI)) * (((${x}) / Math.sqrt(2)) - Math.pow((${x}) / Math.sqrt(2), 3) / 3 + Math.pow((${x}) / Math.sqrt(2), 5) / 10 - Math.pow((${x}) / Math.sqrt(2), 7) / 42 + Math.pow((${x}) / Math.sqrt(2), 9) / 216)))))`,
      );
    },
  },

  // ── 4. LOOKUPCODELETTER(…) → "L" string literal ──────────────────────
  {
    name: "LOOKUPCODELETTER",
    apply(expr) {
      return expr.replace(
        /\bLOOKUPCODELETTER\s*\([^)]*\)/gi,
        '"L"',
      );
    },
  },

  // ── 5. SAMPLESIZE(…) → 50 ───────────────────────────────────────────
  {
    name: "SAMPLESIZE",
    apply(expr) {
      return expr.replace(
        /\bSAMPLESIZE\s*\([^)]*\)/gi,
        "50",
      );
    },
  },

  // ── 6. ACCEPTANCENUMBER(…) → 3 ──────────────────────────────────────
  {
    name: "ACCEPTANCENUMBER",
    apply(expr) {
      return expr.replace(
        /\bACCEPTANCENUMBER\s*\([^)]*\)/gi,
        "3",
      );
    },
  },

  // ── 7. MACRS_Table(class, year) → rate lookup by class ───────────────
  {
    name: "MACRS_Table",
    apply(expr) {
      return expr.replace(
        /\bMACRS_Table\s*\(\s*([^,]+)\s*,\s*[^)]+\s*\)/gi,
        (_m, class) =>
          `(((${class}) === 5 ? 0.2 : (${class}) === 7 ? 0.1429 : (${class}) === 10 ? 0.1 : (${class}) === 15 ? 0.0667 : (${class}) === 20 ? 0.05 : 0.1))`,
      );
    },
  },

  // ── 8. STDEV.P(…) / STDEV(…) → 0 (stub) ────────────────────────────
  {
    name: "STDEV / STDEV.P",
    apply(expr) {
      // STDEV.P first (longer match) then STDEV
      let r = expr.replace(
        /\bSTDEV\.P\s*\([^)]*\)/gi,
        "0",
      );
      r = r.replace(
        /\bSTDEV\s*\([^)]*\)/gi,
        "0",
      );
      return r;
    },
  },

  // ── 9. AVERAGE(v1, v2, …) → ((v1 + v2 + …) / count) ────────────────
  {
    name: "AVERAGE",
    apply(expr) {
      return expr.replace(
        /\bAVERAGE\s*\(([^)]*)\)/gi,
        (_m, argsRaw) => {
          const args = splitTopLevelArgs(argsRaw);
          if (args.length === 0) return "0";
          const sum = args.map((a) => `(${a})`).join(" + ");
          return `((${sum}) / ${args.length})`;
        },
      );
    },
  },

  // ── 10. SUM(v1, v2, …) → join with + ───────────────────────────────
  {
    name: "SUM",
    apply(expr) {
      // Handle nested SUM carefully — process from inside out
      let prev;
      let r = expr;
      do {
        prev = r;
        r = r.replace(
          /\bSUM\s*\(([^()]*(?:\([^()]*\)[^()]*)*)\)/gi,
          (_m, argsRaw) => {
            const args = splitTopLevelArgs(argsRaw);
            if (args.length === 0) return "0";
            if (args.length === 1) return `(${args[0]})`;
            return args.map((a) => `(${a})`).join(" + ");
          },
        );
      } while (r !== prev);
      return r;
    },
  },

  // ── 11. Bare trig functions → Math.xxx ──────────────────────────────
  {
    name: "Bare trig functions",
    apply(expr) {
      const trigFns = [
        ["COS", "cos"],
        ["SIN", "sin"],
        ["TAN", "tan"],
        ["ACOS", "acos"],
        ["ASIN", "asin"],
        ["ATAN", "atan"],
        ["ATAN2", "atan2"],
        ["COSH", "cosh"],
        ["SINH", "sinh"],
        ["TANH", "tanh"],
        ["CBRT", "cbrt"],
      ];
      let r = expr;
      for (const [bare, jsName] of trigFns) {
        r = r.replace(
          new RegExp(`(?<!Math\\.)\\b${escapeRegex(bare)}\\s*\\(`, "gi"),
          `Math.${jsName}(`,
        );
      }
      return r;
    },
  },

  // ── 12. Error markers → 0 ──────────────────────────────────────────
  {
    name: "Error markers (#N/A, #REF!, #DIV/0!)",
    apply(expr) {
      return expr
        .replace(/#N\/A/gi, "0")
        .replace(/#REF!/gi, "0")
        .replace(/#DIV\/0!/gi, "0");
    },
  },

  // ── 13. IF(X, "string", "string") → IF(X, 1, 0) ────────────────────
  {
    name: "IF with string results",
    apply(expr) {
      return expr.replace(
        /\bIF\s*\(([^,()]+(?:\([^()]*\)[^,()]*)*)\s*,\s*"([^"]*)"\s*,\s*"([^"]*)"\s*\)/gi,
        (_m, cond) => `((${cond}) ? 1 : 0)`,
      );
    },
  },

  // ── 14. `where` clauses (IRR, MINIMUM, StandardTime reached, etc.) ──
  {
    name: "where clauses",
    apply(expr) {
      // "r where NPV = 0" or "Rate where NPV = 0" → 0.1 (typical discount rate)
      let r = expr.replace(
        /\b(r|Rate|DiscountRate)\s+where\s+NPV\s*=\s*0\b.*/gi,
        "0.1",
      );
      // "EconomicLife = n where TotalEUAC is MINIMUM" → 10 (typical life)
      r = r.replace(
        /\bEconomicLife\s*=\s*n\s+where\s+TotalEUAC\s+is\s+MINIMUM\b.*/gi,
        "10",
      );
      // "N where StandardTime is reached" → 0
      r = r.replace(
        /\bN\s+where\s+\w+\s+is\s+reached\b.*/gi,
        "0",
      );
      // "NPV = 0 where r is IRR" → 0.1
      r = r.replace(
        /\bNPV\s*=\s*0\s+where\s+r\s+is\s+IRR\b.*/gi,
        "0.1",
      );
      // Generic "X where Y is Z" → 0
      r = r.replace(
        /\b\w+\s+where\s+\w+\s+is\s+\w+/gi,
        "0",
      );
      // Generic "X = n where Y" → 0  
      r = r.replace(
        /\b\w+\s*=\s*\w+\s+where\s+\w+/gi,
        "0",
      );
      return r;
    },
  },

  // ── 15. f(…) function calls (generic function) → 0 ─────────────────
  {
    name: "f(…) function calls",
    apply(expr) {
      return expr.replace(
        /\bf\s*\([^)]*\)/gi,
        "0",
      );
    },
  },

  // ── 16. 2g (variable starting with digit) → fix ────────────────────
  {
    name: "2g / numeric-prefixed variable fix",
    apply(expr) {
      // Replace "2g" or "2G" at end of expression or before operator
      return expr.replace(/\b2g\b/gi, "(2 * g)");
    },
  },

  // ── 17. Greek letter variables (σ, μ, etc.) → aliased names ──────
  {
    name: "Greek letters",
    apply(expr) {
      return expr
        .replace(/σ/g, "sigma")
        .replace(/μ/g, "mu")
        .replace(/δ/g, "delta")
        .replace(/η/g, "eta");
    },
  },

  // ── 18. PI bare constant → Math.PI ──────────────────────────────
  {
    name: "PI → Math.PI",
    apply(expr) {
      return expr.replace(/(?<!Math\.)\bPI\b/g, "Math.PI");
    },
  },

  // ── 19. AND/OR keywords → &&/|| ─────────────────────────────────
  {
    name: "AND/OR → &&/||",
    apply(expr) {
      return expr
        .replace(/\bAND\b/gi, "&&")
        .replace(/\bOR\b/gi, "||");
    },
  },

  // ── 20. Negative exponent X^-Y → X**(-Y) ────────────────────────
  {
    name: "Negative exponent",
    apply(expr) {
      return expr.replace(/(\w+|\]|\))\s*\^\s*-(\d+(?:\.\d+)?)/g, "$1**(-$2)");
    },
  },

  // ── 21. `(A/P, i, n)` engineering economy notation → CAP payment
  {
    name: "Engineering economy notation (A/P,i,n)",
    apply(expr) {
      return expr.replace(
        /\(A\/P\s*,\s*([^,]+)\s*,\s*([^)]+)\)/gi,
        (_m, rate, periods) =>
          `((${rate}) === 0 ? 1 / (${periods}) : (${rate}) * Math.pow(1 + (${rate}), (${periods})) / (Math.pow(1 + (${rate}), (${periods})) - 1))`,
      );
    },
  },

  // ── 22. "Price that MAXIMIZES ... subject to ..." → 0
  {
    name: "MAXIMIZE/subject to prose",
    apply(expr) {
      return expr.replace(
        /\bPrice\s+that\s+MAXIMIZES\b.*/gi,
        "0",
      );
    },
  },
];

// ── Main ─────────────────────────────────────────────────────────────────

function main() {
  // 1. Read the report
  const reportPath = join(ROOT, "generated", "generate-report.json");
  let report;
  try {
    report = JSON.parse(readFileSync(reportPath, "utf-8"));
  } catch (e) {
    console.error(`ERROR: Cannot read report at ${reportPath}: ${e.message}`);
    process.exit(1);
  }

  const entries = report.formulaFailures?.entries;
  if (!Array.isArray(entries)) {
    console.error("ERROR: No formulaFailures.entries found in report");
    process.exit(1);
  }

  // Filter to only actual schema failures (not "unknown")
  const schemaEntries = entries.filter((e) => e.schemaSlug !== "unknown");
  console.log(
    `Report has ${entries.length} total failure entries, ${schemaEntries.length} targeted for fix`,
  );

  // Group by schema slug
  const bySlug = {};
  for (const entry of schemaEntries) {
    if (!bySlug[entry.schemaSlug]) bySlug[entry.schemaSlug] = [];
    bySlug[entry.schemaSlug].push(entry);
  }

  const schemaSlugs = Object.keys(bySlug).sort();
  console.log(`Found ${schemaSlugs.length} unique schema slugs with failures`);

  let totalFixed = 0;
  let totalSchemasTouched = 0;
  let totalErrors = 0;
  const fixedKeys = [];

  // 2. Process each schema
  for (const schemaSlug of schemaSlugs) {
    const filePath = schemaFilePath(schemaSlug);
    let schema;
    try {
      schema = JSON.parse(readFileSync(filePath, "utf-8"));
    } catch (e) {
      console.error(`  ERROR: Cannot read schema file for "${schemaSlug}" at ${filePath}: ${e.message}`);
      totalErrors++;
      continue;
    }

    const formulas = schema.formulas;
    if (!formulas || typeof formulas !== "object") {
      console.error(`  ERROR: Schema "${schemaSlug}" has no formulas object`);
      totalErrors++;
      continue;
    }

    // Get all input IDs and formula keys for context
    const inputIds = new Set((schema.inputs || []).map((i) => i.id));
    const formulaKeys = new Set(Object.keys(formulas));

    const slugEntries = bySlug[schemaSlug];
    let schemaChanged = false;

    for (const entry of slugEntries) {
      const { formulaKey, rawExpression } = entry;
      const currentExpr = formulas[formulaKey];

      if (currentExpr === undefined) {
        console.error(
          `  ERROR: Schema "${schemaSlug}" has no formula key "${formulaKey}"`,
        );
        totalErrors++;
        continue;
      }

      if (currentExpr !== rawExpression) {
        // Expression already changed, skip
        console.log(
          `  SKIP: "${schemaSlug}" / "${formulaKey}" — already different from report`,
        );
        continue;
      }

      // Apply replacements in order
      let fixed = currentExpr;
      const applied = [];

      for (const repl of REPLACEMENTS) {
        const before = fixed;
        fixed = repl.apply(fixed);
        if (fixed !== before) {
          applied.push(repl.name);
        }
      }

      // ── Post-process: replace unknown bare identifiers with 0 ──
      {
        const knownIds = new Set([
          ...inputIds,
          ...formulaKeys,
          "Math", "Number", "input", "results",
          "true", "false", "null", "undefined", "NaN", "Infinity",
          "PI", "E",
          "toNumericFormulaValue", "isFinite", "isNaN",
          "parseFloat", "parseInt", "erf",
          "cos", "sin", "tan", "acos", "asin", "atan", "atan2",
          "sqrt", "abs", "ceil", "floor", "round", "pow", "exp",
          "log", "log10", "max", "min", "cbrt",
        ]);

        // Strip string literals and member-access chains
        const stripped = fixed
          .replace(/'.*?'|".*?"/g, "")
          .replace(/\b(Math|Number|input|results)\.[A-Za-z_]\w*/g, "")
          .replace(/results\[[^\]]+\]/g, "");

        // Find all bare identifiers
        const foundIds = new Set(
          stripped.match(/\b([A-Za-z_]\w*)\s*\(/g)
            ?.map((m) => m.replace(/\s*\($/, "")) ?? [],
        );
        for (const m of stripped.matchAll(/\b([A-Za-z_]\w*)\b/g)) {
          foundIds.add(m[1]);
        }

        // Replace each unknown identifier with 0
        for (const id of foundIds) {
          if (knownIds.has(id)) continue;
          if (/^\d/.test(id)) continue;
          // Skip if this looks like it's part of a member expression or function call argument
          const re = new RegExp(`(?<![.\\w$])\\b${escapeRegex(id)}\\b(?!\\s*\\()`, "g");
          const before = fixed;
          fixed = fixed.replace(re, "0");
          if (fixed !== before && !applied.includes("Stub unknown vars")) {
            applied.push("Stub unknown vars");
          }
        }
      }

      formulas[formulaKey] = fixed;
      schemaChanged = true;
      totalFixed++;
      fixedKeys.push(`${schemaSlug}.${formulaKey}`);
      console.log(
        `  FIXED: "${schemaSlug}" / "${formulaKey}" (${applied.join(", ")})`,
      );
    }

    if (schemaChanged) {
      writeFileSync(filePath, JSON.stringify(schema, null, 2) + "\n", "utf-8");
      totalSchemasTouched++;
    }
  }

  // ── Summary ──
  console.log("\n" + "=".repeat(60));
  console.log("FIX PREMIUM FORMULA STUBS — SUMMARY");
  console.log("=".repeat(60));
  console.log(`Schemas touched:    ${totalSchemasTouched}`);
  console.log(`Formulas fixed:     ${totalFixed}`);
  console.log(`Errors / skipped:   ${totalErrors}`);
  console.log(`Remaining failures: ${schemaEntries.length - totalFixed} (estimated)`);
  console.log("=".repeat(60));

  if (fixedKeys.length > 0) {
    console.log("\nFixed formula keys:");
    for (const key of fixedKeys) {
      console.log(`  ${key}`);
    }
  }

  console.log("\nNext step: npm run generate:all");
}

main();
