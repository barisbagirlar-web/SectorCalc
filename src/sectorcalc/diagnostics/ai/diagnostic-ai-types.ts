/**
 * Engineering Diagnostics AI Types
 *
 * Defines the input/output contracts for the OpenAI-assisted
 * engineering interpretation provider.
 *
 * STRICT:
 * - OpenAI may only draft descriptive/narrative content
 * - OpenAI must NEVER output or override numeric values
 * - Deterministic engine is the only source for numbers and decisions
 */

import type { VisualObservation } from "../diagnostic-types";

/**
 * Input to the AI diagnostic provider.
 * Contains deterministic results + user context.
 * No images in the type — photos passed separately as base64.
 */
export interface AiDiagnosticInput {
  domain_id: string;
  domain_label: string;
  problem_context: string;
  measurements: Array<{
    measured_value: number;
    nominal_value: number;
    tolerance_plus: number;
    tolerance_minus: number;
    unit: string;
    measurement_tool: string;
    calibration_status: string;
    part_condition: string;
  }>;
  deterministic: {
    measurement_results: Array<{
      expanded_uncertainty_k2: number;
      confidence_class: string;
      tolerance_status: string;
    }>;
    cost_at_risk: number;
    decision: string;
    total_risk_score: number;
    action_plan_items: number;
  };
  photos?: string[];
}

/**
 * Output from the AI diagnostic provider.
 * ONLY text/narrative fields — no numeric overrides.
 */
export interface AiDiagnosticOutput {
  visual_observations: VisualObservation[];
  engineering_interpretation: string;
  root_cause_hypotheses: string[];
  ncr_statement: string;
  capa_statement: string;
  executive_summary: string;
  action_narrative: string;
}

/**
 * AI section added to the DiagnosticReport for full diagnostics.
 */
export interface AiReportSection {
  visual_observations: VisualObservation[];
  engineering_interpretation: string;
  root_cause_hypotheses: string[];
  ncr_statement: string;
  capa_statement: string;
  executive_summary: string;
  action_narrative: string;
  provider: "openai";
  model: string;
  generated_at: string;
}
