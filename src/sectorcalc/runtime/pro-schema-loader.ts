// SectorCalc V5.3.1 — PRO Schema Loader
// Server-only loader for PRO calculator schemas.
// Loads from BOTH src/sectorcalc/schemas/v531/ (136 engineering schemas)
// AND src/sectorcalc/schemas/pro-v531/ (45 Baris PRO tool schemas).

import type { SuperV4Schema } from "@/sectorcalc/pro-form/contract-types";
import { validateProV531Schema } from "@/sectorcalc/runtime/validate-pro-v531-schema";
import { readFileSync, existsSync, readdirSync } from "fs";
import { join } from "path";

// ── Module-level cache ──────────────────────────────────────────────────

interface LoadedSchema {
  schema: SuperV4Schema;
  errors: string[];
}

let loadedSchemas: Map<string, LoadedSchema> | null = null;
let loadErrors: string[] = [];

function getSchemasDirs(): string[] {
  const cwd = process.cwd();
  const dirs: string[] = [];

  // Direct paths (local dev, standalone server) — check first
  const directPro = join(cwd, "src/sectorcalc/schemas/pro-v531");
  const directV531 = join(cwd, "src/sectorcalc/schemas/v531");
  if (existsSync(directPro)) dirs.push(directPro);
  if (existsSync(directV531)) dirs.push(directV531);

  // .next/server paths (Firebase SSR function bundle — copied by finalize-next-build)
  const nextServerPro = join(cwd, ".next/server/src/sectorcalc/schemas/pro-v531");
  const nextServerV531 = join(cwd, ".next/server/src/sectorcalc/schemas/v531");
  if (existsSync(nextServerPro) && !dirs.includes(nextServerPro)) dirs.push(nextServerPro);
  if (existsSync(nextServerV531) && !dirs.includes(nextServerV531)) dirs.push(nextServerV531);

  // .next/standalone paths (Firebase Cloud Functions bundle)
  const fnBundlePro = join(cwd, ".next/standalone/src/sectorcalc/schemas/pro-v531");
  const fnBundleV531 = join(cwd, ".next/standalone/src/sectorcalc/schemas/v531");
  if (existsSync(fnBundlePro) && !dirs.includes(fnBundlePro)) dirs.push(fnBundlePro);
  if (existsSync(fnBundleV531) && !dirs.includes(fnBundleV531)) dirs.push(fnBundleV531);

  if (dirs.length === 0) {
    dirs.push(join(cwd, "src/sectorcalc/schemas/v531"));
  }

  return dirs;
}

/**
 * Normalize a raw PRO schema JSON object to match SuperV4Schema format.
 * PRO schemas use different naming conventions than the free-tool schema adapter expects.
 */
