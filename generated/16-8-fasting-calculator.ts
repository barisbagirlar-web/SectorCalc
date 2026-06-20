// Auto-generated from 16-8-fasting-calculator-schema.json
import * as z from 'zod';

export interface _16_8_fasting_calculatorInput {
  currentHour: number;
  fastingStartHour: number;
  fastingDuration: number;
  eatingDuration: number;
  dataConfidence?: number;
}

export const _16_8_fasting_calculatorInputSchema = z.object({
  currentHour: z.number().default(12),
  fastingStartHour: z.number().default(20),
  fastingDuration: z.number().default(16),
  eatingDuration: z.number().default(8),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: _16_8_fasting_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.fastingStartHour + input.fastingDuration) % 24; results["fastingEndHour"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fastingEndHour"] = Number.NaN; }
  try { const v = ((input.fastingStartHour + input.fastingDuration) % 24 + input.eatingDuration) % 24; results["eatingWindowEndHour"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["eatingWindowEndHour"] = Number.NaN; }
  return results;
}


export function calculate_16_8_fasting_calculator(input: _16_8_fasting_calculatorInput): _16_8_fasting_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["eatingWindowEndHour"]);
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


export interface _16_8_fasting_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
