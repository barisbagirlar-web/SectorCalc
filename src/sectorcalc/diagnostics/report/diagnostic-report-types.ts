import type { DomainId, DecisionState, VisualObservation } from "../diagnostic-types";

export const REPORT_TYPE = "ENGINEERING_DIAGNOSTIC_PREVIEW" as const;
export type ReportType = typeof REPORT_TYPE;

export const SCHEMA_VERSION = "2.0.0";
export const ENGINE_VERSION = "1.0.0";
export const METHODOLOGY_VERSION = "1.0.0";

export interface AuditEvent {
  event: string;
  at: string;
  source: "server";
  engine_version: string;
}

export interface DomainSection {
  domain_id: DomainId;
  label: string;
  description: string;
  category: string;
  process_description: string;
  typical_tolerances: string;
  common_defect_modes: string[];
}

export interface ProblemSection {
  problem_context: string;
}

export interface MeasurementSectionEntry {
  index: number;
  measured_value: number;
  nominal_value: number;
  tolerance_plus: number;
  tolerance_minus: number;
  unit: string;
  measurement_tool: string;
  calibration_status: string;
  part_condition: string;
  expanded_uncertainty_k2: number;
  confidence_class: string;
  tolerance_status: string;
  mandatory_decision_floor: string | null;
}

export interface MeasurementSection {
  entries: MeasurementSectionEntry[];
  worst_case_tolerance_status: string;
}

export interface CostSection {
  affected_quantity: number;
  material_cost_per_unit: number;
  rework_hours_per_unit: number;
  blended_hourly_rate: number;
  downtime_hours: number;
  machine_hourly_rate: number;
  expedite_or_delay_cost: number;
  scrap_probability: number;
  rework_probability: number;
  probability_source: string;
  estimated_cost_at_risk: number;
  assumptions: string[];
}

export interface DecisionSection {
  total_risk_score: number;
  decision: DecisionState;
  mandatory_floor_applied: boolean;
  measurement_risk: number;
  confidence_risk: number;
  visual_advisory_risk: number;
  exposure_risk: number;
  cost_risk: number;
  manual_check_risk: number;
}

export interface ActionPlanSectionEntry {
  action: string;
  responsible_role: string;
  priority: string;
  estimated_duration: string;
}

export interface ActionPlanSection {
  containment: ActionPlanSectionEntry[];
  temporary_fix: ActionPlanSectionEntry[];
  permanent_corrective_action: ActionPlanSectionEntry[];
  required_manual_checks: ActionPlanSectionEntry[];
}

export type PhotoStatus = "NOT_ATTACHED" | "HASH_ONLY" | "ATTACHED_IN_MEMORY";

export interface EvidenceSection {
  photo_status: PhotoStatus;
  image_hash: string | null;
  privacy_mode: "standard" | "privacy";
}

export type ToolStatus = "ACTIVE" | "PLANNED" | "MISSING";

export interface RelatedToolEntry {
  slug: string;
  label: string;
  status: ToolStatus;
  reason: string;
}

export interface RelatedToolsSection {
  tools: RelatedToolEntry[];
}

export interface MethodologyEntry {
  name: string;
  description: string;
  formula: string;
}

export interface MethodologySection {
  entries: MethodologyEntry[];
  note: string;
}

export interface LimitationSection {
  disclaimer: string;
  llm_limitation: string;
  manual_verification_required: boolean;
}

export interface DiagnosticReport {
  report_id: string;
  report_type: ReportType;
  schema_version: string;
  engine_version: string;
  methodology_version: string;
  created_at: string;
  domain_section: DomainSection;
  problem_section: ProblemSection;
  measurement_section: MeasurementSection;
  cost_section: CostSection;
  decision_section: DecisionSection;
  action_plan_section: ActionPlanSection;
  evidence_section: EvidenceSection;
  related_tools_section: RelatedToolsSection;
  methodology_section: MethodologySection;
  limitation_section: LimitationSection;
  audit_log: AuditEvent[];
  /** Only present for full paid diagnostics with AI interpretation */
  ai_section?: AiReportSection;
}

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
