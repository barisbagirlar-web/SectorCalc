// @ts-nocheck
// Auto-generated from surface-finish-calculator-schema.json
import * as z from 'zod';

export interface Surface_finish_calculatorInput {
  feedRate: number;
  noseRadius: number;
  cuttingSpeed: number;
  depthOfCut: number;
  desiredRa: number;
}

export const Surface_finish_calculatorInputSchema = z.object({
  feedRate: z.number().default(0.2),
  noseRadius: z.number().default(0.8),
  cuttingSpeed: z.number().default(150),
  depthOfCut: z.number().default(1),
  desiredRa: z.number().default(3.2),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Surface_finish_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = 31.25 * input.feedRate * input.feedRate / input.noseRadius; results["actualRa"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["actualRa"] = 0; }
  try { const v = 31.25 * input.feedRate * input.feedRate / input.desiredRa; results["recommendedNoseRadius"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["recommendedNoseRadius"] = 0; }
  try { const v = 125 * input.feedRate * input.feedRate / input.noseRadius; results["actualRz"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["actualRz"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSurface_finish_calculator(input: Surface_finish_calculatorInput): Surface_finish_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["actualRa"]);
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


export interface Surface_finish_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
