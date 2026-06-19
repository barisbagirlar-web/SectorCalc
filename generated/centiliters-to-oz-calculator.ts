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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Centiliters_to_oz_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.33814 + input.conversionType * (0.35195 - 0.33814); results["conversionFactor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["conversionFactor"] = 0; }
  try { const v = input.centiliters * (asFormulaNumber(results["conversionFactor"])) * input.containerCount; results["rawOunces"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rawOunces"] = 0; }
  try { const v = (asFormulaNumber(results["rawOunces"])) * input.wasteFactor / 100; results["wasteOunces"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wasteOunces"] = 0; }
  try { const v = (asFormulaNumber(results["rawOunces"])) + (asFormulaNumber(results["wasteOunces"])); results["totalOunces"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalOunces"] = 0; }
  try { const v = 10 ** input.roundingPrecision; results["roundingFactor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["roundingFactor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCentiliters_to_oz_calculator(input: Centiliters_to_oz_calculatorInput): Centiliters_to_oz_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["roundingFactor"]));
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


export interface Centiliters_to_oz_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
