// Auto-generated from total-daily-energy-expenditure-calculator-schema.json
import * as z from 'zod';

export interface Total_daily_energy_expenditure_calculatorInput {
  bmr: number;
  aktiviteSeviyesi: number;
  dataConfidence?: number;
}

export const Total_daily_energy_expenditure_calculatorInputSchema = z.object({
  bmr: z.number().min(0).default(1650),
  aktiviteSeviyesi: z.number().min(1.2).max(2).default(1.55),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Total_daily_energy_expenditure_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.bmr * input.aktiviteSeviyesi; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateTotal_daily_energy_expenditure_calculator(input: Total_daily_energy_expenditure_calculatorInput): Total_daily_energy_expenditure_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Consult a healthcare professional before starting any diet or exercise program.","Individual results may vary."];
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
    unit: "kcal",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Total_daily_energy_expenditure_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Total_daily_energy_expenditure_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "kcal",
  breakdownKeys: ["sonuc"],
} as const;

