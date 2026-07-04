#!/usr/bin/env node

/**
 * Integrate user-provided formulas into the formula registry.
 *
 * 1. Reads the generated formula-definitions-v2.ts
 * 2. Creates src/lib/premium-schema/user-premium-formulas.ts
 * 3. Patches formula-registry.ts to import user formulas
 */

import fs from "node:fs";
import path from "node:path";

const GEN_SRC = "scripts/generated-premium/formula-definitions-v2.ts";
const USER_FILE = "src/lib/premium-schema/user-premium-formulas.ts";
const REGISTRY_FILE = "src/lib/premium-schema/formula-registry.ts";

// ── 1. Parse generated definitions ──
const rawDefs = fs.readFileSync(GEN_SRC, "utf-8");

// Extract the formula definitions section (between "append to FORMULA_DEFINITIONS" and "append to FORMULA_META")
const defsMatch = rawDefs.match(
  /\/\/ ── User formulas — append to FORMULA_DEFINITIONS ──\n([\s\S]*?)\n  \/\/ ── User formula metadata/
);
const metaMatch = rawDefs.match(
  /\/\/ ── User formula metadata — append to FORMULA_META ──\n([\s\S]*?)\n\n\/\/ Total:/
);

if (!defsMatch || !metaMatch) {
  console.error("ERROR: Could not parse generated formula definitions");
  console.error("defsMatch:", !!defsMatch);
  console.error("metaMatch:", !!metaMatch);
  process.exit(1);
}

const formulaDefs = defsMatch[1].trim();
const formulaMeta = metaMatch[1].trim();

