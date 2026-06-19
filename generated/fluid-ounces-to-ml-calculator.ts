// Auto-generated from fluid-ounces-to-ml-calculator-schema.json
import * as z from 'zod';

export interface Fluid_ounces_to_ml_calculatorInput {
  fluidOunces: number;
  ounceStandard: number;
  precision: number;
  batchSize: number;
  dataConfidence?: number;
}

export const Fluid_ounces_to_ml_calculatorInputSchema = z.object({
  fluidOunces: z.number().default(1),
  ounceStandard: z.number().default(0),
  precision: z.number().default(2),
  batchSize: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Fluid_ounces_to_ml_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ounceStandard === 0 ? 29.5735 : 28.4131; results["conversionFactor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["conversionFactor"] = 0; }
  try { const v = input.fluidOunces * (asFormulaNumber(results["conversionFactor"])); results["mlPerItem"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["mlPerItem"] = 0; }
  try { const v = input.batchSize * (asFormulaNumber(results["mlPerItem"])); results["totalMl"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalMl"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFluid_ounces_to_ml_calculator(input: Fluid_ounces_to_ml_calculatorInput): Fluid_ounces_to_ml_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalMl"]);
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


export interface Fluid_ounces_to_ml_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
