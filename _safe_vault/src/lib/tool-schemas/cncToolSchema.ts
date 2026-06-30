/**
 * CNC Cutting Dynamics & Spindle Power Tool Schema
 * PRO_043 — Schema-driven definition for CNC calculator
 * Tool selector in old HTML used PRO_043 for CNC
 * Inputs/validation/fmea from UNIVERSAL PRO TOOL FORM.txt
 */

import type { LegacyToolSchema, ToolSchemaInput, ToolSchemaValidationRule, ToolSchemaFMEAItem, ToolSchemaOutput } from "./types-legacy";

const STANDARDS = [
  "ISO 513:2012",
  "ISO 3685:1993",
  "ISO 3002-1",
  "Kienzle Equation",
  "Sandvik C-2920",
];

const INPUTS: ToolSchemaInput[] = [
  {
    id: "D", name: "Tool Diameter (D)", symbol: "D", unit: "mm",
    type: "number", required: true, confidence_label: "CERTAIN",
    absolute_min: 0.1, absolute_max: 500, resolution: 0.1,
    note: "Carbide or HSS end mill / face mill",
  },
  {
    id: "z", name: "Number of Flutes (z)", symbol: "z", unit: "—",
    type: "number", required: true, confidence_label: "CERTAIN",
    absolute_min: 1, absolute_max: 24, resolution: 1,
    note: "Effective cutting teeth count",
  },
  {
    id: "Vc", name: "Cutting Speed (V_c)", symbol: "V_c", unit: "m/min",
    type: "number", required: true, confidence_label: "STRONG",
    absolute_min: 5, absolute_max: 5000, resolution: 1,
    note: "Peripheral speed at tool tip",
  },
  {
    id: "fz", name: "Feed per Tooth (f_z)", symbol: "f_z", unit: "mm/tooth",
    type: "number", required: true, confidence_label: "STRONG",
    absolute_min: 0.001, absolute_max: 2.0, resolution: 0.001,
    note: "Chip load per cutting edge",
  },
  {
    id: "re", name: "Corner Nose Radius (r_ε)", symbol: "r_ε", unit: "mm",
    type: "number", required: true, confidence_label: "CERTAIN",
    absolute_min: 0.01, absolute_max: 6.0, resolution: 0.01,
    note: "Determines theoretical Ra",
  },
  {
    id: "ap", name: "Axial Depth of Cut (a_p)", symbol: "a_p", unit: "mm",
    type: "number", required: true, confidence_label: "STRONG",
    absolute_min: 0.05, absolute_max: 400, resolution: 0.01,
    note: "Depth along tool axis",
  },
  {
    id: "ae", name: "Radial Width of Cut (a_e)", symbol: "a_e", unit: "mm",
    type: "number", required: true, confidence_label: "STRONG",
    absolute_min: 0.01, absolute_max: 500, resolution: 0.01,
    note: "Engagement width ≤ D",
  },
  {
    id: "kc1", name: "Specific Cutting Force (k_c1)", symbol: "k_c1", unit: "N/mm²",
    type: "number", required: true, confidence_label: "STRONG",
    absolute_min: 100, absolute_max: 6000, resolution: 1,
    note: "Kienzle constant — from material preset",
  },
  {
    id: "mc", name: "Chip Thickness Exponent (m_c)", symbol: "m_c", unit: "—",
    type: "number", required: true, confidence_label: "STRONG",
    absolute_min: 0.05, absolute_max: 0.5, resolution: 0.01,
    note: "Kienzle exponent — typical 0.14–0.35",
  },
  {
    id: "eta", name: "Spindle Efficiency (η)", symbol: "η", unit: "%",
    type: "number", required: true, confidence_label: "CERTAIN",
    absolute_min: 50, absolute_max: 100, default: 88, resolution: 1,
    note: "Drive train efficiency",
  },
  {
    id: "Pmax", name: "Machine Rated Power (P_mach)", symbol: "P_mach", unit: "kW",
    type: "number", required: true, confidence_label: "CERTAIN",
    absolute_min: 1, absolute_max: 500, resolution: 0.1,
    note: "Nameplate spindle power",
  },
  {
    id: "RPMmax", name: "Machine Max Speed (n_max)", symbol: "n_max", unit: "RPM",
    type: "number", required: false, confidence_label: "CERTAIN",
    absolute_min: 100, absolute_max: 100000, default: 12000, resolution: 1,
    note: "Spindle speed limit. Default 12000 RPM.",
  },
];

