// Auto-generated from chinese-zodiac-calculator-schema.json
import * as z from 'zod';

export interface Chinese_zodiac_calculatorInput {
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
}

export const Chinese_zodiac_calculatorInputSchema = z.object({
  birthYear: z.number().default(2000),
  birthMonth: z.number().default(1),
  birthDay: z.number().default(1),
  birthHour: z.number().default(0),
});

function evaluateAllFormulas(input: Chinese_zodiac_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.birthYear - 4) % 12 + 12) % 12; results["zodiacIndex"] = Number.isFinite(v) ? v : 0; } catch { results["zodiacIndex"] = 0; }
  try { const v = Math.floor((((input.birthYear - 4) % 10 + 10) % 10) / 2); results["elementIndex"] = Number.isFinite(v) ? v : 0; } catch { results["elementIndex"] = 0; }
  try { const v = $(results["zodiacIndex"] ?? 0); results["__zodiacIndex_"] = Number.isFinite(v) ? v : 0; } catch { results["__zodiacIndex_"] = 0; }
  try { const v = $(results["elementIndex"] ?? 0); results["__elementIndex_"] = Number.isFinite(v) ? v : 0; } catch { results["__elementIndex_"] = 0; }
  return results;
}


export function calculateChinese_zodiac_calculator(input: Chinese_zodiac_calculatorInput): Chinese_zodiac_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["zodiacIndex"] ?? 0;
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


export interface Chinese_zodiac_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
