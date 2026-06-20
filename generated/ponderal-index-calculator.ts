// Auto-generated from ponderal-index-calculator-schema.json
import * as z from 'zod';

export interface Ponderal_index_calculatorInput {
  mass_kg: number;
  height_cm: number;
  mass_lb: number;
  height_in: number;
  dataConfidence?: number;
}

export const Ponderal_index_calculatorInputSchema = z.object({
  mass_kg: z.number().default(70),
  height_cm: z.number().default(170),
  mass_lb: z.number().default(154.32),
  height_in: z.number().default(66.93),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ponderal_index_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mass_kg / ((input.height_cm / 100) ** 3); results["metricPI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["metricPI"] = Number.NaN; }
  try { const v = input.mass_lb / (input.height_in ** 3); results["imperialPI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["imperialPI"] = Number.NaN; }
  return results;
}


export function calculatePonderal_index_calculator(input: Ponderal_index_calculatorInput): Ponderal_index_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["metricPI"]);
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


export interface Ponderal_index_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
