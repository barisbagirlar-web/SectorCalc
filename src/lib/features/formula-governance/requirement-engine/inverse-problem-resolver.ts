/**
 * Inverse problem resolver - reversible formula requirement expansion.
 */

import type { ResolveInverseRequirementParams, InverseRequirementResult } from "@/lib/features/formula-governance/requirement-engine/requirement-engine-types";

export function resolveInverseRequirement(
  params: ResolveInverseRequirementParams,
): InverseRequirementResult {
  const { formulaNode, targetVariable, knownInputs } = params;
  const blockers: string[] = [];
  const warnings: string[] = [];

  if (!formulaNode.reversible) {
    return {
      status: "blocked",
      requiredInputs: [],
      blockers: [`Formula "${formulaNode.id}" is not reversible.`],
      warnings: ["Inverse solve requested on non-reversible formula."],
    };
  }

  if (formulaNode.outputVariable === targetVariable) {
    return {
      status: "resolved",
      solvedVariable: targetVariable,
      requiredInputs: [...formulaNode.requiredInputs],
      blockers: [],
      warnings: [],
    };
  }

  const mapping = formulaNode.inverseMappings?.find(
    (entry) => entry.solvedVariable === targetVariable,
  );

  if (!mapping) {
    return {
      status: "warning",
      requiredInputs: [],
      blockers: [],
      warnings: [
        `Target "${targetVariable}" is not an output or registered inverse mapping on "${formulaNode.id}".`,
      ],
    };
  }

  if (mapping.divisionRisk) {
    const denominatorKey = mapping.requiredInputs.find((key) => key !== targetVariable);
    if (denominatorKey && knownInputs[denominatorKey] === 0) {
      blockers.push(`Division by zero risk solving "${targetVariable}" from "${denominatorKey}".`);
    } else {
      warnings.push(`Inverse mapping for "${targetVariable}" includes division risk.`);
    }
  }

  const missing = mapping.requiredInputs.filter((key) => !(key in knownInputs));
  if (missing.length > 0) {
    warnings.push(`Inverse solve for "${targetVariable}" still needs: ${missing.join(", ")}.`);
  }

  return {
    status: blockers.length > 0 ? "blocked" : "resolved",
    solvedVariable: targetVariable,
    requiredInputs: [...mapping.requiredInputs],
    blockers,
    warnings,
  };
}