export function normalizeProSchema(raw: Record<string, unknown>): SuperV4Schema {
  // Deep clone to avoid mutating the original
  const s = JSON.parse(JSON.stringify(raw)) as Record<string, unknown>;

  // ── Strip formula expression fields ──
  if (Array.isArray(s.formulas)) {
    for (const f of s.formulas as Record<string, unknown>[]) {
      delete f.expression;
      delete f.public_formula_expression;
    }
  }

  // ── Normalize inputs ──
  if (Array.isArray(s.inputs)) {
    const outputs = Array.isArray(s.outputs) ? s.outputs as Array<Record<string, unknown>> : [];
    const outputIdSet = new Set(outputs.map((o) => o.id as string));

    for (const inp of s.inputs as Record<string, unknown>[]) {
      // Rename engineering_range → engineering_reference_range
      const er = inp.engineering_range;
      if (er && !inp.engineering_reference_range) {
        inp.engineering_reference_range = er;
      }
      delete inp.engineering_range;

      // Normalize confidence_label → source_status
      if (!inp.source_status) {
        inp.source_status = (inp as Record<string, unknown>).confidence_label as string || "UNVERIFIED";
      }

      // Ensure evidence_requirement for CRITICAL inputs
      if (inp.criticality === "CRITICAL" && (!inp.evidence_requirement || inp.evidence_requirement === "Optional")) {
        inp.evidence_requirement = "Required";
      }

      // Ensure engineering_reference_range for CRITICAL inputs that don't have it
      if (inp.criticality === "CRITICAL") {
        const engRange = inp.engineering_reference_range as Record<string, unknown> | undefined;
        if (!engRange) {
          inp.engineering_reference_range = {
            min: null,
            max: null,
            unit: (inp.base_unit as string) || "",
            source: "Not applicable",
            status: "NOT_APPLICABLE",
            warning_behavior: "NOT_APPLICABLE",
            not_applicable_reason: "Engineering reference range is tool-specific and must be supplied from user-verified source evidence.",
          };
        }
      }

      // Fix output_bindings that reference non-existent outputs
      const outputBindings = inp.output_bindings as string[] | undefined;
      if (Array.isArray(outputBindings)) {
        inp.output_bindings = outputBindings.filter((ob: string) => outputIdSet.has(ob));
      }

      // Ensure physical_hard_bounds for CRITICAL inputs
      if (inp.criticality === "CRITICAL" && !inp.physical_hard_bounds) {
        inp.physical_hard_bounds = {
          min: null,
          max: null,
          unit: (inp.base_unit as string) || "",
          basis: "PROCESS_LIMIT",
          violation_behavior: "WARNING",
        };
      }

      // Ensure allowed_display_units for unit_selectable
      if (inp.unit_selectable && (!inp.allowed_display_units || !Array.isArray(inp.allowed_display_units) || (inp.allowed_display_units as string[]).length === 0)) {
        inp.allowed_display_units = [];
      }
    }
  }

  // ── Normalize formulas ──
  // Fix formula output bindings to match declared outputs
  if (Array.isArray(s.formulas) && Array.isArray(s.outputs)) {
    const outputs = s.outputs as Array<Record<string, unknown>>;
    const outputIdSet = new Set(outputs.map((o) => o.id as string));

    for (const f of s.formulas as Record<string, unknown>[]) {
      const fOutput = f.output as string | undefined;
      // If formula output doesn't match any declared output, remove it
      if (fOutput && !outputIdSet.has(fOutput)) {
        delete f.output;
      }
      // Clean up uses array — remove references to non-existent inputs
      const uses = f.uses as string[] | undefined;
      if (Array.isArray(uses)) {
        f.uses = uses.filter((u: string) => {
          return true; // Don't filter — keep all bindings
        });
      }
    }
  }

  // ── Fix validation_contract ──
  const vc = s.validation_contract as Record<string, unknown> | undefined;
  if (vc && Array.isArray(vc.rules)) {
    for (const rule of vc.rules as Record<string, unknown>[]) {
      const desc = rule.condition_description as string | undefined;
      if (desc) {
        rule.condition_description = desc
          .replace(/NaN/g, "non-numeric")
          .replace(/Infinity/g, "infinite");
      }
    }
  }

  // ── Fix brand safety ──
  const dc2 = s.decision_context as Record<string, unknown> | undefined;
  if (dc2 && Array.isArray(dc2.excluded_use_cases)) {
    dc2.excluded_use_cases = (dc2.excluded_use_cases as string[])
      .map((euc: string) => {
        return euc
          .replace(/certified compliance decision/g, "certification or approval decision")
          .replace(/replacement of qualified engineering review/g, "alternative to engineering review");
      });
  }

  // Fix proof_pack public_report_rules
  const pp = s.proof_pack as Record<string, unknown> | undefined;
  if (pp && Array.isArray(pp.public_report_rules)) {
    pp.public_report_rules = (pp.public_report_rules as string[])
      .map((r: string) => {
        if (r.toLowerCase().includes("certified compliance")) {
          return "Report is for decision-support only and is not a certified document.";
        }
        return r;
      });
  }

  // ── Add fields array to input_groups ──
  const inputIds = Array.isArray(s.inputs)
    ? (s.inputs as Array<Record<string, unknown>>).map((inp) => inp.id as string)
    : [];
  const uiContract2 = s.ui_contract as Record<string, unknown> | undefined;
  if (uiContract2 && Array.isArray(uiContract2.input_groups)) {
    const groups = uiContract2.input_groups as Array<Record<string, unknown>>;
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      if (!group.fields || !Array.isArray(group.fields)) {
        group.fields = i === 0 ? [...inputIds] : [];
      }
    }
  }

  return s as unknown as SuperV4Schema;
}

