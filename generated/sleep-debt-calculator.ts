// @ts-nocheck
// Auto-generated from sleep-debt-calculator-schema.json
import * as z from 'zod';

export interface Sleep_debt_calculatorInput {
  requiredSleepPerDay: number;
  actualSleepDay1: number;
  actualSleepDay2: number;
  actualSleepDay3: number;
  actualSleepDay4: number;
  actualSleepDay5: number;
  actualSleepDay6: number;
  actualSleepDay7: number;
}

export const Sleep_debt_calculatorInputSchema = z.object({
  requiredSleepPerDay: z.number().default(8),
  actualSleepDay1: z.number().default(8),
  actualSleepDay2: z.number().default(8),
  actualSleepDay3: z.number().default(8),
  actualSleepDay4: z.number().default(8),
  actualSleepDay5: z.number().default(8),
  actualSleepDay6: z.number().default(8),
  actualSleepDay7: z.number().default(8),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sleep_debt_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.requiredSleepPerDay * input.actualSleepDay1 * input.actualSleepDay2 * input.actualSleepDay3; results["normalized_product"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.requiredSleepPerDay * input.actualSleepDay1 * input.actualSleepDay2 * input.actualSleepDay3 * (input.actualSleepDay4 * input.actualSleepDay5 * input.actualSleepDay6 * input.actualSleepDay7); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.actualSleepDay4 * input.actualSleepDay5 * input.actualSleepDay6 * input.actualSleepDay7; results["adjustment_factor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSleep_debt_calculator(input: Sleep_debt_calculatorInput): Sleep_debt_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Sleep_debt_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
