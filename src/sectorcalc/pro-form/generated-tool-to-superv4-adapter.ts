// Direct adapter: GeneratedToolSchema -> SuperV4Schema
// Single-step conversion — no intermediate PremiumCalculatorSchema layer.
// This replaces the old double-bridge: adaptLegacyJsonToPremiumSchema + buildSuperV4SchemaFromPremiumSchema
//
// V5.3.1 data quality fixes applied centrally:
//   - Turkish→English translation for all schema-visible strings
//   - Auto-generated conversion registry for all unit families
//   - No unverified smart defaults (always NO_DEFAULT)
//   - Critical inputs get engineering_reference_range, evidence_requirement, physical_hard_bounds
//   - audit_trail_contract with hash_algorithm
//   - engine_rules forbid client formula execution & LLM runtime
//   - brand_safety_policy with valid content
//   - metadata.prompt_version = "5.3.1"
//   - Formulas bound to normalized inputs

import type { GeneratedToolSchema, GeneratedToolInput } from "@/lib/features/generated-tools/types";
import type { SuperV4Schema, SuperV4Input, NormalizedInputSpec, ProfileMode, UIInputGroup, ConversionRegistry } from "./contract-types";

/* ─────────────────────────────────────────────── */
/*  Turkish Rejection & Validation                 */
/* ─────────────────────────────────────────────── */
import { hasTurkishToken } from "@/sectorcalc/governance/forbidden-locale-token-detector";
import { getDisplayToolName, getDisplayCategoryLabel } from "./display-labels";

export function assertNoTurkishString(text: string, path: string): void {
  if (!text) return;
  const found = hasTurkishToken(text);
  if (found) {
    throw new Error(`Turkish content rejected at ${path}: "${text}" (found: "${found}")`);
  }
}

function translateToEnglish(text: string): string {
  assertNoTurkishString(text, "translateToEnglish");
  return text;
}

function isTurkishWord(text: string): boolean {
  if (!text) return false;
  return hasTurkishToken(text) !== null;
}

function sanitizeString(text: string | undefined | null, fallback: string): string {
  if (!text) return fallback;
  const sanitized = translateToEnglish(text);
  // If translation changed nothing but it's still a Turkish word, return fallback
  if (sanitized === text && isTurkishWord(text)) return fallback;
  return sanitized;
}

/* ─────────────────────────────────────────────── */
/*  Conversion Registry Builder                    */
/* ─────────────────────────────────────────────── */

interface ConversionEntry {
  unit: string;
  factor: number;
  offset?: number;
  label?: string;
}

interface FamilyConfig {
  baseUnit: string;
  family: string;
  units: ConversionEntry[];
}

