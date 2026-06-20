// Auto-generated from cigarette-calculator-schema.json
import * as z from 'zod';

export interface Cigarette_calculatorInput {
  packCost: number;
  cigarettesPerPack: number;
  cigarettesPerDay: number;
  periodDays: number;
  dataConfidence?: number;
}

export const Cigarette_calculatorInputSchema = z.object({
  packCost: z.number().default(20),
  cigarettesPerPack: z.number().default(20),
  cigarettesPerDay: z.number().default(20),
  periodDays: z.number().default(365),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cigarette_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.packCost / input.cigarettesPerPack) * input.cigarettesPerDay; results["dailyCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dailyCost"] = Number.NaN; }
  try { const v = (input.packCost / input.cigarettesPerPack) * input.cigarettesPerDay * 30; results["monthlyCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyCost"] = Number.NaN; }
  try { const v = (input.packCost / input.cigarettesPerPack) * input.cigarettesPerDay * input.periodDays; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  return results;
}


export function calculateCigarette_calculator(input: Cigarette_calculatorInput): Cigarette_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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


export interface Cigarette_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
