// Auto-generated from healthy-life-years-calculator-schema.json
import * as z from 'zod';

export interface Healthy_life_years_calculatorInput {
  life_expectancy: number;
  severe_prevalence: number;
  moderate_prevalence: number;
  severe_weight: number;
  moderate_weight: number;
  dataConfidence?: number;
}

export const Healthy_life_years_calculatorInputSchema = z.object({
  life_expectancy: z.number().default(73),
  severe_prevalence: z.number().default(0.1),
  moderate_prevalence: z.number().default(0.15),
  severe_weight: z.number().default(0.7),
  moderate_weight: z.number().default(0.3),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Healthy_life_years_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.life_expectancy * (1 - (input.severe_prevalence * input.severe_weight + input.moderate_prevalence * input.moderate_weight)); results["healthy_life_years"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["healthy_life_years"] = Number.NaN; }
  try { const v = input.life_expectancy; results["total_life_expectancy"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total_life_expectancy"] = Number.NaN; }
  try { const v = input.life_expectancy * (input.severe_prevalence * input.severe_weight + input.moderate_prevalence * input.moderate_weight); results["unhealthy_years"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["unhealthy_years"] = Number.NaN; }
  return results;
}


export function calculateHealthy_life_years_calculator(input: Healthy_life_years_calculatorInput): Healthy_life_years_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["healthy_life_years"]);
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


export interface Healthy_life_years_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
