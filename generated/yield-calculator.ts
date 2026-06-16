// Auto-generated from yield-calculator-schema.json
import * as z from 'zod';

export interface Yield_calculatorInput {
  totalUnits: number;
  goodUnitsFirstPass: number;
  reworkedUnits: number;
  scrapUnits: number;
}

export const Yield_calculatorInputSchema = z.object({
  totalUnits: z.number().default(1000),
  goodUnitsFirstPass: z.number().default(850),
  reworkedUnits: z.number().default(100),
  scrapUnits: z.number().default(50),
});

function evaluateAllFormulas(input: Yield_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.goodUnitsFirstPass + input.reworkedUnits) / input.totalUnits * 100; results["overallYield"] = Number.isFinite(v) ? v : 0; } catch { results["overallYield"] = 0; }
  try { const v = input.goodUnitsFirstPass / input.totalUnits * 100; results["firstPassYield"] = Number.isFinite(v) ? v : 0; } catch { results["firstPassYield"] = 0; }
  try { const v = input.reworkedUnits / input.totalUnits * 100; results["reworkRate"] = Number.isFinite(v) ? v : 0; } catch { results["reworkRate"] = 0; }
  try { const v = input.scrapUnits / input.totalUnits * 100; results["scrapRate"] = Number.isFinite(v) ? v : 0; } catch { results["scrapRate"] = 0; }
  return results;
}


export function calculateYield_calculator(input: Yield_calculatorInput): Yield_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["overallYield"] ?? 0;
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


export interface Yield_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
