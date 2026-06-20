// Auto-generated from volume-of-revolution-calculator-schema.json
import * as z from 'zod';

export interface Volume_of_revolution_calculatorInput {
  lowerBound: number;
  upperBound: number;
  slope: number;
  intercept: number;
  dataConfidence?: number;
}

export const Volume_of_revolution_calculatorInputSchema = z.object({
  lowerBound: z.number().default(0),
  upperBound: z.number().default(1),
  slope: z.number().default(1),
  intercept: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Volume_of_revolution_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.slope**2 * (input.upperBound**3 - input.lowerBound**3) / 3) + (input.slope * input.intercept * (input.upperBound**2 - input.lowerBound**2)) + (input.intercept**2 * (input.upperBound - input.lowerBound)); results["integralOfF2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["integralOfF2"] = Number.NaN; }
  try { const v = Math.PI * (toNumericFormulaValue(results["integralOfF2"])); results["volume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["volume"] = Number.NaN; }
  try { const v = 'Math.PI × (' + (toNumericFormulaValue(results["integralOfF2"])) + ')'; results["volumeSteps"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["volumeSteps"] = Number.NaN; }
  return results;
}


export function calculateVolume_of_revolution_calculator(input: Volume_of_revolution_calculatorInput): Volume_of_revolution_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["volume"]);
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


export interface Volume_of_revolution_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
