// Auto-generated from date-subtract-calculator-schema.json
import * as z from 'zod';

export interface Date_subtract_calculatorInput {
  startDateSerial: number;
  endDateSerial: number;
  includeEndDay: number;
  outputUnitFactor: number;
}

export const Date_subtract_calculatorInputSchema = z.object({
  startDateSerial: z.number().default(44927),
  endDateSerial: z.number().default(44937),
  includeEndDay: z.number().default(1),
  outputUnitFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Date_subtract_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.endDateSerial - input.startDateSerial; results["rawDifference"] = Number.isFinite(v) ? v : 0; } catch { results["rawDifference"] = 0; }
  try { const v = input.includeEndDay; results["includeEndDayAdjustment"] = Number.isFinite(v) ? v : 0; } catch { results["includeEndDayAdjustment"] = 0; }
  try { const v = (input.endDateSerial - input.startDateSerial) + input.includeEndDay; results["durationInDays"] = Number.isFinite(v) ? v : 0; } catch { results["durationInDays"] = 0; }
  try { const v = ((input.endDateSerial - input.startDateSerial) + input.includeEndDay) * input.outputUnitFactor; results["durationInOutputUnit"] = Number.isFinite(v) ? v : 0; } catch { results["durationInOutputUnit"] = 0; }
  return results;
}


export function calculateDate_subtract_calculator(input: Date_subtract_calculatorInput): Date_subtract_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["durationInOutputUnit"] ?? 0;
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


export interface Date_subtract_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
