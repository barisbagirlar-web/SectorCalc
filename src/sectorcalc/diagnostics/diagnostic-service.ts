import { z } from "zod";
import type { DomainId } from "./domain-taxonomy";
import { DOMAIN_REGISTRY } from "./domain-taxonomy";
import type {
  MeasurementConfidenceInput,
  CostAtRiskInput,
  VisualObservation,
  DecisionState,
} from "./diagnostic-types";
import {
  evaluateMeasurementConfidence,
  computeCostAtRisk,
  evaluateDecision,
  buildActionPlan,
  getIndustrialContext,
} from "./engines/index";
import {
  DomainIdSchema,
  MeasurementConfidenceInputSchema,
  VisualObservationSchema,
} from "./diagnostic-schema";

/* ── Request Schema ── */

export const AnalyzeRequestSchema = z.object({
  domain_id: DomainIdSchema,
  problem_context: z.string().min(1).max(5000),
  measurements: z.array(MeasurementConfidenceInputSchema).min(1).max(50),
  costs: z.object({
    affected_quantity: z.number().nonnegative(),
    material_cost_per_unit: z.number().nonnegative(),
    rework_hours_per_unit: z.number().nonnegative(),
    blended_hourly_rate: z.number().nonnegative(),
    downtime_hours: z.number().nonnegative(),
    machine_hourly_rate: z.number().nonnegative(),
    expedite_or_delay_cost: z.number().nonnegative(),
    scrap_probability: z.number().min(0).max(1),
    rework_probability: z.number().min(0).max(1),
    probability_source: z.enum(["DEFAULT_TABLE", "USER_ADJUSTED"]),
  }),
  visual_observations: z.array(VisualObservationSchema).max(20).optional(),
  privacy_mode: z.enum(["standard", "reduced_retention"]).default("standard"),
});

export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;

/* ── Response Types ── */

export interface AnalyzeResponse {
  ok: true;
  diagnostic_id: "preview-only";
  domain: {
    id: DomainId;
    label: string;
    description: string;
    category: "core" | "advisory";
    context: {
      process_description: string;
      typical_tolerances: string;
      common_defect_modes: string[];
    };
  };
  problem_context: string;
  measurement_results: Array<{
    index: number;
    input_summary: {
      measured_value: number;
      nominal_value: number;
      unit: string;
      tool: string;
    };
    expanded_uncertainty_k2: number;
    confidence_class: string;
    tolerance_status: string;
    mandatory_decision_floor: DecisionState | null;
  }>;
  cost_at_risk: {
    total: number;
    probability_source: string;
    assumptions: string[];
  };
  decision: {
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
  };
  action_plan: {
    containment: Array<{ action: string; responsible_role: string; priority: string; estimated_duration: string }>;
    temporary_fix: Array<{ action: string; responsible_role: string; priority: string; estimated_duration: string }>;
    permanent_corrective_action: Array<{ action: string; responsible_role: string; priority: string; estimated_duration: string }>;
    required_manual_checks: Array<{ action: string; responsible_role: string; priority: string; estimated_duration: string }>;
  };
  audit_log: string[];
  disclaimer: string;
}

/* ── Risk Derivation (server-side, never client-provided) ── */

/**
 * Derive measurement_risk from tolerance_status.
 * Only computed server-side — never trusted from client.
 */
function deriveMeasurementRisk(toleranceStatus: string): number {
  switch (toleranceStatus) {
    case "BREACH":
      return 25;
    case "UNCERTAIN":
      return 20;
    case "NEAR_LIMIT":
      return 10;
    default:
      return 0;
  }
}

/**
 * Derive confidence_risk from confidence_class.
 */
function deriveConfidenceRisk(confidenceClass: string): number {
  switch (confidenceClass) {
    case "LOW":
      return 15;
    case "MEDIUM":
      return 8;
    default:
      return 0;
  }
}

/**
 * Derive exposure_risk from affected_quantity.
 */
