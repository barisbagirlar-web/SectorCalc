// Auto-generated from cat-years-calculator-schema.json
import * as z from 'zod';

export interface Cat_years_calculatorInput {
  catAgeYears: number;
  catAgeMonths: number;
  catWeightKg: number;
  indoor: number;
}

export const Cat_years_calculatorInputSchema = z.object({
  catAgeYears: z.number().default(0),
  catAgeMonths: z.number().default(0),
  catWeightKg: z.number().default(4.5),
  indoor: z.number().default(1),
});

function evaluateAllFormulas(input: Cat_years_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.catAgeYears + input.catAgeMonths / 12; results["totalAgeYears"] = Number.isFinite(v) ? v : 0; } catch { results["totalAgeYears"] = 0; }
  try { const v = ((results["totalAgeYears"] ?? 0) <= 1) ? 15 * (results["totalAgeYears"] ?? 0) : ((results["totalAgeYears"] ?? 0) <= 2) ? 15 + 9 * ((results["totalAgeYears"] ?? 0) - 1) : 24 + 4 * ((results["totalAgeYears"] ?? 0) - 2); results["baseHuman"] = Number.isFinite(v) ? v : 0; } catch { results["baseHuman"] = 0; }
  try { const v = 1 + 0.02 * (input.catWeightKg - 4.5); results["weightFactor"] = Number.isFinite(v) ? v : 0; } catch { results["weightFactor"] = 0; }
  try { const v = input.indoor === 0 ? 1.1 : 1.0; results["indoorFactor"] = Number.isFinite(v) ? v : 0; } catch { results["indoorFactor"] = 0; }
  try { const v = (results["baseHuman"] ?? 0) * (results["weightFactor"] ?? 0) * (results["indoorFactor"] ?? 0); results["finalHumanYears"] = Number.isFinite(v) ? v : 0; } catch { results["finalHumanYears"] = 0; }
  results["__baseHuman_toFixed_2__"] = 0;
  results["__weightFactor_toFixed_2__"] = 0;
  results["__indoorFactor_toFixed_2__"] = 0;
  results["__finalHumanYears_toFixed_1___years"] = 0;
  results["result"] = 0;
  return results;
}


export function calculateCat_years_calculator(input: Cat_years_calculatorInput): Cat_years_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
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


export interface Cat_years_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
