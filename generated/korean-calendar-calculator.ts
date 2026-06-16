// Auto-generated from korean-calendar-calculator-schema.json
import * as z from 'zod';

export interface Korean_calendar_calculatorInput {
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  currentYear: number;
  currentMonth: number;
  currentDay: number;
}

export const Korean_calendar_calculatorInputSchema = z.object({
  birthYear: z.number().default(1990),
  birthMonth: z.number().default(1),
  birthDay: z.number().default(1),
  currentYear: z.number().default(2025),
  currentMonth: z.number().default(6),
  currentDay: z.number().default(10),
});

function evaluateAllFormulas(input: Korean_calendar_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentYear - input.birthYear + 1; results["koreanAge"] = Number.isFinite(v) ? v : 0; } catch { results["koreanAge"] = 0; }
  try { const v = (input.currentYear - input.birthYear) - ( (input.currentMonth < input.birthMonth || (input.currentMonth == input.birthMonth && input.currentDay < input.birthDay)) ? 1 : 0 ); results["internationalAge"] = Number.isFinite(v) ? v : 0; } catch { results["internationalAge"] = 0; }
  try { const v = input.currentYear + 2333; results["dangiYear"] = Number.isFinite(v) ? v : 0; } catch { results["dangiYear"] = 0; }
  return results;
}


export function calculateKorean_calendar_calculator(input: Korean_calendar_calculatorInput): Korean_calendar_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["koreanAge"] ?? 0;
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


export interface Korean_calendar_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
