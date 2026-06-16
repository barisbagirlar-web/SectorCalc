// Auto-generated from column-buckling-calculator-schema.json
import * as z from 'zod';

export interface Column_buckling_calculatorInput {
  elasticModulus: number;
  momentInertia: number;
  area: number;
  length: number;
  effectiveLengthFactor: number;
  appliedLoad: number;
}

export const Column_buckling_calculatorInputSchema = z.object({
  elasticModulus: z.number().default(200000),
  momentInertia: z.number().default(1000000),
  area: z.number().default(5000),
  length: z.number().default(3000),
  effectiveLengthFactor: z.number().default(1),
  appliedLoad: z.number().default(50000),
});

function evaluateAllFormulas(input: Column_buckling_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.PI ** 2 * input.elasticModulus * input.momentInertia / ( (input.effectiveLengthFactor * input.length) ** 2 ); results["criticalLoad"] = Number.isFinite(v) ? v : 0; } catch { results["criticalLoad"] = 0; }
  try { const v = (results["criticalLoad"] ?? 0) / input.area; results["criticalStress"] = Number.isFinite(v) ? v : 0; } catch { results["criticalStress"] = 0; }
  try { const v = (input.effectiveLengthFactor * input.length) / Math.sqrt(input.momentInertia / input.area); results["slendernessRatio"] = Number.isFinite(v) ? v : 0; } catch { results["slendernessRatio"] = 0; }
  try { const v = (results["criticalLoad"] ?? 0) / input.appliedLoad; results["safetyFactor"] = Number.isFinite(v) ? v : 0; } catch { results["safetyFactor"] = 0; }
  return results;
}


export function calculateColumn_buckling_calculator(input: Column_buckling_calculatorInput): Column_buckling_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["criticalLoad"] ?? 0;
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


export interface Column_buckling_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
