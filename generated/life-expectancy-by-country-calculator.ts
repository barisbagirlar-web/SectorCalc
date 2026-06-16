// Auto-generated from life-expectancy-by-country-calculator-schema.json
import * as z from 'zod';

export interface Life_expectancy_by_country_calculatorInput {
  currentAge: number;
  gender: number;
  countryLifeExpectancy: number;
  healthFactor: number;
}

export const Life_expectancy_by_country_calculatorInputSchema = z.object({
  currentAge: z.number().default(30),
  gender: z.number().default(0),
  countryLifeExpectancy: z.number().default(75),
  healthFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Life_expectancy_by_country_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.countryLifeExpectancy - input.currentAge; results["adjustedLifeExpectancy"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedLifeExpectancy"] = 0; }
  try { const v = input.gender === 1 ? 5 : 0; results["genderAdjustment"] = Number.isFinite(v) ? v : 0; } catch { results["genderAdjustment"] = 0; }
  try { const v = input.healthFactor; results["healthMultiplier"] = Number.isFinite(v) ? v : 0; } catch { results["healthMultiplier"] = 0; }
  try { const v = ((results["adjustedLifeExpectancy"] ?? 0) + (results["genderAdjustment"] ?? 0)) * (results["healthMultiplier"] ?? 0); results["remainingLifeExpectancy"] = Number.isFinite(v) ? v : 0; } catch { results["remainingLifeExpectancy"] = 0; }
  return results;
}


export function calculateLife_expectancy_by_country_calculator(input: Life_expectancy_by_country_calculatorInput): Life_expectancy_by_country_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["remainingLifeExpectancy"] ?? 0;
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


export interface Life_expectancy_by_country_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
