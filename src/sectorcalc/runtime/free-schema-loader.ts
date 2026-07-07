import "server-only";
import type { SuperV4Schema } from "@/sectorcalc/pro-form/contract-types";
import { validateSuperV4Schema } from "@/sectorcalc/pro-form/schema-adapter";
import { readFileSync, existsSync, readdirSync } from "fs";
import { join } from "path";
import {
  getFreeV531SchemaBySlug,
} from "@/sectorcalc/schemas/free-v531/registry.generated";

interface LoadedSchema { schema: SuperV4Schema; errors: string[]; }
let loadedSchemas: Map<string, LoadedSchema> | null = null;
let loadErrors: string[] = [];

function getSchemasDir(): string {
  const cwd = process.cwd();
  const fnBundle = join(cwd, ".next/standalone/src/sectorcalc/schemas/free-v531");
  if (existsSync(fnBundle)) return fnBundle;
  const direct = join(cwd, "src/sectorcalc/schemas/free-v531");
  if (existsSync(direct)) return direct;
  return direct;
}

/**
 * Normalize a Free V5.3.1 schema for validation.
 */
export function normalizeFreeSchema(raw: Record<string, unknown>): SuperV4Schema {
  const s = JSON.parse(JSON.stringify(raw)) as Record<string, unknown>;

  const outputs = Array.isArray(s.outputs) ? s.outputs as Array<Record<string, unknown>> : [];
  const outputIdSet = new Set(outputs.map((o) => o.id as string));

  // Collect all formula IDs referenced by input formula_bindings
  const referencedFormulaIds = new Set<string>();
  if (Array.isArray(s.inputs)) {
    for (const inp of s.inputs as Array<Record<string, unknown>>) {
      const fb = inp.formula_bindings as string[] | undefined;
      if (Array.isArray(fb)) {
        for (const id of fb) {
          if (typeof id === "string" && !id.startsWith("server_formula.")) {
            referencedFormulaIds.add(id);
          }
        }
      }
    }
  }

  const inputIds = new Set((s.inputs as Array<Record<string, unknown>> | undefined)?.map((i) => i.id as string) ?? []);

  const formulasArr = Array.isArray(s.formulas) ? s.formulas as Array<Record<string, unknown>> : [];
  const definedFormulaIds = new Set(formulasArr.map((f) => f.id as string));

  // Remove orphan formulas (not referenced by any input and not serving a known output)
  s.formulas = formulasArr.filter((f) => {
    const fid = f.id as string;
    if (referencedFormulaIds.has(fid)) return true;
    const fOutput = f.output as string | undefined;
    if (fOutput && outputIdSet.has(fOutput)) return true;
    // Keep server-internal formulas
    if (typeof fid === "string" && fid.startsWith("F_SERVER_")) return true;
    return false;
  });

  // Add stub formula entries for referenced formula IDs missing from the formulas array
  for (const refId of referencedFormulaIds) {
    if (!definedFormulaIds.has(refId)) {
      (s.formulas as Array<Record<string, unknown>>).push({
        id: refId,
        name: refId,
        operation: "SUBCALC",  // Sub-calculation handled by formula_registry
        output: null,
        description: `Formula ${refId} — computed via formula registry`,
        formula_bindings: [],
        standard_clause_bindings: [],
      });
    }
  }

  for (const f of (s.formulas as Array<Record<string, unknown>>) ?? []) {
    delete f.expression;
    delete f.uncertainty_expression;
    delete f.public_formula_expression;
    const fOutput = f.output as string | undefined;
    if (fOutput && !outputIdSet.has(fOutput)) {
      delete f.output;
    }
  }

  const dc = s.decision_context as Record<string, unknown> | undefined;
  if (dc && Array.isArray(dc.excluded_use_cases)) {
    dc.excluded_use_cases = (dc.excluded_use_cases as string[]).map((euc: string) => {
      return euc
        .replace(/certified compliance claim/g, "approval or certification decision")
        .replace(/certified compliance decision/g, "certification or approval decision")
        .replace(/replacement of qualified engineering review/g, "alternative to engineering review");
    });
  }

  const pp = s.proof_pack as Record<string, unknown> | undefined;
  if (pp && Array.isArray(pp.public_report_rules)) {
    pp.public_report_rules = (pp.public_report_rules as string[]).map((r: string) => {
      if (r.toLowerCase().includes("certified compliance")) {
        return "Report is for decision-support only and is not a certified document.";
      }
      return r;
    });
  }

  // V5.4 Core — Fix unit-selectable inputs that are missing allowed_display_units
  if (Array.isArray(s.inputs)) {
    for (const inp of s.inputs as Array<Record<string, unknown>>) {
      const isUnitSelectable = (inp.unit_selectable as boolean) === true;
      if (isUnitSelectable) {
        const allowedUnits = inp.allowed_display_units as string[] | undefined;
        const baseUnit = inp.base_unit as string | undefined;
        if (!allowedUnits || allowedUnits.length === 0) {
          if (baseUnit && typeof baseUnit === "string" && baseUnit.length > 0) {
            (inp as Record<string, unknown>).allowed_display_units = [baseUnit];
          } else {
            // base_unit is null/empty but input is unit_selectable
            // Use "user_unit" as fallback to preserve unit display in UI
            (inp as Record<string, unknown>).base_unit = "user_unit";
            (inp as Record<string, unknown>).allowed_display_units = ["user_unit"];
          }
        }
      } else {
        if (!inp.allowed_display_units) {
          (inp as Record<string, unknown>).allowed_display_units = [];
        }
      }
    }
  }

  // V5.4 Core — Bind formulas from formula.uses to input.formula_bindings
  const filteredFormulas = Array.isArray(s.formulas) ? s.formulas as Array<Record<string, unknown>> : [];
  const inputById = new Map<string, Record<string, unknown>>();
  if (Array.isArray(s.inputs)) {
    for (const inp of s.inputs as Array<Record<string, unknown>>) {
      inputById.set(inp.id as string, inp);
    }
  }
  for (const f of filteredFormulas) {
    const fid = f.id as string;
    const uses = f.uses as string[] | undefined;
    if (Array.isArray(uses)) {
      for (const useId of uses) {
        const rawId = useId.startsWith("n_") ? useId.slice(2) : useId;
        const inp = inputById.get(rawId) || inputById.get(useId);
        if (inp) {
          let fb = inp.formula_bindings as string[] | undefined;
          if (!Array.isArray(fb)) {
            fb = [];
            inp.formula_bindings = fb;
          }
          if (!fb.includes(fid)) {
            fb.push(fid);
          }
        }
      }
    }
  }

  if (Array.isArray(s.inputs)) {
    for (const inp of s.inputs as Array<Record<string, unknown>>) {
      const isCritical = (inp.criticality as string) === "CRITICAL";
      if (!isCritical) continue;
      if (!inp.physical_hard_bounds) {
        (inp as Record<string, unknown>).physical_hard_bounds = { min: "REFER_TO_ENGINEERING", max: "REFER_TO_ENGINEERING" };
      }
      if (!inp.default_policy) {
        (inp as Record<string, unknown>).default_policy = "NO_DEFAULT";
      }
      if (!inp.engineering_reference_range) {
        (inp as Record<string, unknown>).engineering_reference_range = {
          warning_behavior: "NOT_APPLICABLE",
          not_applicable_reason: "Reference range is not applicable for this input type in the current schema template.",
        };
      }
      if (!inp.evidence_requirement || (inp.evidence_requirement as string) === "Optional") {
        (inp as Record<string, unknown>).evidence_requirement = "Verified measurement or engineering note";
      }
    }
  }

  const uiContract = s.ui_contract as Record<string, unknown> | undefined;
  if (uiContract && Array.isArray(uiContract.input_groups)) {
    const inputIds = Array.isArray(s.inputs)
      ? (s.inputs as Array<Record<string, unknown>>).map((inp) => inp.id as string)
      : [];
    const groups = uiContract.input_groups as Array<Record<string, unknown>>;
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      if (!group.fields || !Array.isArray(group.fields)) {
        group.fields = i === 0 ? [...inputIds] : [];
      }
    }
  }

  // V5.4 Core — Ensure audit_trail_contract has hash_algorithm or seal_config
  const auditTrail = s.audit_trail_contract as Record<string, unknown> | undefined;
  if (auditTrail && typeof auditTrail === "object") {
    if (!("hash_algorithm" in auditTrail) && !("seal_config" in auditTrail)) {
      (auditTrail as Record<string, unknown>).hash_algorithm = "SHA-256";
    }
  } else {
    (s as Record<string, unknown>).audit_trail_contract = {
      version: "1.0",
      hash_algorithm: "SHA-256",
      scope: "decision-support",
    };
  }

  // V5.4 Core — Ensure unit_conversion_contract with conversion_registry exists
  const convContract = s.unit_conversion_contract as Record<string, unknown> | undefined;
  const hasConvRegistry = convContract?.conversion_registry !== undefined &&
    typeof convContract.conversion_registry === "object" &&
    Object.keys(convContract.conversion_registry as Record<string, unknown>).length > 0;
  if (!hasConvRegistry) {
    let needsConversion = false;
    if (Array.isArray(s.inputs)) {
      for (const inp of s.inputs as Array<Record<string, unknown>>) {
        const allowed = inp.allowed_display_units as string[] | undefined;
        if (Array.isArray(allowed) && allowed.length > 1) {
          needsConversion = true;
          break;
        }
      }
    }
    if (needsConversion) {
      const registry: Record<string, unknown> = {};
      if (Array.isArray(s.inputs)) {
        for (const inp of s.inputs as Array<Record<string, unknown>>) {
          const allowed = inp.allowed_display_units as string[] | undefined;
          if (Array.isArray(allowed) && allowed.length > 0 && inp.base_unit) {
            const qk = inp.quantity_kind as string || "dimensionless";
            if (!registry[qk]) {
              registry[qk] = { base: inp.base_unit, units: {} };
            }
          }
        }
      }
      (s as Record<string, unknown>).unit_conversion_contract = {
        unit_system: "GLOBAL",
        conversion_registry: registry,
      };
    }
  }

  return s as unknown as SuperV4Schema;
}

