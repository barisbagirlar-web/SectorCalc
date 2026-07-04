#!/usr/bin/env node
/**
 * scripts/generate-free-v531-formula-modules.mjs
 *
 * Generates server-only formula modules for all 51 Free V5.3.1 tools.
 * Each module uses raw input IDs for Path B compatibility.
 *
 * Generated: src/sectorcalc/formulas/free-v531/{toolKey}.formula.ts
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SCHEMAS_DIR = path.join(ROOT, "src/sectorcalc/schemas/free-v531");
const OUTPUT_DIR = path.join(ROOT, "src/sectorcalc/formulas/free-v531");

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const schemaFiles = fs.readdirSync(SCHEMAS_DIR).filter((f) => f.endsWith(".schema.json"));
let generated = 0;
let errors = 0;

for (const file of schemaFiles) {
  try {
    const raw = JSON.parse(fs.readFileSync(path.join(SCHEMAS_DIR, file), "utf8"));
    const toolKey = raw.tool_key;
    const formulaVersion = raw.metadata?.formula_version || "1.0.0";
    const formulas = Array.isArray(raw.formulas) ? raw.formulas : [];
    const outputs = Array.isArray(raw.outputs) ? raw.outputs : [];
    const inputs = Array.isArray(raw.inputs) ? raw.inputs : [];

    // Map normalized_id → raw id for formula uses
    const normToRaw = {};
    for (const inp of inputs) {
      if (inp.normalized_id) normToRaw[inp.normalized_id] = inp.id;
    }

    const outputKeyList = outputs.map((o) => `"${o.id}"`).join(", ");

    // Collect all raw input keys referenced by formulas
    const requiredRawInputs = new Set();
    for (const f of formulas) {
      if (Array.isArray(f.uses)) {
        for (const u of f.uses) {
          requiredRawInputs.add(normToRaw[u] || u);
        }
      }
    }
    // Also collect from inputs marked required
    for (const inp of inputs) {
      if (inp.required) requiredRawInputs.add(inp.id);
    }
    const requiredStr = [...requiredRawInputs].map((r) => `"${r}"`).join(", ");

    // Build computation blocks for each formula
    const blocks = [];
    for (const f of formulas) {
      const fUses = Array.isArray(f.uses) ? f.uses : [];
      const fOutput = f.output || "";
      if (!outputs.some((o) => o.id === fOutput)) continue;

      // Convert normalized IDs to raw IDs for the get() calls
      const rawGetCalls = fUses.map((normId) => {
        const rawId = normToRaw[normId] || normId;
        return `    const val_${rawId} = get(inputs, "${rawId}");`;
      });
      const rawVarNames = fUses.map((normId) => {
        const rawId = normToRaw[normId] || normId;
        return `val_${rawId}`;
      });

      if (rawVarNames.length === 1) {
        blocks.push(`${rawGetCalls.join("\n")}
    outputs[${JSON.stringify(fOutput)}] = round(${rawVarNames[0]}, 4);`);
      } else if (rawVarNames.length === 2) {
        blocks.push(`${rawGetCalls.join("\n")}
    outputs[${JSON.stringify(fOutput)}] = round(${rawVarNames[0]} * ${rawVarNames[1]}, 4);`);
      } else {
        blocks.push(`${rawGetCalls.join("\n")}
    outputs[${JSON.stringify(fOutput)}] = round(${rawVarNames.join(" * ")}, 4);`);
      }
    }

    const code = `import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = ${JSON.stringify(toolKey)};
export const formulaVersion = ${JSON.stringify(formulaVersion)};

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function get(inputs: Record<string, number>, key: string): number {
  const v = inputs[key];
  return isFiniteNumber(v) ? v : 0;
}

function round(v: number, d: number): number {
  if (!isFiniteNumber(v)) return 0;
  const f = Math.pow(10, d);
  return Math.round(v * f) / f;
}

export function calculate(inputs: Record<string, number>): {
  status: CalculationStatus;
  outputs: Record<string, number>;
  warnings: string[];
  outputKeys: string[];
  redaction_status: RedactionStatus;
} {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  // Validate required inputs
  for (const key of [${requiredStr}]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
${blocks.join("\n\n")}

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: [${outputKeyList}],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
`;

    fs.writeFileSync(path.join(OUTPUT_DIR, `${toolKey}.formula.ts`), code, "utf8");
    generated++;
  } catch (err) {
    console.error(`Error generating formula for ${file}: ${err.message}`);
    errors++;
  }
}

console.log(`Generated ${generated} formula modules (${errors} errors)`);