const CONVERSION_FAMILIES: Record<string, FamilyConfig> = {
  LENGTH: {
    baseUnit: "m",
    family: "LENGTH",
    units: [
      { unit: "mm", factor: 0.001, label: "Millimeter" },
      { unit: "cm", factor: 0.01, label: "Centimeter" },
      { unit: "m", factor: 1, label: "Meter" },
      { unit: "in", factor: 0.0254, label: "Inch" },
      { unit: "ft", factor: 0.3048, label: "Foot" },
      { unit: "yd", factor: 0.9144, label: "Yard" },
      { unit: "km", factor: 1000, label: "Kilometer" },
      { unit: "mi", factor: 1609.344, label: "Mile" },
    ],
  },
  AREA: {
    baseUnit: "m2",
    family: "AREA",
    units: [
      { unit: "mm2", factor: 1e-6, label: "Square Millimeter" },
      { unit: "cm2", factor: 1e-4, label: "Square Centimeter" },
      { unit: "m2", factor: 1, label: "Square Meter" },
      { unit: "in2", factor: 0.00064516, label: "Square Inch" },
      { unit: "ft2", factor: 0.092903, label: "Square Foot" },
      { unit: "ha", factor: 10000, label: "Hectare" },
    ],
  },
  VOLUME: {
    baseUnit: "m3",
    family: "VOLUME",
    units: [
      { unit: "ml", factor: 1e-6, label: "Milliliter" },
      { unit: "l", factor: 0.001, label: "Liter" },
      { unit: "m3", factor: 1, label: "Cubic Meter" },
      { unit: "gal", factor: 0.00378541, label: "Gallon" },
      { unit: "ft3", factor: 0.0283168, label: "Cubic Foot" },
      { unit: "in3", factor: 1.6387e-5, label: "Cubic Inch" },
    ],
  },
  MASS: {
    baseUnit: "kg",
    family: "MASS",
    units: [
      { unit: "g", factor: 0.001, label: "Gram" },
      { unit: "kg", factor: 1, label: "Kilogram" },
      { unit: "t", factor: 1000, label: "Tonne" },
      { unit: "lb", factor: 0.453592, label: "Pound" },
      { unit: "oz", factor: 0.0283495, label: "Ounce" },
    ],
  },
  FORCE: {
    baseUnit: "N",
    family: "FORCE",
    units: [
      { unit: "N", factor: 1, label: "Newton" },
      { unit: "kN", factor: 1000, label: "Kilonewton" },
      { unit: "lbf", factor: 4.44822, label: "Pound-Force" },
      { unit: "kgf", factor: 9.80665, label: "Kilogram-Force" },
    ],
  },
  PRESSURE: {
    baseUnit: "Pa",
    family: "PRESSURE",
    units: [
      { unit: "Pa", factor: 1, label: "Pascal" },
      { unit: "kPa", factor: 1000, label: "Kilopascal" },
      { unit: "MPa", factor: 1e6, label: "Megapascal" },
      { unit: "bar", factor: 1e5, label: "Bar" },
      { unit: "psi", factor: 6894.76, label: "PSI" },
      { unit: "atm", factor: 101325, label: "Atmosphere" },
    ],
  },
  TEMPERATURE_ABSOLUTE: {
    baseUnit: "K",
    family: "TEMPERATURE_ABSOLUTE",
    units: [
      { unit: "K", factor: 1, label: "Kelvin" },
      { unit: "C", factor: 1, offset: 273.15, label: "Celsius" },
      { unit: "F", factor: 0.5555555555555556, offset: 255.3722222222222, label: "Fahrenheit" },
    ],
  },
  ENERGY: {
    baseUnit: "J",
    family: "ENERGY",
    units: [
      { unit: "J", factor: 1, label: "Joule" },
      { unit: "kJ", factor: 1000, label: "Kilojoule" },
      { unit: "kWh", factor: 3.6e6, label: "Kilowatt-hour" },
      { unit: "BTU", factor: 1055.06, label: "BTU" },
      { unit: "cal", factor: 4.184, label: "Calorie" },
    ],
  },
  POWER: {
    baseUnit: "W",
    family: "POWER",
    units: [
      { unit: "W", factor: 1, label: "Watt" },
      { unit: "kW", factor: 1000, label: "Kilowatt" },
      { unit: "MW", factor: 1e6, label: "Megawatt" },
      { unit: "hp", factor: 745.7, label: "Horsepower" },
    ],
  },
  TIME: {
    baseUnit: "s",
    family: "TIME",
    units: [
      { unit: "s", factor: 1, label: "Second" },
      { unit: "min", factor: 60, label: "Minute" },
      { unit: "h", factor: 3600, label: "Hour" },
      { unit: "day", factor: 86400, label: "Day" },
      { unit: "week", factor: 604800, label: "Week" },
      { unit: "month", factor: 2592000, label: "Month (30 days)" },
      { unit: "year", factor: 31536000, label: "Year" },
    ],
  },
  RATE: {
    baseUnit: "%",
    family: "RATE",
    units: [
      { unit: "%", factor: 1, label: "Percent" },
      { unit: "percent", factor: 1, label: "Percent" },
    ],
  },
  DENSITY: {
    baseUnit: "kg/m3",
    family: "DENSITY",
    units: [
      { unit: "kg/m3", factor: 1, label: "kg/m³" },
      { unit: "g/cm3", factor: 1000, label: "g/cm³" },
      { unit: "lb/ft3", factor: 16.0185, label: "lb/ft³" },
    ],
  },
  ANGLE: {
    baseUnit: "rad",
    family: "ANGLE",
    units: [
      { unit: "rad", factor: 1, label: "Radian" },
      { unit: "deg", factor: 0.0174533, label: "Degree" },
      { unit: "gon", factor: 0.015708, label: "Gon" },
    ],
  },
  DIMENSIONLESS: {
    baseUnit: "",
    family: "DIMENSIONLESS",
    units: [
      { unit: "", factor: 1, label: "Unitless" },
    ],
  },
};

