// Auto-generated from kpa-to-psi-calculator-schema.json
import * as z from 'zod';

export interface Kpa_to_psi_calculatorInput {
  pressureKpa: number;
  conversionFactor: number;
  precision: number;
  offset: number;
}

export const Kpa_to_psi_calculatorInputSchema = z.object({
  pressureKpa: z.number().default(100),
  conversionFactor: z.number().default(0.1450377377),
  precision: z.number().default(2),
  offset: z.number().default(0),
});

function evaluateAllFormulas(input: Kpa_to_psi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.pressureKpa * input.conversionFactor + input.offset; results["psi"] = Number.isFinite(v) ? v : 0; } catch { results["psi"] = 0; }
  try { const v = Math.round((results["psi"] ?? 0) * Math.pow(10, input.precision)) / Math.pow(10, input.precision); results["psiRounded"] = Number.isFinite(v) ? v : 0; } catch { results["psiRounded"] = 0; }
  return results;
}


export function calculateKpa_to_psi_calculator(input: Kpa_to_psi_calculatorInput): Kpa_to_psi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["psiRounded"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
