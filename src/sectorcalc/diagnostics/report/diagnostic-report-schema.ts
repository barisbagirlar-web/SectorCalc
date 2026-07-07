import { z } from "zod";
import { DOMAIN_IDS } from "../domain-taxonomy";
import {
  DECISION_STATES,
  CONFIDENCE_CLASSES,
  TOLERANCE_STATUSES,
} from "../diagnostic-types";
import {
  REPORT_TYPE,
  SCHEMA_VERSION,
  ENGINE_VERSION,
  METHODOLOGY_VERSION,
} from "./diagnostic-report-types";

export const AuditEventSchema = z.object({
  event: z.string().min(1),
  at: z.string().min(1),
  source: z.literal("server"),
  engine_version: z.string().min(1),
});

export const DomainSectionSchema = z.object({
  domain_id: z.enum(DOMAIN_IDS),
  label: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  process_description: z.string().min(1),
  typical_tolerances: z.string().min(1),
  common_defect_modes: z.array(z.string()),
});

export const ProblemSectionSchema = z.object({
  problem_context: z.string(),
});

export const MeasurementSectionEntrySchema = z.object({
  index: z.number().nonnegative(),
  measured_value: z.number(),
  nominal_value: z.number(),
  tolerance_plus: z.number(),
  tolerance_minus: z.number(),
  unit: z.string().min(1),
  measurement_tool: z.string().min(1),
  calibration_status: z.string(),
  part_condition: z.string(),
  expanded_uncertainty_k2: z.number().nonnegative(),
  confidence_class: z.enum(CONFIDENCE_CLASSES),
  tolerance_status: z.enum(TOLERANCE_STATUSES),
  mandatory_decision_floor: z.string().nullable(),
});

export const MeasurementSectionSchema = z.object({
  entries: z.array(MeasurementSectionEntrySchema),
  worst_case_tolerance_status: z.enum(TOLERANCE_STATUSES),
});

export const CostSectionSchema = z.object({
  affected_quantity: z.number().nonnegative(),
  material_cost_per_unit: z.number().nonnegative(),
  rework_hours_per_unit: z.number().nonnegative(),
  blended_hourly_rate: z.number().nonnegative(),
  downtime_hours: z.number().nonnegative(),
  machine_hourly_rate: z.number().nonnegative(),
  expedite_or_delay_cost: z.number().nonnegative(),
  scrap_probability: z.number().min(0).max(1),
  rework_probability: z.number().min(0).max(1),
  probability_source: z.string().min(1),
  estimated_cost_at_risk: z.number().nonnegative(),
  assumptions: z.array(z.string()),
});

export const DecisionSectionSchema = z.object({
  total_risk_score: z.number().min(0).max(100),
  decision: z.enum(DECISION_STATES),
  mandatory_floor_applied: z.boolean(),
  measurement_risk: z.number().min(0).max(25),
  confidence_risk: z.number().min(0).max(15),
  visual_advisory_risk: z.number().min(0).max(30),
  exposure_risk: z.number().min(0).max(15),
  cost_risk: z.number().min(0).max(10),
  manual_check_risk: z.number().min(0).max(5),
});

export const ActionPlanSectionEntrySchema = z.object({
  action: z.string().min(1),
  responsible_role: z.string().min(1),
  priority: z.string().min(1),
  estimated_duration: z.string().min(1),
});

export const ActionPlanSectionSchema = z.object({
  containment: z.array(ActionPlanSectionEntrySchema),
  temporary_fix: z.array(ActionPlanSectionEntrySchema),
  permanent_corrective_action: z.array(ActionPlanSectionEntrySchema),
  required_manual_checks: z.array(ActionPlanSectionEntrySchema),
});

export const EvidenceSectionSchema = z.object({
  photo_status: z.enum(["NOT_ATTACHED", "HASH_ONLY", "ATTACHED_IN_MEMORY"]),
  image_hash: z.string().nullable(),
  privacy_mode: z.enum(["standard", "reduced_retention"]),
});

export const RelatedToolEntrySchema = z.object({
  slug: z.string().min(1),
  label: z.string().min(1),
  status: z.enum(["ACTIVE", "PLANNED", "MISSING"]),
  reason: z.string().min(1),
});

export const RelatedToolsSectionSchema = z.object({
  tools: z.array(RelatedToolEntrySchema),
});

export const MethodologyEntrySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  formula: z.string().min(1),
});

export const MethodologySectionSchema = z.object({
  entries: z.array(MethodologyEntrySchema).min(1),
  note: z.string().min(1),
});

export const LimitationSectionSchema = z.object({
  disclaimer: z.string().min(1),
  llm_limitation: z.string().min(1),
  manual_verification_required: z.boolean(),
});

const VisualObservationSchema = z.object({
  description: z.string().min(1),
  severity_hint: z.enum(["LOW", "MEDIUM", "HIGH"]),
  confidence: z.number().min(0).max(1),
  manual_verification_required: z.boolean(),
});

export const AiReportSectionSchema = z.object({
  visual_observations: z.array(VisualObservationSchema),
  engineering_interpretation: z.string().min(1),
  root_cause_hypotheses: z.array(z.string().min(1)),
  ncr_statement: z.string().min(1),
  capa_statement: z.string().min(1),
  executive_summary: z.string().min(1),
  action_narrative: z.string().min(1),
  provider: z.literal("openai"),
  model: z.string().min(1),
  generated_at: z.string().min(1),
});

export const DiagnosticReportSchema = z.object({
  report_id: z.string().min(1),
  report_type: z.literal(REPORT_TYPE),
  schema_version: z.literal(SCHEMA_VERSION),
  engine_version: z.literal(ENGINE_VERSION),
  methodology_version: z.literal(METHODOLOGY_VERSION),
  created_at: z.string().min(1),
  domain_section: DomainSectionSchema,
  problem_section: ProblemSectionSchema,
  measurement_section: MeasurementSectionSchema,
  cost_section: CostSectionSchema,
  decision_section: DecisionSectionSchema,
  action_plan_section: ActionPlanSectionSchema,
  evidence_section: EvidenceSectionSchema,
  related_tools_section: RelatedToolsSectionSchema,
  methodology_section: MethodologySectionSchema,
  limitation_section: LimitationSectionSchema,
  audit_log: z.array(AuditEventSchema),
  ai_section: AiReportSectionSchema.optional(),
});
