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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Volume_of_revolution_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.slope**2 * (input.upperBound**3 - input.lowerBound**3) / 3) + (input.slope * input.intercept * (input.upperBound**2 - input.lowerBound**2)) + (input.intercept**2 * (input.upperBound - input.lowerBound)); results["integralOfF2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["integralOfF2"] = 0; }
  try { const v = Math.PI * (asFormulaNumber(results["integralOfF2"])); results["volume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["volume"] = 0; }
  try { const v = 'Math.PI × (' + (asFormulaNumber(results["integralOfF2"])) + ')'; results["volumeSteps"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["volumeSteps"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateVolume_of_revolution_calculator(input: Volume_of_revolution_calculatorInput): Volume_of_revolution_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["volume"]));
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


export interface Volume_of_revolution_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
