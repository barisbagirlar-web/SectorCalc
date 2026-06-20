// Auto-generated from steel-column-calculator-schema.json
import * as z from 'zod';

export interface Steel_column_calculatorInput {
  effectiveLengthFactor: number;
  unbracedLength: number;
  width: number;
  thickness: number;
  elasticModulus: number;
  yieldStrength: number;
  safetyFactor: number;
  dataConfidence?: number;
}

export const Steel_column_calculatorInputSchema = z.object({
  effectiveLengthFactor: z.number().default(1),
  unbracedLength: z.number().default(3000),
  width: z.number().default(100),
  thickness: z.number().default(10),
  elasticModulus: z.number().default(200),
  yieldStrength: z.number().default(250),
  safetyFactor: z.number().default(1.67),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Steel_column_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.effectiveLengthFactor) * (input.unbracedLength) * (input.width) * (input.thickness) * (input.elasticModulus) * (input.yieldStrength) * (input.safetyFactor); results["A"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["A"] = Number.NaN; }
  try { const v = (input.effectiveLengthFactor) * (input.unbracedLength) * (input.width); results["I"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["I"] = Number.NaN; }
  try { const v = (input.effectiveLengthFactor) * (input.unbracedLength) * (input.width); results["P_yield"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["P_yield"] = Number.NaN; }
  try { const v = (input.effectiveLengthFactor) * (input.unbracedLength) * (input.width); results["yieldStress"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["yieldStress"] = Number.NaN; }
  return results;
}


export function calculateSteel_column_calculator(input: Steel_column_calculatorInput): Steel_column_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["yieldStress"]);
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


export interface Steel_column_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
