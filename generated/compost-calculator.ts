// Auto-generated from compost-calculator-schema.json
import * as z from 'zod';

export interface Compost_calculatorInput {
  greenWeight: number;
  greenC: number;
  greenN: number;
  brownWeight: number;
  brownC: number;
  brownN: number;
}

export const Compost_calculatorInputSchema = z.object({
  greenWeight: z.number().default(10),
  greenC: z.number().default(15),
  greenN: z.number().default(1.5),
  brownWeight: z.number().default(10),
  brownC: z.number().default(50),
  brownN: z.number().default(1),
});

function evaluateAllFormulas(input: Compost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.greenWeight * input.greenC / 100 + input.brownWeight * input.brownC / 100; results["totalCarbon"] = Number.isFinite(v) ? v : 0; } catch { results["totalCarbon"] = 0; }
  try { const v = input.greenWeight * input.greenN / 100 + input.brownWeight * input.brownN / 100; results["totalNitrogen"] = Number.isFinite(v) ? v : 0; } catch { results["totalNitrogen"] = 0; }
  try { const v = input.greenWeight + input.brownWeight; results["totalWeight"] = Number.isFinite(v) ? v : 0; } catch { results["totalWeight"] = 0; }
  try { const v = (results["totalCarbon"] ?? 0) / (results["totalNitrogen"] ?? 0); results["resultingCNRatio"] = Number.isFinite(v) ? v : 0; } catch { results["resultingCNRatio"] = 0; }
  try { const v = (results["resultingCNRatio"] ?? 0) >= 25 && (results["resultingCNRatio"] ?? 0) <= 35; results["isOptimal"] = Number.isFinite(v) ? v : 0; } catch { results["isOptimal"] = 0; }
  return results;
}


export function calculateCompost_calculator(input: Compost_calculatorInput): Compost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["resultingCNRatio"] ?? 0;
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


export interface Compost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
