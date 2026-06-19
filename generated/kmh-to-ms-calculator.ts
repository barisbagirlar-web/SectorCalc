// Auto-generated from kmh-to-ms-calculator-schema.json
import * as z from 'zod';

export interface Kmh_to_ms_calculatorInput {
  speed_kmh: number;
  decimal_places: number;
  conversion_factor: number;
  measurement_uncertainty_percent: number;
  dataConfidence?: number;
}

export const Kmh_to_ms_calculatorInputSchema = z.object({
  speed_kmh: z.number().default(0),
  decimal_places: z.number().default(2),
  conversion_factor: z.number().default(3.6),
  measurement_uncertainty_percent: z.number().default(0.1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Kmh_to_ms_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.speed_kmh / input.conversion_factor; results["speed_ms_raw"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["speed_ms_raw"] = 0; }
  try { const v = input.speed_kmh / input.conversion_factor; results["speed_ms_raw_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["speed_ms_raw_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateKmh_to_ms_calculator(input: Kmh_to_ms_calculatorInput): Kmh_to_ms_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["speed_ms_raw_aux"]);
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


export interface Kmh_to_ms_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
