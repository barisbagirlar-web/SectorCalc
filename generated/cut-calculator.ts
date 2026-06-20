// Auto-generated from cut-calculator-schema.json
import * as z from 'zod';

export interface Cut_calculatorInput {
  cuttingSpeed: number;
  feedPerTooth: number;
  numberOfTeeth: number;
  toolDiameter: number;
  depthOfCut: number;
  widthOfCut: number;
  dataConfidence?: number;
}

export const Cut_calculatorInputSchema = z.object({
  cuttingSpeed: z.number().default(150),
  feedPerTooth: z.number().default(0.15),
  numberOfTeeth: z.number().default(4),
  toolDiameter: z.number().default(12),
  depthOfCut: z.number().default(5),
  widthOfCut: z.number().default(8),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cut_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.cuttingSpeed * 1000) / (Math.PI * input.toolDiameter); results["spindleSpeed"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["spindleSpeed"] = Number.NaN; }
  try { const v = input.feedPerTooth * input.numberOfTeeth * (toNumericFormulaValue(results["spindleSpeed"])); results["feedRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["feedRate"] = Number.NaN; }
  try { const v = (input.depthOfCut * input.widthOfCut * (toNumericFormulaValue(results["feedRate"]))) / 1000; results["materialRemovalRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["materialRemovalRate"] = Number.NaN; }
  return results;
}


export function calculateCut_calculator(input: Cut_calculatorInput): Cut_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["materialRemovalRate"]);
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


export interface Cut_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