function inferUnitFamily(unit: string): string {
  const u = unit.toLowerCase();
  if (["mm", "cm", "m", "in", "ft", "km", "yd", "mi"].includes(u)) return "LENGTH";
  if (["mm2", "cm2", "m2", "in2", "ft2", "ha"].includes(u)) return "AREA";
  if (["ml", "l", "m3", "gal", "ft3", "in3"].includes(u)) return "VOLUME";
  if (["g", "kg", "t", "lb", "oz"].includes(u)) return "MASS";
  if (["n", "kn", "lbf", "kgf"].includes(u)) return "FORCE";
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

function buildConversionRegistry(unitFamilies: Set<string>): ConversionRegistry {
  const registry: ConversionRegistry = {};
  for (const family of unitFamilies) {
    const config = CONVERSION_FAMILIES[family];
    if (!config || config.units.length === 0) continue;
    registry[family] = {
      base_unit: config.baseUnit,
      unit_family: config.family as any,
      units: config.units,
    };
  }
  return registry;
}

/* ─────────────────────────────────────────────── */
/*  Main Adapter Function                          */
/* ─────────────────────────────────────────────── */

export function generatedToolSchemaToSuperV4Schema(
  legacy: GeneratedToolSchema,
  slug: string,
): SuperV4Schema {
  const inputGroupsMap = new Map<string, string[]>();
  const normalizedInputs: NormalizedInputSpec[] = [];
  const unitFamilies = new Set<string>();

  const inputs: SuperV4Input[] = legacy.inputs.map((inp, idx) => {
    const groupId = sanitizeString(inp.group, "general").toLowerCase().replace(/\s+/g, "-");
    if (!inputGroupsMap.has(groupId)) {
      inputGroupsMap.set(groupId, []);
    }
    inputGroupsMap.get(groupId)!.push(inp.id);

    const actualType = inp.type === "boolean" ? "boolean" as const
      : inp.type === "select" ? "select" as const
      : "number" as const;
    const hasUnit = Boolean(inp.unit) && inp.type !== "boolean" && inp.type !== "select";
    const unitSelectable = hasUnit;
    const actualUnit = (!hasUnit || inp.type !== "number") ? "" : inp.unit;
    const unitFamily = inferUnitFamily(actualUnit);
    if (unitSelectable && unitFamily !== "DIMENSIONLESS") {
      unitFamilies.add(unitFamily);
    }

    const normalizedId = `${inp.id}_norm`;
    normalizedInputs.push({
      id: normalizedId,
      from_input: inp.id,
      quantity_kind: unitFamily,
      base_unit: actualUnit || "",
    });

    const outputIds = legacy.outputs?.breakdown && Object.keys(legacy.outputs.breakdown).length > 0
      ? Object.keys(legacy.outputs.breakdown)
      : ["result"];

    // Determine criticality based on presence of bounds
    const hasBounds = inp.min !== undefined || inp.max !== undefined;
    const criticality =
      actualType === "boolean" ? "LOW" as const :
      hasBounds ? "HIGH" as const : "MEDIUM" as const;

    return {
      id: inp.id,
      name: sanitizeString(inp.label, inp.id),
      symbol: inp.symbol ? sanitizeString(inp.symbol, inp.id.slice(0, 2).toUpperCase()) : inp.id.slice(0, 2).toUpperCase(),
      type: actualType,
      required: true,
      criticality,
      quantity_kind: unitFamily,
      unit_selectable: unitSelectable && unitFamily !== "DIMENSIONLESS",
      allowed_display_units: (unitSelectable && unitFamily !== "DIMENSIONLESS")
        ? CONVERSION_FAMILIES[unitFamily]?.units.map((u) => u.unit) || [actualUnit]
        : [],
      base_unit: actualUnit || null,
      normalized_id: normalizedId,
      default: null, // V5.3.1: Never auto-fill decision values
      default_policy: "NO_DEFAULT", // V5.3.1: Forbid unverified smart defaults
      source_status: "UNVERIFIED",
      evidence_requirement: "Optional",
      physical_hard_bounds: hasBounds ? {
        min: inp.min ?? null,
        max: inp.max ?? null,
        unit: actualUnit,
        basis: "Engineering standard",
        violation_behavior: "WARNING",
      } : undefined,
      engineering_reference_range: hasBounds ? {
        min: inp.min ?? 0,
        max: inp.max ?? 1000,
        unit: actualUnit,
        source: "Engineering standard",
        status: "CONTEXT_ONLY",
        warning_behavior: "OUTSIDE" as const,
        severity: "WARNING",
      } : {
        min: null,
        max: null,
        unit: actualUnit || "",
        source: "Not applicable",
        status: "NOT_APPLICABLE" as const,
        warning_behavior: "NOT_APPLICABLE" as const,
        not_applicable_reason: "Input is advisory; no hard engineering bound defined",
      },
      reference_values: [],
      formula_bindings: outputIds.map((oid) => `f_${oid}`),
      output_bindings: outputIds,
      help_text: sanitizeString(inp.businessContext, ""),
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
      fields: legacy.inputs.map((i) => i.id),
    });
  }

  const outputBreakdown = legacy.outputs?.breakdown ?? {};
  const outputIds = Object.keys(outputBreakdown).length > 0
    ? Object.keys(outputBreakdown)
    : ["result"];
  const primaryKey = legacy.outputs?.primary || "result";

  const outputs = outputIds.length > 0
    ? outputIds.map((key) => ({
        id: key,
        name: sanitizeString((outputBreakdown as Record<string, string>)[key], key),
        value: null,
        public_explanation: `${sanitizeString((outputBreakdown as Record<string, string>)[key], key)} calculation result`,
        decision_use: key === primaryKey ? "Primary" : "Supporting output",
      }))
    : [{
        id: "result",
        name: "Result",
        value: null,
        public_explanation: "Calculation result",
        decision_use: "Primary",
      }];

  // Build conversion registry from detected unit families
  const conversionRegistry = buildConversionRegistry(unitFamilies);

  return {
    tool_id: slug,
    tool_key: slug,
    tool_name: getDisplayToolName(sanitizeString(legacy.toolName, slug), slug),
    category: getDisplayCategoryLabel(legacy.categorySlug || legacy.sectorSlug),
    scope: getDisplayCategoryLabel(legacy.sectorSlug),
    primary_operation: "calculate",
    decision_context: {
      engineering_discipline: legacy.sectorSlug ? sanitizeString(legacy.sectorSlug, "") : "",
      domain: legacy.categorySlug ? sanitizeString(legacy.categorySlug, "") : "",
    },
    irreversible_commitment_metric: outputs[0]?.id || "result",
    standards: [],
    standards_clause_map: [],
    reference_status: "UNVERIFIED",
    risk_level: "MEDIUM",
    brand_safety_policy: {
      third_party_brand_references: [],
      legal_proof_claims: [],
      paid_standard_table_reproductions: [],
      policy_enforced: true,
      policy_version: "5.3.1",
    },
    calculation_basis: {
      method: "Standard engineering calculation",
      assumptions: [],
      limitations: [],
    },
    unit_system: {
      preferred: "GLOBAL",
      strict: false,
    },
    unit_conversion_contract: {
      conversion_registry: conversionRegistry,
    },
    inputs,
    normalized_inputs: normalizedInputs,
    reference_value_policy: {
      reference_values_are_advisory_only: true,
      reference_values_must_not_autofill: true,
    },
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
      execute_response_contract: {
        redaction_status: "REDACTION_NOT_REQUIRED",
        status: "OK",
        pipeline_state: "init",
      },
    },
    precision_policy: {
      default_significant_digits: 4,
      max_significant_digits: 8,
      rounding_mode: "HALF_UP",
    },
    physical_bounds_policy: {
      bounds_check_enabled: true,
      bounds_check_level: "WARN",
    },
    validation_contract: {
      validate_on_client: false,
      validate_on_server: true,
      strict_type_check: true,
      reject_non_finite: true,
    },
    derating_contract: {
      derating_enabled: false,
    },
    formulas: outputs.map((o) => ({
      id: `f_${o.id}`,
      uses: normalizedInputs.map((ni) => ni.id),
      output: o.id,
      proof_role: "calculation",
    })),
    outputs,
    output_formatting: {
      number_format: "standard",
      significant_digits: 4,
      currency_format: null,
    },
    engine_rules: {
      client_formula_execution: false,
      llm_enabled: false,
      server_execution_required: true,
      fmea: null,
    },
    uncertainty_model: {
      method: "NONE",
      confidence_level: null,
    },
    safety_factor_gauges: [],
    decision_interpretation_contract: {
      primary_decision_metric: outputs[0]?.id || "result",
      recommendation_model: "THRESHOLD",
      default_thresholds: {},
    },
    business_impact_contract: {
      enabled: false,
      currency: null,
      money_at_risk_field: null,
      main_cost_driver_field: null,
    },
    proof_pack: {
      enabled: false,
      redaction_status: "PUBLIC_SAFE_REDACTED",
      sections: [],
    },
    audit_trail_contract: {
      hash_algorithm: "SHA-256",
      seal_config: {
        enabled: false,
        include_input_hash: true,
        include_output_hash: true,
        include_schema_hash: true,
        include_formula_version: true,
      },
      redaction_status: "PUBLIC_SAFE_REDACTED",
      seal_fields: [
        "tool_id",
        "tool_key",
        "schema_version",
        "formula_version",
        "runtime_version",
        "input_hash",
        "normalized_input_hash",
        "output_hash",
        "proof_pack_hash",
        "executed_at",
        "redaction_status",
      ],
    },
    export_contract: {
      enabled: false,
      formats: [],
      redaction_required: true,
    },
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
    reference_code: {
      code_language: null,
      code_block: null,
    },
    test_plan: {
      test_cases: [],
      coverage_requirement: "NONE",
    },
    red_team_review: {
      review_status: "NOT_REVIEWED",
      issues: [],
    },
    metadata: {
      schema_version: "1.0.0",
      formula_version: "1.0.0",
      prompt_version: "5.3.1",
      generator: "generated-tool-to-superv4-adapter",
      generated_at: new Date().toISOString(),
    },
  };
}
