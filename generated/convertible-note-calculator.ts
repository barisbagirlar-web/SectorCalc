// Auto-generated from convertible-note-calculator-schema.json
import * as z from 'zod';

export interface Convertible_note_calculatorInput {
  investmentAmount: number;
  discountRate: number;
  valuationCap: number;
  nextRoundPricePerShare: number;
  interestRate: number;
  maturity: number;
  preMoneyFullyDilutedShares: number;
  dataConfidence?: number;
}

export const Convertible_note_calculatorInputSchema = z.object({
  investmentAmount: z.number().default(100000),
  discountRate: z.number().default(20),
  valuationCap: z.number().default(5000000),
  nextRoundPricePerShare: z.number().default(1),
  interestRate: z.number().default(5),
  maturity: z.number().default(2),
  preMoneyFullyDilutedShares: z.number().default(10000000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Convertible_note_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.investmentAmount * (1 + input.interestRate/100 * input.maturity); results["accruedPrincipal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["accruedPrincipal"] = Number.NaN; }
  try { const v = input.nextRoundPricePerShare * (1 - input.discountRate/100); results["discountPrice"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["discountPrice"] = Number.NaN; }
  try { const v = input.valuationCap / input.preMoneyFullyDilutedShares; results["capPrice"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["capPrice"] = Number.NaN; }
  return results;
}


export function calculateConvertible_note_calculator(input: Convertible_note_calculatorInput): Convertible_note_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["capPrice"]);
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


export interface Convertible_note_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
