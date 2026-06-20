// Auto-generated from safe-note-calculator-schema.json
import * as z from 'zod';

export interface Safe_note_calculatorInput {
  investmentAmount: number;
  valuationCap: number;
  discountRate: number;
  preMoneyValuation: number;
  dataConfidence?: number;
}

export const Safe_note_calculatorInputSchema = z.object({
  investmentAmount: z.number().default(100000),
  valuationCap: z.number().default(5000000),
  discountRate: z.number().default(20),
  preMoneyValuation: z.number().default(8000000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Safe_note_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.preMoneyValuation * (1 - input.discountRate/100); results["discountedVal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["discountedVal"] = Number.NaN; }
  try { const v = input.preMoneyValuation * (1 - input.discountRate/100); results["discountedVal_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["discountedVal_aux"] = Number.NaN; }
  return results;
}


export function calculateSafe_note_calculator(input: Safe_note_calculatorInput): Safe_note_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["discountedVal_aux"]);
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


export interface Safe_note_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
