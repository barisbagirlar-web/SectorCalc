// Auto-generated from oil-barrels-to-liters-calculator-schema.json
import * as z from 'zod';

export interface Oil_barrels_to_liters_calculatorInput {
  barrels: number;
  observedTemperature: number;
  referenceTemperature: number;
  alpha: number;
  precision: number;
  dataConfidence?: number;
}

export const Oil_barrels_to_liters_calculatorInputSchema = z.object({
  barrels: z.number().default(1),
  observedTemperature: z.number().default(20),
  referenceTemperature: z.number().default(15),
  alpha: z.number().default(0.0007),
  precision: z.number().default(2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Oil_barrels_to_liters_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.barrels / (1 + input.alpha * (input.observedTemperature - input.referenceTemperature)); results["referenceBarrels"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["referenceBarrels"] = 0; }
  try { const v = (asFormulaNumber(results["referenceBarrels"])) * 158.9873; results["rawLiters"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rawLiters"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateOil_barrels_to_liters_calculator(input: Oil_barrels_to_liters_calculatorInput): Oil_barrels_to_liters_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["rawLiters"]));
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


export interface Oil_barrels_to_liters_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