function deriveExposureRisk(affectedQuantity: number): number {
  if (affectedQuantity >= 1000) return 15;
  if (affectedQuantity >= 500) return 10;
  if (affectedQuantity >= 100) return 5;
  if (affectedQuantity >= 1) return 2;
  return 0;
}

/**
 * Derive cost_risk from cost_at_risk value.
 */
function deriveCostRisk(costAtRisk: number): number {
  if (costAtRisk >= 100_000) return 10;
  if (costAtRisk >= 50_000) return 7;
  if (costAtRisk >= 10_000) return 5;
  if (costAtRisk >= 1_000) return 3;
  if (costAtRisk > 0) return 1;
  return 0;
}

/**
 * Derive visual_advisory_risk from optional visual observations.
 */
function deriveVisualAdvisoryRisk(
  observations?: VisualObservation[]
): number {
  if (!observations || observations.length === 0) return 0;
  const maxSeverity = observations.reduce((max, o) => {
    const sev = o.severity_hint === "HIGH" ? 3 : o.severity_hint === "MEDIUM" ? 2 : 1;
    return Math.max(max, sev);
  }, 0);
  if (maxSeverity >= 3) return 30;
  if (maxSeverity === 2) return 15;
  return 5;
}

/**
 * Derive manual_check_risk from visual observations.
 * If any observation requires manual verification, set to 5.
 */
function deriveManualCheckRisk(
  observations?: VisualObservation[]
): number {
  if (!observations || observations.length === 0) return 0;
  const requiresManual = observations.some((o) => o.manual_verification_required);
  return requiresManual ? 5 : 0;
}

/* ── Orchestrator ── */

/**
 * Run the full deterministic diagnostic pipeline.
 *
 * All risk component scores are derived server-side from engine outputs.
 * Client-provided risk values are NEVER trusted.
 * No LLM, no random values, no API calls.
 */
