// Auto-generated from column-load-calculator-schema.json
import * as z from 'zod';

export interface Column_load_calculatorInput {
  length: number;
  area: number;
  inertia: number;
  elasticModulus: number;
  yieldStrength: number;
  effectiveLengthFactor: number;
  safetyFactor: number;
}

export const Column_load_calculatorInputSchema = z.object({
  length: z.number().default(3000),
  area: z.number().default(5000),
  inertia: z.number().default(1000000),
  elasticModulus: z.number().default(200),
  yieldStrength: z.number().default(250),
  effectiveLengthFactor: z.number().default(1),
  safetyFactor: z.number().default(1.5),
});

function evaluateAllFormulas(input: Column_load_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt(input.inertia/input.area); results["radiusOfGyration"] = Number.isFinite(v) ? v : 0; } catch { results["radiusOfGyration"] = 0; }
  try { const v = (input.effectiveLengthFactor*input.length) / (results["radiusOfGyration"] ?? 0); results["slendernessRatio"] = Number.isFinite(v) ? v : 0; } catch { results["slendernessRatio"] = 0; }
  try { const v = (Math.PI**2 * input.elasticModulus * 1000 * input.inertia) / (input.effectiveLengthFactor*input.length)**2; results["criticalBucklingLoad"] = Number.isFinite(v) ? v : 0; } catch { results["criticalBucklingLoad"] = 0; }
  try { const v = input.area*input.yieldStrength; results["yieldLoad"] = Number.isFinite(v) ? v : 0; } catch { results["yieldLoad"] = 0; }
  try { const v = Math.min((results["yieldLoad"] ?? 0), (results["criticalBucklingLoad"] ?? 0))/input.safetyFactor; results["designLoad"] = Number.isFinite(v) ? v : 0; } catch { results["designLoad"] = 0; }
  return results;
}


export function calculateColumn_load_calculator(input: Column_load_calculatorInput): Column_load_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["designLoad"] ?? 0;
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


export interface Column_load_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
