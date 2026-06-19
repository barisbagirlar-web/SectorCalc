// Auto-generated from feet-to-yards-calculator-schema.json
import * as z from 'zod';

export interface Feet_to_yards_calculatorInput {
  length_feet: number;
  waste_percent: number;
  safety_margin_percent: number;
  quantity: number;
  cost_per_yard: number;
  decimal_places: number;
  dataConfidence?: number;
}

export const Feet_to_yards_calculatorInputSchema = z.object({
  length_feet: z.number().default(1),
  waste_percent: z.number().default(0),
  safety_margin_percent: z.number().default(0),
  quantity: z.number().default(1),
  cost_per_yard: z.number().default(0),
  decimal_places: z.number().default(2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Feet_to_yards_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.length_feet / 3; results["raw_yards"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["raw_yards"] = 0; }
  try { const v = (asFormulaNumber(results["raw_yards"])) * input.waste_percent / 100; results["waste_yards"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["waste_yards"] = 0; }
  try { const v = (asFormulaNumber(results["raw_yards"])) * input.safety_margin_percent / 100; results["safety_yards"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["safety_yards"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFeet_to_yards_calculator(input: Feet_to_yards_calculatorInput): Feet_to_yards_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["safety_yards"]);
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


export interface Feet_to_yards_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
