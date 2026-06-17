// @ts-nocheck
// Auto-generated from brick-calculator-schema.json
import * as z from 'zod';

export interface Brick_calculatorInput {
  wallLength: number;
  wallHeight: number;
  brickLength: number;
  brickHeight: number;
  mortarThickness: number;
  openingArea: number;
  wastagePercentage: number;
}

export const Brick_calculatorInputSchema = z.object({
  wallLength: z.number().default(10),
  wallHeight: z.number().default(3),
  brickLength: z.number().default(200),
  brickHeight: z.number().default(100),
  mortarThickness: z.number().default(10),
  openingArea: z.number().default(2),
  wastagePercentage: z.number().default(5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Brick_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.wallLength * input.wallHeight - input.openingArea; results["wallArea"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["wallArea"] = 0; }
  try { const v = input.brickLength / 1000; results["brickLengthM"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["brickLengthM"] = 0; }
  try { const v = input.brickHeight / 1000; results["brickHeightM"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["brickHeightM"] = 0; }
  try { const v = input.mortarThickness / 1000; results["mortarThicknessM"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["mortarThicknessM"] = 0; }
  try { const v = (asFormulaNumber(results["brickLengthM"])) + (asFormulaNumber(results["mortarThicknessM"])); results["effectiveLength"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["effectiveLength"] = 0; }
  try { const v = (asFormulaNumber(results["brickHeightM"])) + (asFormulaNumber(results["mortarThicknessM"])); results["effectiveHeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["effectiveHeight"] = 0; }
  try { const v = 1 / ((asFormulaNumber(results["effectiveLength"])) * (asFormulaNumber(results["effectiveHeight"]))); results["bricksPerSquareMeter"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["bricksPerSquareMeter"] = 0; }
  try { const v = (asFormulaNumber(results["wallArea"])) * (asFormulaNumber(results["bricksPerSquareMeter"])); results["netBricks"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["netBricks"] = 0; }
  try { const v = 1 + input.wastagePercentage / 100; results["wastageMultiplier"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["wastageMultiplier"] = 0; }
  try { const v = (asFormulaNumber(results["netBricks"])) * (asFormulaNumber(results["wastageMultiplier"])); results["grossBricks"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["grossBricks"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBrick_calculator(input: Brick_calculatorInput): Brick_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["grossBricks"]);
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


export interface Brick_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