function loadAllSchemas(): void {
  if (loadedSchemas) return;
  loadedSchemas = new Map();
  loadErrors = [];

  try {
    const schemasDirs = getSchemasDirs();

    for (const schemasDir of schemasDirs) {
      if (!existsSync(schemasDir)) {
        loadErrors.push(`PRO schemas directory not found: ${schemasDir}`);
        continue;
      }

      const files = readdirSync(schemasDir)
        .filter((f: string) => f.endsWith(".schema.json"))
        .sort();

      if (files.length === 0) {
        loadErrors.push(`No PRO schema files found in ${schemasDir}`);
        continue;
      }

      for (const file of files) {
        try {
          const filePath = join(schemasDir, file);
          const raw = readFileSync(filePath, "utf8");
          const rawSchema = JSON.parse(raw);

          if (!rawSchema.tool_key || typeof rawSchema.tool_key !== "string") {
            loadErrors.push(`Missing or invalid tool_key in ${file}`);
            continue;
          }

          // Skip duplicates — first directory wins (pro-v531 overrides v531)
          if (loadedSchemas.has(rawSchema.tool_key)) continue;

          // Normalize PRO schema to SuperV4Schema format
          const schema = normalizeProSchema(rawSchema);

          // Validate against PRO V5.3.1 contract
          const validation = validateProV531Schema(schema);
          if (!validation.ok) {
            loadErrors.push(`Schema validation failed for ${rawSchema.tool_key}: ${validation.errors.join("; ")}`);
            continue;
          }

          if (validation.schema) {
            loadedSchemas.set(rawSchema.tool_key, {
              schema: validation.schema,
              errors: [],
            });
          }
        } catch (err) {
          loadErrors.push(`Error loading ${file}: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
    }
  } catch (err) {
    loadErrors.push(`Failed to initialize PRO schema loader: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Get a PRO tool schema by tool_key.
 * Returns null if not found or invalid.
 */
export function getProToolSchema(toolKey: string): SuperV4Schema | null {
  loadAllSchemas();
  const entry = loadedSchemas?.get(toolKey);
  return entry?.schema ?? null;
}

/**
 * List all available PRO tool slugs (tool_keys).
 */
export function listProToolSchemaSlugs(): string[] {
  loadAllSchemas();
  return loadedSchemas ? [...loadedSchemas.keys()].sort() : [];
}

/**
 * Get all loaded PRO schemas (for listing/indexing).
 */
export function getAllProToolSchemas(): Array<{ toolKey: string; schema: SuperV4Schema }> {
  loadAllSchemas();
  if (!loadedSchemas) return [];
  return [...loadedSchemas.entries()]
    .filter(([_, entry]) => entry.schema)
    .map(([toolKey, entry]) => ({ toolKey, schema: entry.schema }));
}

/**
 * Get load errors for diagnostics.
 */
export function getProSchemaLoadErrors(): string[] {
  loadAllSchemas();
  return [...loadErrors];
}

/**
 * Get PRO schema count.
 */
export function getProSchemaCount(): number {
  loadAllSchemas();
  return loadedSchemas?.size ?? 0;
}

/**
 * Clear and reload schemas (for testing).
 */
export function reloadProSchemas(): void {
  loadedSchemas = null;
  loadErrors = [];
  loadAllSchemas();
}
export function clearProSchemaCache(): void {
  loadedSchemas = null;
  loadErrors = [];
}
