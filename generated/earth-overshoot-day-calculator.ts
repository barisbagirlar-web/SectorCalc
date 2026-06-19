// Auto-generated from earth-overshoot-day-calculator-schema.json
import * as z from 'zod';

export interface Earth_overshoot_day_calculatorInput {
  globalPopulation: number;
  perCapitaBiocapacity: number;
  perCapitaFootprint: number;
  year: number;
  dataConfidence?: number;
}

export const Earth_overshoot_day_calculatorInputSchema = z.object({
  globalPopulation: z.number().default(7.9),
  perCapitaBiocapacity: z.number().default(1.6),
  perCapitaFootprint: z.number().default(2.7),
  year: z.number().default(2025),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Earth_overshoot_day_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.globalPopulation * input.perCapitaBiocapacity; results["totalBiocapacity"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalBiocapacity"] = 0; }
  try { const v = input.globalPopulation * input.perCapitaFootprint; results["totalFootprint"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalFootprint"] = 0; }
  try { const v = (asFormulaNumber(results["totalFootprint"])) / (asFormulaNumber(results["totalBiocapacity"])); results["excessEarths"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["excessEarths"] = 0; }
  try { const v = ((asFormulaNumber(results["totalBiocapacity"])) / (asFormulaNumber(results["totalFootprint"]))) * 365; results["overshootDayFloat"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["overshootDayFloat"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateEarth_overshoot_day_calculator(input: Earth_overshoot_day_calculatorInput): Earth_overshoot_day_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["overshootDayFloat"]));
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


export interface Earth_overshoot_day_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
