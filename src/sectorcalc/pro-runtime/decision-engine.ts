// SectorCalc SuperV4 V5.3 — Decision Engine
// Server-side decision state computation. No client-side decision logic.

import type { CalcStatus, DecisionInterpretation, Severity } from "../pro-form/contract-types";

export interface DecisionInput {
  outputs: Array<{ id: string; value: number | string | boolean | null; name: string }>;
  warnings: Array<{ severity: Severity; message: string }>;
  violations: Array<{ inputId: string; severity: Severity; message: string }>;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  moneyAtRisk: number | null;
  currency: string | null;
  mainCostDriver: string | null;
}

export interface DecisionResult {
  status: CalcStatus;
  primary_reason: string;
  hidden_risks: DecisionInterpretation["hidden_risk_explanations"];
  money_impact: DecisionInterpretation["money_impact_summary"];
  what_can_flip: string[];
  next_actions: string[];
}

export function computeDecision(input: DecisionInput): DecisionResult {
  const hasBlockedWarning = input.warnings.some((w) => w.severity === "BLOCKED");
  const hasCriticalWarning = input.warnings.some((w) => w.severity === "CRITICAL");
  const hasBlockedViolation = input.violations.some((v) => v.severity === "BLOCKED");

  // Determine status
  let status: CalcStatus = "OK";
  let primaryReason = "Calculation completed within acceptable parameters.";

  if (hasBlockedViolation || hasBlockedWarning) {
    status = "BLOCKED";
    primaryReason = "Calculation blocked due to physical bound violations or critical blockers.";
  } else if (hasCriticalWarning) {
    status = "REVIEW";
    primaryReason = "Calculation completed with critical warnings that require engineering review.";
  } else if (input.riskLevel === "CRITICAL" || input.riskLevel === "HIGH") {
    status = "REVIEW";
    primaryReason = `Risk level is ${input.riskLevel}. Engineering review recommended.`;
  }

  // Hidden risks
  const hidden_risks: DecisionResult["hidden_risks"] = [];
  for (const v of input.violations) {
    if (v.severity === "WARNING" || v.severity === "REVIEW") {
      hidden_risks.push({
        id: `hr_${v.inputId}`,
        severity: v.severity,
        affected_input_id: v.inputId,
        affected_output_id: null,
        affected_clause_id: null,
        message: v.message,
        why_it_matters: "This input value may affect calculation reliability.",
        suggested_action: "Verify input value against source documentation.",
      });
    }
  }

  // Money impact
  const money_impact: DecisionInterpretation["money_impact_summary"] = {
    enabled: input.moneyAtRisk !== null,
    currency: input.currency,
    money_at_risk_formatted:
      input.moneyAtRisk !== null && input.currency
        ? `${input.currency}${input.moneyAtRisk.toLocaleString("en-US", { maximumFractionDigits: 2 })}`
        : null,
    main_cost_driver: input.mainCostDriver,
    quote_or_decision_impact:
      status === "BLOCKED"
        ? "Calculation blocked — no impact assessment available."
        : status === "REVIEW"
          ? "Proceed with caution. Review recommended before commitment."
          : "Within acceptable range.",
  };

  // What can flip
  const what_can_flip: string[] = [];
  for (const hr of hidden_risks) {
    what_can_flip.push(hr.message.slice(0, 100));
  }
  if (what_can_flip.length === 0) {
    what_can_flip.push("No significant flip factors identified.");
  }

  // Next actions
  const next_actions: string[] = [];
  if (status === "BLOCKED") {
    next_actions.push("Correct the blocked inputs and re-run.");
    next_actions.push("Verify all input values against source documentation.");
  } else if (status === "REVIEW") {
    next_actions.push("Review warnings and hidden risks before proceeding.");
    next_actions.push("Cross-check critical inputs with engineering team.");
  } else {
    next_actions.push("Proceed with the calculated result.");
    next_actions.push("Document inputs and outputs for audit trail.");
  }

  return {
    status,
    primary_reason: primaryReason,
    hidden_risks,
    money_impact,
    what_can_flip,
    next_actions,
  };
}
