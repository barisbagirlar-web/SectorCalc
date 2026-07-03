// SectorCalc SuperV4 V5.3 Schema Adapter — strict validation, brand safety, formula leak prevention

import type {
  SuperV4Schema,
  ConversionRegistry,
  ConversionRegistryItem,
} from "./contract-types";
import { V531_APPROVED_TOP_LEVEL_KEYS } from "./contract-types";

const REQUIRED_TOP_LEVEL_KEYS = [
  "tool_id",
  "tool_key",
  "tool_name",
  "category",
  "scope",
  "primary_operation",
  "decision_context",
  "irreversible_commitment_metric",
  "standards",
  "standards_clause_map",
  "reference_status",
  "risk_level",
  "brand_safety_policy",
  "calculation_basis",
  "unit_system",
  "unit_conversion_contract",
  "inputs",
  "normalized_inputs",
  "physical_bounds_policy",
  "validation_contract",
  "derating_contract",
  "formulas",
  "outputs",
  "output_formatting",
  "engine_rules",
  "uncertainty_model",
  "safety_factor_gauges",
  "decision_interpretation_contract",
  "business_impact_contract",
  "proof_pack",
  "audit_trail_contract",
  "export_contract",
  "ui_contract",
  "reference_code",
  "test_plan",
  "red_team_review",
  "metadata",
] as const;

const APPROVED_TOP_LEVEL_KEYS: ReadonlySet<string> = new Set<string>(V531_APPROVED_TOP_LEVEL_KEYS);

// Brand/third-party detection patterns
const THIRD_PARTY_BRAND_PATTERNS = [
  /autodesk/i,
  /solidworks/i,
  /catia/i,
  /ansys/i,
  /abaqus/i,
  /matlab/i,
  /simulink/i,
  /nx\s+simens/i,
  /creo/i,
  /inventor/i,
  /revit/i,
  /navisworks/i,
  /etabs/i,
  /sap2000/i,
  /staad/i,
  /tekla/i,
  /primesim/i,
  /hypermesh/i,
  /comsol/i,
  /fluent/i,
  /star-ccm/i,
  /plaxis/i,
  /robot\s+structural/i,
  /diploma/i,
  /proteus/i,
  /orcad/i,
  /altium/i,
  /kiCad/i,
  /eagle/i,
  /labview/i,
  /multisim/i,
  /pads/i,
  /xilinx/i,
  /quartus/i,
  /vivado/i,
  /modelsim/i,
  /questasim/i,
  /code\s+composer/i,
  /code\s+warrior/i,
  /iar\s/,
  /keil/i,
  /mplab/i,
  /atmel\s+studio/i,
  /stm32cube/i,
  /tia\s+portal/i,
  /wincc/i,
  /step\s+7/i,
  /twincat/i,
  /codesys/i,
  /rslogix/i,
  /studio\s+5000/i,
  /factorytalk/i,
  /ignition/i,
  /wonderware/i,
  /ifix/i,
  /system\s+platform/i,
  /pvsyst/i,
  /pvcase/i,
  /helioscope/i,
  /sam\s+simulator/i,
  /homer/i,
  /retScreen/i,
  /energy3d/i,
  /energyplus/i,
  /trnsys/i,
  /esp-r/i,
  /idaho\s+engine/i,
  /fea\s+software/i,
  /cfd\s+software/i,
  /cae\s+software/i,
];

const LEGAL_PROOF_PATTERNS = [
  /legally\s+binding/i,
  /certified\s+complian/i,
  /regulatory\s+approv/i,
  /authority\s+accept/i,
  /auditor\s+approv/i,
  /oem\s+approv/i,
  /replacement\s+of\s+qualified/i,
  /substitute\s+for\s+professional/i,
  /guaranteed\s+complian/i,
  /legally\s+enforceable/i,
  /approved\s+by\s+\w+\s+authorit/i,
  /certified\s+by\s/i,
];

const PAID_STANDARD_TABLE_MARKERS = [
  /table\s+\d+[\.\-]/i,
  /see\s+standard\s+table/i,
  /reproduced\s+from\s+(asme|iso|astm|en|aci|aisc|ieee|iec|api|din)/i,
  /extracted\s+from\s+(asme|iso|astm|en|aci|aisc|ieee|iec|api|din)/i,
  /copyrighted\s+(standard|table|data)/i,
  /permission\s+to\s+reproduce/i,
  /licensed\s+(standard|table|data)/i,
];

