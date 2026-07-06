import { z } from "zod";
import { DOMAIN_IDS, assertValidDomainId } from "./domain-taxonomy";
import {
  DECISION_STATES,
  CONFIDENCE_CLASSES,
  TOLERANCE_STATUSES,
  MEASUREMENT_TOOLS,
  CALIBRATION_STATUSES,
} from "./diagnostic-types";

/* ── Domain ── */

export const DomainIdSchema = z
  .string()
  .refine((val) => (DOMAIN_IDS as readonly string[]).includes(val), {
    message: `DomainId must be one of: ${DOMAIN_IDS.join(", ")}`,
  });

/* ── Measurement Confidence ── */

export const MeasurementToolSchema = z.enum(MEASUREMENT_TOOLS);

export const CalibrationStatusSchema = z.enum(CALIBRATION_STATUSES);

export const MeasurementConfidenceInputSchema = z.object({
  measured_value: z.number(),
  nominal_value: z.number(),
  tolerance_plus: z.number(),
  tolerance_minus: z.number(),
  unit: z.string().min(1),
  measurement_tool: MeasurementToolSchema,
  calibration_status: CalibrationStatusSchema,
  part_condition: z.string().min(1),
});

export const ToleranceStatusSchema = z.enum(TOLERANCE_STATUSES);
export const ConfidenceClassSchema = z.enum(CONFIDENCE_CLASSES);
export const DecisionStateSchema = z.enum(DECISION_STATES);

export const MeasurementConfidenceOutputSchema = z.object({
  expanded_uncertainty_k2: z.number().nonnegative(),
  confidence_class: ConfidenceClassSchema,
  tolerance_status: ToleranceStatusSchema,
  mandatory_decision_floor: DecisionStateSchema.nullable(),
});

/* ── Cost-at-Risk ── */

export const ProbabilitySourceSchema = z.enum([
  "DEFAULT_TABLE",
  "USER_ADJUSTED",
]);

export const CostAtRiskInputSchema = z.object({
  affected_quantity: z.number().nonnegative(),
  material_cost_per_unit: z.number().nonnegative(),
  rework_hours_per_unit: z.number().nonnegative(),
  blended_hourly_rate: z.number().nonnegative(),
  downtime_hours: z.number().nonnegative(),
  machine_hourly_rate: z.number().nonnegative(),
  expedite_or_delay_cost: z.number().nonnegative(),
  scrap_probability: z.number().min(0).max(1),
  rework_probability: z.number().min(0).max(1),
  probability_source: ProbabilitySourceSchema,
});

export const CostAtRiskOutputSchema = z.object({
  cost_at_risk: z.number().nonnegative(),
  probability_source: ProbabilitySourceSchema,
  assumptions: z.array(z.string()),
});

/* ── Visual Observation ── */

export const SeverityHintSchema = z.enum(["LOW", "MEDIUM", "HIGH"]);

export const VisualObservationSchema = z.object({
  description: z.string().min(1),
  severity_hint: SeverityHintSchema,
  confidence: z.number().min(0).max(1),
  manual_verification_required: z.boolean(),
});

/* ── Decision Engine ── */

export const DecisionEngineInputSchema = z.object({
  measurement_risk: z.number().min(0).max(25),
  confidence_risk: z.number().min(0).max(15),
  visual_advisory_risk: z.number().min(0).max(30).optional(),
  exposure_risk: z.number().min(0).max(15),
  cost_risk: z.number().min(0).max(10),
  manual_check_risk: z.number().min(0).max(5),
  mandatory_decision_floor: DecisionStateSchema.nullable().optional(),
  visual_observations: z.array(VisualObservationSchema).optional(),
});

export const RiskBreakdownSchema = z.object({
  measurement_risk: z.number(),
  confidence_risk: z.number(),
  visual_advisory_risk: z.number(),
  exposure_risk: z.number(),
  cost_risk: z.number(),
  manual_check_risk: z.number(),
});

export const DecisionEngineOutputSchema = z.object({
  total_risk_score: z.number().min(0).max(100),
  decision: DecisionStateSchema,
  mandatory_floor_applied: z.boolean(),
  breakdown: RiskBreakdownSchema,
});

/* ── Action Plan ── */

export const PrioritySchema = z.enum([
  "IMMEDIATE",
  "HIGH",
  "MEDIUM",
  "LOW",
]);

export const ActionPlanItemSchema = z.object({
  action: z.string().min(1),
  responsible_role: z.string().min(1),
  priority: PrioritySchema,
  estimated_duration: z.string().min(1),
});

export const ActionPlanOutputSchema = z.object({
  domain_id: DomainIdSchema,
  decision: DecisionStateSchema,
  containment: z.array(ActionPlanItemSchema),
  temporary_fix: z.array(ActionPlanItemSchema),
  permanent_corrective_action: z.array(ActionPlanItemSchema),
  required_manual_checks: z.array(ActionPlanItemSchema),
});

/* ── Industrial Context ── */

export const IndustrialContextSchema = z.object({
  domain_id: DomainIdSchema,
  process_description: z.string(),
  typical_tolerances: z.string(),
  common_defect_modes: z.array(z.string()),
});

/* ── Complete Diagnostic Result ── */

export const DiagnosticResultSchema = z.object({
  domain_id: DomainIdSchema,
  measurement: MeasurementConfidenceOutputSchema,
  cost: CostAtRiskOutputSchema,
  decision: DecisionEngineOutputSchema,
  action_plan: ActionPlanOutputSchema,
  context: IndustrialContextSchema,
});

/* ── Runtime Domain Guard ── */

export function parseAndValidateDomainId(raw: string): string {
  try {
    assertValidDomainId(raw);
  } catch {
    throw new Error(
      `DomainResolveError: "${raw}" is not a recognized domain. Valid domains: ${DOMAIN_IDS.join(", ")}`
    );
  }
  return raw;
}
