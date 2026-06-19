// Auto-generated from kpa-to-psi-calculator-schema.json
import * as z from 'zod';

export interface Kpa_to_psi_calculatorInput {
  pressureKpa: number;
  conversionFactor: number;
  precision: number;
  offset: number;
  dataConfidence?: number;
}

export const Kpa_to_psi_calculatorInputSchema = z.object({
  pressureKpa: z.number().default(100),
  conversionFactor: z.number().default(0.1450377377),
  precision: z.number().default(2),
  offset: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Kpa_to_psi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.pressureKpa * input.conversionFactor + input.offset; results["psi"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["psi"] = 0; }
  try { const v = input.pressureKpa * input.conversionFactor + input.offset; results["psi_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["psi_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateKpa_to_psi_calculator(input: Kpa_to_psi_calculatorInput): Kpa_to_psi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["psi_aux"]));
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


export interface Kpa_to_psi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
