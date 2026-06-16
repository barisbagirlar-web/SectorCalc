// Auto-generated from quartile-calculator-schema.json
import * as z from 'zod';

export interface Quartile_calculatorInput {
  num1: number;
  num2: number;
  num3: number;
  num4: number;
  num5: number;
  num6: number;
  num7: number;
  num8: number;
}

export const Quartile_calculatorInputSchema = z.object({
  num1: z.number().default(12),
  num2: z.number().default(15),
  num3: z.number().default(18),
  num4: z.number().default(20),
  num5: z.number().default(22),
  num6: z.number().default(25),
  num7: z.number().default(30),
  num8: z.number().default(35),
});

function evaluateAllFormulas(input: Quartile_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = [input.num1,input.num2,input.num3,input.num4,input.num5,input.num6,input.num7,input.num8].sort((a,b)=>a-b); results["sorted"] = Number.isFinite(v) ? v : 0; } catch { results["sorted"] = 0; }
  try { const v = (results["sorted"] ?? 0)[0]; results["min"] = Number.isFinite(v) ? v : 0; } catch { results["min"] = 0; }
  try { const v = (results["sorted"] ?? 0)[7]; results["max"] = Number.isFinite(v) ? v : 0; } catch { results["max"] = 0; }
  try { const v = ((results["sorted"] ?? 0)[1]+(results["sorted"] ?? 0)[2])/2; results["q1"] = Number.isFinite(v) ? v : 0; } catch { results["q1"] = 0; }
  try { const v = ((results["sorted"] ?? 0)[3]+(results["sorted"] ?? 0)[4])/2; results["q2"] = Number.isFinite(v) ? v : 0; } catch { results["q2"] = 0; }
  try { const v = ((results["sorted"] ?? 0)[5]+(results["sorted"] ?? 0)[6])/2; results["q3"] = Number.isFinite(v) ? v : 0; } catch { results["q3"] = 0; }
  try { const v = (results["q3"] ?? 0) - (results["q1"] ?? 0); results["iqr"] = Number.isFinite(v) ? v : 0; } catch { results["iqr"] = 0; }
  return results;
}


export function calculateQuartile_calculator(input: Quartile_calculatorInput): Quartile_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["q2"] ?? 0;
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


export interface Quartile_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
