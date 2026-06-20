// Auto-generated from cat-years-calculator-schema.json
import * as z from 'zod';

export interface Cat_years_calculatorInput {
  catAgeYears: number;
  catAgeMonths: number;
  catWeightKg: number;
  indoor: number;
  dataConfidence?: number;
}

export const Cat_years_calculatorInputSchema = z.object({
  catAgeYears: z.number().default(0),
  catAgeMonths: z.number().default(0),
  catWeightKg: z.number().default(4.5),
  indoor: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cat_years_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.catAgeYears + input.catAgeMonths / 12; results["totalAgeYears"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalAgeYears"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["totalAgeYears"])) <= 1) ? 15 * (toNumericFormulaValue(results["totalAgeYears"])) : ((toNumericFormulaValue(results["totalAgeYears"])) <= 2) ? 15 + 9 * ((toNumericFormulaValue(results["totalAgeYears"])) - 1) : 24 + 4 * ((toNumericFormulaValue(results["totalAgeYears"])) - 2); results["baseHuman"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["baseHuman"] = Number.NaN; }
  try { const v = 1 + 0.02 * (input.catWeightKg - 4.5); results["weightFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["weightFactor"] = Number.NaN; }
  try { const v = input.indoor === 0 ? 1.1 : 1.0; results["indoorFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["indoorFactor"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["baseHuman"])) * (toNumericFormulaValue(results["weightFactor"])) * (toNumericFormulaValue(results["indoorFactor"])); results["finalHumanYears"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["finalHumanYears"] = Number.NaN; }
  return results;
}


export function calculateCat_years_calculator(input: Cat_years_calculatorInput): Cat_years_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["finalHumanYears"]);
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


export interface Cat_years_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
