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
  dataConfidence?: number;
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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Heatmap_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.likelihood * input.impact; results["inherentScore"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["inherentScore"] = 0; }
  try { const v = input.residualLikelihood * input.residualImpact * (1 - input.controlEffectiveness / 100); results["residualScore"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["residualScore"] = 0; }
  try { const v = (asFormulaNumber(results["inherentScore"])) * input.inherentWeight + (asFormulaNumber(results["residualScore"])) * input.residualWeight; results["overallScore"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["overallScore"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHeatmap_calculator(input: Heatmap_calculatorInput): Heatmap_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["overallScore"]);
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


export interface Heatmap_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
