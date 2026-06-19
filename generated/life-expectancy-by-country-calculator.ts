// Auto-generated from life-expectancy-by-country-calculator-schema.json
import * as z from 'zod';

export interface Life_expectancy_by_country_calculatorInput {
  currentAge: number;
  gender: number;
  countryLifeExpectancy: number;
  healthFactor: number;
  dataConfidence?: number;
}

export const Life_expectancy_by_country_calculatorInputSchema = z.object({
  currentAge: z.number().default(30),
  gender: z.number().default(0),
  countryLifeExpectancy: z.number().default(75),
  healthFactor: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Life_expectancy_by_country_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.countryLifeExpectancy - input.currentAge; results["adjustedLifeExpectancy"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustedLifeExpectancy"] = 0; }
  try { const v = input.gender === 1 ? 5 : 0; results["genderAdjustment"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["genderAdjustment"] = 0; }
  try { const v = input.healthFactor; results["healthMultiplier"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["healthMultiplier"] = 0; }
  try { const v = ((asFormulaNumber(results["adjustedLifeExpectancy"])) + (asFormulaNumber(results["genderAdjustment"]))) * (asFormulaNumber(results["healthMultiplier"])); results["remainingLifeExpectancy"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["remainingLifeExpectancy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateLife_expectancy_by_country_calculator(input: Life_expectancy_by_country_calculatorInput): Life_expectancy_by_country_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["remainingLifeExpectancy"]);
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


export interface Life_expectancy_by_country_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
