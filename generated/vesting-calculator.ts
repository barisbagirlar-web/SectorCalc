// Auto-generated from vesting-calculator-schema.json
import * as z from 'zod';

export interface Vesting_calculatorInput {
  totalGrant: number;
  vestingStartMonth: number;
  currentMonth: number;
  vestingPeriodMonths: number;
  cliffPeriodMonths: number;
  dataConfidence?: number;
}

export const Vesting_calculatorInputSchema = z.object({
  totalGrant: z.number().default(1000),
  vestingStartMonth: z.number().default(0),
  currentMonth: z.number().default(12),
  vestingPeriodMonths: z.number().default(48),
  cliffPeriodMonths: z.number().default(12),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Vesting_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalGrant * input.vestingStartMonth * input.currentMonth * input.vestingPeriodMonths; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.totalGrant * input.vestingStartMonth * input.currentMonth * input.vestingPeriodMonths * (input.cliffPeriodMonths); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.cliffPeriodMonths; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateVesting_calculator(input: Vesting_calculatorInput): Vesting_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Vesting_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
