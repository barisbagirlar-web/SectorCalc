// Auto-generated from abc-classification-calculator-schema.json
import * as z from 'zod';

export interface Abc_classification_calculatorInput {
  annualDemand: number;
  unitCost: number;
  totalAnnualValue: number;
  cumulativeBefore: number;
}

export const Abc_classification_calculatorInputSchema = z.object({
  annualDemand: z.number().default(0),
  unitCost: z.number().default(0),
  totalAnnualValue: z.number().default(0),
  cumulativeBefore: z.number().default(0),
});

function evaluateAllFormulas(input: Abc_classification_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualDemand * input.unitCost; results["annualValue"] = Number.isFinite(v) ? v : 0; } catch { results["annualValue"] = 0; }
  try { const v = input.totalAnnualValue !== 0 ? ((results["annualValue"] ?? 0) / input.totalAnnualValue) * 100 : 0; results["percentage"] = Number.isFinite(v) ? v : 0; } catch { results["percentage"] = 0; }
  try { const v = input.cumulativeBefore + (results["percentage"] ?? 0); results["cumulativeAfter"] = Number.isFinite(v) ? v : 0; } catch { results["cumulativeAfter"] = 0; }
  try { const v = (results["cumulativeAfter"] ?? 0) <= 80 ? 'A' : (results["cumulativeAfter"] ?? 0) <= 95 ? 'B' : 'C'; results["classification"] = Number.isFinite(v) ? v : 0; } catch { results["classification"] = 0; }
  return results;
}


export function calculateAbc_classification_calculator(input: Abc_classification_calculatorInput): Abc_classification_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["classification"] ?? 0;
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


export interface Abc_classification_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
