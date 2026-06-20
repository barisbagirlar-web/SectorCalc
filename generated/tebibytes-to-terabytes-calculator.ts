// Auto-generated from tebibytes-to-terabytes-calculator-schema.json
import * as z from 'zod';

export interface Tebibytes_to_terabytes_calculatorInput {
  tebibytes: number;
  conversionFactor: number;
  precision: number;
  outputMultiplier: number;
  dataConfidence?: number;
}

export const Tebibytes_to_terabytes_calculatorInputSchema = z.object({
  tebibytes: z.number().default(1),
  conversionFactor: z.number().default(1.099511627776),
  precision: z.number().default(2),
  outputMultiplier: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Tebibytes_to_terabytes_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = "1 TiB = " + input.conversionFactor + " TB"; results["conversionEquation"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["conversionEquation"] = Number.NaN; }
  try { const v = input.tebibytes * input.conversionFactor; results["rawValueWithoutMultiplier"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rawValueWithoutMultiplier"] = Number.NaN; }
  return results;
}


export function calculateTebibytes_to_terabytes_calculator(input: Tebibytes_to_terabytes_calculatorInput): Tebibytes_to_terabytes_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["rawValueWithoutMultiplier"]);
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


export interface Tebibytes_to_terabytes_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
