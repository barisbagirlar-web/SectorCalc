// Auto-generated from lbtt-calculator-scotland-schema.json
import * as z from 'zod';

export interface Lbtt_calculator_scotlandInput {
  purchasePrice: number;
  isFirstTimeBuyer: number;
  isAdditionalDwelling: number;
  dataConfidence?: number;
}

export const Lbtt_calculator_scotlandInputSchema = z.object({
  purchasePrice: z.number().default(0),
  isFirstTimeBuyer: z.number().default(0),
  isAdditionalDwelling: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Lbtt_calculator_scotlandInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.isFirstTimeBuyer * input.purchasePrice; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["base_cost"] = Number.NaN; }
  try { const v = input.isFirstTimeBuyer * input.purchasePrice; results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjusted_cost"] = Number.NaN; }
  try { const v = input.isFirstTimeBuyer * input.purchasePrice; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateLbtt_calculator_scotland(input: Lbtt_calculator_scotlandInput): Lbtt_calculator_scotlandOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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


export interface Lbtt_calculator_scotlandOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
