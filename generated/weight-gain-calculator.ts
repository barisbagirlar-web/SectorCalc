// Auto-generated from weight-gain-calculator-schema.json
import * as z from 'zod';

export interface Weight_gain_calculatorInput {
  surfaceArea: number;
  coatingThickness: number;
  coatingDensity: number;
  numberOfParts: number;
  dataConfidence?: number;
}

export const Weight_gain_calculatorInputSchema = z.object({
  surfaceArea: z.number().default(0.5),
  coatingThickness: z.number().default(50),
  coatingDensity: z.number().default(1200),
  numberOfParts: z.number().default(100),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Weight_gain_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.surfaceArea * input.coatingThickness / 1000000; results["coatingVolumePerPart"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["coatingVolumePerPart"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["coatingVolumePerPart"])) * input.coatingDensity; results["weightGainPerPart"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["weightGainPerPart"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["weightGainPerPart"])) * input.numberOfParts; results["totalWeightGain"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalWeightGain"] = Number.NaN; }
  return results;
}


export function calculateWeight_gain_calculator(input: Weight_gain_calculatorInput): Weight_gain_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalWeightGain"]);
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


export interface Weight_gain_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
