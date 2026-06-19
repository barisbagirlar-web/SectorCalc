// Auto-generated from bushels-to-liters-calculator-schema.json
import * as z from 'zod';

export interface Bushels_to_liters_calculatorInput {
  total_bushels: number;
  conversion_factor: number;
  batch_count: number;
  container_size: number;
  dataConfidence?: number;
}

export const Bushels_to_liters_calculatorInputSchema = z.object({
  total_bushels: z.number().default(1),
  conversion_factor: z.number().default(35.2391),
  batch_count: z.number().default(1),
  container_size: z.number().default(20),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Bushels_to_liters_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.total_bushels * input.conversion_factor * input.batch_count; results["total_liters"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["total_liters"] = 0; }
  try { const v = input.total_bushels * input.conversion_factor * input.batch_count; results["total_liters_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["total_liters_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBushels_to_liters_calculator(input: Bushels_to_liters_calculatorInput): Bushels_to_liters_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["total_liters"]);
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


export interface Bushels_to_liters_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
