// Auto-generated from fiber-optic-calculator-schema.json
import * as z from 'zod';

export interface Fiber_optic_calculatorInput {
  fiberLength: number;
  attenuationCoeff: number;
  inputPower: number;
  numSplices: number;
  spliceLoss: number;
  numConnectors: number;
  connectorLoss: number;
  dataConfidence?: number;
}

export const Fiber_optic_calculatorInputSchema = z.object({
  fiberLength: z.number().default(10),
  attenuationCoeff: z.number().default(0.2),
  inputPower: z.number().default(0),
  numSplices: z.number().default(2),
  spliceLoss: z.number().default(0.05),
  numConnectors: z.number().default(2),
  connectorLoss: z.number().default(0.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fiber_optic_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fiberLength * input.attenuationCoeff + input.numSplices * input.spliceLoss + input.numConnectors * input.connectorLoss; results["totalLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalLoss"] = Number.NaN; }
  try { const v = input.inputPower - (toNumericFormulaValue(results["totalLoss"])); results["receivedPower"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["receivedPower"] = Number.NaN; }
  return results;
}


export function calculateFiber_optic_calculator(input: Fiber_optic_calculatorInput): Fiber_optic_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalLoss"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Fiber_optic_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
