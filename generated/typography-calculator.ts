// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Typography_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.viewingDistance * 2.5 * input.ageFactor * input.lightingFactor * input.safetyFactor; results["recommendedFontHeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["recommendedFontHeight"] = 0; }
  try { const v = input.viewingDistance * 2.5 * input.ageFactor * input.lightingFactor * input.safetyFactor; results["recommendedFontHeight_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["recommendedFontHeight_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateTypography_calculator(input: Typography_calculatorInput): Typography_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["recommendedFontHeight"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
