// @ts-nocheck
// Auto-generated from ice-cream-calculator-schema.json
import * as z from 'zod';

export interface Ice_cream_calculatorInput {
  batchMixVolume: number;
  overrunPercent: number;
  mixCostPerLiter: number;
  packagingCostPerLiter: number;
  otherCostsPerBatch: number;
  desiredProfitMarginPercent: number;
}

export const Ice_cream_calculatorInputSchema = z.object({
  batchMixVolume: z.number().default(100),
  overrunPercent: z.number().default(50),
  mixCostPerLiter: z.number().default(2.5),
  packagingCostPerLiter: z.number().default(0.5),
  otherCostsPerBatch: z.number().default(50),
  desiredProfitMarginPercent: z.number().default(30),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ice_cream_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.batchMixVolume * input.mixCostPerLiter; results["base_cost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.batchMixVolume * input.mixCostPerLiter * (1 + (input.overrunPercent / 100)); results["adjusted_cost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.batchMixVolume * input.mixCostPerLiter * (1 + (input.overrunPercent / 100)); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateIce_cream_calculator(input: Ice_cream_calculatorInput): Ice_cream_calculatorOutput {
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
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Ice_cream_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
