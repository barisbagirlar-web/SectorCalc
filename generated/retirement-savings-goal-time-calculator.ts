// Auto-generated from retirement-savings-goal-time-calculator-schema.json
import * as z from 'zod';

export interface Retirement_savings_goal_time_calculatorInput {
  hedefPortfoy: number;
  mevcutBirikim: number;
  aylikKatki: number;
  faiz: number;
  dataConfidence?: number;
}

export const Retirement_savings_goal_time_calculatorInputSchema = z.object({
  hedefPortfoy: z.number().min(0).default(3000000),
  mevcutBirikim: z.number().min(0).default(200000),
  aylikKatki: z.number().min(0).default(5000),
  faiz: z.number().min(0).default(8),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Retirement_savings_goal_time_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = -Math.log(Math.max(0.0001, (input.hedefPortfoy * (input.faiz / 1200) + input.aylikKatki) / (input.mevcutBirikim * (input.faiz / 1200) + input.aylikKatki))) / Math.log(Math.max(0.0001, 1 + (input.faiz / 1200))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateRetirement_savings_goal_time_calculator(input: Retirement_savings_goal_time_calculatorInput): Retirement_savings_goal_time_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review insurance coverage annually.","Consult a retirement planner for personalized strategy."];
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
    unit: "months",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Retirement_savings_goal_time_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Retirement_savings_goal_time_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "months",
  breakdownKeys: ["sonuc"],
} as const;