// Count formulas
const formulaCount = (formulaDefs.match(/id:\s*"user\./g) || []).length;
console.log(`Found ${formulaCount} formula definitions and metadata entries`);

// ── 2. Create user-premium-formulas.ts ──
const userFileContent = `/**
 * User-Provided Premium Formulas
 *
 * These formulas are EXACTLY as specified by the user for 141 premium tools.
 * They replace any auto-generated formulas for the same tools.
 *
 * Auto-generated from archive/migration-only/data/premium-formulas-batch.txt
 * Generated: ${new Date().toISOString()}
 */

import type {
  FormulaDefinition,
  FormulaInputs,
} from "@/lib/premium-schema/formula-registry";
import type { FormulaRegistryMeta } from "@/lib/premium-schema/formula-registry";

// Helper functions (mirrored from formula-registry.ts)
function num(inputs: FormulaInputs, key: string, fallback = 0): number {
  const value = inputs[key];
  return Number.isFinite(typeof value === "number" ? value : Number(value))
    ? value
    : fallback;
}

function assertFinite(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

function nonNegative(value: number): number {
  return assertFinite(Math.max(0, value));
}

/**
 * Standard normal CDF approximation (Abramowitz & Stegun 26.2.17).
 * Returns P(Z ≤ x) for Z ~ N(0,1).
 */
function normStd(x: number): number {
  const b0 = 0.2316419, b1 = 0.319381530, b2 = -0.356563782;
  const b3 = 1.781477937, b4 = -1.821255978, b5 = 1.330274429;
  const t = 1 / (1 + b0 * Math.abs(x));
  const poly = t * (b1 + t * (b2 + t * (b3 + t * (b4 + t * b5)));
  const cdf = 1 - poly * Math.exp(-x * x / 2);
  return x >= 0 ? cdf : 1 - cdf;
}

/**
 * Standard normal inverse CDF approximation (rational).
 * Returns z such that P(Z ≤ z) = p for Z ~ N(0,1).
 */
function normSInv(p: number): number {
  if (p <= 0) return -6;
  if (p >= 1) return 6;
  const a = [-3.969683028665376e+1, 2.209460984245205e+2,
    -2.759285104469687e+2, 1.383577518672690e+2,
    -3.066479806614716e+1, 2.506628277459239e+0];
  const b = [-5.447609879822406e+1, 1.615858368580409e+2,
    -1.556989798598866e+2, 6.680131188771972e+1,
    -1.328068155288572e+1];
  const c = [-7.784894002430293e-3, -3.223964580411365e-1,
    -2.400758277161838e+0, -2.549732539343734e+0,
    4.374664141464968e+0, 2.938163982698783e+0];
  const d = [7.784695709041462e-3, 3.224671290700398e-1,
    2.445134137142996e+0, 3.754408661907416e+0];
  
  let q = p - 0.5;
  if (Math.abs(q) <= 0.425) {
    const r = 0.180625 - q * q;
    return q * (((((a[5] * r + a[4]) * r + a[3]) * r + a[2]) * r + a[1]) * r + a[0]) /
      (((((b[4] * r + b[3]) * r + b[2]) * r + b[1]) * r + b[0]) * r + 1);
  }
  const r = q < 0 ? p : 1 - p;
  if (r <= 0) return q < 0 ? -6 : 6;
  const rSqrt = Math.sqrt(-2 * Math.log(r));
  let z = (((((c[5] * rSqrt + c[4]) * rSqrt + c[3]) * rSqrt + c[2]) * rSqrt + c[1]) * rSqrt + c[0]) /
    ((((d[3] * rSqrt + d[2]) * rSqrt + d[1]) * rSqrt + d[0]) * rSqrt + 1);
  return q < 0 ? -z : z;
}

// ═══════════════════════════════════════════════════════════════════════════
// USER-PROVIDED FORMULA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

export const USER_FORMULA_DEFINITIONS: readonly FormulaDefinition[] = [
${formulaDefs.split("\n").map(l => l === "" ? "" : l).join("\n")}
];

export const USER_FORMULA_META_DETAILS: Record<
  string,
  Omit<FormulaRegistryMeta, "formulaId" | "family" | "label">
> = {
${formulaMeta.split("\n").map(l => {
  // Convert metadata to proper format
  return l;
}).join("\n")}
};
`;

fs.writeFileSync(USER_FILE, userFileContent, "utf-8");
console.log(`✅ Created ${USER_FILE} (${formulaCount} formulas)`);

// ── 3. Patch formula-registry.ts ──
// We need to:
// a) Add import for user formulas after existing imports
// b) Spread user formulas into FORMULA_DEFINITIONS
// c) Spread user metadata into FORMULA_META_DETAILS

let registryContent = fs.readFileSync(REGISTRY_FILE, "utf-8");

// Check if already patched
if (registryContent.includes("user-premium-formulas")) {
  console.log("ℹ️  Registry already patched, skipping");
} else {
  // Find the import section end and add import
  const importEnd = registryContent.indexOf(
    '} from "@/lib/premium-schema/formula-families";'
  );
  if (importEnd >= 0) {
    const userImport = `\nimport {\n  USER_FORMULA_DEFINITIONS,\n  USER_FORMULA_META_DETAILS as USER_META_DETAILS,\n} from "@/lib/premium-schema/user-premium-formulas";`;
    registryContent =
      registryContent.slice(0, importEnd + 1) +
      userImport +
      registryContent.slice(importEnd + 1);
  }

  // Find FORMULA_DEFINITIONS end (line with "];" after the definitions array)
  const defsCloseMatch = registryContent.match(/^];\n\n\/\/ Legacy aliases/m);
  if (defsCloseMatch) {
    const insertPos = defsCloseMatch.index;
    const userDefsInjection = `  // ── User-provided premium formulas ──\n  ...USER_FORMULA_DEFINITIONS,\n`;
    registryContent =
      registryContent.slice(0, insertPos) +
      userDefsInjection +
      registryContent.slice(insertPos);
  }

  // Find FORMULA_META_DETAILS close (last closing brace/bracket before buildFormulaRegistryMeta)
  const metaCloseMatch = registryContent.match(/^};[\\n]+\/\/ end meta\s*$|^};[\\n]*\nfunction buildFormulaRegistryMeta/m);
  // Alternative: find the last "};" before "function buildFormulaRegistryMeta"
  const buildFnIndex = registryContent.indexOf("function buildFormulaRegistryMeta");
  if (buildFnIndex > 0) {
    // Find the last "};" before buildFormulaRegistryMeta
    const beforeBuild = registryContent.slice(0, buildFnIndex);
    const lastClose = beforeBuild.lastIndexOf("};");
    if (lastClose > 0) {
      const userMetaInjection = `\n  // ── User-provided premium formula metadata ──\n  ...USER_META_DETAILS,\n`;
      registryContent =
        registryContent.slice(0, lastClose + 2) +
        userMetaInjection +
        registryContent.slice(lastClose + 2);
    }
  }

  fs.writeFileSync(REGISTRY_FILE, registryContent, "utf-8");
  console.log(`✅ Patched ${REGISTRY_FILE}`);
}

// ── Verify ──
console.log(`\nDone! ${formulaCount} formulas integrated.`);
console.log(`Next: npm run typecheck`);
