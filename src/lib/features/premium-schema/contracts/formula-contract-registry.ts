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
