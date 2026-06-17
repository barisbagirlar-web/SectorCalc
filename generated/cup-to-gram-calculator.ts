// @ts-nocheck
// Auto-generated from cup-to-gram-calculator-schema.json
import * as z from 'zod';

export interface Cup_to_gram_calculatorInput {
  cups: number;
  cupVolume: number;
  density: number;
  temperature: number;
  densityCorrectionFactor: number;
}

export const Cup_to_gram_calculatorInputSchema = z.object({
  cups: z.number().default(1),
  cupVolume: z.number().default(236.588),
  density: z.number().default(1),
  temperature: z.number().default(20),
  densityCorrectionFactor: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cup_to_gram_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.density * (1 + input.densityCorrectionFactor * (input.temperature - 20)); results["correctedDensity"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["correctedDensity"] = 0; }
  try { const v = input.cups * input.cupVolume; results["volumeInML"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["volumeInML"] = 0; }
  try { const v = (asFormulaNumber(results["volumeInML"])) * (asFormulaNumber(results["correctedDensity"])); results["massInGrams"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["massInGrams"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCup_to_gram_calculator(input: Cup_to_gram_calculatorInput): Cup_to_gram_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["massInGrams"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Cup_to_gram_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
