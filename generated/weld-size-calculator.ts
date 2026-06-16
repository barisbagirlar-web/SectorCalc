// Auto-generated from weld-size-calculator-schema.json
import * as z from 'zod';

export interface Weld_size_calculatorInput {
  force: number;
  allowableStress: number;
  numWelds: number;
  weldLengthPer: number;
  safetyFactor: number;
}

export const Weld_size_calculatorInputSchema = z.object({
  force: z.number().default(50),
  allowableStress: z.number().default(100),
  numWelds: z.number().default(2),
  weldLengthPer: z.number().default(100),
  safetyFactor: z.number().default(1.5),
});

function evaluateAllFormulas(input: Weld_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numWelds * input.weldLengthPer; results["totalLength"] = Number.isFinite(v) ? v : 0; } catch { results["totalLength"] = 0; }
  try { const v = input.force * input.safetyFactor; results["designForce"] = Number.isFinite(v) ? v : 0; } catch { results["designForce"] = 0; }
  try { const v = ((results["designForce"] ?? 0) * 1000) / (input.allowableStress * (results["totalLength"] ?? 0)); results["throatRequired"] = Number.isFinite(v) ? v : 0; } catch { results["throatRequired"] = 0; }
  try { const v = (results["throatRequired"] ?? 0) * Math.sqrt(2); results["legRequired"] = Number.isFinite(v) ? v : 0; } catch { results["legRequired"] = 0; }
  return results;
}


export function calculateWeld_size_calculator(input: Weld_size_calculatorInput): Weld_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["legRequired"] ?? 0;
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


export interface Weld_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
