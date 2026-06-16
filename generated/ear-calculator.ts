// Auto-generated from ear-calculator-schema.json
import * as z from 'zod';

export interface Ear_calculatorInput {
  nominalRate: number;
  compoundingPeriods: number;
  years: number;
  principal: number;
}

export const Ear_calculatorInputSchema = z.object({
  nominalRate: z.number().default(5),
  compoundingPeriods: z.number().default(12),
  years: z.number().default(1),
  principal: z.number().default(1),
});

function evaluateAllFormulas(input: Ear_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.nominalRate / 100 / input.compoundingPeriods; results["periodicRate"] = Number.isFinite(v) ? v : 0; } catch { results["periodicRate"] = 0; }
  try { const v = ((1 + (results["periodicRate"] ?? 0)) ** input.compoundingPeriods - 1) * 100; results["effectiveAnnualRate"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveAnnualRate"] = 0; }
  try { const v = ((1 + (results["periodicRate"] ?? 0)) ** (input.compoundingPeriods * input.years)); results["growthFactor"] = Number.isFinite(v) ? v : 0; } catch { results["growthFactor"] = 0; }
  try { const v = input.principal * (results["growthFactor"] ?? 0); results["futureValue"] = Number.isFinite(v) ? v : 0; } catch { results["futureValue"] = 0; }
  return results;
}


export function calculateEar_calculator(input: Ear_calculatorInput): Ear_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["effectiveAnnualRate"] ?? 0;
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


export interface Ear_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
