// Auto-generated from mixing-ratio-calculator-schema.json
import * as z from 'zod';

export interface Mixing_ratio_calculatorInput {
  ratioA: number;
  ratioB: number;
  totalQuantity: number;
  wastePercent: number;
  dataConfidence?: number;
}

export const Mixing_ratio_calculatorInputSchema = z.object({
  ratioA: z.number().default(1),
  ratioB: z.number().default(1),
  totalQuantity: z.number().default(1000),
  wastePercent: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mixing_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ratioA + input.ratioB; results["totalParts"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalParts"] = 0; }
  try { const v = input.totalQuantity * (1 + input.wastePercent / 100); results["effectiveTotal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectiveTotal"] = 0; }
  try { const v = (asFormulaNumber(results["effectiveTotal"])) * input.ratioA / (asFormulaNumber(results["totalParts"])); results["amountA"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["amountA"] = 0; }
  try { const v = (asFormulaNumber(results["effectiveTotal"])) * input.ratioB / (asFormulaNumber(results["totalParts"])); results["amountB"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["amountB"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMixing_ratio_calculator(input: Mixing_ratio_calculatorInput): Mixing_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["amountA"]));
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


export interface Mixing_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
