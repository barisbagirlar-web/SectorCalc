// @ts-nocheck
// Auto-generated from square-rods-to-sqm-calculator-schema.json
import * as z from 'zod';

export interface Square_rods_to_sqm_calculatorInput {
  squareRods: number;
  conversionFactor: number;
  roundingDecimals: number;
  areaAdjustment: number;
}

export const Square_rods_to_sqm_calculatorInputSchema = z.object({
  squareRods: z.number().default(1),
  conversionFactor: z.number().default(25.29285264),
  roundingDecimals: z.number().default(2),
  areaAdjustment: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Square_rods_to_sqm_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.squareRods * input.conversionFactor; results["baseSqm"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["baseSqm"] = 0; }
  try { const v = (asFormulaNumber(results["baseSqm"])) * (1 + input.areaAdjustment / 100); results["adjustedSqm"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustedSqm"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSquare_rods_to_sqm_calculator(input: Square_rods_to_sqm_calculatorInput): Square_rods_to_sqm_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["adjustedSqm"]);
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


export interface Square_rods_to_sqm_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
