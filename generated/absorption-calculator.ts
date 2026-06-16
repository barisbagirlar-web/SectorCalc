// Auto-generated from absorption-calculator-schema.json
import * as z from 'zod';

export interface Absorption_calculatorInput {
  budgetedOverhead: number;
  budgetedActivity: number;
  actualActivity: number;
  actualOverhead: number;
}

export const Absorption_calculatorInputSchema = z.object({
  budgetedOverhead: z.number().default(100000),
  budgetedActivity: z.number().default(10000),
  actualActivity: z.number().default(9500),
  actualOverhead: z.number().default(105000),
});

function evaluateAllFormulas(input: Absorption_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.budgetedOverhead / input.budgetedActivity; results["absorptionRate"] = Number.isFinite(v) ? v : 0; } catch { results["absorptionRate"] = 0; }
  try { const v = (results["absorptionRate"] ?? 0) * input.actualActivity; results["overheadAbsorbed"] = Number.isFinite(v) ? v : 0; } catch { results["overheadAbsorbed"] = 0; }
  try { const v = input.actualOverhead - (results["overheadAbsorbed"] ?? 0); results["overUnderAbsorbed"] = Number.isFinite(v) ? v : 0; } catch { results["overUnderAbsorbed"] = 0; }
  return results;
}


export function calculateAbsorption_calculator(input: Absorption_calculatorInput): Absorption_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["absorptionRate"] ?? 0;
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


export interface Absorption_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
