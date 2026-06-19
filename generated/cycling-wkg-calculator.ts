// Auto-generated from cycling-wkg-calculator-schema.json
import * as z from 'zod';

export interface Cycling_wkg_calculatorInput {
  weight: number;
  bikeWeight: number;
  power: number;
  duration: number;
  dataConfidence?: number;
}

export const Cycling_wkg_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  bikeWeight: z.number().default(9),
  power: z.number().default(250),
  duration: z.number().default(60),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cycling_wkg_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight + input.bikeWeight; results["totalWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalWeight"] = 0; }
  try { const v = input.power / (asFormulaNumber(results["totalWeight"])); results["wkg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wkg"] = 0; }
  try { const v = (asFormulaNumber(results["wkg"])) * (1 + 0.005 * (input.duration / 60 - 1)); results["normalizedWkg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalizedWkg"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCycling_wkg_calculator(input: Cycling_wkg_calculatorInput): Cycling_wkg_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["wkg"]));
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


export interface Cycling_wkg_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
