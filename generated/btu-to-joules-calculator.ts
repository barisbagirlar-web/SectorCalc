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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Btu_to_joules_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.factorOverride !== 0 ? input.factorOverride : (input.btuStandard === 1 ? 1055.05585262 : (input.btuStandard === 2 ? 1054.350 : (input.btuStandard === 3 ? 1055.056 : (input.btuStandard === 4 ? 1055.87 : 1055.05585262)))); results["conversionFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["conversionFactor"] = Number.NaN; }
  try { const v = input.btuValue * (toNumericFormulaValue(results["conversionFactor"])); results["rawJoules"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rawJoules"] = Number.NaN; }
  try { const v = input.outputUnit === 2 ? (toNumericFormulaValue(results["rawJoules"])) / 1000 : (toNumericFormulaValue(results["rawJoules"])); results["joules"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["joules"] = Number.NaN; }
  return results;
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
