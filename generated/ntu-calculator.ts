// Auto-generated from ntu-calculator-schema.json
import * as z from 'zod';

export interface Ntu_calculatorInput {
  ntus_value: number;
  slope_a: number;
  intercept_b: number;
  dilution_factor: number;
  dataConfidence?: number;
}

export const Ntu_calculatorInputSchema = z.object({
  ntus_value: z.number().default(15),
  slope_a: z.number().default(2.1),
  intercept_b: z.number().default(3.2),
  dilution_factor: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ntu_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.slope_a * input.ntus_value + input.intercept_b) * input.dilution_factor; results["tss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tss"] = Number.NaN; }
  try { const v = (input.slope_a * input.ntus_value + input.intercept_b) * input.dilution_factor; results["tss_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tss_aux"] = Number.NaN; }
  return results;
}


export function calculateNtu_calculator(input: Ntu_calculatorInput): Ntu_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["tss_aux"]);
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


export interface Ntu_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
