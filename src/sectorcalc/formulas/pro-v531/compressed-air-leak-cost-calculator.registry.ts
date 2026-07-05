// SectorCalc V5.4 Core — First Real Pro Pilot: Compressed Air Leak Cost Calculator
// Server-side only. Registers numeric formula nodes for the compressed air leak
// cost calculation. String enum outputs (decision_status, governing_driver) are
// produced via dedicated post-processing functions.
import "server-only";
import { formulaRegistry, FormulaRegistry, FormulaRegistryRecord, FormulaRegistryNode } from "@/sectorcalc/pro-runtime/formula-registry";
import { SchemaRegistry } from "@/sectorcalc/pro-form/schema-registry";
import type { ServerOutput, CalcStatus } from "@/sectorcalc/pro-form/contract-types";

const TOOL_ID = "PRO_001_COMPRESSED_AIR_LEAK_COST_CALCULATOR";
const TOOL_KEY = "compressed-air-leak-cost-calculator";
const FORMULA_VERSION = "5.4.0-pro-pilot";

// ── Helper to build a CONSTANT node ───────────────────────────────────────
function constantNode(id: string, value: number, outputRef: string): FormulaRegistryNode {
  return {
    formula_id: id,
    formula_version: FORMULA_VERSION,
    schema_hash_binding: "",
    formula_registry_hash: "",
    operation: "CONSTANT",
    constant_refs: [value],
    input_refs: [],
    output_ref: outputRef,
    unit_dimension_rule: "DIMENSIONLESS",
    uncertainty_rule: "NONE",
    sensitivity_rule: "NONE",
    fmea_trigger_rule: null,
    acceptance_rule: `${outputRef} !== null`,
    review_rule: `${outputRef} === null`,
    rejection_rule: `${outputRef} === null`,
    redaction_rule: "PUBLIC_SAFE_REDACTED",
  };
}

