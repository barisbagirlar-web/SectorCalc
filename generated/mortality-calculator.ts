// Auto-generated from mortality-calculator-schema.json
import * as z from 'zod';

export interface Mortality_calculatorInput {
  deaths: number;
  population: number;
  period: number;
  multiplier: number;
}

export const Mortality_calculatorInputSchema = z.object({
  deaths: z.number().default(0),
  population: z.number().default(100000),
  period: z.number().default(1),
  multiplier: z.number().default(100000),
});

function evaluateAllFormulas(input: Mortality_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.population * input.period; results["personYears"] = Number.isFinite(v) ? v : 0; } catch { results["personYears"] = 0; }
  try { const v = input.deaths / (input.population * input.period); results["crudeRate"] = Number.isFinite(v) ? v : 0; } catch { results["crudeRate"] = 0; }
  try { const v = (input.deaths / (input.population * input.period)) * input.multiplier; results["mortalityRate"] = Number.isFinite(v) ? v : 0; } catch { results["mortalityRate"] = 0; }
  return results;
}


export function calculateMortality_calculator(input: Mortality_calculatorInput): Mortality_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["mortalityRate"] ?? 0;
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


export interface Mortality_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