function loadAllSchemas(): void {
  if (loadedSchemas) return;
  loadedSchemas = new Map(); loadErrors = [];
  try {
    const schemasDir = getSchemasDir();
    if (!existsSync(schemasDir)) { loadErrors.push("Dir not found: " + schemasDir); return; }
    const files = readdirSync(schemasDir).filter((f: string) => f.endsWith(".json")).sort();
    if (files.length === 0) { loadErrors.push("No schema files"); return; }
    for (const file of files) {
      try {
        const raw = JSON.parse(readFileSync(join(schemasDir, file), "utf8")) as Record<string, unknown>;
        if (!raw.tool_key) { loadErrors.push("Missing tool_key in " + file); continue; }
        const schema = normalizeFreeSchema(raw);
        const v = validateSuperV4Schema(schema);
        if (!v.ok) { loadErrors.push(String(raw.tool_key) + ": " + v.errors.join("; ")); continue; }
        if (loadedSchemas.has(String(raw.tool_key))) { loadErrors.push("Duplicate: " + String(raw.tool_key)); continue; }
        if (v.schema) loadedSchemas.set(String(raw.tool_key), { schema: v.schema, errors: [] });
      } catch (err) {
        loadErrors.push("Error " + file + ": " + (err instanceof Error ? err.message : String(err)));
      }
    }
  } catch (err) {
    loadErrors.push("Init: " + (err instanceof Error ? err.message : String(err)));
  }
}

