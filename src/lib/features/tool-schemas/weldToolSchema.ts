/**
 * WPS Preheat Temperature & Carbon Equivalent Tool Schema
 * PRO_091 - Schema-driven definition for welding preheat calculator
 * Data sourced from PRO_043.json (Arc Welding Heat Input)
 * Inputs/validation/fmea matched to UNIVERSAL PRO TOOL FORM.txt
 */

import type { LegacyToolSchema, ToolSchemaInput, ToolSchemaValidationRule, ToolSchemaFMEAItem, ToolSchemaOutput } from "./types-legacy";

const STANDARDS = [
  "AWS D1.1:2020",
  "EN 1011-2:2001",
  "IIW Doc. IX-2136",
  "ASME BPVC IX",
  "ISO 15614-1",
];

const INPUTS: ToolSchemaInput[] = [
  { id: "arc_voltage_v", name: "Arc Voltage (U)", symbol: "U", unit: "V",
    type: "number", required: true, confidence_label: "CERTAIN",
    absolute_min: 10, absolute_max: 60, resolution: 0.1,
    note: "Measured arc voltage during welding" },
  { id: "welding_current_a", name: "Welding Current (I)", symbol: "I", unit: "A",
    type: "number", required: true, confidence_label: "CERTAIN",
    absolute_min: 20, absolute_max: 2000, resolution: 1,
    note: "Welding current setpoint" },
  { id: "travel_speed_mm_min", name: "Weld Travel Speed (v)", symbol: "v", unit: "mm/min",
    type: "number", required: true, confidence_label: "CERTAIN",
    absolute_min: 50, absolute_max: 3000, resolution: 1,
    note: "Welding torch travel speed" },
  {
    id: "thermal_efficiency", name: "Process Thermal Efficiency (η)", symbol: "η", unit: "-",
    type: "enum", required: true, confidence_label: "CERTAIN", default: 0.8,
    options: [
      { value: "0.8", label: "SMAW (Stick) - 0.80" },
      { value: "0.8", label: "GMAW (MIG/MAG) - 0.80" },
      { value: "0.6", label: "GTAW (TIG) - 0.60" },
      { value: "0.99", label: "SAW (Submerged Arc) - 0.99" },
      { value: "0.8", label: "FCAW - 0.80" },
    ],
    note: "AWS D1.1-2020 Commentary §C-4.11 / EN 1011-1 Table B.1",
  },
  { id: "base_metal_CE", name: "Base Metal Carbon Equivalent (CE_IIW)", symbol: "CE_IIW", unit: "-",
    type: "number", required: true, confidence_label: "STRONG",
    default: 0.42, absolute_min: 0.1, absolute_max: 0.8, resolution: 0.01,
    note: "CE = C + Mn/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15 - IIW formula" },
  { id: "plate_thickness_mm", name: "Base Metal Plate Thickness (t)", symbol: "t", unit: "mm",
    type: "number", required: true, confidence_label: "CERTAIN",
    absolute_min: 3, absolute_max: 300, resolution: 1,
    note: "Joint thickness governs cooling rate" },
  {
    id: "hydrogen_content", name: "Diffusible Hydrogen Content (H_d)", symbol: "H_d", unit: "ml/100g",
    type: "enum", required: true, confidence_label: "CERTAIN", default: 10,
    options: [
      { value: "15", label: "H15 (≤15 ml/100g) - standard" },
      { value: "10", label: "H10 (≤10 ml/100g) - low hydrogen" },
      { value: "5", label: "H5 (≤5 ml/100g) - very low hydrogen" },
      { value: "2.5", label: "H2.5 (≤2.5 ml/100g) - ultra-low" },
    ],
    note: "Per AWS A4.3 / ISO 3690 classification",
  },
];

const VALIDATION_RULES: ToolSchemaValidationRule[] = [
  { id: "V1", action: "BLOCK", condition: "HI_kj_mm > 3.5",
    message: "Heat input > 3.5 kJ/mm: excessive - grain coarsening and toughness loss in HAZ",
    standard_ref: "AWS D1.1 Table 3.2" },
  { id: "V2", action: "BLOCK", condition: "HI_kj_mm < 0.3",
    message: "Heat input < 0.3 kJ/mm: very high cooling rate - hard HAZ and hydrogen cracking risk",
    standard_ref: "EN 1011-2:2001" },
  { id: "V3", action: "WARN", condition: "CE > 0.50",
    message: "High CE: severe cold cracking susceptibility - post-weld hydrogen release bake recommended per EN 1011-2",
    standard_ref: "EN 1011-2:2001 Annex C" },
  { id: "V4", action: "WARN", condition: "Preheat > 150°C",
    message: "Verify interpass temperature control - max interpass typically 250°C for structural steels",
    standard_ref: "AWS D1.1 §4.11" },
  { id: "V5", action: "WARN", condition: "HAZ width > 8 mm",
    message: "Large heat-affected zone - CTOD toughness testing at HAZ required per ISO 12135-2",
    standard_ref: "ISO 15614-1" },
  { id: "V6", action: "WARN", condition: "t8/5 < 5 s",
    message: "Rapid cooling - risk of martensite formation in HAZ; verify hardness < 350 HV",
    standard_ref: "ISO 15614-1" },
];

