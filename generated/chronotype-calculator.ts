// Auto-generated from chronotype-calculator-schema.json
import * as z from 'zod';

export interface Chronotype_calculatorInput {
  workdayBedtime: number;
  workdayWaketime: number;
  freeDayBedtime: number;
  freeDayWaketime: number;
  dataConfidence?: number;
}

export const Chronotype_calculatorInputSchema = z.object({
  workdayBedtime: z.number().default(23),
  workdayWaketime: z.number().default(7),
  freeDayBedtime: z.number().default(0),
  freeDayWaketime: z.number().default(8),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Chronotype_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.workdayWaketime >= input.workdayBedtime ? input.workdayWaketime - input.workdayBedtime : (input.workdayWaketime + 24) - input.workdayBedtime; results["workdaySleep"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["workdaySleep"] = 0; }
  try { const v = input.freeDayWaketime >= input.freeDayBedtime ? input.freeDayWaketime - input.freeDayBedtime : (input.freeDayWaketime + 24) - input.freeDayBedtime; results["freeDaySleep"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["freeDaySleep"] = 0; }
  try { const v = (input.freeDayBedtime + (asFormulaNumber(results["freeDaySleep"])) / 2) % 24; results["msf"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["msf"] = 0; }
  try { const v = ((asFormulaNumber(results["workdaySleep"])) + (asFormulaNumber(results["freeDaySleep"]))) / 2; results["avgSleep"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["avgSleep"] = 0; }
  try { const v = ((asFormulaNumber(results["freeDaySleep"])) - (asFormulaNumber(results["avgSleep"]))) / 2; results["sleepDebt"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sleepDebt"] = 0; }
  try { const v = (((asFormulaNumber(results["msf"])) - (asFormulaNumber(results["sleepDebt"]))) % 24 + 24) % 24; results["chronotype"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["chronotype"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateChronotype_calculator(input: Chronotype_calculatorInput): Chronotype_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["chronotype"]);
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


export interface Chronotype_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
