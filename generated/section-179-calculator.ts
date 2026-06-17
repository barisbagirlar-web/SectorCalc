// @ts-nocheck
// Auto-generated from section-179-calculator-schema.json
import * as z from 'zod';

export interface Section_179_calculatorInput {
  assetCost: number;
  businessUsePercent: number;
  section179Limit: number;
  phaseOutThreshold: number;
  totalAssetAdditions: number;
}

export const Section_179_calculatorInputSchema = z.object({
  assetCost: z.number().default(50000),
  businessUsePercent: z.number().default(100),
  section179Limit: z.number().default(1220000),
  phaseOutThreshold: z.number().default(3050000),
  totalAssetAdditions: z.number().default(50000),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Section_179_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.assetCost + input.businessUsePercent + input.section179Limit; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.assetCost + input.businessUsePercent + input.section179Limit; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSection_179_calculator(input: Section_179_calculatorInput): Section_179_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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


export interface Section_179_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
