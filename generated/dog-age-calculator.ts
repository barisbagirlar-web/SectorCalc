// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Dog_age_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.dogAgeYears + input.dogAgeMonths / 12; results["totalHumanAge"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalHumanAge"] = 0; }
  try { const v = input.sizeCategory == 1 ? 4 : (input.sizeCategory == 2 ? 5 : 6); results["sizeMultiplier"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["sizeMultiplier"] = 0; }
  try { const v = (asFormulaNumber(results["totalHumanAge"])) * 7; results["dogYearsTraditional"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["dogYearsTraditional"] = 0; }
  try { const v = (asFormulaNumber(results["totalHumanAge"])) <= 1 ? (asFormulaNumber(results["totalHumanAge"])) * 15 : ((asFormulaNumber(results["totalHumanAge"])) <= 2 ? 15 + ((asFormulaNumber(results["totalHumanAge"])) - 1) * 9 : 24 + ((asFormulaNumber(results["totalHumanAge"])) - 2) * (asFormulaNumber(results["sizeMultiplier"]))); results["dogYearsAdjusted"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["dogYearsAdjusted"] = 0; }
  try { const v = input.conversionModel == 1 ? (asFormulaNumber(results["dogYearsTraditional"])) : (asFormulaNumber(results["dogYearsAdjusted"])); results["dogYears"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["dogYears"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateDog_age_calculator(input: Dog_age_calculatorInput): Dog_age_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["dogYears"]);
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


export interface Dog_age_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
