// Auto-generated from surface-finish-calculator-schema.json
import * as z from 'zod';

export interface Surface_finish_calculatorInput {
  feedRate: number;
  noseRadius: number;
  cuttingSpeed: number;
  depthOfCut: number;
  desiredRa: number;
  dataConfidence?: number;
}

export const Surface_finish_calculatorInputSchema = z.object({
  feedRate: z.number().default(0.2),
  noseRadius: z.number().default(0.8),
  cuttingSpeed: z.number().default(150),
  depthOfCut: z.number().default(1),
  desiredRa: z.number().default(3.2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Surface_finish_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 31.25 * input.feedRate * input.feedRate / input.noseRadius; results["actualRa"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["actualRa"] = Number.NaN; }
  try { const v = 31.25 * input.feedRate * input.feedRate / input.desiredRa; results["recommendedNoseRadius"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["recommendedNoseRadius"] = Number.NaN; }
  try { const v = 125 * input.feedRate * input.feedRate / input.noseRadius; results["actualRz"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["actualRz"] = Number.NaN; }
  return results;
}


export function calculateSurface_finish_calculator(input: Surface_finish_calculatorInput): Surface_finish_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["actualRa"]);
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


export interface Surface_finish_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
