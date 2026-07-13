// SectorCalc SuperV4 V5.3 — Decision Engine
// Server-side decision state computation. No client-side decision logic.

import type {
  CalcStatus,
  DecisionInterpretation,
  Severity,
} from "../pro-form/contract-types";

export interface DecisionInput {
  outputs: Array<{
    id: string;
    value: number | string | boolean | null;
    name: string;
  }>;
  warnings: Array<{ severity: Severity; message: string }>;
  violations: Array<{ inputId: string; severity: Severity; message: string }>;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  moneyAtRisk: number | null;
  currency: string | null;
  mainCostDriver: string | null;
  /** Authoritative status returned by the server-side formula module. */
  formulaStatus?: CalcStatus | null;
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
  const hasBlockedWarning = input.warnings.some(
    (warning) => warning.severity === "BLOCKED",
  );
  const hasCriticalWarning = input.warnings.some(
    (warning) => warning.severity === "CRITICAL",
  );
  const hasBlockedViolation = input.violations.some(
    (violation) => violation.severity === "BLOCKED",
  );

  let status: CalcStatus = "OK";
  let primaryReason = "Calculation completed within acceptable parameters.";

  if (
    hasBlockedViolation ||
    hasBlockedWarning ||
    input.formulaStatus === "BLOCKED"
  ) {
    status = "BLOCKED";
    primaryReason =
      input.formulaStatus === "BLOCKED"
        ? "The calculator decision model blocked this case. Correct the blocked inputs before commitment."
        : "Calculation blocked due to physical bound violations or critical blockers.";
  } else if (input.formulaStatus === "REVIEW") {
    status = "REVIEW";
    primaryReason =
      "The calculator decision model requires review before commitment.";
  } else if (hasCriticalWarning) {
    status = "REVIEW";
    primaryReason =
      "Calculation completed with critical warnings that require review.";
  } else if (input.riskLevel === "CRITICAL" || input.riskLevel === "HIGH") {
    status = "REVIEW";
    primaryReason = `Risk level is ${input.riskLevel}. Review recommended.`;
  }

  const hiddenRisks: DecisionResult["hidden_risks"] = [];
  for (const violation of input.violations) {
    if (
      violation.severity === "WARNING" ||
      violation.severity === "REVIEW"
    ) {
      hiddenRisks.push({
        id: `hr_${violation.inputId}`,
        severity: violation.severity,
        affected_input_id: violation.inputId,
        affected_output_id: null,
        affected_clause_id: null,
        message: violation.message,
        why_it_matters: "This input value may affect calculation reliability.",
        suggested_action: "Verify input value against source documentation.",
      });
    }
  }

  const moneyImpact: DecisionInterpretation["money_impact_summary"] = {
    enabled: input.moneyAtRisk !== null,
    currency: input.currency,
    money_at_risk_formatted:
      input.moneyAtRisk !== null && input.currency
        ? `${input.currency}${input.moneyAtRisk.toLocaleString("en-US", {
            maximumFractionDigits: 2,
          })}`
        : null,
    main_cost_driver: input.mainCostDriver,
    quote_or_decision_impact:
      status === "BLOCKED"
        ? "Calculation blocked — no impact assessment available."
        : status === "REVIEW"
          ? "Proceed only after the identified review conditions are resolved."
          : "Within the declared decision limits.",
  };

  const whatCanFlip = hiddenRisks.map((risk) => risk.message.slice(0, 100));
  if (whatCanFlip.length === 0) {
    whatCanFlip.push("No significant flip factors identified.");
  }

  const nextActions: string[] = [];
  if (status === "BLOCKED") {
    nextActions.push("Correct the blocked inputs and re-run.");
    nextActions.push("Verify all input values against source documentation.");
  } else if (status === "REVIEW") {
    nextActions.push("Resolve the review conditions before proceeding.");
    nextActions.push("Cross-check critical inputs against source documentation.");
  } else {
    nextActions.push("Proceed with the calculated result.");
    nextActions.push("Document inputs and outputs for the audit trail.");
  }

  return {
    status,
    primary_reason: primaryReason,
    hidden_risks: hiddenRisks,
    money_impact: moneyImpact,
    what_can_flip: whatCanFlip,
    next_actions: nextActions,
  };
}
