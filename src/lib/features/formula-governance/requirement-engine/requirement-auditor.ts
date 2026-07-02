/**
 * Requirement auditor - sanity checks on requirement solve results.
 */

import type { CalculationOntology } from "@/lib/features/formula-governance/calculation-ontology/ontology-types";
import type { DriftScoreGateResult } from "@/lib/features/formula-governance/requirement-engine/drift-score-gate";
import type { RequirementSolveResult } from "@/lib/features/formula-governance/requirement-engine/requirement-engine-types";

export type RequirementAuditFinding = {
  readonly code: string;
  readonly message: string;
};

export type AuditRequirementSolveResultParams = {
  readonly ontology: CalculationOntology;
  readonly result: RequirementSolveResult;
  readonly driftGate?: DriftScoreGateResult;
};

function driftGateFinding(driftGate: DriftScoreGateResult): RequirementAuditFinding {
  const code =
    driftGate.status === "blocked"
      ? "DRIFT_GATE_BLOCKED"
      : driftGate.status === "needs_review"
        ? "DRIFT_GATE_NEEDS_REVIEW"
        : "DRIFT_GATE_LOW_RISK";

  return {
    code,
    message: `${driftGate.recommendedAction} (${driftGate.reasons.join(" ")})`,
  };
}

export function auditRequirementSolveResult(
  ontologyOrParams: CalculationOntology | AuditRequirementSolveResultParams,
  result?: RequirementSolveResult,
): readonly RequirementAuditFinding[] {
  const ontology =
    "ontology" in ontologyOrParams ? ontologyOrParams.ontology : ontologyOrParams;
  const solveResult =
    "ontology" in ontologyOrParams ? ontologyOrParams.result : result!;
  const driftGate =
    "ontology" in ontologyOrParams ? ontologyOrParams.driftGate : undefined;
  const findings: RequirementAuditFinding[] = [];

  for (const variableId of solveResult.requiredMissingInputs) {
    const variable = ontology.variables.find((entry) => entry.id === variableId);
    if (!variable) {
      findings.push({
        code: "REQ_UNKNOWN_MISSING",
        message: `Missing input "${variableId}" is not declared in ontology.`,
      });
    }
  }

  for (const variableId of solveResult.defaultedInputs) {
    const variable = ontology.variables.find((entry) => entry.id === variableId);
    if (variable && variable.knowledgeLevel !== "defaultable") {
      findings.push({
        code: "REQ_INVALID_DEFAULT",
        message: `Variable "${variableId}" was defaulted but is not defaultable.`,
      });
    }
  }

  for (const step of solveResult.derivedResolutionPlan) {
    if (!ontology.formulas.some((formula) => formula.id === step.formulaNodeId)) {
      findings.push({
        code: "REQ_UNKNOWN_FORMULA",
        message: `Derived plan references unknown formula "${step.formulaNodeId}".`,
      });
    }
  }

  if (solveResult.status === "ready_to_calculate" && solveResult.requiredMissingInputs.length > 0) {
    findings.push({
      code: "REQ_STATUS_MISMATCH",
      message: "Status is ready_to_calculate but missing inputs remain.",
    });
  }

  if (driftGate) {
    findings.push(driftGateFinding(driftGate));
  }

  return findings;
}