const FMEA: ToolSchemaFMEAItem[] = [
  { failureMode: "Hydrogen-Induced Cracking (HAZ)", effect: "Structural failure, delayed fracture, joint rejection",
    severity: "HIGH", occurrence: 4, detection: 5, rpn: 200, rpn_high: 200,
    control_measure: "CE_IIW < 0.45 or apply calculated preheat. Use low-hydrogen electrode." },
  { failureMode: "Martensite Formation (HAZ)", effect: "Brittle fracture, HAZ hardness > 350 HV10",
    severity: "HIGH", occurrence: 3, detection: 6, rpn: 162, rpn_high: 162,
    control_measure: "Preheat + controlled heat input. PWHT if t > 40mm or CE > 0.45." },
  { failureMode: "Incomplete Fusion", effect: "Reduced joint strength, fatigue crack initiation",
    severity: "HIGH", occurrence: 4, detection: 4, rpn: 128, rpn_high: 128,
    control_measure: "Preheat reduces base metal heat sink. Minimum interpass temperature maintained." },
  { failureMode: "CE_IIW Data Error (Mill Certificate)", effect: "Systematic preheat underestimation, design basis failure",
    severity: "HIGH", occurrence: 3, detection: 7, rpn: 189, rpn_high: 189,
    control_measure: "Verify C, Mn, Cr, Mo, V, Ni, Cu from certified mill test report per EN 10204 3.1/3.2." },
  { failureMode: "Schaeffler Misapplication (Stainless)", effect: "Wrong phase diagram, delta ferrite underestimation",
    severity: "HIGH", occurrence: 3, detection: 5, rpn: 120, rpn_high: 120,
    control_measure: "Use separate CrEq/NiEq Schaeffler-Delong method for Cr > 12%." },
];

const OUTPUTS: ToolSchemaOutput[] = [
  { id: "HI_kj_mm", name: "Arc Energy (Heat Input)", unit: "kJ/mm", group: "welding" },
  { id: "HAZ_mm", name: "Estimated HAZ Width", unit: "mm", group: "welding" },
  { id: "T_preheat_c", name: "Preheat Temperature (EN 1011-2 CET)", unit: "°C", group: "preheat" },
  { id: "T_preheat_aws_c", name: "Preheat Temperature (AWS D1.1)", unit: "°C", group: "preheat" },
  { id: "T_preheat_gov_c", name: "Governing Preheat Temperature", unit: "°C", group: "preheat" },
  { id: "t85_s", name: "Cooling Rate Indicator (t8/5)", unit: "s", group: "cooling" },
];

const weldToolSchema: LegacyToolSchema = {
  tool_id: "PRO_091",
  tool_key: "weld",
  tool_name: "WPS Preheat Temperature & Carbon Equivalent Calculator",
  title: "WPS Preheat Temperature & Carbon Equivalent Calculator",
  category: "Welding Metallurgy · WPS",
  scope: "CE_IIW Method · Cold Crack Risk Analysis · HAZ Assessment",
  primary_operation: "wps_preheat_calculation",
  designStandard: "EN 1011-2",
  standards: STANDARDS,
  inputs: INPUTS,
  formulas: [
    "HI_kj_mm = (U × I × η × 60) / (v × 1000)   // [kJ/mm] Arc Energy - AWS D1.1 §4.11 / EN 1011-1 §7",
    "HAZ_mm = 0.9 × HI_kj_mm / (4.13e-3 × t)   // [mm] Estimated HAZ Width - Rosenthal 2D thin-plate",
    "CET = CE_IIW × 0.75 + 0.25   // [-] Carbon Equivalent for preheat (CET method)",
    "T_preheat_c = 350 × √(CET − 0.1 × log₁₀(HI×1000) + 0.015 × log₁₀(H_d) + 0.005 × log₁₀(t)) − 0.08 × t   // [°C] EN 1011-2 CET method",
    "T_preheat_aws = CE < 0.40 ? 10 : CE < 0.45 ? 66 : CE < 0.50 ? 107 : 150   // [°C] AWS D1.1 Table 3.2",
    "T_preheat_gov = max(T_preheat_c, T_preheat_aws, 10)   // [°C] Governing Preheat - conservative max",
    "t85_s = (6700 − 5 × T_preheat_gov) × HI × ((1/(300−T))² − (1/(700−T))²) × 1e-3   // [s] t8/5 thin-plate approx",
  ],
  validationRules: VALIDATION_RULES,
  fmea: FMEA,
  outputs: OUTPUTS,
};

export default weldToolSchema;
