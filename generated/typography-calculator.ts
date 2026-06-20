// Auto-generated from typography-calculator-schema.json
import * as z from 'zod';

export interface Typography_calculatorInput {
  viewingDistance: number;
  ageFactor: number;
  lightingFactor: number;
  safetyFactor: number;
  dataConfidence?: number;
}

export const Typography_calculatorInputSchema = z.object({
  viewingDistance: z.number().default(2),
  ageFactor: z.number().default(1),
  lightingFactor: z.number().default(1),
  safetyFactor: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Typography_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.viewingDistance * 2.5 * input.ageFactor * input.lightingFactor * input.safetyFactor; results["recommendedFontHeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["recommendedFontHeight"] = Number.NaN; }
  try { const v = input.viewingDistance * 2.5 * input.ageFactor * input.lightingFactor * input.safetyFactor; results["recommendedFontHeight_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["recommendedFontHeight_aux"] = Number.NaN; }
  return results;
}


export function calculateTypography_calculator(input: Typography_calculatorInput): Typography_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["recommendedFontHeight"]);
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


export interface Typography_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
