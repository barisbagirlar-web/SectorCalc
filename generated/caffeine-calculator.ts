// Auto-generated from caffeine-calculator-schema.json
import * as z from 'zod';

export interface Caffeine_calculatorInput {
  volumePerServing: number;
  numberOfServings: number;
  caffeineContentPer100ml: number;
  bodyWeight: number;
  dataConfidence?: number;
}

export const Caffeine_calculatorInputSchema = z.object({
  volumePerServing: z.number().default(250),
  numberOfServings: z.number().default(1),
  caffeineContentPer100ml: z.number().default(40),
  bodyWeight: z.number().default(70),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Caffeine_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.volumePerServing * input.numberOfServings * (input.caffeineContentPer100ml / 100); results["totalCaffeine"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCaffeine"] = 0; }
  try { const v = input.bodyWeight * 6; results["safeLimit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["safeLimit"] = 0; }
  try { const v = (asFormulaNumber(results["safeLimit"])) - (asFormulaNumber(results["totalCaffeine"])); results["remainingCaffeine"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["remainingCaffeine"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCaffeine_calculator(input: Caffeine_calculatorInput): Caffeine_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCaffeine"]);
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


export interface Caffeine_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
