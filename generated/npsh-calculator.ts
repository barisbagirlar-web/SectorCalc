// Auto-generated from npsh-calculator-schema.json
import * as z from 'zod';

export interface Npsh_calculatorInput {
  atmosphericPressure: number;
  vaporPressure: number;
  liquidDensity: number;
  staticSuctionHead: number;
  frictionHeadLoss: number;
  velocityHead: number;
}

export const Npsh_calculatorInputSchema = z.object({
  atmosphericPressure: z.number().default(1.01325),
  vaporPressure: z.number().default(0.02339),
  liquidDensity: z.number().default(1000),
  staticSuctionHead: z.number().default(0),
  frictionHeadLoss: z.number().default(0.5),
  velocityHead: z.number().default(0.2),
});

function evaluateAllFormulas(input: Npsh_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.atmosphericPressure * 100000) / (input.liquidDensity * 9.80665); results["atmHead"] = Number.isFinite(v) ? v : 0; } catch { results["atmHead"] = 0; }
  try { const v = (input.vaporPressure * 100000) / (input.liquidDensity * 9.80665); results["vaporHead"] = Number.isFinite(v) ? v : 0; } catch { results["vaporHead"] = 0; }
  try { const v = (results["atmHead"] ?? 0) - (results["vaporHead"] ?? 0) + input.staticSuctionHead + input.velocityHead - input.frictionHeadLoss; results["npsha"] = Number.isFinite(v) ? v : 0; } catch { results["npsha"] = 0; }
  return results;
}


export function calculateNpsh_calculator(input: Npsh_calculatorInput): Npsh_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["npsha"] ?? 0;
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


export interface Npsh_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