const nodes: FormulaRegistryNode[] = [
  // ── Physical constants ──
  constantNode("F_C_ATM", 1.01325, "c_atm"),
  constantNode("F_C_BAR_TO_PA", 100000, "c_bar_to_pa"),
  constantNode("F_C_MM_TO_M", 1000, "c_mm_to_m"),
  constantNode("F_C_PI_OVER_4", Math.PI / 4, "c_pi_4"),
  constantNode("F_C_CD", 0.65, "c_cd"),
  constantNode("F_C_R", 287.05, "c_r"),
  constantNode("F_C_T", 293.15, "c_t"),
  constantNode("F_C_GAMMA", 1.4, "c_gamma"),
  constantNode("F_C_RHO", 1.204, "c_rho"),
  constantNode("F_C_60", 60, "c_60"),
  constantNode("F_C_365", 365, "c_365"),
  constantNode("F_C_2", 2, "c_2"),
  constantNode("F_C_GP1", 2.4, "c_gp1"),

  // ── Pressure: p_abs = (p_gauge + p_atm) * 100000 ──
  {
    formula_id: "F_P_ABS_BAR",
    formula_version: FORMULA_VERSION,
    schema_hash_binding: "",
    formula_registry_hash: "",
    operation: "ADD",
    constant_refs: [],
    input_refs: ["n_system_pressure_bar_g", "c_atm"],
    output_ref: "c_p_abs_bar",
    unit_dimension_rule: "PRESSURE",
    uncertainty_rule: "NONE",
    sensitivity_rule: "DERIVATIVE",
    fmea_trigger_rule: null,
    acceptance_rule: "c_p_abs_bar > 0",
    review_rule: "c_p_abs_bar <= 0",
    rejection_rule: "c_p_abs_bar <= 0",
    redaction_rule: "PUBLIC_SAFE_REDACTED",
  },
  {
    formula_id: "F_P_ABS_PA",
    formula_version: FORMULA_VERSION,
    schema_hash_binding: "",
    formula_registry_hash: "",
    operation: "MULTIPLY",
    constant_refs: [],
    input_refs: ["c_p_abs_bar", "c_bar_to_pa"],
    output_ref: "c_p_abs_pa",
    unit_dimension_rule: "PRESSURE",
    uncertainty_rule: "NONE",
    sensitivity_rule: "DERIVATIVE",
    fmea_trigger_rule: null,
    acceptance_rule: "c_p_abs_pa > 0",
    review_rule: "c_p_abs_pa <= 0",
    rejection_rule: "c_p_abs_pa <= 0",
    redaction_rule: "PUBLIC_SAFE_REDACTED",
  },

  // ── Orifice geometry: A = π * (d/1000)^2 / 4 ──
  {
    formula_id: "F_D_M",
    formula_version: FORMULA_VERSION,
    schema_hash_binding: "",
    formula_registry_hash: "",
    operation: "DIVIDE",
    constant_refs: [],
    input_refs: ["n_leak_orifice_diameter_mm", "c_mm_to_m"],
    output_ref: "c_d_m",
    unit_dimension_rule: "LENGTH",
    uncertainty_rule: "NONE",
    sensitivity_rule: "DERIVATIVE",
    fmea_trigger_rule: null,
    acceptance_rule: "c_d_m > 0",
    review_rule: "c_d_m <= 0",
    rejection_rule: "c_d_m <= 0",
    redaction_rule: "PUBLIC_SAFE_REDACTED",
  },
  {
    formula_id: "F_D_SQ",
    formula_version: FORMULA_VERSION,
    schema_hash_binding: "",
    formula_registry_hash: "",
    operation: "MULTIPLY",
    constant_refs: [],
    input_refs: ["c_d_m", "c_d_m"],
    output_ref: "c_d_sq",
    unit_dimension_rule: "AREA",
    uncertainty_rule: "NONE",
    sensitivity_rule: "DERIVATIVE",
    fmea_trigger_rule: null,
    acceptance_rule: "c_d_sq > 0",
    review_rule: "c_d_sq <= 0",
    rejection_rule: "c_d_sq <= 0",
    redaction_rule: "PUBLIC_SAFE_REDACTED",
  },
  {
    formula_id: "F_ORIFICE_AREA",
    formula_version: FORMULA_VERSION,
    schema_hash_binding: "",
    formula_registry_hash: "",
    operation: "MULTIPLY",
    constant_refs: [],
    input_refs: ["c_d_sq", "c_pi_4"],
    output_ref: "c_area",
    unit_dimension_rule: "AREA",
    uncertainty_rule: "NONE",
    sensitivity_rule: "DERIVATIVE",
    fmea_trigger_rule: null,
    acceptance_rule: "c_area > 0",
    review_rule: "c_area <= 0",
    rejection_rule: "c_area <= 0",
    redaction_rule: "PUBLIC_SAFE_REDACTED",
  },

  // ── Choked flow factor ──
  // sqrt(gamma / (R * T)) * (2/(gamma+1))^((gamma+1)/(2*(gamma-1)))
  {
    formula_id: "F_RT",
    formula_version: FORMULA_VERSION,
    schema_hash_binding: "",
    formula_registry_hash: "",
    operation: "MULTIPLY",
    constant_refs: [],
    input_refs: ["c_r", "c_t"],
    output_ref: "c_rt",
    unit_dimension_rule: "ENERGY_PER_MASS",
    uncertainty_rule: "NONE",
    sensitivity_rule: "NONE",
    fmea_trigger_rule: null,
    acceptance_rule: "c_rt > 0",
    review_rule: "c_rt <= 0",
    rejection_rule: "c_rt <= 0",
    redaction_rule: "PUBLIC_SAFE_REDACTED",
  },
  {
    formula_id: "F_GAMMA_DIV_RT",
    formula_version: FORMULA_VERSION,
    schema_hash_binding: "",
    formula_registry_hash: "",
    operation: "DIVIDE",
    constant_refs: [],
    input_refs: ["c_gamma", "c_rt"],
    output_ref: "c_gamma_div_rt",
    unit_dimension_rule: "INVERSE_ENERGY_PER_MASS",
    uncertainty_rule: "NONE",
    sensitivity_rule: "NONE",
    fmea_trigger_rule: null,
    acceptance_rule: "c_gamma_div_rt > 0",
    review_rule: "c_gamma_div_rt <= 0",
    rejection_rule: "c_gamma_div_rt <= 0",
    redaction_rule: "PUBLIC_SAFE_REDACTED",
  },
  {
    formula_id: "F_SQRT_GAMMA_RT",
    formula_version: FORMULA_VERSION,
    schema_hash_binding: "",
    formula_registry_hash: "",
    operation: "SQRT",
    constant_refs: [],
    input_refs: ["c_gamma_div_rt"],
    output_ref: "c_sqrt_gamma_rt",
    unit_dimension_rule: "DIMENSIONLESS",
    uncertainty_rule: "NONE",
    sensitivity_rule: "NONE",
    fmea_trigger_rule: null,
    acceptance_rule: "c_sqrt_gamma_rt > 0",
    review_rule: "c_sqrt_gamma_rt <= 0",
    rejection_rule: "c_sqrt_gamma_rt <= 0",
    redaction_rule: "PUBLIC_SAFE_REDACTED",
  },
  {
    formula_id: "F_TWO_DIV_GP1",
    formula_version: FORMULA_VERSION,
    schema_hash_binding: "",
    formula_registry_hash: "",
    operation: "DIVIDE",
    constant_refs: [],
    input_refs: ["c_2", "c_gp1"],
    output_ref: "c_base",
    unit_dimension_rule: "DIMENSIONLESS",
    uncertainty_rule: "NONE",
    sensitivity_rule: "NONE",
    fmea_trigger_rule: null,
    acceptance_rule: "c_base > 0",
    review_rule: "c_base <= 0",
    rejection_rule: "c_base <= 0",
    redaction_rule: "PUBLIC_SAFE_REDACTED",
  },
  {
    formula_id: "F_CHOKED_EXP",
    formula_version: FORMULA_VERSION,
    schema_hash_binding: "",
    formula_registry_hash: "",
    operation: "POW",
    constant_refs: [(1.4 + 1) / (2 * (1.4 - 1))],
    input_refs: ["c_base"],
    output_ref: "c_choked",
    unit_dimension_rule: "DIMENSIONLESS",
    uncertainty_rule: "NONE",
    sensitivity_rule: "NONE",
    fmea_trigger_rule: null,
    acceptance_rule: "c_choked > 0",
    review_rule: "c_choked <= 0",
    rejection_rule: "c_choked <= 0",
    redaction_rule: "PUBLIC_SAFE_REDACTED",
  },

  // ── Mass flow: Cd * A * p_abs * sqrt(gamma/RT) * (2/(gamma+1))^((gamma+1)/(2*(gamma-1))) ──
  {
    formula_id: "F_MASS_FLOW",
    formula_version: FORMULA_VERSION,
    schema_hash_binding: "",
    formula_registry_hash: "",
    operation: "MULTIPLY",
    constant_refs: [],
    input_refs: ["c_cd", "c_area", "c_p_abs_pa", "c_sqrt_gamma_rt", "c_choked"],
    output_ref: "c_mass_flow",
    unit_dimension_rule: "MASS_FLOW",
    uncertainty_rule: "NONE",
    sensitivity_rule: "DERIVATIVE",
    fmea_trigger_rule: null,
    acceptance_rule: "c_mass_flow > 0",
    review_rule: "c_mass_flow <= 0",
    rejection_rule: "c_mass_flow <= 0",
    redaction_rule: "PUBLIC_SAFE_REDACTED",
  },

  // ── Volumetric flow: m_dot / rho * 60 ──
  {
    formula_id: "F_VOL_FLOW_M3_S",
    formula_version: FORMULA_VERSION,
    schema_hash_binding: "",
    formula_registry_hash: "",
    operation: "DIVIDE",
    constant_refs: [],
    input_refs: ["c_mass_flow", "c_rho"],
    output_ref: "c_vol_flow_m3_s",
    unit_dimension_rule: "VOLUMETRIC_FLOW",
    uncertainty_rule: "NONE",
    sensitivity_rule: "DERIVATIVE",
    fmea_trigger_rule: null,
    acceptance_rule: "c_vol_flow_m3_s > 0",
    review_rule: "c_vol_flow_m3_s <= 0",
    rejection_rule: "c_vol_flow_m3_s <= 0",
    redaction_rule: "PUBLIC_SAFE_REDACTED",
  },
  {
    formula_id: "F_AIR_LOSS_M3_MIN",
    formula_version: FORMULA_VERSION,
    schema_hash_binding: "",
    formula_registry_hash: "",
    operation: "MULTIPLY",
    constant_refs: [],
    input_refs: ["c_vol_flow_m3_s", "c_60"],
    output_ref: "estimated_air_loss_m3_min",
    unit_dimension_rule: "VOLUMETRIC_FLOW",
    uncertainty_rule: "NONE",
    sensitivity_rule: "DERIVATIVE",
    fmea_trigger_rule: null,
    acceptance_rule: "estimated_air_loss_m3_min > 0",
    review_rule: "estimated_air_loss_m3_min <= 0",
    rejection_rule: "estimated_air_loss_m3_min <= 0",
    redaction_rule: "PUBLIC_SAFE_REDACTED",
  },

  // ── Annual energy loss: Q * specific_power * hours ──
  {
    formula_id: "F_ANNUAL_ENERGY",
    formula_version: FORMULA_VERSION,
    schema_hash_binding: "",
    formula_registry_hash: "",
    operation: "MULTIPLY",
    constant_refs: [],
    input_refs: ["estimated_air_loss_m3_min", "n_compressor_specific_power_kw_per_m3_min", "n_operating_hours_per_year"],
    output_ref: "annual_energy_loss_kwh",
    unit_dimension_rule: "ENERGY",
    uncertainty_rule: "NONE",
    sensitivity_rule: "DERIVATIVE",
    fmea_trigger_rule: null,
    acceptance_rule: "annual_energy_loss_kwh > 0",
    review_rule: "annual_energy_loss_kwh <= 0",
    rejection_rule: "annual_energy_loss_kwh <= 0",
    redaction_rule: "PUBLIC_SAFE_REDACTED",
  },

  // ── Annual leak cost: energy_loss * electricity_cost ──
  {
    formula_id: "F_ANNUAL_COST",
    formula_version: FORMULA_VERSION,
    schema_hash_binding: "",
    formula_registry_hash: "",
    operation: "MULTIPLY",
    constant_refs: [],
    input_refs: ["annual_energy_loss_kwh", "n_electricity_cost_per_kwh"],
    output_ref: "annual_leak_cost",
    unit_dimension_rule: "CURRENCY",
    uncertainty_rule: "NONE",
    sensitivity_rule: "DERIVATIVE",
    fmea_trigger_rule: null,
    acceptance_rule: "annual_leak_cost > 0",
    review_rule: "annual_leak_cost <= 0",
    rejection_rule: "annual_leak_cost <= 0",
    redaction_rule: "PUBLIC_SAFE_REDACTED",
  },

  // ── Repair payback: repair_cost / (annual_cost / 365) ──
  {
    formula_id: "F_COST_PER_DAY",
    formula_version: FORMULA_VERSION,
    schema_hash_binding: "",
    formula_registry_hash: "",
    operation: "DIVIDE",
    constant_refs: [],
    input_refs: ["annual_leak_cost", "c_365"],
    output_ref: "c_cost_per_day",
    unit_dimension_rule: "CURRENCY_PER_TIME",
    uncertainty_rule: "NONE",
    sensitivity_rule: "DERIVATIVE",
    fmea_trigger_rule: null,
    acceptance_rule: "c_cost_per_day > 0",
    review_rule: "c_cost_per_day <= 0",
    rejection_rule: "c_cost_per_day < 0",
    redaction_rule: "PUBLIC_SAFE_REDACTED",
  },
  {
    formula_id: "F_PAYBACK_DAYS",
    formula_version: FORMULA_VERSION,
    schema_hash_binding: "",
    formula_registry_hash: "",
    operation: "DIVIDE",
    constant_refs: [],
    input_refs: ["n_repair_cost", "c_cost_per_day"],
    output_ref: "repair_payback_days",
    unit_dimension_rule: "TIME",
    uncertainty_rule: "NONE",
    sensitivity_rule: "DERIVATIVE",
    fmea_trigger_rule: null,
    acceptance_rule: "repair_payback_days >= 0",
    review_rule: "repair_payback_days > 365",
    rejection_rule: "c_cost_per_day <= 0",
    redaction_rule: "PUBLIC_SAFE_REDACTED",
  },
];

