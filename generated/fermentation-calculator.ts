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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Fermentation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.initialSugar / 17; results["potentialABV"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["potentialABV"] = 0; }
  try { const v = input.initialSugar / 17; results["potentialABV_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["potentialABV_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFermentation_calculator(input: Fermentation_calculatorInput): Fermentation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["potentialABV_aux"]));
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


export interface Fermentation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
