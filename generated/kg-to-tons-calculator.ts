// Auto-generated from kg-to-tons-calculator-schema.json
import * as z from 'zod';

export interface Kg_to_tons_calculatorInput {
  gross_kg: number;
  tare_kg: number;
  batch_count: number;
  decimal_places: number;
}

export const Kg_to_tons_calculatorInputSchema = z.object({
  gross_kg: z.number().default(0),
  tare_kg: z.number().default(0),
  batch_count: z.number().default(1),
  decimal_places: z.number().default(3),
});

function evaluateAllFormulas(input: Kg_to_tons_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.round((((input.gross_kg - input.tare_kg) * input.batch_count) / 1000) * Math.pow(10, input.decimal_places)) / Math.pow(10, input.decimal_places); results["tons_output"] = Number.isFinite(v) ? v : 0; } catch { results["tons_output"] = 0; }
  try { const v = (input.gross_kg - input.tare_kg) * input.batch_count; results["net_kg"] = Number.isFinite(v) ? v : 0; } catch { results["net_kg"] = 0; }
  try { const v = (input.gross_kg * input.batch_count) / 1000; results["gross_tons"] = Number.isFinite(v) ? v : 0; } catch { results["gross_tons"] = 0; }
  return results;
}


export function calculateKg_to_tons_calculator(input: Kg_to_tons_calculatorInput): Kg_to_tons_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["tons_output"] ?? 0;
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


export interface Kg_to_tons_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
