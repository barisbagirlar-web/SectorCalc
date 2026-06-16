// Auto-generated from sustainability-calculator-schema.json
import * as z from 'zod';

export interface Sustainability_calculatorInput {
  electricity: number;
  gas: number;
  fuel: number;
  waste: number;
}

export const Sustainability_calculatorInputSchema = z.object({
  electricity: z.number().default(3000),
  gas: z.number().default(1200),
  fuel: z.number().default(1000),
  waste: z.number().default(500),
});

function evaluateAllFormulas(input: Sustainability_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.electricity * 0.233 + input.gas * 2.02 + input.fuel * 2.31 + input.waste * 0.5; results["totalCO2"] = Number.isFinite(v) ? v : 0; } catch { results["totalCO2"] = 0; }
  try { const v = input.electricity * 0.233; results["electricityCO2"] = Number.isFinite(v) ? v : 0; } catch { results["electricityCO2"] = 0; }
  try { const v = input.gas * 2.02; results["gasCO2"] = Number.isFinite(v) ? v : 0; } catch { results["gasCO2"] = 0; }
  try { const v = input.fuel * 2.31; results["fuelCO2"] = Number.isFinite(v) ? v : 0; } catch { results["fuelCO2"] = 0; }
  try { const v = input.waste * 0.5; results["wasteCO2"] = Number.isFinite(v) ? v : 0; } catch { results["wasteCO2"] = 0; }
  return results;
}


export function calculateSustainability_calculator(input: Sustainability_calculatorInput): Sustainability_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCO2"] ?? 0;
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


export interface Sustainability_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
