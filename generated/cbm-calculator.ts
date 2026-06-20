// Auto-generated from cbm-calculator-schema.json
import * as z from 'zod';

export interface Cbm_calculatorInput {
  length: number;
  width: number;
  height: number;
  quantity: number;
  dataConfidence?: number;
}

export const Cbm_calculatorInputSchema = z.object({
  length: z.number().default(100),
  width: z.number().default(100),
  height: z.number().default(100),
  quantity: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cbm_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.length * input.width * input.height) / 1000000; results["volume_per_item_m3"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["volume_per_item_m3"] = Number.NaN; }
  try { const v = (input.length * input.width * input.height) / 1000000 * input.quantity; results["total_cbm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total_cbm"] = Number.NaN; }
  return results;
}


export function calculateCbm_calculator(input: Cbm_calculatorInput): Cbm_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["total_cbm"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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


export interface Cbm_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
