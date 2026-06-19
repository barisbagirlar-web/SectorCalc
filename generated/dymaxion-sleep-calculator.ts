// Auto-generated from dymaxion-sleep-calculator-schema.json
import * as z from 'zod';

export interface Dymaxion_sleep_calculatorInput {
  napDurationMinutes: number;
  intervalHours: number;
  totalDays: number;
  baseSleepHours: number;
  dataConfidence?: number;
}

export const Dymaxion_sleep_calculatorInputSchema = z.object({
  napDurationMinutes: z.number().default(30),
  intervalHours: z.number().default(6),
  totalDays: z.number().default(7),
  baseSleepHours: z.number().default(8),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Dymaxion_sleep_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 24 / input.intervalHours; results["napsPerDay"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["napsPerDay"] = 0; }
  try { const v = (asFormulaNumber(results["napsPerDay"])) * input.totalDays; results["totalNaps"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalNaps"] = 0; }
  try { const v = (asFormulaNumber(results["totalNaps"])) * input.napDurationMinutes; results["totalSleepMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalSleepMinutes"] = 0; }
  try { const v = (asFormulaNumber(results["totalSleepMinutes"])) / 60; results["totalSleepHours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalSleepHours"] = 0; }
  try { const v = ((asFormulaNumber(results["totalSleepMinutes"])) / (input.baseSleepHours * 60)) * 100; results["efficiencyPercent"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["efficiencyPercent"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDymaxion_sleep_calculator(input: Dymaxion_sleep_calculatorInput): Dymaxion_sleep_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["efficiencyPercent"]);
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


export interface Dymaxion_sleep_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
