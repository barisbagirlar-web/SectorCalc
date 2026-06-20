// Auto-generated from fermentation-calculator-schema.json
import * as z from 'zod';

export interface Fermentation_calculatorInput {
  initialSugar: number;
  fermentationTime: number;
  temperature: number;
  yeastPitchRate: number;
  batchVolume: number;
  dataConfidence?: number;
}

export const Fermentation_calculatorInputSchema = z.object({
  initialSugar: z.number().default(200),
  fermentationTime: z.number().default(48),
  temperature: z.number().default(20),
  yeastPitchRate: z.number().default(1000000),
  batchVolume: z.number().default(1000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fermentation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.initialSugar) * (input.fermentationTime) * (input.temperature) * (input.yeastPitchRate) * (input.batchVolume); results["potentialABV"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["potentialABV"] = Number.NaN; }
  try { const v = (input.initialSugar) * (input.fermentationTime) * (input.temperature); results["potentialABV_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["potentialABV_aux"] = Number.NaN; }
  return results;
}


export function calculateFermentation_calculator(input: Fermentation_calculatorInput): Fermentation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["potentialABV_aux"]);
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


export interface Fermentation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
