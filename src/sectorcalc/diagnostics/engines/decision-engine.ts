import type {
  DecisionEngineInput,
  DecisionEngineOutput,
  DecisionState,
} from "../diagnostic-types";
import { RISK_CAPS, TOTAL_RISK_MAX, DECISION_THRESHOLDS } from "../diagnostic-constants";

/**
 * Clamp a risk component score to its cap.
 */
function clampComponent(
  value: number,
  key: keyof typeof RISK_CAPS
): number {
  const cap = RISK_CAPS[key].max;
  return Math.max(0, Math.min(value, cap));
}

/**
 * Map a total score to a DecisionState using threshold table.
 */
export function scoreToDecision(totalScore: number): DecisionState {
  for (const threshold of DECISION_THRESHOLDS) {
    if (totalScore <= threshold.max_score) {
      return threshold.decision;
    }
  }
  return "HIGH_SCRAP_RISK";
}

/**
 * Evaluate decision state from risk component scores.
 *
 * Rules:
 * 1. Each component is independently clamped to its allowed cap.
 * 2. Total is sum of clamped components, capped at 100.
 * 3. If mandatory_decision_floor is set, the final decision
 *    cannot be below that floor.
 * 4. visual_advisory_risk defaults to 0 when absent.
 * 5. No LLM, no random values — fully deterministic.
 */
export function evaluateDecision(
  input: DecisionEngineInput
): DecisionEngineOutput {
  const clamped: DecisionEngineOutput["breakdown"] = {
    measurement_risk: clampComponent(input.measurement_risk, "measurement_risk"),
    confidence_risk: clampComponent(input.confidence_risk, "confidence_risk"),
    visual_advisory_risk: clampComponent(
      input.visual_advisory_risk ?? 0,
      "visual_advisory_risk"
    ),
    exposure_risk: clampComponent(input.exposure_risk, "exposure_risk"),
    cost_risk: clampComponent(input.cost_risk, "cost_risk"),
    manual_check_risk: clampComponent(input.manual_check_risk, "manual_check_risk"),
  };

  let totalScore =
    clamped.measurement_risk +
    clamped.confidence_risk +
    clamped.visual_advisory_risk +
    clamped.exposure_risk +
    clamped.cost_risk +
    clamped.manual_check_risk;

  totalScore = Math.min(totalScore, TOTAL_RISK_MAX);

  let decision = scoreToDecision(totalScore);
  let mandatoryFloorApplied = false;

  if (input.mandatory_decision_floor) {
    const floorValue = DECISION_THRESHOLDS.find(
      (t) => t.decision === input.mandatory_decision_floor
    );
    const decisionValue = DECISION_THRESHOLDS.find(
      (t) => t.decision === decision
    );

    if (floorValue && decisionValue && floorValue.max_score > decisionValue.max_score) {
      decision = input.mandatory_decision_floor;
      mandatoryFloorApplied = true;
    }
  }

  return {
    total_risk_score: totalScore,
    decision,
    mandatory_floor_applied: mandatoryFloorApplied,
    breakdown: clamped,
  };
}
