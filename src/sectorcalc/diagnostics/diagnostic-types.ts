import type { DomainId } from "./domain-taxonomy";

export type { DomainId };

/* ── Decision States ── */

export const DECISION_STATES = [
  "LOW_RISK",
  "PROCEED_WITH_CAUTION",
  "STOP_AND_INSPECT",
  "QC_REQUIRED",
  "HIGH_SCRAP_RISK",
] as const;

export type DecisionState = (typeof DECISION_STATES)[number];

/* ── Confidence Classes ── */

export const CONFIDENCE_CLASSES = ["HIGH", "MEDIUM", "LOW"] as const;
export type ConfidenceClass = (typeof CONFIDENCE_CLASSES)[number];

/* ── Tolerance Status ── */

export const TOLERANCE_STATUSES = [
  "INSIDE",
  "NEAR_LIMIT",
  "BREACH",
  "UNCERTAIN",
] as const;
export type ToleranceStatus = (typeof TOLERANCE_STATUSES)[number];

/* ── Measurement Tools ── */

export const MEASUREMENT_TOOLS = [
  "caliper",
  "micrometer",
  "bore_gauge",
  "dial_indicator",
  "cmm",
  "unknown",
] as const;
export type MeasurementTool = (typeof MEASUREMENT_TOOLS)[number];

/* ── Calibration Status ── */

export const CALIBRATION_STATUSES = ["valid", "unknown", "expired"] as const;
export type CalibrationStatus = (typeof CALIBRATION_STATUSES)[number];

/* ── Measurement Confidence Input ── */

export interface MeasurementConfidenceInput {
  measured_value: number;
  nominal_value: number;
  tolerance_plus: number;
  tolerance_minus: number;
  unit: string;
  measurement_tool: MeasurementTool;
  calibration_status: CalibrationStatus;
  part_condition: string;
}

/* ── Measurement Confidence Output ── */

export interface MeasurementConfidenceOutput {
  expanded_uncertainty_k2: number;
  confidence_class: ConfidenceClass;
  tolerance_status: ToleranceStatus;
  mandatory_decision_floor: DecisionState | null;
}

/* ── Cost-at-Risk Input ── */

export interface CostAtRiskInput {
  affected_quantity: number;
  material_cost_per_unit: number;
  rework_hours_per_unit: number;
  blended_hourly_rate: number;
  downtime_hours: number;
  machine_hourly_rate: number;
  expedite_or_delay_cost: number;
  scrap_probability: number;
  rework_probability: number;
  probability_source: "DEFAULT_TABLE" | "USER_ADJUSTED";
}

/* ── Cost-at-Risk Output ── */

export interface CostAtRiskOutput {
  cost_at_risk: number;
  probability_source: "DEFAULT_TABLE" | "USER_ADJUSTED";
  assumptions: string[];
}

/* ── Visual Advisory Observation ── */

export interface VisualObservation {
  description: string;
  severity_hint: "LOW" | "MEDIUM" | "HIGH";
  confidence: number;
  manual_verification_required: boolean;
}

/* ── Decision Engine Input ── */

export interface DecisionEngineInput {
  measurement_risk: number;
  confidence_risk: number;
  visual_advisory_risk?: number;
  exposure_risk: number;
  cost_risk: number;
  manual_check_risk: number;
  mandatory_decision_floor?: DecisionState | null;
  visual_observations?: VisualObservation[];
}

/* ── Decision Engine Output ── */

export interface DecisionEngineOutput {
  total_risk_score: number;
  decision: DecisionState;
  mandatory_floor_applied: boolean;
  breakdown: {
    measurement_risk: number;
    confidence_risk: number;
    visual_advisory_risk: number;
    exposure_risk: number;
    cost_risk: number;
    manual_check_risk: number;
  };
}

/* ── Action Plan Item ── */

export interface ActionPlanItem {
  action: string;
  responsible_role: string;
  priority: "IMMEDIATE" | "HIGH" | "MEDIUM" | "LOW";
  estimated_duration: string;
}

/* ── Action Plan Output ── */

export interface ActionPlanOutput {
  domain_id: DomainId;
  decision: DecisionState;
  containment: ActionPlanItem[];
  temporary_fix: ActionPlanItem[];
  permanent_corrective_action: ActionPlanItem[];
  required_manual_checks: ActionPlanItem[];
}

/* ── Industrial Context ── */

export interface IndustrialContext {
  domain_id: DomainId;
  process_description: string;
  typical_tolerances: string;
  common_defect_modes: string[];
}

/* ── Complete Diagnostic Result ── */

export interface DiagnosticResult {
  domain_id: DomainId;
  measurement: MeasurementConfidenceOutput;
  cost: CostAtRiskOutput;
  decision: DecisionEngineOutput;
  action_plan: ActionPlanOutput;
  context: IndustrialContext;
}
