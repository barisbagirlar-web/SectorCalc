// Auto-generated from corpulence-index-calculator-schema.json
import * as z from 'zod';

export interface Corpulence_index_calculatorInput {
  unit_system: number;
  weight_kg: number;
  height_cm: number;
  weight_stones: number;
  weight_pounds: number;
  height_feet: number;
  height_inches: number;
  dataConfidence?: number;
}

export const Corpulence_index_calculatorInputSchema = z.object({
  unit_system: z.number().default(0),
  weight_kg: z.number().default(70),
  height_cm: z.number().default(170),
  weight_stones: z.number().default(0),
  weight_pounds: z.number().default(0),
  height_feet: z.number().default(0),
  height_inches: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Corpulence_index_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.unit_system === 0 ? input.weight_kg : (input.weight_stones * 6.35029 + input.weight_pounds * 0.453592)) ? 1 : 0); results["weight_kg_total"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["weight_kg_total"] = 0; }
  try { const v = input.unit_system === 0 ? (input.height_cm / 100) : (input.height_feet * 0.3048 + input.height_inches * 0.0254); results["height_m"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["height_m"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCorpulence_index_calculator(input: Corpulence_index_calculatorInput): Corpulence_index_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["height_m"]);
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


export interface Corpulence_index_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
