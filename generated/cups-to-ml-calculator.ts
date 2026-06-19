// Auto-generated from cups-to-ml-calculator-schema.json
import * as z from 'zod';

export interface Cups_to_ml_calculatorInput {
  cups: number;
  cupSize: number;
  precision: number;
  batchSize: number;
  temperature: number;
  altitude: number;
  dataConfidence?: number;
}

export const Cups_to_ml_calculatorInputSchema = z.object({
  cups: z.number().default(1),
  cupSize: z.number().default(236.588),
  precision: z.number().default(2),
  batchSize: z.number().default(1),
  temperature: z.number().default(20),
  altitude: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cups_to_ml_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cups * input.cupSize * input.batchSize + 0 * input.temperature + 0 * input.altitude; results["millilitersUnrounded"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["millilitersUnrounded"] = 0; }
  try { const v = input.cups * input.cupSize * input.batchSize + 0 * input.temperature + 0 * input.altitude; results["millilitersUnrounded_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["millilitersUnrounded_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCups_to_ml_calculator(input: Cups_to_ml_calculatorInput): Cups_to_ml_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["millilitersUnrounded"]));
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


export interface Cups_to_ml_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
