// Auto-generated from beard-growth-calculator-schema.json
import * as z from 'zod';

export interface Beard_growth_calculatorInput {
  current_length: number;
  desired_length: number;
  growth_rate: number;
  resting_days: number;
  genetic_factor: number;
  dataConfidence?: number;
}

export const Beard_growth_calculatorInputSchema = z.object({
  current_length: z.number().default(5),
  desired_length: z.number().default(30),
  growth_rate: z.number().default(0.4),
  resting_days: z.number().default(2),
  genetic_factor: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Beard_growth_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.desired_length - input.current_length; results["lengthNeeded"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["lengthNeeded"] = 0; }
  try { const v = (asFormulaNumber(results["lengthNeeded"])) / (input.growth_rate * input.genetic_factor); results["daysRequired"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["daysRequired"] = 0; }
  try { const v = (asFormulaNumber(results["daysRequired"])) / 30.44; results["monthsRequired"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["monthsRequired"] = 0; }
  try { const v = (30 - input.resting_days) * input.growth_rate * input.genetic_factor; results["monthlyGrowth"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["monthlyGrowth"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBeard_growth_calculator(input: Beard_growth_calculatorInput): Beard_growth_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["daysRequired"]);
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


export interface Beard_growth_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
