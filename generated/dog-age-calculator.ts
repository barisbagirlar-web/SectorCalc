// Auto-generated from dog-age-calculator-schema.json
import * as z from 'zod';

export interface Dog_age_calculatorInput {
  dogAgeYears: number;
  dogAgeMonths: number;
  sizeCategory: number;
  conversionModel: number;
}

export const Dog_age_calculatorInputSchema = z.object({
  dogAgeYears: z.number().default(1),
  dogAgeMonths: z.number().default(0),
  sizeCategory: z.number().default(2),
  conversionModel: z.number().default(2),
});

function evaluateAllFormulas(input: Dog_age_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dogAgeYears + input.dogAgeMonths / 12; results["totalHumanAge"] = Number.isFinite(v) ? v : 0; } catch { results["totalHumanAge"] = 0; }
  try { const v = input.sizeCategory == 1 ? 4 : (input.sizeCategory == 2 ? 5 : 6); results["sizeMultiplier"] = Number.isFinite(v) ? v : 0; } catch { results["sizeMultiplier"] = 0; }
  try { const v = (results["totalHumanAge"] ?? 0) * 7; results["dogYearsTraditional"] = Number.isFinite(v) ? v : 0; } catch { results["dogYearsTraditional"] = 0; }
  try { const v = (results["totalHumanAge"] ?? 0) <= 1 ? (results["totalHumanAge"] ?? 0) * 15 : ((results["totalHumanAge"] ?? 0) <= 2 ? 15 + ((results["totalHumanAge"] ?? 0) - 1) * 9 : 24 + ((results["totalHumanAge"] ?? 0) - 2) * (results["sizeMultiplier"] ?? 0)); results["dogYearsAdjusted"] = Number.isFinite(v) ? v : 0; } catch { results["dogYearsAdjusted"] = 0; }
  try { const v = input.conversionModel == 1 ? (results["dogYearsTraditional"] ?? 0) : (results["dogYearsAdjusted"] ?? 0); results["dogYears"] = Number.isFinite(v) ? v : 0; } catch { results["dogYears"] = 0; }
  return results;
}


export function calculateDog_age_calculator(input: Dog_age_calculatorInput): Dog_age_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["dogYears"] ?? 0;
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


export interface Dog_age_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
