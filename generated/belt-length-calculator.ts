// Auto-generated from belt-length-calculator-schema.json
import * as z from 'zod';

export interface Belt_length_calculatorInput {
  large_diameter: number;
  small_diameter: number;
  center_distance: number;
  configuration: number;
  dataConfidence?: number;
}

export const Belt_length_calculatorInputSchema = z.object({
  large_diameter: z.number().default(200),
  small_diameter: z.number().default(100),
  center_distance: z.number().default(500),
  configuration: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Belt_length_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 2 * input.center_distance; results["straight_length"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["straight_length"] = 0; }
  try { const v = Math.PI * (input.large_diameter + input.small_diameter) / 2; results["arc_length"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["arc_length"] = 0; }
  try { const v = input.configuration === 0 ? ((input.large_diameter - input.small_diameter) ** 2) / (4 * input.center_distance) : ((input.large_diameter + input.small_diameter) ** 2) / (4 * input.center_distance); results["correction_length"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["correction_length"] = 0; }
  try { const v = (asFormulaNumber(results["straight_length"])) + (asFormulaNumber(results["arc_length"])) + (asFormulaNumber(results["correction_length"])); results["belt_length"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["belt_length"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBelt_length_calculator(input: Belt_length_calculatorInput): Belt_length_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["belt_length"]);
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


export interface Belt_length_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
