// Auto-generated from korean-calendar-calculator-schema.json
import * as z from 'zod';

export interface Korean_calendar_calculatorInput {
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  currentYear: number;
  currentMonth: number;
  currentDay: number;
  dataConfidence?: number;
}

export const Korean_calendar_calculatorInputSchema = z.object({
  birthYear: z.number().default(1990),
  birthMonth: z.number().default(1),
  birthDay: z.number().default(1),
  currentYear: z.number().default(2025),
  currentMonth: z.number().default(6),
  currentDay: z.number().default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Korean_calendar_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentYear - input.birthYear + 1; results["koreanAge"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["koreanAge"] = Number.NaN; }
  try { const v = (input.currentYear - input.birthYear) - ( (input.currentMonth < input.birthMonth || (input.currentMonth == input.birthMonth && input.currentDay < input.birthDay)) ? 1 : 0 ); results["internationalAge"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["internationalAge"] = Number.NaN; }
  try { const v = input.currentYear + 2333; results["dangiYear"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dangiYear"] = Number.NaN; }
  return results;
}


export function calculateKorean_calendar_calculator(input: Korean_calendar_calculatorInput): Korean_calendar_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["koreanAge"]);
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


export interface Korean_calendar_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
