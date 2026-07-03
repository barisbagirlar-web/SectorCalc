// PremiumCalculatorSchema -> SuperV4Schema adapter
// Lives in premium-schema domain because the source type lives here.
// No bridge concept — local format conversion only.

import type { SuperV4Schema, SuperV4Input, NormalizedInputSpec, ProfileMode, UIInputGroup } from "@/sectorcalc/pro-form/contract-types";

interface LegacyInput {
  id: string;
  label: string;
  type: string;
  unit?: string;
  required?: boolean;
  smartDefault?: number | string | boolean;
  validation?: { min?: number; max?: number; step?: number };
  helper?: string;
  options?: ReadonlyArray<{ value: string; label: string }>;
  group?: string;
}

interface LegacyOutput {
  id: string;
  label: string;
  unit?: string;
  format?: string;
  isBigNumber?: boolean;
}

function inferUnitFamily(unit: string): string {
  const u = unit.toLowerCase();
  if (["mm", "cm", "m", "in", "ft", "km", "yd"].includes(u)) return "LENGTH";
  if (["mm2", "cm2", "m2", "in2", "ft2", "ha"].includes(u)) return "AREA";
  if (["ml", "l", "m3", "gal", "ft3", "in3"].includes(u)) return "VOLUME";
  if (["g", "kg", "t", "lb", "oz"].includes(u)) return "MASS";
  if (["n", "kn", "lbf"].includes(u)) return "FORCE";
  if (["pa", "kpa", "mpa", "bar", "psi", "atm"].includes(u)) return "PRESSURE";
  if (["c", "f", "k"].includes(u)) return "TEMPERATURE_ABSOLUTE";
  if (["j", "kj", "kwh", "btu", "cal"].includes(u)) return "ENERGY";
  if (["w", "kw", "mw", "hp"].includes(u)) return "POWER";
  if (["s", "min", "h", "day", "week", "month", "year"].includes(u)) return "TIME";
  if (["%", "percent"].includes(u)) return "RATE";
  if (["kg/m3", "lb/ft3", "g/cm3"].includes(u)) return "DENSITY";
  if (["deg", "rad", "gon"].includes(u)) return "ANGLE";
  return "DIMENSIONLESS";
}

