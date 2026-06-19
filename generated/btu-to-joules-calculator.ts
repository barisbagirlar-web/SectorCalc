// Auto-generated from btu-to-joules-calculator-schema.json
import * as z from 'zod';

export interface Btu_to_joules_calculatorInput {
  btuValue: number;
  btuStandard: number;
  precision: number;
  factorOverride: number;
  outputUnit: number;
  dataConfidence?: number;
}

export const Btu_to_joules_calculatorInputSchema = z.object({
  btuValue: z.number().default(0),
  btuStandard: z.number().default(1),
  precision: z.number().default(2),
  factorOverride: z.number().default(0),
  outputUnit: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Btu_to_joules_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.factorOverride !== 0 ? input.factorOverride : (input.btuStandard === 1 ? 1055.05585262 : (input.btuStandard === 2 ? 1054.350 : (input.btuStandard === 3 ? 1055.056 : (input.btuStandard === 4 ? 1055.87 : 1055.05585262)))); results["conversionFactor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["conversionFactor"] = 0; }
  try { const v = input.btuValue * (asFormulaNumber(results["conversionFactor"])); results["rawJoules"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rawJoules"] = 0; }
  try { const v = input.outputUnit === 2 ? (asFormulaNumber(results["rawJoules"])) / 1000 : (asFormulaNumber(results["rawJoules"])); results["joules"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["joules"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBtu_to_joules_calculator(input: Btu_to_joules_calculatorInput): Btu_to_joules_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["joules"]);
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


export interface Btu_to_joules_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
