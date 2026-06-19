// Auto-generated from date-subtract-calculator-schema.json
import * as z from 'zod';

export interface Date_subtract_calculatorInput {
  startDateSerial: number;
  endDateSerial: number;
  includeEndDay: number;
  outputUnitFactor: number;
  dataConfidence?: number;
}

export const Date_subtract_calculatorInputSchema = z.object({
  startDateSerial: z.number().default(44927),
  endDateSerial: z.number().default(44937),
  includeEndDay: z.number().default(1),
  outputUnitFactor: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Date_subtract_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.endDateSerial - input.startDateSerial; results["rawDifference"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rawDifference"] = 0; }
  try { const v = input.includeEndDay; results["includeEndDayAdjustment"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["includeEndDayAdjustment"] = 0; }
  try { const v = (input.endDateSerial - input.startDateSerial) + input.includeEndDay; results["durationInDays"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["durationInDays"] = 0; }
  try { const v = ((input.endDateSerial - input.startDateSerial) + input.includeEndDay) * input.outputUnitFactor; results["durationInOutputUnit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["durationInOutputUnit"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDate_subtract_calculator(input: Date_subtract_calculatorInput): Date_subtract_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["durationInOutputUnit"]));
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


export interface Date_subtract_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
