// Auto-generated from tanning-calculator-schema.json
import * as z from 'zod';

export interface Tanning_calculatorInput {
  hideWeight: number;
  desiredCr2O3Offer: number;
  bcsCr2O3Content: number;
  floatVolume: number;
  dataConfidence?: number;
}

export const Tanning_calculatorInputSchema = z.object({
  hideWeight: z.number().default(1000),
  desiredCr2O3Offer: z.number().default(6),
  bcsCr2O3Content: z.number().default(25),
  floatVolume: z.number().default(2000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Tanning_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.hideWeight * input.desiredCr2O3Offer / 100; results["pureCr2O3Weight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pureCr2O3Weight"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["pureCr2O3Weight"])) / (input.bcsCr2O3Content / 100); results["bcsWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bcsWeight"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["bcsWeight"])) * 1000 / input.floatVolume; results["concentrationInFloat"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["concentrationInFloat"] = Number.NaN; }
  return results;
}


export function calculateTanning_calculator(input: Tanning_calculatorInput): Tanning_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["bcsWeight"]);
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


export interface Tanning_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
