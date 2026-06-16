// Auto-generated from chronotype-calculator-schema.json
import * as z from 'zod';

export interface Chronotype_calculatorInput {
  workdayBedtime: number;
  workdayWaketime: number;
  freeDayBedtime: number;
  freeDayWaketime: number;
}

export const Chronotype_calculatorInputSchema = z.object({
  workdayBedtime: z.number().default(23),
  workdayWaketime: z.number().default(7),
  freeDayBedtime: z.number().default(0),
  freeDayWaketime: z.number().default(8),
});

function evaluateAllFormulas(input: Chronotype_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.workdayWaketime >= input.workdayBedtime ? input.workdayWaketime - input.workdayBedtime : (input.workdayWaketime + 24) - input.workdayBedtime; results["workdaySleep"] = Number.isFinite(v) ? v : 0; } catch { results["workdaySleep"] = 0; }
  try { const v = input.freeDayWaketime >= input.freeDayBedtime ? input.freeDayWaketime - input.freeDayBedtime : (input.freeDayWaketime + 24) - input.freeDayBedtime; results["freeDaySleep"] = Number.isFinite(v) ? v : 0; } catch { results["freeDaySleep"] = 0; }
  try { const v = (input.freeDayBedtime + (results["freeDaySleep"] ?? 0) / 2) % 24; results["msf"] = Number.isFinite(v) ? v : 0; } catch { results["msf"] = 0; }
  try { const v = ((results["workdaySleep"] ?? 0) + (results["freeDaySleep"] ?? 0)) / 2; results["avgSleep"] = Number.isFinite(v) ? v : 0; } catch { results["avgSleep"] = 0; }
  try { const v = ((results["freeDaySleep"] ?? 0) - (results["avgSleep"] ?? 0)) / 2; results["sleepDebt"] = Number.isFinite(v) ? v : 0; } catch { results["sleepDebt"] = 0; }
  try { const v = (((results["msf"] ?? 0) - (results["sleepDebt"] ?? 0)) % 24 + 24) % 24; results["chronotype"] = Number.isFinite(v) ? v : 0; } catch { results["chronotype"] = 0; }
  return results;
}


export function calculateChronotype_calculator(input: Chronotype_calculatorInput): Chronotype_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["chronotype"] ?? 0;
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


export interface Chronotype_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