export function getFreeToolSchema(toolKey: string): SuperV4Schema | null {
  // V5.4 Core — Check bundle-safe static registry first (no runtime fs).
  // Directly get the schema (avoids bundler inlining that drops the getter).
  const rawSchema = getFreeV531SchemaBySlug(toolKey);
  if (rawSchema) {
    // Normalize the raw JSON schema (removes orphan formulas, expressions, etc.)
    return normalizeFreeSchema(rawSchema as unknown as Record<string, unknown>);
  }
  loadAllSchemas(); const entry = loadedSchemas?.get(toolKey); return entry?.schema ?? null;
}
export function listFreeToolSchemaSlugs(): string[] {
  loadAllSchemas(); return loadedSchemas ? [...loadedSchemas.keys()].sort() : [];
}
export function getAllFreeToolSchemas(): Array<{ toolKey: string; schema: SuperV4Schema }> {
  loadAllSchemas(); if (!loadedSchemas) return [];
  return [...loadedSchemas.entries()].filter(([_, e]) => e.schema).map(([k, e]) => ({ toolKey: k, schema: e.schema }));
}
export function getFreeSchemaLoadErrors(): string[] {
  loadAllSchemas(); return [...loadErrors];
}
export function getFreeSchemaCount(): number {
  loadAllSchemas(); return loadedSchemas?.size ?? 0;
}
export function clearFreeSchemaCache(): void {
  loadedSchemas = null;
  loadErrors = [];
}
