// Auto-generated from roofing-square-calculator-schema.json
import * as z from 'zod';

export interface Roofing_square_calculatorInput {
  roofLength: number;
  roofWidth: number;
  pitchAngle: number;
  wastePercent: number;
  dataConfidence?: number;
}

export const Roofing_square_calculatorInputSchema = z.object({
  roofLength: z.number().default(30),
  roofWidth: z.number().default(20),
  pitchAngle: z.number().default(20),
  wastePercent: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Roofing_square_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.roofLength * input.roofWidth * input.pitchAngle * (input.wastePercent / 100); results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.roofLength * input.roofWidth * input.pitchAngle * (input.wastePercent / 100); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRoofing_square_calculator(input: Roofing_square_calculatorInput): Roofing_square_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Roofing_square_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
