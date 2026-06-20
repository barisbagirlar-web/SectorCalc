// Auto-generated from decibel-calculator-schema.json
import * as z from 'zod';

export interface Decibel_calculatorInput {
  powerRef: number;
  powerMeas: number;
  ampRef: number;
  ampMeas: number;
  dataConfidence?: number;
}

export const Decibel_calculatorInputSchema = z.object({
  powerRef: z.number().default(1),
  powerMeas: z.number().default(2),
  ampRef: z.number().default(1),
  ampMeas: z.number().default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Decibel_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.powerMeas / input.powerRef; results["powerRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["powerRatio"] = Number.NaN; }
  try { const v = input.powerMeas / input.powerRef; results["powerRatio_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["powerRatio_aux"] = Number.NaN; }
  return results;
}


export function calculateDecibel_calculator(input: Decibel_calculatorInput): Decibel_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["powerRatio_aux"]);
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


export interface Decibel_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
