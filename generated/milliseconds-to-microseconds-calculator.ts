// Auto-generated from milliseconds-to-microseconds-calculator-schema.json
import * as z from 'zod';

export interface Milliseconds_to_microseconds_calculatorInput {
  milliseconds: number;
  calibrationOffset: number;
  safetyFactor: number;
  decimalPlaces: number;
  dataConfidence?: number;
}

export const Milliseconds_to_microseconds_calculatorInputSchema = z.object({
  milliseconds: z.number().default(0),
  calibrationOffset: z.number().default(0),
  safetyFactor: z.number().default(1),
  decimalPlaces: z.number().default(2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Milliseconds_to_microseconds_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.milliseconds * 1000 + input.calibrationOffset) * input.safetyFactor; results["rawMicroseconds"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rawMicroseconds"] = 0; }
  try { const v = (input.milliseconds * 1000 + input.calibrationOffset) * input.safetyFactor; results["rawMicroseconds_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rawMicroseconds_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMilliseconds_to_microseconds_calculator(input: Milliseconds_to_microseconds_calculatorInput): Milliseconds_to_microseconds_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["rawMicroseconds_aux"]));
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


export interface Milliseconds_to_microseconds_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
