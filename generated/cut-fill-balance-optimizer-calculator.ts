// @ts-nocheck
// Auto-generated from cut-fill-balance-optimizer-calculator-schema.json
import * as z from 'zod';

export interface Cut_fill_balance_optimizer_calculatorInput {
  cutVolume: number;
  fillVolume: number;
  swellFactor: number;
  shrinkageFactor: number;
  haulDistance: number;
  unitHaulCost: number;
  wasteDisposalCost: number;
  borrowCost: number;
}

export const Cut_fill_balance_optimizer_calculatorInputSchema = z.object({
  cutVolume: z.number().min(0).max(1000000).default(10000),
  fillVolume: z.number().min(0).max(1000000).default(8000),
  swellFactor: z.number().min(1).max(1.5).default(1.25),
  shrinkageFactor: z.number().min(0.7).max(1).default(0.85),
  haulDistance: z.number().min(0.1).max(100).default(5),
  unitHaulCost: z.number().min(0.1).max(10).default(0.5),
  wasteDisposalCost: z.number().min(0).max(50).default(3),
  borrowCost: z.number().min(0).max(100).default(5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cut_fill_balance_optimizer_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.cutVolume + input.fillVolume + input.swellFactor; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.cutVolume + input.fillVolume + input.swellFactor; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCut_fill_balance_optimizer_calculator(input: Cut_fill_balance_optimizer_calculatorInput): Cut_fill_balance_optimizer_calculatorOutput {
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","Automated haul route optimization"],
  };
}


export interface Cut_fill_balance_optimizer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