export function premiumSchemaToSuperV4Schema(
  legacy: {
    id: string;
    name: string;
    sectorSlug?: string;
    category?: string;
    painStatement?: string;
    inputs: LegacyInput[];
    outputs: LegacyOutput[];
    thresholds?: Array<{
      fieldId: string;
      warning: number;
      critical?: number;
      direction: string;
      warningMessage: string;
      criticalMessage?: string;
    }>;
    assumptions?: Record<string, unknown>;
    legacyFormulas?: Record<string, string>;
  },
): SuperV4Schema {
  const inputGroupsMap = new Map<string, string[]>();
  const normalizedInputs: NormalizedInputSpec[] = [];
  const inputs: SuperV4Input[] = Array.from(legacy.inputs).map((inp, idx) => {
    const groupId = inp.group || "general";
    if (!inputGroupsMap.has(groupId)) {
      inputGroupsMap.set(groupId, []);
    }
    inputGroupsMap.get(groupId)!.push(inp.id);

    const normalizedId = `${inp.id}_norm`;
    const actualType = inp.type === "boolean" ? "boolean" as const
      : inp.type === "select" ? "select" as const
      : "number" as const;
    const unitSelectable = Boolean(inp.unit) && inp.unit !== "boolean" && inp.unit !== "enum";
    const actualUnit = (!inp.unit || inp.unit === "number" || inp.unit === "boolean" || inp.unit === "enum") ? "" : inp.unit;

    normalizedInputs.push({
      id: normalizedId,
      from_input: inp.id,
      quantity_kind: inferUnitFamily(actualUnit),
      base_unit: actualUnit || "",
    });

    const outputBindings: string[] = [];
    for (const out of Array.from(legacy.outputs)) {
      if (out.label?.toLowerCase().includes(inp.id.toLowerCase())) {
        outputBindings.push(out.id);
      }
    }

    return {
      id: inp.id,
      name: inp.label || inp.id,
      symbol: inp.id.slice(0, 2).toUpperCase(),
      type: actualType,
      required: inp.required ?? true,
      criticality: actualType === "boolean" ? "LOW" : (inp.required ? "HIGH" : "MEDIUM"),
      quantity_kind: inferUnitFamily(actualUnit),
      unit_selectable: unitSelectable,
      allowed_display_units: unitSelectable ? [actualUnit] : [],
      base_unit: actualUnit || null,
      normalized_id: normalizedId,
      default: inp.smartDefault ?? null,
      default_policy: inp.smartDefault !== undefined && inp.smartDefault !== null
        ? "USER_SELECTABLE_CONTEXT_DEFAULT"
        : "NO_DEFAULT",
      source_status: "UNVERIFIED",
      evidence_requirement: inp.required ? "Required for calculation" : "Optional",
      reference_values: [],
      formula_bindings: [],
      output_bindings: outputBindings.length > 0
        ? outputBindings
        : Array.from(legacy.outputs).map((o) => o.id),
      help_text: inp.helper || "",
      semantic_error_messages: inp.validation
        ? {
            ...(inp.validation.min !== undefined ? { too_low: `Value must be >= ${inp.validation.min}` } : {}),
            ...(inp.validation.max !== undefined ? { too_high: `Value must be <= ${inp.validation.max}` } : {}),
          }
        : undefined,
      precision: actualType === "number" ? {
        input_decimals: 4,
        display_decimals: 2,
        calculation_precision: "FULL_DOUBLE",
      } : undefined,
      ui_binding: {
        group_id: groupId,
        field_order: idx,
        advanced: false,
        visible_in_modes: ["quick", "engineering", "cost", "audit"] as ProfileMode[],
      },
    };
  });

  const inputGroups: UIInputGroup[] = [];
  for (const [groupId, fields] of inputGroupsMap.entries()) {
    inputGroups.push({
      id: groupId,
      title: groupId.charAt(0).toUpperCase() + groupId.slice(1),
      description: "",
      mode_visibility: ["quick", "engineering", "cost", "audit"] as ProfileMode[],
      fields,
    });
  }

  if (inputGroups.length === 0) {
    inputGroups.push({
      id: "general",
      title: "Input Parameters",
      description: "",
      mode_visibility: ["quick", "engineering", "cost", "audit"] as ProfileMode[],
      fields: Array.from(legacy.inputs).map((i) => i.id),
    });
  }

  const outputs = Array.from(legacy.outputs).map((out) => ({
    id: out.id,
    name: out.label || out.id,
    value: null,
    public_explanation: `${out.label || out.id} calculation result`,
    decision_use: out.isBigNumber ? "Primary decision metric" : "Supporting output",
  }));

  const formulas = Array.from(legacy.outputs).map((out) => ({
    id: `f_${out.id}`,
    uses: normalizedInputs.map((ni) => ni.id),
    output: out.id,
    proof_role: "calculation",
  }));

  return {
    tool_id: legacy.id,
    tool_key: legacy.id,
    tool_name: legacy.name || legacy.id,
    category: legacy.category || legacy.sectorSlug || "General",
    scope: legacy.sectorSlug || "general",
    primary_operation: "calculate",
    decision_context: {},
    irreversible_commitment_metric: outputs[0]?.id || "result",
    standards: [],
    standards_clause_map: [],
    reference_status: "UNVERIFIED",
    risk_level: "MEDIUM",
    brand_safety_policy: {},
    calculation_basis: {},
    unit_system: {},
    unit_conversion_contract: { conversion_registry: {} },
    inputs,
    normalized_inputs: normalizedInputs,
    reference_value_policy: {},
    form_runtime_binding: {
      renderer: "UniversalIndustrialDecisionForm",
      schema_generation_runtime: "offline",
      llm_runtime_usage: "FORBIDDEN",
      client_formula_execution: "FORBIDDEN",
      server_execution_required: true,
      state_management_required: true,
      dynamic_ui_contract_required: true,
      json_schema_form_substrate_allowed: false,
      generic_json_schema_form_alone_sufficient: false,
      state_domains: [],
      state_transitions: [],
      execute_request_contract: {},
      execute_response_contract: {},
    },
    precision_policy: {},
    physical_bounds_policy: {},
    validation_contract: {},
    derating_contract: {},
    formulas,
    outputs,
    output_formatting: {},
    engine_rules: {},
    uncertainty_model: {},
    safety_factor_gauges: [],
    decision_interpretation_contract: {},
    business_impact_contract: {},
    proof_pack: {},
    audit_trail_contract: {},
    export_contract: {},
    ui_contract: {
      target_renderer: "UniversalIndustrialDecisionForm",
      profile_modes: ["quick", "engineering", "cost", "audit"],
      input_groups: inputGroups,
      sticky_decision_cockpit: true,
      mobile_bottom_action_bar: true,
      normalized_preview_required: true,
      reference_values_visible: true,
      evidence_controls_required: true,
      semantic_error_summary_required: true,
      safety_factor_gauges_required: true,
      hidden_risk_panel_required: true,
      business_impact_panel_required: true,
      standards_clause_panel_required: true,
      protected_methodology_panel_required: true,
      audit_seal_panel_required: true,
      accessibility: {},
    },
    reference_code: {},
    test_plan: {},
    red_team_review: {},
    metadata: {
      schema_version: "1.0.0",
      formula_version: "1.0.0",
    },
  };
}
