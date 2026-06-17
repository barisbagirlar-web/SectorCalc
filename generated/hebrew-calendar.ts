// Auto-generated from hebrew-calendar-schema.json
import * as z from 'zod';

export interface Hebrew_calendarInput {
  gregorianYear: number;
  gregorianMonth: number;
  gregorianDay: number;
  hebrewYear: number;
  hebrewMonth: number;
  hebrewDay: number;
}

export const Hebrew_calendarInputSchema = z.object({
  gregorianYear: z.number().default(2025),
  gregorianMonth: z.number().default(1),
  gregorianDay: z.number().default(1),
  hebrewYear: z.number().default(5785),
  hebrewMonth: z.number().default(1),
  hebrewDay: z.number().default(1),
});

function evaluateAllFormulas(input: Hebrew_calendarInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.floor((3761 + input.gregorianYear) + (input.gregorianMonth > 9 ? 1 : 0)); results["hebrewYearFromGregorian"] = Number.isFinite(v) ? v : 0; } catch { results["hebrewYearFromGregorian"] = 0; }
  try { const v = input.hebrewYear - 3761; results["gregorianYearFromHebrew"] = Number.isFinite(v) ? v : 0; } catch { results["gregorianYearFromHebrew"] = 0; }
  try { const v = input.hebrewYear % 19 < 7 ? 354 : 384; results["daysInHebrewYear"] = Number.isFinite(v) ? v : 0; } catch { results["daysInHebrewYear"] = 0; }
  try { const v = input.hebrewYear % 19 === 0 || input.hebrewYear % 19 === 3 || input.hebrewYear % 19 === 6 || input.hebrewYear % 19 === 8 || input.hebrewYear % 19 === 11 || input.hebrewYear % 19 === 14 || input.hebrewYear % 19 === 17 ? 1 : 0; results["isLeapYear"] = Number.isFinite(v) ? v : 0; } catch { results["isLeapYear"] = 0; }
  try { const v = ['Tishrei','Cheshvan','Kislev','Tevet','Shevat','Adar','Nisan','Iyar','Sivan','Tammuz','Av','Elul'][input.hebrewMonth-1] || 'Invalid'; results["monthName"] = Number.isFinite(v) ? v : 0; } catch { results["monthName"] = 0; }
  try { const v = (results["gregorianYearFromHebrew"] ?? 0); results["_gregorianYearFromHebrew_"] = Number.isFinite(v) ? v : 0; } catch { results["_gregorianYearFromHebrew_"] = 0; }
  try { const v = (results["daysInHebrewYear"] ?? 0); results["_daysInHebrewYear_"] = Number.isFinite(v) ? v : 0; } catch { results["_daysInHebrewYear_"] = 0; }
  try { const v = (results["isLeapYear"] ?? 0); results["_isLeapYear_"] = Number.isFinite(v) ? v : 0; } catch { results["_isLeapYear_"] = 0; }
  try { const v = (results["monthName"] ?? 0); results["_monthName_"] = Number.isFinite(v) ? v : 0; } catch { results["_monthName_"] = 0; }
  return results;
}


export function calculateHebrew_calendar(input: Hebrew_calendarInput): Hebrew_calendarOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["hebrewYearFromGregorian"] ?? 0;
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


export interface Hebrew_calendarOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
