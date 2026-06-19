// Auto-generated from thanksgiving-calculator-schema.json
import * as z from 'zod';

export interface Thanksgiving_calculatorInput {
  adults: number;
  children: number;
  leftoverDays: number;
  adultWeight: number;
  childWeight: number;
  dataConfidence?: number;
}

export const Thanksgiving_calculatorInputSchema = z.object({
  adults: z.number().default(4),
  children: z.number().default(2),
  leftoverDays: z.number().default(1),
  adultWeight: z.number().default(1.5),
  childWeight: z.number().default(0.75),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Thanksgiving_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.adults * input.adultWeight + input.children * input.childWeight) * (1 + input.leftoverDays * 0.25); results["totalTurkeyWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalTurkeyWeight"] = 0; }
  try { const v = (asFormulaNumber(results["totalTurkeyWeight"])) * 15; results["cookingTimeMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["cookingTimeMinutes"] = 0; }
  try { const v = (input.adults + input.children) * (1 + input.leftoverDays * 0.5); results["estimatedServings"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["estimatedServings"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateThanksgiving_calculator(input: Thanksgiving_calculatorInput): Thanksgiving_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalTurkeyWeight"]));
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


export interface Thanksgiving_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
