// Auto-generated from spf-calculator-schema.json
import * as z from 'zod';

export interface Spf_calculatorInput {
  fuelMassFlow: number;
  powerOutput: number;
  carbonContent: number;
  oxidationFactor: number;
}

export const Spf_calculatorInputSchema = z.object({
  fuelMassFlow: z.number().default(200),
  powerOutput: z.number().default(1000),
  carbonContent: z.number().default(0.86),
  oxidationFactor: z.number().default(0.99),
});

function evaluateAllFormulas(input: Spf_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fuelMassFlow * 1000 / input.powerOutput; results["sfc"] = Number.isFinite(v) ? v : 0; } catch { results["sfc"] = 0; }
  try { const v = input.fuelMassFlow * input.carbonContent * input.oxidationFactor * (44/12); results["co2Emissions"] = Number.isFinite(v) ? v : 0; } catch { results["co2Emissions"] = 0; }
  return results;
}


export function calculateSpf_calculator(input: Spf_calculatorInput): Spf_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["sfc"] ?? 0;
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


export interface Spf_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
