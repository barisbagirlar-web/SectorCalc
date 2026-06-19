// Auto-generated from meet-preparation-calculator-schema.json
import * as z from 'zod';

export interface Meet_preparation_calculatorInput {
  openerWeight: number;
  secondAttemptFactor: number;
  thirdAttemptFactor: number;
  warmUpStartPercent: number;
  warmUpEndPercent: number;
  warmUpStepPercent: number;
  dataConfidence?: number;
}

export const Meet_preparation_calculatorInputSchema = z.object({
  openerWeight: z.number().default(100),
  secondAttemptFactor: z.number().default(105),
  thirdAttemptFactor: z.number().default(110),
  warmUpStartPercent: z.number().default(50),
  warmUpEndPercent: z.number().default(90),
  warmUpStepPercent: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Meet_preparation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.openerWeight * (input.secondAttemptFactor / 100) * (input.thirdAttemptFactor / 100) * (input.warmUpStartPercent / 100); results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.openerWeight * (input.secondAttemptFactor / 100) * (input.thirdAttemptFactor / 100) * (input.warmUpStartPercent / 100) * ((input.warmUpEndPercent / 100) * (input.warmUpStepPercent / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = (input.warmUpEndPercent / 100) * (input.warmUpStepPercent / 100); results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMeet_preparation_calculator(input: Meet_preparation_calculatorInput): Meet_preparation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Meet_preparation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
