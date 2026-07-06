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

// ──────────────────────────────────────────────────────────
// Richer Engineering Reasoning Draft (new AI layer)
// ──────────────────────────────────────────────────────────

/**
 * A single visible observation from visual/media inspection.
 */
export interface ObservationEntry {
  observation: string;
  confidence: number;
  manual_verification_required: boolean;
  severity_hint: "LOW" | "MEDIUM" | "HIGH";
}

/**
 * A root cause hypothesis with likelihood and verification method.
 */
export interface RootCauseHypothesis {
  cause: string;
  likelihood: "LOW" | "MEDIUM" | "HIGH";
  verification_method: string;
}

/**
 * NCR (Non-Conformance Report) draft.
 */
export interface NcrDraft {
  nonconformity: string;
  affected_process: string;
  containment: string;
  corrective_action: string;
  verification_method: string;
}

/**
 * CAPA (Corrective and Preventive Action) draft.
 */
export interface CapaDraft {
  root_cause_hypothesis: string;
  corrective_action: string;
  preventive_action: string;
  evidence_required: string;
}

/**
 * The richer AI engineering reasoning draft output.
 * Used by the new ai-draft endpoint and the openai-engineering-provider.
 */
export interface AiEngineeringDraft {
  visual_observations: ObservationEntry[];
  engineering_interpretation: string;
  root_cause_hypotheses: RootCauseHypothesis[];
  required_manual_checks: string[];
  containment_actions: string[];
  temporary_fix: string[];
  permanent_corrective_action: string[];
  ncr_draft: NcrDraft;
  capa_draft: CapaDraft;
  executive_summary: string;
  limitations: string[];
}

/**
 * Input to the engineering reasoning AI draft service.
 */
export interface EngineeringDraftInput {
  domain_id: string;
  domain_label: string;
  problem_context: string;
  optional_image?: string; // base64 image string
  deterministic_result: {
    measurement_count: number;
    worst_case_tolerance_status: string;
    cost_at_risk: number;
    decision: string;
    total_risk_score: number;
  };
  report_contract: {
    domain_section: {
      category: string;
      process_description: string;
      common_defect_modes: string[];
    };
    action_plan: {
      containment_count: number;
      temp_fix_count: number;
      permanent_action_count: number;
      manual_check_count: number;
    };
  };
}

/**
 * Result of the AI draft service call.
 */
export interface EngineeringDraftResult {
  ok: true;
  source: "openai" | "fallback";
  ai_draft: AiEngineeringDraft;
}