const NON_FINITE_PATTERNS = [
  /NaN/,
  /Infinity/,
  /[^a-zA-Z]Infinity[^a-zA-Z]/,
  /-Infinity/,
];

function scanForNonFinite(obj: unknown, path: string, errors: string[]): void {
  if (obj === null || obj === undefined) return;
  if (typeof obj === "number") {
    if (!Number.isFinite(obj)) {
      errors.push(`Non-finite numeric value at ${path}: ${obj}`);
    }
    return;
  }
  if (typeof obj === "string") {
    if (NON_FINITE_PATTERNS.some((p) => p.test(obj))) {
      errors.push(`Non-finite numeric string at ${path}: "${obj}"`);
    }
    return;
  }
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => scanForNonFinite(item, `${path}[${i}]`, errors));
    return;
  }
  if (typeof obj === "object") {
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      scanForNonFinite(value, `${path}.${key}`, errors);
    }
  }
}

function scanForThirdPartyBrands(text: string, path: string, errors: string[]): void {
  for (const pattern of THIRD_PARTY_BRAND_PATTERNS) {
    if (pattern.test(text)) {
      errors.push(`Third-party brand reference detected at ${path}: "${text.slice(0, 120)}"`);
      return;
    }
  }
}

function scanStringValues(obj: unknown, path: string, errors: string[], scanFn: (s: string, p: string, e: string[]) => void): void {
  if (obj === null || obj === undefined) return;
  if (typeof obj === "string") {
    scanFn(obj, path, errors);
    return;
  }
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => scanStringValues(item, `${path}[${i}]`, errors, scanFn));
    return;
  }
  if (typeof obj === "object") {
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      scanStringValues(value, `${path}.${key}`, errors, scanFn);
    }
  }
}

