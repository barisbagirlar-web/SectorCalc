// Auto-generated from jam-calculator-schema.json
import * as z from 'zod';

export interface Jam_calculatorInput {
  fruitWeight: number;
  fruitBrix: number;
  targetBrix: number;
  pectinWeight: number;
  pectinSugarContent: number;
}

export const Jam_calculatorInputSchema = z.object({
  fruitWeight: z.number().default(10),
  fruitBrix: z.number().default(10),
  targetBrix: z.number().default(65),
  pectinWeight: z.number().default(0),
  pectinSugarContent: z.number().default(100),
});

function evaluateAllFormulas(input: Jam_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.max(0, input.fruitWeight * (input.targetBrix - input.fruitBrix) / (100 - input.targetBrix) - input.pectinWeight * (input.pectinSugarContent / 100)); results["sugarToAdd"] = Number.isFinite(v) ? v : 0; } catch { results["sugarToAdd"] = 0; }
  try { const v = input.fruitWeight + (results["sugarToAdd"] ?? 0) + input.pectinWeight; results["totalWeight"] = Number.isFinite(v) ? v : 0; } catch { results["totalWeight"] = 0; }
  try { const v = ((input.fruitWeight * input.fruitBrix / 100) + (results["sugarToAdd"] ?? 0) + input.pectinWeight * (input.pectinSugarContent / 100)) / (results["totalWeight"] ?? 0) * 100; results["finalBrix"] = Number.isFinite(v) ? v : 0; } catch { results["finalBrix"] = 0; }
  results["Total_Jam_Weight__kg_"] = 0;
  results["Final_Brix____"] = 0;
  results["result"] = 0;
  return results;
}


export function calculateJam_calculator(input: Jam_calculatorInput): Jam_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
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


export interface Jam_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
