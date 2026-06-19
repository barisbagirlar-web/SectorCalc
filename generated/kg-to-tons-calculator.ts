// Auto-generated from kg-to-tons-calculator-schema.json
import * as z from 'zod';

export interface Kg_to_tons_calculatorInput {
  gross_kg: number;
  tare_kg: number;
  batch_count: number;
  decimal_places: number;
  dataConfidence?: number;
}

export const Kg_to_tons_calculatorInputSchema = z.object({
  gross_kg: z.number().default(0),
  tare_kg: z.number().default(0),
  batch_count: z.number().default(1),
  decimal_places: z.number().default(3),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Kg_to_tons_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.gross_kg - input.tare_kg) * input.batch_count; results["net_kg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["net_kg"] = 0; }
  try { const v = (input.gross_kg * input.batch_count) / 1000; results["gross_tons"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["gross_tons"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateKg_to_tons_calculator(input: Kg_to_tons_calculatorInput): Kg_to_tons_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["gross_tons"]));
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


export interface Kg_to_tons_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
