/**
 * Advanced OEE & 6 Big Loss Financial Converter Tool Schema
 * PRO_098 — Schema-driven definition for OEE calculator
 * Inputs/validation/fmea from UNIVERSAL PRO TOOL FORM.txt
 */

import type { LegacyToolSchema, ToolSchemaInput, ToolSchemaValidationRule, ToolSchemaFMEAItem, ToolSchemaOutput } from "./types-legacy";

const STANDARDS = [
  "ISO 22400-2:2014",
  "JIPM TPM",
  "OEE Foundation",
  "Six Sigma DPMO",
  "ANSI/ISA-18.2",
];

const INPUTS: ToolSchemaInput[] = [
  { id: "T_planned", name: "Planned Production Time (T_p)", symbol: "T_p", unit: "h",
    type: "number", required: true, confidence_label: "EXACT",
    absolute_min: 0.5, absolute_max: 744, resolution: 0.01,
    note: "Per shift/day/week — 8h=1 shift" },
  { id: "T_down", name: "Unplanned Downtime (Failures)", symbol: "T_down", unit: "h",
    type: "number", required: true, confidence_label: "STRONG",
    absolute_min: 0, absolute_max: 744, resolution: 0.01,
    note: "Big Loss 1: Equipment failures" },
  { id: "T_setup", name: "Setup & Changeover Time", symbol: "T_setup", unit: "h",
    type: "number", required: true, confidence_label: "STRONG",
    absolute_min: 0, absolute_max: 744, resolution: 0.01,
    note: "Big Loss 2: Setup & adjustment" },
  { id: "CT_ideal", name: "Ideal Cycle Time (design)", symbol: "CT_0", unit: "h/unit",
    type: "number", required: true, confidence_label: "EXACT",
    absolute_min: 0.0001, absolute_max: 100, resolution: 0.0001,
    note: "OEM/design value — NOT measured cycle time" },
  { id: "N_total", name: "Total Parts Produced", symbol: "N_tot", unit: "units",
    type: "number", required: true, confidence_label: "EXACT",
    absolute_min: 1, absolute_max: 1e9, resolution: 1,
    note: "All parts including defects" },
  { id: "N_good", name: "Good Parts (First Pass)", symbol: "N_good", unit: "units",
    type: "number", required: true, confidence_label: "EXACT",
    absolute_min: 0, absolute_max: 1e9, resolution: 1,
    note: "Conforming parts only — no rework" },
  { id: "CM_unit", name: "Contribution Margin / Unit", symbol: "CM", unit: "USD/unit",
    type: "number", required: true, confidence_label: "STRONG",
    absolute_min: 0, absolute_max: 1e6, resolution: 0.01,
    note: "Revenue − variable cost per unit" },
];

const VALIDATION_RULES: ToolSchemaValidationRule[] = [
  { id: "V1", action: "BLOCK", condition: "N_good > N_total",
    message: "Conforming parts exceed total production. Logical impossibility.",
    standard_ref: "ISO 22400-2" },
  { id: "V2", action: "BLOCK", condition: "T_down + T_setup ≥ T_planned",
    message: "Operating Time ≤ 0. Net production time is zero or negative.",
    standard_ref: "ISO 22400-2 §3.1.4.7" },
  { id: "V3", action: "BLOCK", condition: "CT_ideal ≤ 0",
    message: "Ideal cycle time must be positive. Design/catalogue value required.",
    standard_ref: "ISO 22400-2 §3.2.4.4" },
  { id: "V4", action: "WARN", condition: "Performance > 105%",
    message: "Ideal cycle time likely incorrectly defined (too long). Data inconsistency.",
    standard_ref: "ISO 22400-2 §3.2.4.4" },
  { id: "V5", action: "WARN", condition: "OEE < 65%",
    message: "Critical. JIPM world-class benchmark is 85%. Immediate TPM intervention required.",
    standard_ref: "JIPM TPM World-Class Benchmark" },
];

