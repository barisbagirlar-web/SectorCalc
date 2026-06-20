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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Earth_overshoot_day_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.globalPopulation * input.perCapitaBiocapacity; results["totalBiocapacity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalBiocapacity"] = Number.NaN; }
  try { const v = input.globalPopulation * input.perCapitaFootprint; results["totalFootprint"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalFootprint"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalFootprint"])) / (toNumericFormulaValue(results["totalBiocapacity"])); results["excessEarths"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["excessEarths"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["totalBiocapacity"])) / (toNumericFormulaValue(results["totalFootprint"]))) * 365; results["overshootDayFloat"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["overshootDayFloat"] = Number.NaN; }
  return results;
}


export function calculateEarth_overshoot_day_calculator(input: Earth_overshoot_day_calculatorInput): Earth_overshoot_day_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["overshootDayFloat"]);
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


export interface Earth_overshoot_day_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
