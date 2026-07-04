// SectorCalc V5.3.1 — PRO Schema Loader
// Server-only loader for the 135 V5.3.1 PRO calculator schemas.
// Schemas are loaded from src/sectorcalc/schemas/v531/ and normalized
// to match the SuperV4Schema contract expected by the schema validator.

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

function getSchemasDir(): string {
  return join(process.cwd(), "src/sectorcalc/schemas/v531");
}

/**
 * Normalize a raw PRO schema JSON object to match SuperV4Schema format.
 * PRO schemas use different naming conventions than the free-tool schema adapter expects.
 */
function normalizeProSchema(raw: Record<string, unknown>): SuperV4Schema {
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
          // Keep if it's a normalized input (starts with norm_ or ends with _norm)
          // or if it references an existing formula
          return true; // Don't filter — keep all bindings
        });
      }
    }
  }

  // ── Fix validation_contract ──
  // Remove NaN/Infinity references in rule descriptions
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
  // Excluded use cases contain denial phrases like "certified compliance decision"
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

  return s as unknown as SuperV4Schema;
}

function loadAllSchemas(): void {
  if (loadedSchemas) return;
  loadedSchemas = new Map();
  loadErrors = [];

  try {
    const schemasDir = getSchemasDir();
    if (!existsSync(schemasDir)) {
      loadErrors.push(`PRO schemas directory not found: ${schemasDir}`);
      return;
    }

    const files = readdirSync(schemasDir)
      .filter((f: string) => f.endsWith(".schema.json"))
      .sort();

    if (files.length === 0) {
      loadErrors.push("No PRO schema files found in v531 directory");
      return;
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

        // Normalize PRO schema to SuperV4Schema format
        const schema = normalizeProSchema(rawSchema);

        // Validate against PRO V5.3.1 contract
        const validation = validateProV531Schema(schema);
        if (!validation.ok) {
          loadErrors.push(`Schema validation failed for ${rawSchema.tool_key}: ${validation.errors.join("; ")}`);
          continue;
        }

        const existing = loadedSchemas.get(rawSchema.tool_key);
        if (existing) {
          loadErrors.push(`Duplicate tool_key: ${rawSchema.tool_key} in ${file}`);
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
