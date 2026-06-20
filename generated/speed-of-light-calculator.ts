// Auto-generated from speed-of-light-calculator-schema.json
import * as z from 'zod';

export interface Speed_of_light_calculatorInput {
  c: number;
  n: number;
  f: number;
  d: number;
  dataConfidence?: number;
}

export const Speed_of_light_calculatorInputSchema = z.object({
  c: z.number().default(299792458),
  n: z.number().default(1),
  f: z.number().default(500000000000000),
  d: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Speed_of_light_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.c / input.n; results["speed_in_medium"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["speed_in_medium"] = Number.NaN; }
  try { const v = input.d / (input.c / input.n); results["time_of_flight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["time_of_flight"] = Number.NaN; }
  try { const v = (input.c / input.n) / input.f; results["wavelength_in_medium"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wavelength_in_medium"] = Number.NaN; }
  return results;
}


export function calculateSpeed_of_light_calculator(input: Speed_of_light_calculatorInput): Speed_of_light_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["speed_in_medium"]);
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


export interface Speed_of_light_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