const VALIDATION_RULES: ToolSchemaValidationRule[] = [
  { id: "V1", action: "BLOCK", condition: "a_e > D",
    message: "Radial engagement exceeds tool diameter. Geometrically impossible.",
    standard_ref: "ISO 3002-1" },
  { id: "V2", action: "BLOCK", condition: "f_z < 0.001 mm/tooth",
    message: "No chip forms below this threshold; tool rubs and work-hardens.",
    standard_ref: "ISO 3002-1 §4.3" },
  { id: "V3", action: "BLOCK", condition: "a_p > 0.80 × D",
    message: "Axial depth exceeds 80% of diameter. Catastrophic bending load risk.",
    standard_ref: "ISO 3002-1 §4.2" },
  { id: "V4", action: "BLOCK", condition: "r_ε < 0.01 mm",
    message: "Division by zero in R_z formula. Minimum nose radius enforced.",
    standard_ref: "ISO 3002-1 §7" },
  { id: "V5", action: "WARN", condition: "P_motor > P_machine",
    message: "Required power exceeds machine rated capacity. Spindle stall hazard.",
    standard_ref: "ISO 3002-1 §5.3" },
  { id: "V6", action: "WARN", condition: "n_rpm_calc > n_max",
    message: "Calculated speed exceeds machine limit; V_c derated to machine limit.",
    standard_ref: "ISO 3002-1 §4.2" },
];

const FMEA: ToolSchemaFMEAItem[] = [
  { failureMode: "BUE Formation (Built-Up Edge)", effect: "Surface quality loss, dimensional error, tool fracture",
    severity: "MEDIUM", occurrence: 5, detection: 4, rpn: 140, rpn_high: 140,
    control_measure: "Verify V_c ≥ V_c,min per ISO 513 group · Use coated carbide" },
  { failureMode: "Tool Breakage (Chipping)", effect: "Workpiece damage, machine crash, safety hazard",
    severity: "HIGH", occurrence: 3, detection: 5, rpn: 135, rpn_high: 135,
    control_measure: "Enforce a_p ≤ 0.8D · Vibration monitoring" },
  { failureMode: "Spindle Power Overload", effect: "Drive fault, spindle bearing damage, E-stop",
    severity: "HIGH", occurrence: 4, detection: 3, rpn: 96, rpn_high: 96,
    control_measure: "P_motor ≤ P_machine. Reduce a_p or a_e if power margin <10%." },
  { failureMode: "Dimensional Error (Ra exceedance)", effect: "Part rejection, rework cost, inspection failure",
    severity: "MEDIUM", occurrence: 5, detection: 4, rpn: 120, rpn_high: 120,
    control_measure: "Ra ≤ 3.2 μm check · Reduce f_z or use wiper insert" },
  { failureMode: "Thermal Damage (Workpiece)", effect: "Hardness change, residual stress, microstructural alteration",
    severity: "HIGH", occurrence: 3, detection: 6, rpn: 144, rpn_high: 144,
    control_measure: "V_c within Sandvik C-2920 range · Flood coolant" },
  { failureMode: "kc1/mc Data Mismatch", effect: "Systematic force underestimation, incorrect machine loading",
    severity: "MEDIUM", occurrence: 4, detection: 7, rpn: 168, rpn_high: 168,
    control_measure: "Use material preset from ISO 513 database; verify with certificate" },
  { failureMode: "RPM Limit Exceedance", effect: "Machine spindle damage, tool runout, vibration chatter",
    severity: "MEDIUM", occurrence: 3, detection: 3, rpn: 63, rpn_high: 63,
    control_measure: "Input machine n_max. Tool auto-derates V_c to n_max limit." },
  { failureMode: "Short Tool Life (Taylor)", effect: "Frequent tool change, cost overrun, unplanned downtime",
    severity: "MEDIUM", occurrence: 5, detection: 5, rpn: 125, rpn_high: 125,
    control_measure: "T_life ≥ 30 min target. Adjust V_c toward opt. value." },
];

