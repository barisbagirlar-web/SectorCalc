// @ts-nocheck
// Auto-generated from weight-distribution-schema.json
import * as z from 'zod';

export interface Weight_distributionInput {
  totalWeight: number;
  frontAxleDist: number;
  rearAxleDist: number;
  wheelbase: number;
}

export const Weight_distributionInputSchema = z.object({
  totalWeight: z.number().default(1000),
  frontAxleDist: z.number().default(2.5),
  rearAxleDist: z.number().default(1.5),
  wheelbase: z.number().default(4),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Weight_distributionInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.totalWeight * (input.rearAxleDist / input.wheelbase); results["frontAxleLoad"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["frontAxleLoad"] = 0; }
  try { const v = input.totalWeight * (input.frontAxleDist / input.wheelbase); results["rearAxleLoad"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rearAxleLoad"] = 0; }
  try { const v = ((asFormulaNumber(results["frontAxleLoad"])) / input.totalWeight) * 100; results["frontAxlePercent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["frontAxlePercent"] = 0; }
  try { const v = ((asFormulaNumber(results["rearAxleLoad"])) / input.totalWeight) * 100; results["rearAxlePercent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rearAxlePercent"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateWeight_distribution(input: Weight_distributionInput): Weight_distributionOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["frontAxleLoad"]);
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


export interface Weight_distributionOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
