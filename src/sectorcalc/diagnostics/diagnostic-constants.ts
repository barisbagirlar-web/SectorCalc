import type { MeasurementTool, CalibrationStatus, DecisionState } from "./diagnostic-types";

/* ── Tool Uncertainty Defaults (mm) ── */

export const TOOL_UNCERTAINTY_DEFAULTS: Record<MeasurementTool, number> = {
  caliper: 0.02,
  micrometer: 0.004,
  bore_gauge: 0.005,
  dial_indicator: 0.003,
  cmm: 0.002,
  unknown: 0.05,
};

/* ── Calibration Multiplier ── */

export const CALIBRATION_MULTIPLIER: Record<CalibrationStatus, number> = {
  valid: 1.0,
  unknown: 1.5,
  expired: 2.0,
};

/* ── Coverage Factor k=2 ── */

export const COVERAGE_FACTOR_K2 = 2.0;

/* ── Decision Thresholds ── */

export interface DecisionThreshold {
  max_score: number;
  decision: DecisionState;
}

export const DECISION_THRESHOLDS: DecisionThreshold[] = [
  { max_score: 25, decision: "LOW_RISK" },
  { max_score: 50, decision: "PROCEED_WITH_CAUTION" },
  { max_score: 75, decision: "STOP_AND_INSPECT" },
  { max_score: 90, decision: "QC_REQUIRED" },
  { max_score: 100, decision: "HIGH_SCRAP_RISK" },
];

/* ── Risk Component Weights / Caps ── */

export const RISK_CAPS = {
  measurement_risk: { max: 25 },
  confidence_risk: { max: 15 },
  visual_advisory_risk: { max: 30 },
  exposure_risk: { max: 15 },
  cost_risk: { max: 10 },
  manual_check_risk: { max: 5 },
} as const;

export const TOTAL_RISK_MAX = 100;

/* ── Measurement Confidence Class Boundaries ── */

export const CONFIDENCE_CLASS_BOUNDARIES = {
  HIGH: { min_ratio: 0.5 },   // uncertainty <= 50% of tolerance span
  MEDIUM: { min_ratio: 1.0 }, // uncertainty <= 100% of tolerance span
  // LOW: anything above MEDIUM threshold
} as const;

/* ── Default Assumptions for Cost-at-Risk ── */

export const DEFAULT_CAR_ASSUMPTIONS: string[] = [
  "Cost-at-risk is a deterministic estimate based on user-provided inputs",
  "Scrap and rework probabilities are sourced from industry default tables",
  "Downtime cost assumes full machine rate during idle period",
  "Expedite costs reflect standard market premiums for accelerated delivery",
];
