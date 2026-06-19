// Auto-generated from eu-shoe-size-to-us-calculator-schema.json
import * as z from 'zod';

export interface Eu_shoe_size_to_us_calculatorInput {
  euSize: number;
  conversionType: number;
  brandAdjustment: number;
  calibrationOffset: number;
  dataConfidence?: number;
}

export const Eu_shoe_size_to_us_calculatorInputSchema = z.object({
  euSize: z.number().default(42),
  conversionType: z.number().default(1),
  brandAdjustment: z.number().default(0),
  calibrationOffset: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Eu_shoe_size_to_us_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.euSize - 33; results["menUS"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["menUS"] = 0; }
  try { const v = input.euSize - 30.5; results["womenUS"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["womenUS"] = 0; }
  try { const v = input.euSize - 16; results["kidsUS"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["kidsUS"] = 0; }
  try { const v = input.conversionType == 1 ? (asFormulaNumber(results["menUS"])) + input.brandAdjustment + input.calibrationOffset : input.conversionType == 2 ? (asFormulaNumber(results["womenUS"])) + input.brandAdjustment + input.calibrationOffset : (asFormulaNumber(results["kidsUS"])) + input.brandAdjustment + input.calibrationOffset; results["usSize"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["usSize"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateEu_shoe_size_to_us_calculator(input: Eu_shoe_size_to_us_calculatorInput): Eu_shoe_size_to_us_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["usSize"]));
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


export interface Eu_shoe_size_to_us_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