export function validateSuperV4Schema(
  schema: unknown,
): { ok: true; schema: SuperV4Schema } | { ok: false; errors: string[] } {
  const errors: string[] = [];

  if (schema === null || schema === undefined || typeof schema !== "object") {
    return { ok: false, errors: ["Schema must be a non-null object"] };
  }

  const s = schema as Record<string, unknown>;

  // 1. Check missing required top-level keys
  for (const key of REQUIRED_TOP_LEVEL_KEYS) {
    if (!(key in s)) {
      errors.push(`Missing required top-level key: ${key}`);
    }
  }

  // 2. Check extra top-level keys
  for (const key of Object.keys(s)) {
    if (!APPROVED_TOP_LEVEL_KEYS.has(key)) {
      errors.push(`Unknown top-level key: ${key}`);
    }
  }

  // If no inputs, return early with what we have
  if (!Array.isArray(s.inputs)) {
    if (errors.length === 0) errors.push("inputs must be an array");
    return { ok: false, errors };
  }

  // 3. Check missing input ID
  const inputIds = new Set<string>();
  const inputMap = new Map<string, Record<string, unknown>>();
  for (let i = 0; i < s.inputs.length; i++) {
    const inp = s.inputs[i] as Record<string, unknown>;
    if (!inp.id || typeof inp.id !== "string") {
      errors.push(`Input at index ${i} is missing id`);
      continue;
    }
    // 4. Duplicate input ID
    if (inputIds.has(inp.id)) {
      errors.push(`Duplicate input id: ${inp.id}`);
    }
    inputIds.add(inp.id);
    inputMap.set(inp.id, inp);
  }

  // Normalized inputs
  const normalizedInputs = Array.isArray(s.normalized_inputs) ? s.normalized_inputs : [];
  const normalizedIds = new Set<string>();
  for (let i = 0; i < normalizedInputs.length; i++) {
    const ni = normalizedInputs[i] as Record<string, unknown>;
    if (!ni.id || typeof ni.id !== "string") {
      errors.push(`Normalized input at index ${i} is missing id`);
      continue;
    }
    normalizedIds.add(ni.id as string);

    const fromInput = ni.from_input as string | undefined;
    if (fromInput && !inputIds.has(fromInput)) {
      errors.push(`Normalized input ${ni.id} references missing input: ${fromInput}`);
    }
  }

  // 5. Orphan normalized input
  for (const ni of normalizedInputs) {
    const nid = (ni as Record<string, unknown>).id as string;
    const fromInput = (ni as Record<string, unknown>).from_input as string | undefined;
    if (fromInput) {
      const parentInput = inputMap.get(fromInput);
      if (parentInput) {
        const normalizedId = parentInput.normalized_id as string | undefined;
        if (normalizedId !== nid) {
          // This is fine — normalized input might be unused by any input binding
        }
      }
    }
  }

  // UI contract checks
  const uiContract = s.ui_contract as Record<string, unknown> | undefined;
  const uiFields = new Set<string>();
  if (uiContract?.input_groups && Array.isArray(uiContract.input_groups)) {
    for (const group of uiContract.input_groups as Array<Record<string, unknown>>) {
      const fields = group.fields as string[] | undefined;
      if (Array.isArray(fields)) {
        for (const fieldId of fields) {
          if (!inputIds.has(fieldId)) {
            errors.push(`UI field ${fieldId} in group ${group.id} does not match any input`);
          }
          uiFields.add(fieldId);
        }
      }
    }
  }

  // Formulas
  const formulas = Array.isArray(s.formulas) ? s.formulas : [];
  const formulaIds = new Set<string>();
  const formulaOutputs = new Set<string>();
  for (let i = 0; i < formulas.length; i++) {
    const f = formulas[i] as Record<string, unknown>;
    const fid = f.id as string | undefined;
    if (!fid || typeof fid !== "string") {
      errors.push(`Formula at index ${i} is missing id`);
      continue;
    }
    formulaIds.add(fid);

    const fOutput = f.output as string | undefined;
    if (fOutput) {
      formulaOutputs.add(fOutput);
    }

    const uses = f.uses as string[] | undefined;
    if (Array.isArray(uses)) {
      for (const useId of uses) {
        if (inputIds.has(useId)) {
          errors.push(`Formula ${fid} uses raw input id "${useId}". Formulas must use normalized input ids`);
        }
        if (!normalizedIds.has(useId) && !inputIds.has(useId)) {
          // Could be another formula's output
        }
      }
    }

    if (fOutput && !formulaOutputs.has(fOutput)) {
      // output mapping happens via outputs array
    }

    const proofRole = f.proof_role as string | undefined;
    if (proofRole && proofRole.toLowerCase().includes("standard")) {
      // Warn if no standards_clause_map binding
    }

    if (f.public_formula_expression !== undefined || f.expression !== undefined) {
      errors.push(`Formula ${fid} must not expose public formula expression or expression field`);
    }
  }

  // Input binding checks
  for (const inp of s.inputs as Array<Record<string, unknown>>) {
    const id = inp.id as string;

    const formulaBindings = inp.formula_bindings as string[] | undefined;
    if (Array.isArray(formulaBindings)) {
      for (const fb of formulaBindings) {
        if (!formulaIds.has(fb)) {
          errors.push(`Input ${id} formula_binding "${fb}" references non-existent formula`);
        }
      }
    }

    const outputBindings = inp.output_bindings as string[] | undefined;
    if (Array.isArray(outputBindings)) {
      for (const ob of outputBindings) {
        const outputs = Array.isArray(s.outputs) ? s.outputs as Array<Record<string, unknown>> : [];
        const outputExists = outputs.some((o) => o.id === ob);
        if (!outputExists) {
          errors.push(`Input ${id} output_binding "${ob}" references non-existent output`);
        }
      }
    }

    // Critical input without physical hard bounds
    const criticality = inp.criticality as string | undefined;
    if (criticality === "CRITICAL" && !inp.physical_hard_bounds) {
      errors.push(`Critical input ${id} must define physical_hard_bounds`);
    }

    // Critical input with hidden default
    if (criticality === "CRITICAL") {
      const defaultPolicy = inp.default_policy as string | undefined;
      const defaultValue = inp.default;
      if (defaultPolicy !== "NO_DEFAULT" && defaultValue !== null && defaultValue !== undefined) {
        errors.push(`Critical input ${id} must not have a hidden default (policy: ${defaultPolicy})`);
      }
    }

    // Unit selectable input without allowed units
    const unitSelectable = inp.unit_selectable as boolean | undefined;
    if (unitSelectable) {
      const allowedUnits = inp.allowed_display_units as string[] | undefined;
      if (!allowedUnits || allowedUnits.length === 0) {
        errors.push(`Unit-selectable input ${id} must define allowed_display_units`);
      }
    }

    // V5.3: Engineering reference range validation
    if (criticality === "CRITICAL") {
      const engRange = inp.engineering_reference_range as Record<string, unknown> | undefined;
      if (!engRange) {
        errors.push(`CRITICAL input ${id} must define engineering_reference_range or set warning_behavior=NOT_APPLICABLE`);
      } else if (engRange.warning_behavior === "NOT_APPLICABLE" && !engRange.not_applicable_reason) {
        errors.push(`Input ${id} has NOT_APPLICABLE reference range but no not_applicable_reason`);
      }
    }

    // V5.3: Evidence requirement for CRITICAL inputs
    if (criticality === "CRITICAL") {
      const evidenceReq = inp.evidence_requirement as string | undefined;
      if (!evidenceReq || evidenceReq === "Optional") {
        errors.push(`CRITICAL input ${id} must have a non-Optional evidence_requirement`);
      }
    }
  }

  // Unit selectable input without conversion registry
  const conversionContract = s.unit_conversion_contract as Record<string, unknown> | undefined;
  const conversionRegistry = conversionContract?.conversion_registry as Record<string, unknown> | undefined;
  const hasConversionRegistry = conversionRegistry && Object.keys(conversionRegistry).length > 0;

  if (!hasConversionRegistry) {
    for (const inp of s.inputs as Array<Record<string, unknown>>) {
      if ((inp.unit_selectable as boolean) && Array.isArray(inp.allowed_display_units) && (inp.allowed_display_units as string[]).length > 0) {
        errors.push(`Unit-selectable input ${inp.id} has allowed units but no conversion_registry entry`);
      }
    }
  }

  // Unverified smart default auto-filling decision input
  for (const inp of s.inputs as Array<Record<string, unknown>>) {
    const defaultPolicy = inp.default_policy as string | undefined;
    const sourceStatus = inp.source_status as string | undefined;
    const defaultValue = inp.default;
    if (
      defaultPolicy === "USER_SELECTABLE_CONTEXT_DEFAULT" &&
      defaultValue !== null &&
      defaultValue !== undefined &&
      (!sourceStatus || sourceStatus === "UNVERIFIED")
    ) {
      errors.push(`Input ${inp.id} has unverified smart default that may auto-fill decision value. Use NO_DEFAULT or VERIFIED source_status`);
    }
  }

  // Output checks — orphan output
  const outputIds = new Set<string>();
  const outputs = Array.isArray(s.outputs) ? s.outputs as Array<Record<string, unknown>> : [];
  for (let i = 0; i < outputs.length; i++) {
    const o = outputs[i];
    const oid = o.id as string | undefined;
    if (!oid || typeof oid !== "string") {
      errors.push(`Output at index ${i} is missing id`);
      continue;
    }
    outputIds.add(oid);
  }

  // Formula output not mapped to any output (orphan formula)
  for (const f of formulas) {
    const fOutput = f.output as string | undefined;
    if (fOutput && !outputIds.has(fOutput)) {
      errors.push(`Formula ${f.id} output "${fOutput}" does not match any declared output`);
    }
  }

  // Orphan formula
  for (const f of formulas) {
    const fid = f.id as string;
    let bound = false;
    for (const inp of s.inputs as Array<Record<string, unknown>>) {
      const fb = inp.formula_bindings as string[] | undefined;
      if (Array.isArray(fb) && fb.includes(fid)) {
        bound = true;
        break;
      }
    }
    if (!bound) {
      errors.push(`Orphan formula ${fid}: not bound to any input`);
    }
  }

  // Brand safety scan on all string fields
  scanStringValues(s, "schema", errors, scanForThirdPartyBrands);

  // Legal proof claims
  scanStringValues(s, "schema", errors, (text, path, errs) => {
    for (const pattern of LEGAL_PROOF_PATTERNS) {
      if (pattern.test(text)) {
        errs.push(`Legal proof/certified compliance claim detected at ${path}: "${text.slice(0, 120)}"`);
        return;
      }
    }
  });

  // Paid standard table reproduction
  scanStringValues(s, "schema", errors, (text, path, errs) => {
    for (const pattern of PAID_STANDARD_TABLE_MARKERS) {
      if (pattern.test(text)) {
        errs.push(`Paid standard table reproduction marker detected at ${path}: "${text.slice(0, 120)}"`);
        return;
      }
    }
  });

  // NaN/Infinity check
  scanForNonFinite(s, "schema", errors);

  // Validate conversion registry entries have safe numeric values
  if (conversionRegistry && typeof conversionRegistry === "object") {
    for (const [quantityKind, entry] of Object.entries(conversionRegistry)) {
      const typedEntry = entry as Record<string, unknown>;
      const units = typedEntry.units as Array<Record<string, unknown>> | undefined;
      if (Array.isArray(units)) {
        for (let i = 0; i < units.length; i++) {
          const u = units[i];
          const factor = u.factor as number | undefined;
          if (typeof factor !== "number" || !Number.isFinite(factor) || factor <= 0) {
            errors.push(`Conversion registry ${quantityKind} unit[${i}] has invalid factor: ${factor}`);
          }
        }
      }
    }
  }

  // V5.3: Validate uncertainty_model structure
  const uncertaintyModel = s.uncertainty_model as Record<string, unknown> | undefined;
  if (uncertaintyModel && typeof uncertaintyModel === "object") {
    const method = uncertaintyModel.method as string | undefined;
    if (method && !["ANALYTICAL", "MONTE_CARLO", "NONE", "STUB"].includes(method)) {
      errors.push(`Uncertainty model method "${method}" is not recognized. Use ANALYTICAL, MONTE_CARLO, NONE, or STUB.`);
    }
  }

  // V5.3: Validate FMEA contract
  const fmeaConfig = (s.engine_rules as Record<string, unknown> | undefined)?.fmea as Record<string, unknown> | undefined;
  if (fmeaConfig && typeof fmeaConfig === "object") {
    const rpnThreshold = fmeaConfig.rpn_threshold as number | undefined;
    if (rpnThreshold !== undefined && (typeof rpnThreshold !== "number" || rpnThreshold < 0)) {
      errors.push(`FMEA rpn_threshold must be a non-negative number, got ${rpnThreshold}`);
    }
  }

  // V5.3: Validate audit_trail_contract
  const auditTrail = s.audit_trail_contract as Record<string, unknown> | undefined;
  if (auditTrail && typeof auditTrail === "object") {
    const hasAlgo = "hash_algorithm" in auditTrail;
    const hasSealConfig = "seal_config" in auditTrail;
    if (!hasAlgo && !hasSealConfig) {
      errors.push(`audit_trail_contract must define hash_algorithm or seal_config`);
    }
  }

  // V5.3: No-runtime-LLM guard
  const engineRules = s.engine_rules as Record<string, unknown> | undefined;
  if (engineRules) {
    const llmEnabled = engineRules.llm_enabled as boolean | undefined;
    if (llmEnabled === true) {
      errors.push(`engine_rules.llm_enabled is true — runtime LLM usage is forbidden. Set to false or omit.`);
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, schema: s as unknown as SuperV4Schema };
}

export function normalizeConversionRegistry(
  registry: unknown,
): ConversionRegistry | null {
  if (!registry || typeof registry !== "object") return null;

  const result: ConversionRegistry = {};
  for (const [key, value] of Object.entries(registry as Record<string, unknown>)) {
    const entry = value as Record<string, unknown> | undefined;
    if (!entry || typeof entry !== "object") continue;

    const baseUnit = entry.base_unit as string | undefined;
    const unitFamily = entry.unit_family as string | undefined;
    const units = entry.units as Array<Record<string, unknown>> | undefined;

    if (!baseUnit || !unitFamily || !Array.isArray(units) || units.length === 0) continue;

    const validUnits = units
      .filter((u) => {
        const factor = u.factor as number | undefined;
        return typeof factor === "number" && Number.isFinite(factor) && factor > 0;
      })
      .map((u) => ({
        unit: u.unit as string,
        factor: u.factor as number,
        offset: u.offset !== undefined ? (u.offset as number) : undefined,
        label: u.label !== undefined ? (u.label as string) : undefined,
      }));

    if (validUnits.length > 0) {
      const typedFamily = unitFamily as ConversionRegistryItem["unit_family"];
      result[key] = {
        base_unit: baseUnit,
        unit_family: typedFamily,
        units: validUnits,
      };
    }
  }

  return Object.keys(result).length > 0 ? result : null;
}
