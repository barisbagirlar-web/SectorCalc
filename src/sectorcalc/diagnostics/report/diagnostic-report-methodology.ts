import type { MethodologyEntry } from "./diagnostic-report-types";

export const METHODOLOGY_VERSION = "1.0.0";

export const METHODOLOGY_ENTRIES: MethodologyEntry[] = [
  {
    name: "Expanded Uncertainty (k=2)",
    description: "The expanded measurement uncertainty is computed by multiplying the tool-specific standard uncertainty by the calibration status multiplier and a coverage factor of k=2. This provides a 95% confidence interval for the measurement error.",
    formula: "U = 2 × u_tool × k_calibration",
  },
  {
    name: "Measurement Tolerance Status",
    description: "The measured value is compared to the upper and lower tolerance limits. If the distance to the nearest limit is smaller than the expanded uncertainty, the measurement is classified as UNCERTAIN, triggering a mandatory STOP_AND_INSPECT decision floor.",
    formula: "distance = min(|upper - measured|, |measured - lower|)\nstatus = BREACH if outside, else UNCERTAIN if distance < U, else NEAR_LIMIT if distance < 2×U, else INSIDE",
  },
  {
    name: "Confidence Class",
    description: "The confidence class compares the expanded uncertainty to the total tolerance span. HIGH when uncertainty is at most 50% of the span, MEDIUM at most 100%, and LOW otherwise.",
    formula: "span = tolerance_plus + tolerance_minus\nratio = U / span\nHIGH if ratio ≤ 0.50, MEDIUM if ratio ≤ 1.00, LOW otherwise",
  },
  {
    name: "Cost-at-Risk",
    description: "The estimated financial exposure combines scrap cost, rework labor cost, downtime machine cost, and any expedite or delay charges. Each term is scaled by its probability.",
    formula: "CAR = (P_scrap × Q × M) + (P_rework × Q × H_r × R) + (H_d × M_r) + E",
  },
  {
    name: "Risk Score Components",
    description: "The total risk score is the sum of six independently clamped components. Each component is derived server-side from engine outputs, never from client-provided values.",
    formula: "total = min(measurement(0-25) + confidence(0-15) + visual(0-30) + exposure(0-15) + cost(0-10) + manual(0-5), 100)",
  },
  {
    name: "Decision Thresholds",
    description: "The total risk score maps to five decision states. If the measurement engine signals UNCERTAIN, the decision floor is raised to STOP_AND_INSPECT regardless of the computed score.",
    formula: "0-25 → LOW_RISK\n26-50 → PROCEED_WITH_CAUTION\n51-75 → STOP_AND_INSPECT\n76-90 → QC_REQUIRED\n91-100 → HIGH_SCRAP_RISK",
  },
  {
    name: "Mandatory Floor Rule",
    description: "When measurement uncertainty exceeds the distance to the nearest tolerance limit, the measurement is classified UNCERTAIN. This forces the decision floor to STOP_AND_INSPECT, overriding any lower risk score.",
    formula: "mandatory_floor = UNCERTAIN ? STOP_AND_INSPECT : null",
  },
  {
    name: "LLM Limitation Rule",
    description: "No large language model is used to calculate risk scores, costs, confidence, or decisions. All numeric outputs are computed by deterministic TypeScript engines. The diagnostic output is preliminary decision-support and requires qualified professional review before any action.",
    formula: "deterministic_engine_only = true",
  },
];

export const METHODOLOGY_NOTE =
  "All formulas shown are implemented as deterministic TypeScript functions. No machine learning or large language model computes any numeric value in this report. Manual verification by a qualified professional is required before any production action.";

export function buildMethodologySection(): {
  entries: MethodologyEntry[];
  note: string;
} {
  return {
    entries: METHODOLOGY_ENTRIES,
    note: METHODOLOGY_NOTE,
  };
}
