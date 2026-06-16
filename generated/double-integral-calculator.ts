// Auto-generated from double-integral-calculator-schema.json
import * as z from 'zod';

export interface Double_integral_calculatorInput {
  xLower: number;
  xUpper: number;
  yLower: number;
  yUpper: number;
  coefA: number;
  coefB: number;
  constantC: number;
}

export const Double_integral_calculatorInputSchema = z.object({
  xLower: z.number().default(0),
  xUpper: z.number().default(1),
  yLower: z.number().default(0),
  yUpper: z.number().default(1),
  coefA: z.number().default(0),
  coefB: z.number().default(0),
  constantC: z.number().default(0),
});

function evaluateAllFormulas(input: Double_integral_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.coefA/3)*(Math.pow(input.xUpper,3)-Math.pow(input.xLower,3))*(input.yUpper-input.yLower); results["xTerm"] = Number.isFinite(v) ? v : 0; } catch { results["xTerm"] = 0; }
  try { const v = (input.coefB/3)*(Math.pow(input.yUpper,3)-Math.pow(input.yLower,3))*(input.xUpper-input.xLower); results["yTerm"] = Number.isFinite(v) ? v : 0; } catch { results["yTerm"] = 0; }
  try { const v = input.constantC*(input.xUpper-input.xLower)*(input.yUpper-input.yLower); results["constTerm"] = Number.isFinite(v) ? v : 0; } catch { results["constTerm"] = 0; }
  try { const v = (input.coefA/3)*(Math.pow(input.xUpper,3)-Math.pow(input.xLower,3))*(input.yUpper-input.yLower) + (input.coefB/3)*(Math.pow(input.yUpper,3)-Math.pow(input.yLower,3))*(input.xUpper-input.xLower) + input.constantC*(input.xUpper-input.xLower)*(input.yUpper-input.yLower); results["integral"] = Number.isFinite(v) ? v : 0; } catch { results["integral"] = 0; }
  return results;
}


export function calculateDouble_integral_calculator(input: Double_integral_calculatorInput): Double_integral_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["integral"] ?? 0;
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


export interface Double_integral_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
