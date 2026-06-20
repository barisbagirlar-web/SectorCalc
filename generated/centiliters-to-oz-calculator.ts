// Auto-generated from centiliters-to-oz-calculator-schema.json
import * as z from 'zod';

export interface Centiliters_to_oz_calculatorInput {
  centiliters: number;
  conversionType: number;
  containerCount: number;
  wasteFactor: number;
  roundingPrecision: number;
  dataConfidence?: number;
}

export const Centiliters_to_oz_calculatorInputSchema = z.object({
  centiliters: z.number().default(100),
  conversionType: z.number().default(0),
  containerCount: z.number().default(1),
  wasteFactor: z.number().default(0),
  roundingPrecision: z.number().default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Centiliters_to_oz_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.33814 + input.conversionType * (0.35195 - 0.33814); results["conversionFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["conversionFactor"] = Number.NaN; }
  try { const v = input.centiliters * (toNumericFormulaValue(results["conversionFactor"])) * input.containerCount; results["rawOunces"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rawOunces"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["rawOunces"])) * input.wasteFactor / 100; results["wasteOunces"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wasteOunces"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["rawOunces"])) + (toNumericFormulaValue(results["wasteOunces"])); results["totalOunces"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalOunces"] = Number.NaN; }
  try { const v = 10 ** input.roundingPrecision; results["roundingFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["roundingFactor"] = Number.NaN; }
  return results;
}


export function calculateCentiliters_to_oz_calculator(input: Centiliters_to_oz_calculatorInput): Centiliters_to_oz_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["roundingFactor"]);
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


export interface Centiliters_to_oz_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
