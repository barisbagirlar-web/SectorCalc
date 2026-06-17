// @ts-nocheck
// Auto-generated from gcse-calculator-schema.json
import * as z from 'zod';

export interface Gcse_calculatorInput {
  wallLength: number;
  wallHeight: number;
  leafCount: number;
  brickLength: number;
  brickHeight: number;
  mortarThickness: number;
  wastagePercent: number;
}

export const Gcse_calculatorInputSchema = z.object({
  wallLength: z.number().default(10),
  wallHeight: z.number().default(2.5),
  leafCount: z.number().default(1),
  brickLength: z.number().default(215),
  brickHeight: z.number().default(65),
  mortarThickness: z.number().default(10),
  wastagePercent: z.number().default(5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Gcse_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.wallLength * input.wallHeight * input.leafCount; results["wallArea"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["wallArea"] = 0; }
  try { const v = (input.brickLength/1000 + input.mortarThickness/1000) * (input.brickHeight/1000 + input.mortarThickness/1000); results["brickArea"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["brickArea"] = 0; }
  try { const v = (asFormulaNumber(results["wallArea"])) / (asFormulaNumber(results["brickArea"])); results["baseBricks"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["baseBricks"] = 0; }
  try { const v = (asFormulaNumber(results["baseBricks"])) * (1 + input.wastagePercent/100); results["totalBricks"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalBricks"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateGcse_calculator(input: Gcse_calculatorInput): Gcse_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalBricks"]);
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


export interface Gcse_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