const OUTPUTS: ToolSchemaOutput[] = [
  { id: "n_rpm", name: "Spindle Speed", unit: "RPM", group: "cutting" },
  { id: "Vf", name: "Table Feed Rate", unit: "mm/min", group: "cutting" },
  { id: "h_m", name: "Mean Chip Thickness", unit: "mm", group: "cutting" },
  { id: "kc_act", name: "Effective Specific Cutting Force", unit: "N/mm²", group: "cutting" },
  { id: "Fc", name: "Tangential Cutting Force", unit: "N", group: "force" },
  { id: "Pc_net", name: "Net Cutting Power", unit: "kW", group: "power" },
  { id: "P_motor", name: "Required Spindle Motor Power", unit: "kW", group: "power" },
  { id: "UC", name: "Power Utilization", unit: "", group: "utilization" },
  { id: "MRR", name: "Material Removal Rate", unit: "cm³/min", group: "productivity" },
  { id: "Rz", name: "Theoretical Peak-to-Valley Roughness", unit: "μm", group: "quality" },
  { id: "Ra", name: "Arithmetic Mean Roughness", unit: "μm", group: "quality" },
  { id: "T_life", name: "Taylor Tool Life", unit: "min", group: "tool" },
];

const cncToolSchema: LegacyToolSchema = {
  tool_id: "PRO_043",
  tool_key: "cnc",
  tool_name: "CNC Cutting Dynamics & Spindle Power Calculator",
  title: "CNC Cutting Dynamics & Spindle Power Calculator",
  category: "CNC Manufacturing · Milling",
  scope: "Face/end milling operations · Kienzle force model · Taylor tool life",
  primary_operation: "cnc_cutting_dynamics",
  designStandard: "ISO 3002-1",
  standards: STANDARDS,
  inputs: INPUTS,
  formulas: [
    "n_rpm = (1000 × V_c) / (π × D)   // [RPM] Spindle speed — ISO 3002-1 §4.2",
    "n_act = min(n_rpm, n_max)   // [RPM] Actual speed (capped by machine limit)",
    "Vc_act = (n_act × π × D) / 1000   // [m/min] Actual cutting speed after derating",
    "V_f = f_z × z × n_act   // [mm/min] Table feed rate — ISO 3002-1 §4.4",
    "h_m = f_z × √(a_e / D)   // [mm] Mean chip thickness — Kienzle-Victor (1957)",
    "k_c = k_c1 / h_m^m_c   // [N/mm²] Specific cutting force — Kienzle Eq; Sandvik C-2920",
    "F_c = k_c × a_p × f_z   // [N] Tangential cutting force — ISO 3002-1 §5.2",
    "P_c,net = (F_c × V_c) / 60 000   // [kW] Net cutting power — ISO 3002-1 §5.3",
    "P_motor = P_c,net / (η / 100)   // [kW] Required spindle motor power",
    "UC = P_motor / P_machine   // [-] Power utilization ratio",
    "MRR = (a_p × a_e × V_f) / 1 000   // [cm³/min] Material Removal Rate — ISO 3002-1 §4.5",
    "R_z = (f_z² / (8 × r_ε)) × 1000   // [μm] Theoretical peak-to-valley roughness — ISO 3002-1 §7",
    "R_a = R_z / 4.5   // [μm] Arithmetic mean roughness — milling empirical factor",
    "T_life = (C / V_c)^(1/n)   // [min] Taylor tool life — ISO 3685:1993 §5.2",
  ],
  validationRules: VALIDATION_RULES,
  fmea: FMEA,
  outputs: OUTPUTS,
};

export default cncToolSchema;
