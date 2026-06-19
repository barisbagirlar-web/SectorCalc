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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cbm_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.length * input.width * input.height) / 1000000; results["volume_per_item_m3"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["volume_per_item_m3"] = 0; }
  try { const v = (input.length * input.width * input.height) / 1000000 * input.quantity; results["total_cbm"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["total_cbm"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCbm_calculator(input: Cbm_calculatorInput): Cbm_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["total_cbm"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
