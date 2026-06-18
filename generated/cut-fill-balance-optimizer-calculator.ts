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
  try { const v = input.swellFactor * input.unitHaulCost; results["base_cost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.swellFactor * input.unitHaulCost; results["adjusted_cost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.swellFactor * input.unitHaulCost * 1 * (input.cutVolume * input.fillVolume); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.cutVolume; results["factor_cutVolume"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["factor_cutVolume"] = 0; }
  try { const v = input.fillVolume; results["factor_fillVolume"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["factor_fillVolume"] = 0; }
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
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
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
