// Auto-generated from heatmap-calculator-schema.json
import * as z from 'zod';

export interface Heatmap_calculatorInput {
  likelihood: number;
  impact: number;
  controlEffectiveness: number;
  residualLikelihood: number;
  residualImpact: number;
  inherentWeight: number;
  residualWeight: number;
}

export const Heatmap_calculatorInputSchema = z.object({
  likelihood: z.number().default(3),
  impact: z.number().default(3),
  controlEffectiveness: z.number().default(50),
  residualLikelihood: z.number().default(2),
  residualImpact: z.number().default(2),
  inherentWeight: z.number().default(0.5),
  residualWeight: z.number().default(0.5),
});

function evaluateAllFormulas(input: Heatmap_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.likelihood * input.impact; results["inherentScore"] = Number.isFinite(v) ? v : 0; } catch { results["inherentScore"] = 0; }
  try { const v = input.residualLikelihood * input.residualImpact * (1 - input.controlEffectiveness / 100); results["residualScore"] = Number.isFinite(v) ? v : 0; } catch { results["residualScore"] = 0; }
  try { const v = (results["inherentScore"] ?? 0) * input.inherentWeight + (results["residualScore"] ?? 0) * input.residualWeight; results["overallScore"] = Number.isFinite(v) ? v : 0; } catch { results["overallScore"] = 0; }
  return results;
}


export function calculateHeatmap_calculator(input: Heatmap_calculatorInput): Heatmap_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["overallScore"] ?? 0;
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


export interface Heatmap_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
