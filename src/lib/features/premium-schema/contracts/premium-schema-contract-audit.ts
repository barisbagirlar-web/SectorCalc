import type { PremiumCalculatorSchema } from "../premium-calculator-schema";
import { FORMULA_CONTRACT_REGISTRY } from "./formula-contract-registry";

export interface ContractAuditError {
  toolKey: string;
  formulaId: string;
  inputId?: string;
  outputId?: string;
  reason: string;
  filePath?: string;
}

export function auditPremiumSchema(
  schema: PremiumCalculatorSchema,
  filePath?: string
): ContractAuditError[] {
  const errors: ContractAuditError[] = [];

  if (!schema.formulaPipeline || schema.formulaPipeline.length === 0) {
    return errors;
  }

  // Track what input IDs are available at each step.
  // Initially, all schema inputs are available.
  const availableInputIds = new Set<string>(schema.inputs.map((i) => i.id));

  for (let i = 0; i < schema.formulaPipeline.length; i++) {
    const step = schema.formulaPipeline[i];
    const contract = FORMULA_CONTRACT_REGISTRY[step.formulaId];

    if (!contract) {
      // Contract not yet defined; skip for now per rollout strategy.
      // Make step output available to subsequent steps.
      if (step.outputId) {
        availableInputIds.add(step.outputId);
      }
      continue;
    }

    // Check required inputs against contract
    for (const reqInput of contract.requiredInputs) {
      const mappedId = step.inputMap[reqInput.id];

      if (!mappedId) {
        errors.push({
          toolKey: schema.id,
          formulaId: step.formulaId,
          inputId: reqInput.id,
          filePath,
          reason: `Contract requires input '${reqInput.id}', but it is missing from the step's inputMap.`,
        });
        continue;
      }

      // Sometimes inputMaps contain constants or raw strings instead of IDs. 
      // But based on our architecture, they should map to input IDs. 
      // If we find an exception later, we can adjust, but standard practice is mapping to IDs.
      if (!availableInputIds.has(mappedId)) {
        errors.push({
          toolKey: schema.id,
          formulaId: step.formulaId,
          inputId: reqInput.id,
          filePath,
          reason: `Mapped input '${mappedId}' (for contract input '${reqInput.id}') does not exist in schema inputs or prior outputs.`,
        });
      }
    }

    // Make step output available to subsequent steps
    if (step.outputId) {
      availableInputIds.add(step.outputId);
    }
  }

  return errors;
}
