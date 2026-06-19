// Auto-generated from hours-to-minutes-calculator-schema.json
import * as z from 'zod';

export interface Hours_to_minutes_calculatorInput {
  hours: number;
  batchSize: number;
  machineCount: number;
  adjustmentPercent: number;
  dataConfidence?: number;
}

export const Hours_to_minutes_calculatorInputSchema = z.object({
  hours: z.number().default(1),
  batchSize: z.number().default(1),
  machineCount: z.number().default(1),
  adjustmentPercent: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Hours_to_minutes_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.hours * input.batchSize * input.machineCount * (input.adjustmentPercent / 100); results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.hours * input.batchSize * input.machineCount * (input.adjustmentPercent / 100); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHours_to_minutes_calculator(input: Hours_to_minutes_calculatorInput): Hours_to_minutes_calculatorOutput {
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


export interface Hours_to_minutes_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
