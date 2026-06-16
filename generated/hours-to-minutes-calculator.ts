// Auto-generated from hours-to-minutes-calculator-schema.json
import * as z from 'zod';

export interface Hours_to_minutes_calculatorInput {
  hours: number;
  batchSize: number;
  machineCount: number;
  adjustmentPercent: number;
}

export const Hours_to_minutes_calculatorInputSchema = z.object({
  hours: z.number().default(1),
  batchSize: z.number().default(1),
  machineCount: z.number().default(1),
  adjustmentPercent: z.number().default(0),
});

function evaluateAllFormulas(input: Hours_to_minutes_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.hours * 60; results["baseMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["baseMinutes"] = 0; }
  try { const v = (results["baseMinutes"] ?? 0) * input.batchSize * input.machineCount * (1 + input.adjustmentPercent / 100); results["totalMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["totalMinutes"] = 0; }
  return results;
}


export function calculateHours_to_minutes_calculator(input: Hours_to_minutes_calculatorInput): Hours_to_minutes_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Toplam"] ?? 0;
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


export interface Hours_to_minutes_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
