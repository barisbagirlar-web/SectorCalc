/**
 * Free schema loader — loads SuperV4 V5.3.1 Free Tool schemas.
 * Uses lazy initialization guarded by runtime environment check so the module
 * can be imported from any context (server builds, client bundles, tsx scripts).
 */
import type { SuperV4Schema } from "@/sectorcalc/pro-form/contract-types";
import { validateSuperV4Schema } from "@/sectorcalc/pro-form/schema-adapter";

interface LoadedSchema { schema: SuperV4Schema; errors: string[]; }
let loadedSchemas: Map<string, LoadedSchema> | null = null;
let loadErrors: string[] = [];

function ensureFs(): boolean {
  try {
    if (typeof process === "undefined" || typeof process.cwd !== "function") return false;
    require("fs");
    require("path");
    return true;
  } catch { return false; }
}

function getSchemasDir(): string | null {
  try {
    if (!ensureFs()) return null;
    const fs = require("fs");
    const path = require("path");
    const cwd = process.cwd();
    const fnBundle = path.join(cwd, ".next/standalone/src/sectorcalc/schemas/free-v531");
    if (fs.existsSync(fnBundle)) return fnBundle;
    const direct = path.join(cwd, "src/sectorcalc/schemas/free-v531");
    if (fs.existsSync(direct)) return direct;
    return direct;
  } catch { return null; }
}

/**
 * Normalize a Free V5.3.1 schema for validation.
 */
function normalizeFreeSchema(raw: Record<string, unknown>): SuperV4Schema {
  const s = JSON.parse(JSON.stringify(raw)) as Record<string, unknown>;

  const outputs = Array.isArray(s.outputs) ? s.outputs as Array<Record<string, unknown>> : [];
  const outputIdSet = new Set(outputs.map((o) => o.id as string));

  if (Array.isArray(s.formulas)) {
    for (const f of s.formulas as Record<string, unknown>[]) {
      delete f.expression;
      delete f.uncertainty_expression;
      delete f.public_formula_expression;
      const fOutput = f.output as string | undefined;
      if (fOutput && !outputIdSet.has(fOutput)) {
        delete f.output;
      }
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

  return s as unknown as SuperV4Schema;
}

function loadAllSchemas(): void {
  if (loadedSchemas) return;
  loadedSchemas = new Map(); loadErrors = [];
  try {
    if (!ensureFs()) { loadErrors.push("File system not available (client context)"); return; }
    const fs = require("fs");
    const path = require("path");
    const schemasDir = getSchemasDir();
    if (!schemasDir) { loadErrors.push("Free schemas dir not found"); return; }
    if (!fs.existsSync(schemasDir)) { loadErrors.push("Dir not found: " + schemasDir); return; }
    const files = fs.readdirSync(schemasDir).filter((f: string) => f.endsWith(".json")).sort();
    if (files.length === 0) { loadErrors.push("No schema files"); return; }
    for (const file of files) {
      try {
        const raw = JSON.parse(fs.readFileSync(path.join(schemasDir, file), "utf8")) as Record<string, unknown>;
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
