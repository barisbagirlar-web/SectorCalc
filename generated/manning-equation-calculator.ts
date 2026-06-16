// Auto-generated from manning-equation-calculator-schema.json
import * as z from 'zod';

export interface Manning_equation_calculatorInput {
  roughness: number;
  hydraulicRadius: number;
  area: number;
  slope: number;
}

export const Manning_equation_calculatorInputSchema = z.object({
  roughness: z.number().default(0.013),
  hydraulicRadius: z.number().default(1),
  area: z.number().default(1),
  slope: z.number().default(0.001),
});

function evaluateAllFormulas(input: Manning_equation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (1 / input.roughness) * input.area * Math.pow(input.hydraulicRadius, 2/3) * Math.sqrt(input.slope); results["flowRate"] = Number.isFinite(v) ? v : 0; } catch { results["flowRate"] = 0; }
  try { const v = (results["flowRate"] ?? 0) / input.area; results["velocity"] = Number.isFinite(v) ? v : 0; } catch { results["velocity"] = 0; }
  return results;
}


export function calculateManning_equation_calculator(input: Manning_equation_calculatorInput): Manning_equation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["flowRate"] ?? 0;
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


export interface Manning_equation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