// Compute registry hash
const formulaRegistryHash = FormulaRegistry.computeRegistryHash(nodes);
for (const node of nodes) {
  node.formula_registry_hash = formulaRegistryHash;
}

export function registerProPilotFormulas(schema: unknown): void {
  const existing = formulaRegistry.fetch(TOOL_ID, FORMULA_VERSION);
  if (existing) return;

  const schemaHash = SchemaRegistry.computeSchemaHash(schema as Parameters<typeof SchemaRegistry.computeSchemaHash>[0]);

  for (const node of nodes) {
    node.schema_hash_binding = schemaHash;
  }

  const record: FormulaRegistryRecord = {
    tool_id: TOOL_ID,
    tool_key: TOOL_KEY,
    formula_version: FORMULA_VERSION,
    formula_registry_hash: formulaRegistryHash,
    schema_hash_binding: schemaHash,
    nodes,
    internal_trace_policy: "RESTRICTED_CHECKER",
    created_at: new Date().toISOString(),
    approved_at: new Date().toISOString(),
    approved_by: "v54-core-pro-pilot",
  };

  formulaRegistry.register(record);
}

/**
 * Post-process numeric engine outputs to produce string enum outputs
 * (decision_status, governing_driver) for the compressed air tool.
 */
export function postProcessProOutputs(
  engineOutputs: ServerOutput[],
  schemaOutputDefs: Array<{ id: string; name?: string; public_explanation?: string; decision_use?: string }>,
): ServerOutput[] {
  const result = [...engineOutputs];

  const payback = engineOutputs.find((o) => o.id === "repair_payback_days")?.value;
  const annualCost = engineOutputs.find((o) => o.id === "annual_leak_cost")?.value;

  const paybackNum = typeof payback === "number" && Number.isFinite(payback) ? payback : null;
  const costNum = typeof annualCost === "number" && Number.isFinite(annualCost) ? annualCost : null;

  // decision_status
  let decisionStatus = "MONITOR";
  if (paybackNum !== null && paybackNum <= 90) {
    decisionStatus = "ACTION_REQUIRED";
  } else if (costNum !== null && costNum >= 1000) {
    decisionStatus = "ACTION_REQUIRED";
  } else if (paybackNum !== null && paybackNum <= 365) {
    decisionStatus = "REVIEW";
  } else if (costNum !== null && costNum >= 250) {
    decisionStatus = "REVIEW";
  }

  // governing_driver
  let governingDriver = "Low economic urgency";
  if (paybackNum !== null && paybackNum <= 90) {
    governingDriver = "Fast repair payback";
  } else if (costNum !== null && costNum >= 1000) {
    governingDriver = "High annual leak cost";
  } else if (costNum !== null && costNum >= 250) {
    governingDriver = "Moderate leak economics";
  }

  // Add or replace decision_status
  const existingDsIdx = result.findIndex((o) => o.id === "decision_status");
  const dsOutput: ServerOutput = {
    id: "decision_status",
    name: "Decision Status",
    value: decisionStatus,
    status: "OK" as CalcStatus,
    public_explanation: "Action priority based on payback period and annual leak cost.",
    decision_use: "STATUS",
  };
  if (existingDsIdx >= 0) {
    result[existingDsIdx] = dsOutput;
  } else {
    result.push(dsOutput);
  }

  // Add or replace governing_driver
  const existingGdIdx = result.findIndex((o) => o.id === "governing_driver");
  const gdOutput: ServerOutput = {
    id: "governing_driver",
    name: "Governing Driver",
    value: governingDriver,
    status: "OK" as CalcStatus,
    public_explanation: "Primary factor driving the decision status classification.",
    decision_use: "STATUS",
  };
  if (existingGdIdx >= 0) {
    result[existingGdIdx] = gdOutput;
  } else {
    result.push(gdOutput);
  }

  return result;
}
