// Auto-generated from baking-percentage-calculator-schema.json
import * as z from 'zod';

export interface Baking_percentage_calculatorInput {
  flourWeight: number;
  waterPercent: number;
  saltPercent: number;
  yeastPercent: number;
  otherPercent: number;
  dataConfidence?: number;
}

export const Baking_percentage_calculatorInputSchema = z.object({
  flourWeight: z.number().default(1000),
  waterPercent: z.number().default(65),
  saltPercent: z.number().default(2),
  yeastPercent: z.number().default(1),
  otherPercent: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Baking_percentage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.flourWeight * (input.waterPercent / 100); results["waterWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["waterWeight"] = 0; }
  try { const v = input.flourWeight * (input.saltPercent / 100); results["saltWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["saltWeight"] = 0; }
  try { const v = input.flourWeight * (input.yeastPercent / 100); results["yeastWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["yeastWeight"] = 0; }
  try { const v = input.flourWeight * (input.otherPercent / 100); results["otherWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["otherWeight"] = 0; }
  try { const v = input.flourWeight + (asFormulaNumber(results["waterWeight"])) + (asFormulaNumber(results["saltWeight"])) + (asFormulaNumber(results["yeastWeight"])) + (asFormulaNumber(results["otherWeight"])); results["totalDoughWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalDoughWeight"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBaking_percentage_calculator(input: Baking_percentage_calculatorInput): Baking_percentage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalDoughWeight"]));
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


export interface Baking_percentage_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
