// @ts-nocheck
// Auto-generated from wallpaper-calculator-schema.json
import * as z from 'zod';

export interface Wallpaper_calculatorInput {
  wallWidth: number;
  wallHeight: number;
  rollWidth: number;
  rollLength: number;
  patternRepeat: number;
  wastePercent: number;
}

export const Wallpaper_calculatorInputSchema = z.object({
  wallWidth: z.number().default(5),
  wallHeight: z.number().default(2.5),
  rollWidth: z.number().default(0.53),
  rollLength: z.number().default(10),
  patternRepeat: z.number().default(0),
  wastePercent: z.number().default(10),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Wallpaper_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.wallWidth * input.wallHeight; results["wallArea"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["wallArea"] = 0; }
  try { const v = input.rollLength - (input.patternRepeat > 0 ? (input.rollLength % input.patternRepeat) : 0); results["usableRollLength"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["usableRollLength"] = 0; }
  try { const v = input.wallWidth * input.wallHeight; results["totalArea"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalArea"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateWallpaper_calculator(input: Wallpaper_calculatorInput): Wallpaper_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalArea"]);
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


export interface Wallpaper_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
