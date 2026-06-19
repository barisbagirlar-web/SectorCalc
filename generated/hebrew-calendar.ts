// Auto-generated from hebrew-calendar-schema.json
import * as z from 'zod';

export interface Hebrew_calendarInput {
  gregorianYear: number;
  gregorianMonth: number;
  gregorianDay: number;
  hebrewYear: number;
  hebrewMonth: number;
  hebrewDay: number;
  dataConfidence?: number;
}

export const Hebrew_calendarInputSchema = z.object({
  gregorianYear: z.number().default(2025),
  gregorianMonth: z.number().default(1),
  gregorianDay: z.number().default(1),
  hebrewYear: z.number().default(5785),
  hebrewMonth: z.number().default(1),
  hebrewDay: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Hebrew_calendarInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.hebrewYear - 3761; results["gregorianYearFromHebrew"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["gregorianYearFromHebrew"] = 0; }
  try { const v = input.hebrewYear % 19 < 7 ? 354 : 384; results["daysInHebrewYear"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["daysInHebrewYear"] = 0; }
  try { const v = input.hebrewYear % 19 === 0 || input.hebrewYear % 19 === 3 || input.hebrewYear % 19 === 6 || input.hebrewYear % 19 === 8 || input.hebrewYear % 19 === 11 || input.hebrewYear % 19 === 14 || input.hebrewYear % 19 === 17 ? 1 : 0; results["isLeapYear"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["isLeapYear"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHebrew_calendar(input: Hebrew_calendarInput): Hebrew_calendarOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["isLeapYear"]);
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


export interface Hebrew_calendarOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
