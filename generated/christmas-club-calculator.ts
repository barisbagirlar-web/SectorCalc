// Auto-generated from christmas-club-calculator-schema.json
import * as z from 'zod';

export interface Christmas_club_calculatorInput {
  weeklyDeposit: number;
  numberOfWeeks: number;
  annualInterestRate: number;
  compoundingFrequency: number;
  startingBalance: number;
  dataConfidence?: number;
}

export const Christmas_club_calculatorInputSchema = z.object({
  weeklyDeposit: z.number().default(50),
  numberOfWeeks: z.number().default(50),
  annualInterestRate: z.number().default(2),
  compoundingFrequency: z.number().default(52),
  startingBalance: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Christmas_club_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualInterestRate / 100 / input.compoundingFrequency; results["periodicRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["periodicRate"] = 0; }
  try { const v = input.weeklyDeposit * input.numberOfWeeks; results["totalDeposits"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalDeposits"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateChristmas_club_calculator(input: Christmas_club_calculatorInput): Christmas_club_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalDeposits"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Christmas_club_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
