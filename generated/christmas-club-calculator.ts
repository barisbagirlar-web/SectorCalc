// Auto-generated from christmas-club-calculator-schema.json
import * as z from 'zod';

export interface Christmas_club_calculatorInput {
  weeklyDeposit: number;
  numberOfWeeks: number;
  annualInterestRate: number;
  compoundingFrequency: number;
  startingBalance: number;
}

export const Christmas_club_calculatorInputSchema = z.object({
  weeklyDeposit: z.number().default(50),
  numberOfWeeks: z.number().default(50),
  annualInterestRate: z.number().default(2),
  compoundingFrequency: z.number().default(52),
  startingBalance: z.number().default(0),
});

function evaluateAllFormulas(input: Christmas_club_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualInterestRate / 100 / input.compoundingFrequency; results["periodicRate"] = Number.isFinite(v) ? v : 0; } catch { results["periodicRate"] = 0; }
  try { const v = input.weeklyDeposit * input.numberOfWeeks; results["totalDeposits"] = Number.isFinite(v) ? v : 0; } catch { results["totalDeposits"] = 0; }
  try { const v = (results["periodicRate"] ?? 0) === 0 ? (input.weeklyDeposit * input.numberOfWeeks + input.startingBalance) : (input.weeklyDeposit * ((Math.pow(1 + (results["periodicRate"] ?? 0), input.numberOfWeeks) - 1) / (results["periodicRate"] ?? 0)) + input.startingBalance * Math.pow(1 + (results["periodicRate"] ?? 0), input.numberOfWeeks)); results["futureValue"] = Number.isFinite(v) ? v : 0; } catch { results["futureValue"] = 0; }
  try { const v = (results["futureValue"] ?? 0) - (results["totalDeposits"] ?? 0) - input.startingBalance; results["totalInterest"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterest"] = 0; }
  return results;
}


export function calculateChristmas_club_calculator(input: Christmas_club_calculatorInput): Christmas_club_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["futureValue"] ?? 0;
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


export interface Christmas_club_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