const FMEA: ToolSchemaFMEAItem[] = [
  { failureMode: "1. Equipment Failure / Breakdowns", effect: "Availability loss — unplanned downtime",
    severity: "HIGH", occurrence: 4, detection: 4, rpn: 144, rpn_high: 144,
    control_measure: "Autonomous Maintenance (AM) · Planned PM schedule · MTBF improvement" },
  { failureMode: "2. Setup & Adjustment Losses", effect: "Availability loss — changeover time",
    severity: "MEDIUM", occurrence: 6, detection: 5, rpn: 210, rpn_high: 210,
    control_measure: "SMED methodology · One-point lessons · Standardized changeover SOPs" },
  { failureMode: "3. Idling & Minor Stoppages", effect: "Performance loss — phantom losses, micro-stops",
    severity: "MEDIUM", occurrence: 7, detection: 6, rpn: 252, rpn_high: 252,
    control_measure: "MES/IIoT real-time monitoring · Sensor-based jam detection · Kaizen" },
  { failureMode: "4. Reduced Speed Losses", effect: "Performance loss — speed gap to design rate",
    severity: "MEDIUM", occurrence: 5, detection: 7, rpn: 210, rpn_high: 210,
    control_measure: "Verify ideal cycle time from OEM data · Condition monitoring" },
  { failureMode: "5. Process Defects & Scrap", effect: "Quality loss — first-pass yield reduction",
    severity: "MEDIUM", occurrence: 5, detection: 4, rpn: 140, rpn_high: 140,
    control_measure: "SPC / Cpk monitoring · Poka-yoke · Root cause analysis (8D)" },
  { failureMode: "6. Reduced Yield (Start-Up)", effect: "Quality loss — scrap during warm-up/start-up",
    severity: "MEDIUM", occurrence: 5, detection: 6, rpn: 150, rpn_high: 150,
    control_measure: "Process parameter lock-in · Pre-start checklists · Standard start-up procedures" },
];

const OUTPUTS: ToolSchemaOutput[] = [
  { id: "OT", name: "Operating Time", unit: "h", group: "time" },
  { id: "Av", name: "Availability", unit: "%", group: "oee" },
  { id: "Pf", name: "Performance", unit: "%", group: "oee" },
  { id: "Qu", name: "Quality", unit: "%", group: "oee" },
  { id: "OEE", name: "Overall Equipment Effectiveness", unit: "%", group: "oee" },
  { id: "N_max_theo", name: "Theoretical Max Capacity", unit: "units", group: "capacity" },
  { id: "N_lost", name: "Total Lost Units", unit: "units", group: "loss" },
  { id: "L_financial", name: "Financial Loss", unit: "USD", group: "loss" },
  { id: "DPMO", name: "Defects Per Million Opportunities", unit: "", group: "quality" },
];

const oeeToolSchema: LegacyToolSchema = {
  tool_id: "PRO_098",
  tool_key: "oee",
  tool_name: "Advanced OEE & 6 Big Loss Financial Converter",
  title: "Advanced OEE (TPM) & 6 Big Loss Financial Converter",
  category: "Lean Manufacturing · TPM",
  scope: "Availability × Performance × Quality — ISO 22400-2 · Phantom Loss Detection",
  primary_operation: "oee_calculation",
  designStandard: "ISO 22400-2:2014",
  standards: STANDARDS,
  inputs: INPUTS,
  formulas: [
    "OT = T_planned − T_down − T_setup   // [h] Operating Time — ISO 22400-2 §3.1.4.7",
    "A = (OT / T_planned) × 100   // [%] Availability — ISO 22400-2 §3.2.4.3",
    "P = min((CT_ideal × N_total) / OT × 100, 100)   // [%] Performance — ISO 22400-2 §3.2.4.4, capped at 100%",
    "Q = (N_good / N_total) × 100   // [%] Quality — ISO 22400-2 §3.2.4.5",
    "OEE = (A × P × Q) / 10 000   // [%] Overall Equipment Effectiveness — JIPM TPM",
    "N_max,theo = T_planned / CT_ideal   // [units] Theoretical maximum capacity",
    "N_lost = N_max,theo − N_good   // [units] Total lost units from all 6 loss categories",
    "L_financial = N_lost × CM_unit   // [USD] Financial loss — contribution margin basis",
    "DPMO = ((N_total − N_good) / N_total) × 1 000 000   // Six Sigma defects per million",
  ],
  validationRules: VALIDATION_RULES,
  fmea: FMEA,
  outputs: OUTPUTS,
};

export default oeeToolSchema;
