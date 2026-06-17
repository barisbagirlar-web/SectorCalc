// @ts-nocheck
// Auto-generated from cut-calculator-schema.json
import * as z from 'zod';

export interface Cut_calculatorInput {
  cuttingSpeed: number;
  feedPerTooth: number;
  numberOfTeeth: number;
  toolDiameter: number;
  depthOfCut: number;
  widthOfCut: number;
}

export const Cut_calculatorInputSchema = z.object({
  cuttingSpeed: z.number().default(150),
  feedPerTooth: z.number().default(0.15),
  numberOfTeeth: z.number().default(4),
  toolDiameter: z.number().default(12),
  depthOfCut: z.number().default(5),
  widthOfCut: z.number().default(8),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cut_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.cuttingSpeed * 1000) / (Math.PI * input.toolDiameter); results["spindleSpeed"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["spindleSpeed"] = 0; }
  try { const v = input.feedPerTooth * input.numberOfTeeth * (asFormulaNumber(results["spindleSpeed"])); results["feedRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["feedRate"] = 0; }
  try { const v = (input.depthOfCut * input.widthOfCut * (asFormulaNumber(results["feedRate"]))) / 1000; results["materialRemovalRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["materialRemovalRate"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCut_calculator(input: Cut_calculatorInput): Cut_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["materialRemovalRate"]);
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


export interface Cut_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
