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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ntu_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.slope_a * input.ntus_value + input.intercept_b) * input.dilution_factor; results["tss"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["tss"] = 0; }
  try { const v = (input.slope_a * input.ntus_value + input.intercept_b) * input.dilution_factor; results["tss_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["tss_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateNtu_calculator(input: Ntu_calculatorInput): Ntu_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["tss_aux"]));
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


export interface Ntu_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
