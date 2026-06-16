// Auto-generated from half-birthday-calculator-schema.json
import * as z from 'zod';

export interface Half_birthday_calculatorInput {
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  monthOffset: number;
}

export const Half_birthday_calculatorInputSchema = z.object({
  birthDay: z.number().default(1),
  birthMonth: z.number().default(1),
  birthYear: z.number().default(2000),
  monthOffset: z.number().default(6),
});

function evaluateAllFormulas(input: Half_birthday_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.birthMonth + input.monthOffset - 1; results["totalMonths"] = Number.isFinite(v) ? v : 0; } catch { results["totalMonths"] = 0; }
  try { const v = Math.floor((results["totalMonths"] ?? 0) / 12); results["yearOffset"] = Number.isFinite(v) ? v : 0; } catch { results["yearOffset"] = 0; }
  try { const v = input.birthYear + (results["yearOffset"] ?? 0); results["newYear"] = Number.isFinite(v) ? v : 0; } catch { results["newYear"] = 0; }
  try { const v = (results["totalMonths"] ?? 0) % 12; results["newMonthRaw"] = Number.isFinite(v) ? v : 0; } catch { results["newMonthRaw"] = 0; }
  try { const v = (results["newMonthRaw"] ?? 0) + 1; results["newMonth"] = Number.isFinite(v) ? v : 0; } catch { results["newMonth"] = 0; }
  try { const v = ((results["newYear"] ?? 0) % 4 == 0 && (results["newYear"] ?? 0) % 100 != 0) || ((results["newYear"] ?? 0) % 400 == 0); results["isLeap"] = Number.isFinite(v) ? v : 0; } catch { results["isLeap"] = 0; }
  results["daysInMonth"] = 0;
  try { const v = (results["daysInMonth"] ?? 0); results["maxDay"] = Number.isFinite(v) ? v : 0; } catch { results["maxDay"] = 0; }
  try { const v = Math.min(input.birthDay, (results["maxDay"] ?? 0)); results["newDay"] = Number.isFinite(v) ? v : 0; } catch { results["newDay"] = 0; }
  try { const v = ('' + (results["newYear"] ?? 0)) + '-' + ((results["newMonth"] ?? 0) < 10 ? '0' + (results["newMonth"] ?? 0) : '' + (results["newMonth"] ?? 0)) + '-' + ((results["newDay"] ?? 0) < 10 ? '0' + (results["newDay"] ?? 0) : '' + (results["newDay"] ?? 0)); results["dateString"] = Number.isFinite(v) ? v : 0; } catch { results["dateString"] = 0; }
  return results;
}


export function calculateHalf_birthday_calculator(input: Half_birthday_calculatorInput): Half_birthday_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["dateString"] ?? 0;
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


export interface Half_birthday_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
