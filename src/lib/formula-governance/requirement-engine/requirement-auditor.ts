/**
 * Requirement auditor — sanity checks on requirement solve results.
 */

import type { CalculationOntology } from "@/lib/formula-governance/calculation-ontology/ontology-types";
import type { RequirementSolveResult } from "@/lib/formula-governance/requirement-engine/requirement-engine-types";

export type RequirementAuditFinding = {
  readonly code: string;
  readonly message: string;
};

export function auditRequirementSolveResult(
  ontology: CalculationOntology,
  result: RequirementSolveResult,
): readonly RequirementAuditFinding[] {
  const findings: RequirementAuditFinding[] = [];

  for (const variableId of result.requiredMissingInputs) {
    const variable = ontology.variables.find((entry) => entry.id === variableId);
    if (!variable) {
      findings.push({
        code: "REQ_UNKNOWN_MISSING",
        message: `Missing input "${variableId}" is not declared in ontology.`,
      });
    }
  }

  for (const variableId of result.defaultedInputs) {
    const variable = ontology.variables.find((entry) => entry.id === variableId);
    if (variable && variable.knowledgeLevel !== "defaultable") {
      findings.push({
        code: "REQ_INVALID_DEFAULT",
        message: `Variable "${variableId}" was defaulted but is not defaultable.`,
      });
    }
  }

  for (const step of result.derivedResolutionPlan) {
    if (!ontology.formulas.some((formula) => formula.id === step.formulaNodeId)) {
      findings.push({
        code: "REQ_UNKNOWN_FORMULA",
        message: `Derived plan references unknown formula "${step.formulaNodeId}".`,
      });
    }
  }

  if (result.status === "ready_to_calculate" && result.requiredMissingInputs.length > 0) {
    findings.push({
      code: "REQ_STATUS_MISMATCH",
      message: "Status is ready_to_calculate but missing inputs remain.",
    });
  }

  return findings;
}
