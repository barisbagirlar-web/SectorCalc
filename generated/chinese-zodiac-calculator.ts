// Auto-generated from chinese-zodiac-calculator-schema.json
import * as z from 'zod';

export interface Chinese_zodiac_calculatorInput {
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  dataConfidence?: number;
}

export const Chinese_zodiac_calculatorInputSchema = z.object({
  birthYear: z.number().default(2000),
  birthMonth: z.number().default(1),
  birthDay: z.number().default(1),
  birthHour: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Chinese_zodiac_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.birthYear - 4) % 12 + 12) % 12; results["zodiacIndex"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["zodiacIndex"] = 0; }
  try { const v = ((input.birthYear - 4) % 10 + 10) % 10; results["elementIndex"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["elementIndex"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateChinese_zodiac_calculator(input: Chinese_zodiac_calculatorInput): Chinese_zodiac_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["zodiacIndex"]);
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


export interface Chinese_zodiac_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
