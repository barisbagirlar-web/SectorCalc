// Auto-generated from psi-to-pascal-calculator-schema.json
import * as z from 'zod';

export interface Psi_to_pascal_calculatorInput {
  psi_value: number;
  conversion_factor: number;
  calibration_offset: number;
  decimal_places: number;
  dataConfidence?: number;
}

export const Psi_to_pascal_calculatorInputSchema = z.object({
  psi_value: z.number().default(0),
  conversion_factor: z.number().default(6894.76),
  calibration_offset: z.number().default(0),
  decimal_places: z.number().default(2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Psi_to_pascal_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.psi_value * input.conversion_factor; results["raw_pascal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["raw_pascal"] = 0; }
  try { const v = (asFormulaNumber(results["raw_pascal"])) + input.calibration_offset; results["pascal_with_offset"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["pascal_with_offset"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePsi_to_pascal_calculator(input: Psi_to_pascal_calculatorInput): Psi_to_pascal_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["pascal_with_offset"]);
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


export interface Psi_to_pascal_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