export function runDiagnostic(
  request: AnalyzeRequest
): AnalyzeResponse {
  const auditLog: string[] = [];
  const timestamp = new Date().toISOString();
  auditLog.push(`[${timestamp}] Diagnostic started for domain: ${request.domain_id}`);

  /* 1. Resolve domain context */
  const context = getIndustrialContext(request.domain_id as DomainId);
  const domainInfo = DOMAIN_REGISTRY[request.domain_id as DomainId];
  auditLog.push(`[${timestamp}] Domain context resolved: ${domainInfo.label}`);

  /* 2. Run measurement confidence engine for each measurement */
  const measurementResults = request.measurements.map((m: MeasurementConfidenceInput, i: number) => {
    const result = evaluateMeasurementConfidence(m);
    auditLog.push(
      `[${timestamp}] Measurement[${i}]: ${m.measurement_tool} → ${result.tolerance_status} (u_k2=${result.expanded_uncertainty_k2.toFixed(4)})`
    );
    return {
      index: i,
      input_summary: {
        measured_value: m.measured_value,
        nominal_value: m.nominal_value,
        unit: m.unit,
        tool: m.measurement_tool,
      },
      expanded_uncertainty_k2: result.expanded_uncertainty_k2,
      confidence_class: result.confidence_class,
      tolerance_status: result.tolerance_status,
      mandatory_decision_floor: result.mandatory_decision_floor,
    };
  });

  /* 3. Determine mandatory decision floor across all measurements */
  const mandatoryFloor = measurementResults.reduce<DecisionState | null>(
    (floor, mr) => {
      if (mr.mandatory_decision_floor === "STOP_AND_INSPECT") return "STOP_AND_INSPECT";
      return floor;
    },
    null
  );

  /* 4. Aggregate risk from worst measurement */
  const worstMeasurement = measurementResults.reduce((worst, mr) => {
    const riskOrder: Record<string, number> = { BREACH: 4, UNCERTAIN: 3, NEAR_LIMIT: 2, INSIDE: 1 };
    const worstOrder = riskOrder[worst.tolerance_status] ?? 0;
    const currentOrder = riskOrder[mr.tolerance_status] ?? 0;
    return currentOrder > worstOrder ? mr : worst;
  }, measurementResults[0]);

  /* 5. Run cost-at-risk engine */
  const costAtRiskInput: CostAtRiskInput = {
    affected_quantity: request.costs.affected_quantity,
    material_cost_per_unit: request.costs.material_cost_per_unit,
    rework_hours_per_unit: request.costs.rework_hours_per_unit,
    blended_hourly_rate: request.costs.blended_hourly_rate,
    downtime_hours: request.costs.downtime_hours,
    machine_hourly_rate: request.costs.machine_hourly_rate,
    expedite_or_delay_cost: request.costs.expedite_or_delay_cost,
    scrap_probability: request.costs.scrap_probability,
    rework_probability: request.costs.rework_probability,
    probability_source: request.costs.probability_source,
  };
  const costResult = computeCostAtRisk(costAtRiskInput);
  auditLog.push(
    `[${timestamp}] Cost-at-risk computed: ${costResult.cost_at_risk.toFixed(2)}`
  );

  /* 6. Derive all risk components server-side */
  const derivedMeasurementRisk = deriveMeasurementRisk(worstMeasurement.tolerance_status);
  const derivedConfidenceRisk = deriveConfidenceRisk(worstMeasurement.confidence_class);
  const derivedExposureRisk = deriveExposureRisk(request.costs.affected_quantity);
  const derivedCostRisk = deriveCostRisk(costResult.cost_at_risk);
  const derivedVisualRisk = deriveVisualAdvisoryRisk(request.visual_observations);
  const derivedManualCheckRisk = deriveManualCheckRisk(request.visual_observations);

  /* 7. Run decision engine */
  const decisionResult = evaluateDecision({
    measurement_risk: derivedMeasurementRisk,
    confidence_risk: derivedConfidenceRisk,
    visual_advisory_risk: derivedVisualRisk,
    exposure_risk: derivedExposureRisk,
    cost_risk: derivedCostRisk,
    manual_check_risk: derivedManualCheckRisk,
    mandatory_decision_floor: mandatoryFloor,
    visual_observations: request.visual_observations,
  });
  auditLog.push(
    `[${timestamp}] Decision: ${decisionResult.decision} (score=${decisionResult.total_risk_score})`
  );

  /* 8. Run action planning engine */
  const actionPlan = buildActionPlan(
    request.domain_id as DomainId,
    decisionResult.decision
  );
  auditLog.push(
    `[${timestamp}] Action plan built: ${actionPlan.containment.length} containment items`
  );

  /* 9. Final audit */
  auditLog.push(`[${timestamp}] Diagnostic complete`);

  return {
    ok: true,
    diagnostic_id: "preview-only",
    domain: {
      id: request.domain_id as DomainId,
      label: domainInfo.label,
      description: domainInfo.description,
      category: domainInfo.category,
      context: {
        process_description: context.process_description,
        typical_tolerances: context.typical_tolerances,
        common_defect_modes: context.common_defect_modes,
      },
    },
    problem_context: request.problem_context,
    measurement_results: measurementResults,
    cost_at_risk: {
      total: costResult.cost_at_risk,
      probability_source: costResult.probability_source,
      assumptions: costResult.assumptions,
    },
    decision: {
      total_risk_score: decisionResult.total_risk_score,
      decision: decisionResult.decision,
      mandatory_floor_applied: decisionResult.mandatory_floor_applied,
      breakdown: decisionResult.breakdown,
    },
    action_plan: {
      containment: actionPlan.containment,
      temporary_fix: actionPlan.temporary_fix,
      permanent_corrective_action: actionPlan.permanent_corrective_action,
      required_manual_checks: actionPlan.required_manual_checks,
    },
    audit_log: auditLog,
    disclaimer:
      "AI-assisted preliminary screening and decision-support output. Manual verification required.",
  };
}
