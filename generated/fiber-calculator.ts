// Auto-generated from fiber-calculator-schema.json
import * as z from 'zod';

export interface Fiber_calculatorInput {
  length: number;
  attenuation: number;
  connectors: number;
  connectorLoss: number;
  splices: number;
  spliceLoss: number;
  margin: number;
}

export const Fiber_calculatorInputSchema = z.object({
  length: z.number().default(1),
  attenuation: z.number().default(0.35),
  connectors: z.number().default(2),
  connectorLoss: z.number().default(0.5),
  splices: z.number().default(0),
  spliceLoss: z.number().default(0.1),
  margin: z.number().default(3),
});

function evaluateAllFormulas(input: Fiber_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.length * input.attenuation + input.connectors * input.connectorLoss + input.splices * input.spliceLoss + input.margin; results["totalLoss"] = Number.isFinite(v) ? v : 0; } catch { results["totalLoss"] = 0; }
  try { const v = input.length * input.attenuation; results["fiberLoss"] = Number.isFinite(v) ? v : 0; } catch { results["fiberLoss"] = 0; }
  try { const v = input.connectors * input.connectorLoss; results["connectorLossTotal"] = Number.isFinite(v) ? v : 0; } catch { results["connectorLossTotal"] = 0; }
  try { const v = input.splices * input.spliceLoss; results["spliceLossTotal"] = Number.isFinite(v) ? v : 0; } catch { results["spliceLossTotal"] = 0; }
  return results;
}


export function calculateFiber_calculator(input: Fiber_calculatorInput): Fiber_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalLoss"] ?? 0;
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


export interface Fiber_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
