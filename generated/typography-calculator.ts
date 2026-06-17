// Auto-generated from typography-calculator-schema.json
import * as z from 'zod';

export interface Typography_calculatorInput {
  viewingDistance: number;
  ageFactor: number;
  lightingFactor: number;
  safetyFactor: number;
}

export const Typography_calculatorInputSchema = z.object({
  viewingDistance: z.number().default(2),
  ageFactor: z.number().default(1),
  lightingFactor: z.number().default(1),
  safetyFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Typography_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.viewingDistance * 2.5 * input.ageFactor * input.lightingFactor * input.safetyFactor; results["recommendedFontHeight"] = Number.isFinite(v) ? v : 0; } catch { results["recommendedFontHeight"] = 0; }
  results["Temel_y_kseklik___G_r___mesafesi___2_5_m"] = 0;
  results["__ageFactor"] = 0;
  results["__lightingFactor"] = 0;
  results["__safetyFactor"] = 0;
  return results;
}


export function calculateTypography_calculator(input: Typography_calculatorInput): Typography_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["recommendedFontHeight"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
