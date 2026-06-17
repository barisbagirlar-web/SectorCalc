// @ts-nocheck
// Auto-generated from healthy-life-years-calculator-schema.json
import * as z from 'zod';

export interface Healthy_life_years_calculatorInput {
  life_expectancy: number;
  severe_prevalence: number;
  moderate_prevalence: number;
  severe_weight: number;
  moderate_weight: number;
}

export const Healthy_life_years_calculatorInputSchema = z.object({
  life_expectancy: z.number().default(73),
  severe_prevalence: z.number().default(0.1),
  moderate_prevalence: z.number().default(0.15),
  severe_weight: z.number().default(0.7),
  moderate_weight: z.number().default(0.3),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Healthy_life_years_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.life_expectancy * (1 - (input.severe_prevalence * input.severe_weight + input.moderate_prevalence * input.moderate_weight)); results["healthy_life_years"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["healthy_life_years"] = 0; }
  try { const v = input.life_expectancy; results["total_life_expectancy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["total_life_expectancy"] = 0; }
  try { const v = input.life_expectancy * (input.severe_prevalence * input.severe_weight + input.moderate_prevalence * input.moderate_weight); results["unhealthy_years"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["unhealthy_years"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateHealthy_life_years_calculator(input: Healthy_life_years_calculatorInput): Healthy_life_years_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["healthy_life_years"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
