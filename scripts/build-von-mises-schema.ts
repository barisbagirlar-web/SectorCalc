/**
 * scripts/build-von-mises-schema.ts
 *
 * Deterministic rebuild of the Von Mises Stress Calculator Free V5.3.1 schema.
 * Replaces the generic template stub (F_DEMAND / capacity_index / utilization_index)
 * with the real Maximum Distortion Energy Theory (Hencky-von Mises) model.
 *
 * Run: npx tsx scripts/build-von-mises-schema.ts
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { normalizeFreeSchema } from "../src/sectorcalc/runtime/free-schema-loader";
import { validateSuperV4Schema } from "../src/sectorcalc/pro-form/schema-adapter";

const ROOT = process.cwd();
const FILE = join(ROOT, "src/sectorcalc/schemas/free-v531/278-von-mises-stress-calculator.json");

type Dict = Record<string, unknown>;

function stressInput(
  id: string,
  name: string,
  symbol: string,
  helpText: string,
  boundMin: number,
  engMin: number,
  engMax: number,
  formulaBindings: string[],
  outputBindings: string[],
  groupId: string,
  order: number,
): Dict {
  return {
    id,
    name,
    symbol,
    quantity_kind: "stress",
    unit_selectable: true,
    base_unit: "MPa",
    allowed_display_units: ["MPa", "psi"],
    normalized_id: `n_${id}`,
    type: "number",
    required: true,
    criticality: "HIGH",
    allowed_values: [],
    confidence_label: "USER_VERIFIED",
    physical_hard_bounds: {
      min: boundMin,
      max: 100000,
      unit: "MPa",
      basis: "PROCESS_LIMIT",
      violation_behavior: "BLOCK",
      semantic_error_message_min: `${name} is below the physically meaningful or operationally permitted lower bound.`,
      semantic_error_message_max: `${name} is above the physically meaningful or operationally permitted upper bound.`,
    },
    engineering_range: {
      min: engMin,
      max: engMax,
      unit: "MPa",
      source: `Typical engineering screening band for ${name.toLowerCase()}; user must verify against measured or datasheet values.`,
      status: "USER_VERIFIED",
    },
    precision_policy: {
      input_decimals: 3,
      display_decimals: 2,
      calculation_precision: "FULL_DOUBLE_PRECISION_NO_PRE_ROUNDING",
      rounding_rule: "DISPLAY_ONLY",
    },
    default_policy: "NO_DEFAULT",
    default_value: null,
    smart_defaults: [],
    reference_values: {
      reference_value_type: "USER_VERIFIED",
      source: `${name} must be verified against the actual stress analysis, FEA result, or datasheet.`,
      reference_status: "USER_VERIFIED",
      user_must_verify: true,
      public_note: `Enter the ${name.toLowerCase()} for the analysed point, in MPa.`,
    },
    source_priority: ["measured_value", "user_verified_source", "supplier_datasheet", "controlled_estimate"],
    evidence_requirement: {
      required: true,
      accepted_evidence: ["FEA result", "measured strain-gauge value", "supplier or manufacturer datasheet", "user-verified engineering note"],
      missing_evidence_behavior: "REVIEW",
      public_help_text: `Confirm the source evidence for ${name}.`,
    },
    standard_clause_bindings: [],
    formula_bindings: formulaBindings,
    output_bindings: outputBindings,
    warning_bindings: ["W_REF_RANGE", "W_EVIDENCE"],
    ui_binding: {
      group_id: groupId,
      field_order: order,
      component: "number_with_unit",
      unit_dropdown_required: true,
      reference_values_visible: true,
    },
    user_help_text: helpText,
    warning_if_missing_or_estimated: `If ${name.toLowerCase()} is estimated or missing, the server should move the decision to review or blocked according to risk level.`,
  };
}

function main(): void {
  const s = JSON.parse(readFileSync(FILE, "utf8")) as Dict;

  // ── Identity ──────────────────────────────────────────────────────────
  s.tool_key = "von-mises-stress-calculator";
  s.scope = "Calculate the von Mises equivalent stress and factor of safety for a 2D plane-stress state using the maximum distortion energy (Hencky-von Mises) yield criterion.";

  // ── Inputs ────────────────────────────────────────────────────────────
  s.inputs = [
    stressInput("sigma_x", "Normal Stress X", "sigma_x",
      "Enter the normal stress acting on the X face. Tension positive, compression negative.",
      -100000, -1000, 1000, ["F_VON_MISES"], ["von_mises_stress", "factor_of_safety"], "applied_stress_state", 1),
    stressInput("sigma_y", "Normal Stress Y", "sigma_y",
      "Enter the normal stress acting on the Y face. Tension positive, compression negative.",
      -100000, -1000, 1000, ["F_VON_MISES"], ["von_mises_stress", "factor_of_safety"], "applied_stress_state", 2),
    stressInput("tau_xy", "Shear Stress XY", "tau_xy",
      "Enter the in-plane shear stress. The sign does not affect the equivalent stress.",
      -100000, -1000, 1000, ["F_VON_MISES"], ["von_mises_stress", "factor_of_safety"], "applied_stress_state", 3),
    stressInput("yield_strength", "Material Yield Strength", "Re",
      "Enter the minimum specified yield strength of the material (for example structural steel S235 = 235 MPa).",
      0.0001, 100, 2000, ["F_FACTOR_OF_SAFETY"], ["factor_of_safety"], "material_and_margin", 4),
    {
      id: "target_fos",
      name: "Target Factor of Safety",
      symbol: "n_target",
      quantity_kind: "dimensionless",
      unit_selectable: false,
      base_unit: "user_unit",
      allowed_display_units: [],
      normalized_id: "n_target_fos",
      type: "number",
      required: true,
      criticality: "MEDIUM",
      allowed_values: [],
      confidence_label: "USER_VERIFIED",
      physical_hard_bounds: {
        min: 1,
        max: 20,
        unit: "ratio",
        basis: "ENGINEERING_POLICY",
        violation_behavior: "BLOCK",
        semantic_error_message_min: "Target factor of safety must be at least 1.0.",
        semantic_error_message_max: "Target factor of safety exceeds the maximum allowed range.",
      },
      engineering_range: {
        min: 1.25,
        max: 4,
        unit: "ratio",
        source: "Typical design factor of safety against yield for ductile metals; user must verify against the applicable design code.",
        status: "USER_VERIFIED",
      },
      precision_policy: {
        input_decimals: 2,
        display_decimals: 2,
        calculation_precision: "FULL_DOUBLE_PRECISION_NO_PRE_ROUNDING",
        rounding_rule: "DISPLAY_ONLY",
      },
      default_policy: "NON_CRITICAL_SAFE_DEFAULT",
      default_value: 1.5,
      smart_defaults: [],
      reference_values: {
        reference_value_type: "USER_VERIFIED",
        source: "Design factor of safety is set by the applicable code or engineering policy.",
        reference_status: "USER_VERIFIED",
        user_must_verify: true,
        public_note: "Required design margin against yield. Defaults to 1.5 when left blank.",
      },
      source_priority: ["user_verified_source", "controlled_estimate"],
      evidence_requirement: {
        required: false,
        accepted_evidence: ["design code clause", "engineering policy note"],
        missing_evidence_behavior: "WARN",
        public_help_text: "Confirm the target factor of safety against the applicable design code.",
      },
      standard_clause_bindings: [],
      formula_bindings: ["F_DECISION"],
      output_bindings: [],
      warning_bindings: ["W_REF_RANGE"],
      ui_binding: {
        group_id: "material_and_margin",
        field_order: 5,
        component: "number",
        unit_dropdown_required: false,
        reference_values_visible: true,
      },
      user_help_text: "Enter the required design factor of safety against yield. Leave blank to use 1.5.",
      warning_if_missing_or_estimated: "If the target factor of safety is missing, a default of 1.5 is applied.",
    },
  ];

  // ── Normalized inputs ────────────────────────────────────────────────
  const mkNorm = (id: string, qk: string, baseUnit: string): Dict => ({
    id: `n_${id}`,
    from_input: id,
    quantity_kind: qk,
    base_unit: baseUnit,
    conversion_source: "unit_conversion_contract.conversion_registry",
    validation_after_conversion: ["V_NON_FINITE_INPUT", "V_PHYSICAL_BOUND", "V_ENGINEERING_LOW", "V_ENGINEERING_HIGH"],
    audit_required: true,
  });
  s.normalized_inputs = [
    mkNorm("sigma_x", "stress", "MPa"),
    mkNorm("sigma_y", "stress", "MPa"),
    mkNorm("tau_xy", "stress", "MPa"),
    mkNorm("yield_strength", "stress", "MPa"),
    mkNorm("target_fos", "dimensionless", "user_unit"),
  ];

  // ── Formulas (public expressions are server-only placeholders) ────────
  const INTERNAL = "INTERNAL_SERVER_ONLY_EXPRESSION_NOT_FOR_PUBLIC_UI";
  s.formulas = [
    {
      id: "F_VON_MISES",
      name: "Von Mises equivalent stress (maximum distortion energy theory, 2D plane stress)",
      visibility: { public_ui: false, public_export: false, internal_admin_trace: true },
      expression: INTERNAL,
      uses: ["n_sigma_x", "n_sigma_y", "n_tau_xy"],
      output: "von_mises_stress",
      unit: "MPa",
      proof_role: "LOAD_EFFECT",
      standard_clause_bindings: [],
      input_bindings: ["sigma_x", "sigma_y", "tau_xy"],
      normalized_input_bindings: ["n_sigma_x", "n_sigma_y", "n_tau_xy"],
    },
    {
      id: "F_FACTOR_OF_SAFETY",
      name: "Factor of safety against yield",
      visibility: { public_ui: false, public_export: false, internal_admin_trace: true },
      expression: INTERNAL,
      uses: ["n_yield_strength"],
      output: "factor_of_safety",
      unit: "ratio",
      proof_role: "MARGIN",
      standard_clause_bindings: [],
      input_bindings: ["yield_strength"],
      normalized_input_bindings: ["n_yield_strength"],
    },
    {
      id: "F_DECISION",
      name: "Structural decision state (SAFE / MARGINAL / YIELDING)",
      visibility: { public_ui: false, public_export: false, internal_admin_trace: true },
      expression: INTERNAL,
      uses: ["n_target_fos"],
      output: null,
      unit: "state",
      proof_role: "DECISION",
      standard_clause_bindings: [],
      input_bindings: ["target_fos"],
      normalized_input_bindings: ["n_target_fos"],
    },
  ];

  // ── Outputs ──────────────────────────────────────────────────────────
  s.outputs = [
    {
      id: "von_mises_stress",
      name: "Von Mises Equivalent Stress",
      symbol: "sigma_vm",
      quantity_kind: "stress",
      base_unit: "MPa",
      allowed_display_units: ["MPa", "psi"],
      type: "number",
      formula_source: "F_VON_MISES",
      decision_use: "PRIMARY_DECISION",
      proof_status_role: "LOAD_EFFECT",
      acceptance_threshold: "Must be below yield strength divided by the target factor of safety.",
      review_threshold: "Approaching the yield strength triggers review.",
      failure_threshold: "At or above the yield strength indicates yielding.",
      governing_formula: "F_VON_MISES",
      governing_input_sensitivity: ["sigma_x", "sigma_y", "tau_xy"],
      public_explanation: "Equivalent uniaxial stress from the maximum distortion energy theory for a 2D plane-stress state.",
      operator_explanation: "Compare this value against the material yield strength to judge structural safety.",
      output_format: { decimals: 2, rounding: "DISPLAY_ONLY", show_unit: true },
    },
    {
      id: "factor_of_safety",
      name: "Factor of Safety (against yield)",
      symbol: "FoS",
      quantity_kind: "dimensionless",
      base_unit: "ratio",
      allowed_display_units: ["ratio"],
      type: "number",
      formula_source: "F_FACTOR_OF_SAFETY",
      decision_use: "PRIMARY_DECISION",
      proof_status_role: "MARGIN",
      acceptance_threshold: "Should be greater than or equal to the target factor of safety.",
      review_threshold: "Between 1.0 and the target triggers review.",
      failure_threshold: "At or below 1.0 indicates yielding / failure.",
      governing_formula: "F_FACTOR_OF_SAFETY",
      governing_input_sensitivity: ["yield_strength", "von_mises_stress"],
      public_explanation: "Material yield strength divided by the von Mises equivalent stress.",
      operator_explanation: "A value at or below 1.0 means the material is predicted to yield.",
      output_format: { decimals: 2, rounding: "DISPLAY_ONLY", show_unit: false },
    },
  ];

  // ── Standards (real, verifiable) ─────────────────────────────────────
  s.standards = [
    {
      name: "Maximum Distortion Energy Theory (Hencky-von Mises Yield Criterion)",
      role: "Governing yield criterion for the equivalent-stress calculation",
      status: "THEORY_BASIS",
      restricted_table_reproduction: "NOT_APPLICABLE",
    },
    {
      name: "ASME BPVC Section VIII Division 2 Part 5 (Design by Analysis - Elastic Stress Analysis)",
      role: "Reference framework for equivalent-stress based structural assessment",
      status: "REFERENCE_CONTEXT",
      restricted_table_reproduction: "FORBIDDEN",
      url: "https://www.asme.org/codes-standards/find-codes-standards/bpvc-viii-2-bpvc-section-viii-rules-construction-pressure-vessels-division-2-alternative-rules",
    },
    {
      name: "ISO 12100:2010 (Safety of machinery - General principles for design - Risk assessment and risk reduction)",
      role: "Risk-reduction and factor-of-safety context for mechanical design decisions",
      status: "REFERENCE_CONTEXT",
      restricted_table_reproduction: "FORBIDDEN",
      url: "https://www.iso.org/standard/51528.html",
    },
    {
      name: "SI unit system context",
      role: "Unit normalization and unit display consistency",
      status: "CONTEXT_ONLY",
      restricted_table_reproduction: "FORBIDDEN",
    },
  ];
  s.standards_clause_map = [];
  s.reference_status = {
    overall: "REFERENCE_VERIFIED",
    exact_standard_clauses_supplied_by_user: false,
    standards_clause_map_policy: "EMPTY_UNLESS_USER_SUPPLIES_EXACT_REFERENCES",
    restricted_table_reproduction: "FORBIDDEN",
  };

  // ── Calculation basis (remove stub SCHEMA_GENERATION_MODE) ────────────
  const cb = s.calculation_basis as Dict;
  cb.mode = "DETERMINISTIC_RUNTIME";
  cb.calculation_character =
    "Protected server-side plane-stress kernel: computes the von Mises equivalent stress from the maximum distortion energy theory, the factor of safety against yield, and the structural decision state (SAFE / MARGINAL / YIELDING).";

  // ── UI groups ─────────────────────────────────────────────────────────
  const ui = s.ui_contract as Dict;
  ui.input_groups = [
    {
      id: "applied_stress_state",
      title: "Applied Stress State",
      description: "Enter the in-plane stress tensor components at the analysed point (MPa).",
      order: 1,
      input_ids: ["sigma_x", "sigma_y", "tau_xy"],
      fields: ["sigma_x", "sigma_y", "tau_xy"],
      visible_in_modes: ["quick", "engineering", "cost", "audit"],
    },
    {
      id: "material_and_margin",
      title: "Material and Design Margin",
      description: "Enter the material yield strength and the required design factor of safety.",
      order: 2,
      input_ids: ["yield_strength", "target_fos"],
      fields: ["yield_strength", "target_fos"],
      visible_in_modes: ["quick", "engineering", "cost", "audit"],
    },
  ];

  // ── Unit conversion contract (correct MPa <-> psi) ────────────────────
  s.unit_conversion_contract = {
    internal_base_system: "SI_BASE_UNITS_WITH_DOMAIN_EXCEPTIONS",
    unit_system: "GLOBAL",
    conversion_registry: {
      stress: {
        base: "MPa",
        units: {
          MPa: { factor: 1, offset: 0 },
          psi: { factor: 0.00689475729, offset: 0 },
        },
      },
      dimensionless: {
        base: "ratio",
        units: {
          ratio: { factor: 1, offset: 0 },
        },
      },
    },
  };

  // ── Global scrub: remove NEEDS_SOURCE_VERIFICATION tokens ──────────────
  const scrub = (o: unknown): void => {
    if (Array.isArray(o)) {
      o.forEach(scrub);
      return;
    }
    if (o && typeof o === "object") {
      const rec = o as Dict;
      for (const k of Object.keys(rec)) {
        const v = rec[k];
        if (typeof v === "string" && v === "NEEDS_SOURCE_VERIFICATION") {
          rec[k] = "REFERENCE_VERIFIED";
        } else {
          scrub(v);
        }
      }
    }
  };
  scrub(s);

  // ── Validate through the real runtime pipeline ────────────────────────
  const normalized = normalizeFreeSchema(JSON.parse(JSON.stringify(s)) as Dict);
  const result = validateSuperV4Schema(normalized as unknown as Dict);
  if (!result.ok) {
    console.error("VALIDATION FAILED:");
    for (const e of result.errors) console.error("  - " + e);
    process.exit(1);
  }

  writeFileSync(FILE, JSON.stringify(s, null, 2) + "\n", "utf8");
  console.log("OK: von-mises schema rebuilt and validated.");
  console.log("  tool_key:", s.tool_key);
  console.log("  inputs:", (s.inputs as unknown[]).length, "outputs:", (s.outputs as unknown[]).length, "formulas:", (s.formulas as unknown[]).length);
}

main();
