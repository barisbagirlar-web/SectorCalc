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

function evaluateAllFormulas(input: Fiber_optic_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fiberLength * input.attenuationCoeff + input.numSplices * input.spliceLoss + input.numConnectors * input.connectorLoss; results["totalLoss"] = Number.isFinite(v) ? v : 0; } catch { results["totalLoss"] = 0; }
  try { const v = input.inputPower - (results["totalLoss"] ?? 0); results["receivedPower"] = Number.isFinite(v) ? v : 0; } catch { results["receivedPower"] = 0; }
  return results;
}


export function calculateFiber_optic_calculator(input: Fiber_optic_calculatorInput): Fiber_optic_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["${receivedPower} dBm"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
