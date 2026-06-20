// Auto-generated from gradient-calculator-schema.json
import * as z from 'zod';

export interface Gradient_calculatorInput {
  startEasting: number;
  startNorthing: number;
  startElevation: number;
  endEasting: number;
  endNorthing: number;
  endElevation: number;
  dataConfidence?: number;
}

export const Gradient_calculatorInputSchema = z.object({
  startEasting: z.number().default(0),
  startNorthing: z.number().default(0),
  startElevation: z.number().default(0),
  endEasting: z.number().default(1),
  endNorthing: z.number().default(0),
  endElevation: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Gradient_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.startEasting) * (input.startNorthing) * (input.startElevation) * (input.endEasting) * (input.endNorthing) * (input.endElevation); results["rise"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rise"] = Number.NaN; }
  try { const v = (input.startEasting) * (input.startNorthing) * (input.startElevation); results["rise_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rise_aux"] = Number.NaN; }
  return results;
}


export function calculateGradient_calculator(input: Gradient_calculatorInput): Gradient_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["rise_aux"]);
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


export interface Gradient_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
