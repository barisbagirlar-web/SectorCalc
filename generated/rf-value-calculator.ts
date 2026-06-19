// Auto-generated from rf-value-calculator-schema.json
import * as z from 'zod';

export interface Rf_value_calculatorInput {
  solventDistance: number;
  spotDistance1: number;
  spotDistance2: number;
  spotDistance3: number;
  dataConfidence?: number;
}

export const Rf_value_calculatorInputSchema = z.object({
  solventDistance: z.number().default(10),
  spotDistance1: z.number().default(5),
  spotDistance2: z.number().default(5.2),
  spotDistance3: z.number().default(4.9),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Rf_value_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.spotDistance1 / input.solventDistance; results["rf1"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rf1"] = 0; }
  try { const v = input.spotDistance2 / input.solventDistance; results["rf2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rf2"] = 0; }
  try { const v = input.spotDistance3 / input.solventDistance; results["rf3"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rf3"] = 0; }
  try { const v = (input.spotDistance1 / input.solventDistance + input.spotDistance2 / input.solventDistance + input.spotDistance3 / input.solventDistance) / 3; results["averageRf"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["averageRf"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRf_value_calculator(input: Rf_value_calculatorInput): Rf_value_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["averageRf"]));
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


export interface Rf_value_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
