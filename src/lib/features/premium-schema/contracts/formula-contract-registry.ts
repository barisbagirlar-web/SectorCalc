import type { FormulaContract } from "./formula-contract-types";

export const FORMULA_CONTRACT_REGISTRY: Record<string, FormulaContract> = {
  // Add an initial contract to demonstrate the Contract-Compiled Kernel guard
  "measurement.lightweight_weight_red": {
    formulaId: "measurement.lightweight_weight_red",
    deterministic: true,
    requiredInputs: [
      { id: "originalMass", kind: "number", unit: "kg", required: true },
      { id: "lightweightMass", kind: "number", unit: "kg", required: true },
    ],
    outputs: [
      { id: "weightReduction", kind: "number", unit: "kg" },
    ],
  },
};

FORMULA_CONTRACT_REGISTRY["calculateUncertaintyBand"] = {
  formulaId: "calculateUncertaintyBand",
  requiredInputs: [{ id: "expectedValue", kind: "number", unit: "custom", required: true }, { id: "uncertaintySigma", kind: "number", unit: "custom", required: true }, { id: "confidenceLevel", kind: "number", unit: "custom", required: true }],
  outputs: [{ id: "uncertaintyBand", kind: "number", unit: "custom" }],
  deterministic: true
};
FORMULA_CONTRACT_REGISTRY["calculateDownsideExposure"] = {
  formulaId: "calculateDownsideExposure",
  requiredInputs: [{ id: "expectedValue", kind: "number", unit: "custom", required: true }, { id: "uncertaintySigma", kind: "number", unit: "custom", required: true }, { id: "downsideLoss", kind: "number", unit: "custom", required: true }, { id: "operatingMarginBuffer", kind: "number", unit: "custom", required: true }],
  outputs: [{ id: "downsideExposure_out", kind: "number", unit: "custom" }],
  deterministic: true
};
FORMULA_CONTRACT_REGISTRY["calculateIrreversibilityPenalty"] = {
  formulaId: "calculateIrreversibilityPenalty",
  requiredInputs: [{ id: "irreversibleCapex", kind: "number", unit: "custom", required: true }, { id: "recoveryValue", kind: "number", unit: "custom", required: true }, { id: "downsideLoss", kind: "number", unit: "custom", required: true }, { id: "regulatoryOrSafetyCriticality", kind: "number", unit: "custom", required: true }],
  outputs: [{ id: "irreversibilityPenalty", kind: "number", unit: "custom" }],
  deterministic: true
};
FORMULA_CONTRACT_REGISTRY["calculateWaitOptionValue"] = {
  formulaId: "calculateWaitOptionValue",
  requiredInputs: [{ id: "delayCost", kind: "number", unit: "custom", required: true }, { id: "uncertaintySigma", kind: "number", unit: "custom", required: true }, { id: "decisionHorizon", kind: "number", unit: "custom", required: true }, { id: "irreversibleCapex", kind: "number", unit: "custom", required: true }],
  outputs: [{ id: "waitOptionValue", kind: "number", unit: "custom" }],
  deterministic: true
};
FORMULA_CONTRACT_REGISTRY["calculateSurvivalProbability"] = {
  formulaId: "calculateSurvivalProbability",
  requiredInputs: [{ id: "downsideExposure", kind: "number", unit: "custom", required: true }, { id: "operatingMarginBuffer", kind: "number", unit: "custom", required: true }, { id: "regulatoryOrSafetyCriticality", kind: "number", unit: "custom", required: true }],
  outputs: [{ id: "survivalProbability", kind: "number", unit: "custom" }],
  deterministic: true
};
FORMULA_CONTRACT_REGISTRY["calculateCommitmentThreshold"] = {
  formulaId: "calculateCommitmentThreshold",
  requiredInputs: [{ id: "irreversibilityPenalty", kind: "number", unit: "custom", required: true }, { id: "waitOptionValue", kind: "number", unit: "custom", required: true }, { id: "survivalProbability", kind: "number", unit: "custom", required: true }, { id: "delayCost", kind: "number", unit: "custom", required: true }],
  outputs: [{ id: "commitmentThreshold", kind: "number", unit: "custom" }],
  deterministic: true
};
FORMULA_CONTRACT_REGISTRY["calculateDecisionVerdict"] = {
  formulaId: "calculateDecisionVerdict",
  requiredInputs: [{ id: "commitmentThreshold", kind: "number", unit: "custom", required: true }, { id: "survivalProbability", kind: "number", unit: "custom", required: true }, { id: "irreversibilityPenalty", kind: "number", unit: "custom", required: true }, { id: "waitOptionValue", kind: "number", unit: "custom", required: true }],
  outputs: [{ id: "decisionVerdict", kind: "number", unit: "custom" }],
  deterministic: true
};
