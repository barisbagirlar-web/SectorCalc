// Auto-generated from acute-chronic-workload-ratio-calculator-schema.json
import * as z from 'zod';

export interface Acute_chronic_workload_ratio_calculatorInput {
  acuteLoad: number;
  acutePeriodDays: number;
  chronicLoad: number;
  chronicPeriodDays: number;
  acwrThreshold: number;
  dataConfidence?: number;
}

export const Acute_chronic_workload_ratio_calculatorInputSchema = z.object({
  acuteLoad: z.number().default(100),
  acutePeriodDays: z.number().default(7),
  chronicLoad: z.number().default(400),
  chronicPeriodDays: z.number().default(28),
  acwrThreshold: z.number().default(1.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Acute_chronic_workload_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.acuteLoad / input.acutePeriodDays; results["acuteDailyLoad"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["acuteDailyLoad"] = Number.NaN; }
  try { const v = input.chronicLoad / input.chronicPeriodDays; results["chronicDailyLoad"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["chronicDailyLoad"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["acuteDailyLoad"])) / (toNumericFormulaValue(results["chronicDailyLoad"])); results["acwr"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["acwr"] = Number.NaN; }
  return results;
}


export function calculateAcute_chronic_workload_ratio_calculator(input: Acute_chronic_workload_ratio_calculatorInput): Acute_chronic_workload_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["acuteDailyLoad"]);
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


export interface Acute_chronic_workload_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
