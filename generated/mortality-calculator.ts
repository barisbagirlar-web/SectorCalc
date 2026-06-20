// Auto-generated from mortality-calculator-schema.json
import * as z from 'zod';

export interface Mortality_calculatorInput {
  deaths: number;
  population: number;
  period: number;
  multiplier: number;
  dataConfidence?: number;
}

export const Mortality_calculatorInputSchema = z.object({
  deaths: z.number().default(0),
  population: z.number().default(100000),
  period: z.number().default(1),
  multiplier: z.number().default(100000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Mortality_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.population * input.period; results["personYears"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["personYears"] = Number.NaN; }
  try { const v = input.deaths / (input.population * input.period); results["crudeRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["crudeRate"] = Number.NaN; }
  try { const v = (input.deaths / (input.population * input.period)) * input.multiplier; results["mortalityRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["mortalityRate"] = Number.NaN; }
  return results;
}


export function calculateMortality_calculator(input: Mortality_calculatorInput): Mortality_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["mortalityRate"]);
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


export interface Mortality_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
