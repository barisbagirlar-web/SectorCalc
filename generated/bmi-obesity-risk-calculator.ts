// Auto-generated from bmi-obesity-risk-calculator-schema.json
import * as z from 'zod';

export interface Bmi_obesity_risk_calculatorInput {
  agirlik: number;
  boy: number;
  dataConfidence?: number;
}

export const Bmi_obesity_risk_calculatorInputSchema = z.object({
  agirlik: z.number().min(20).max(300).default(75),
  boy: z.number().min(0.5).max(2.5).default(1.75),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Bmi_obesity_risk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.agirlik / Math.max(0.0001, (input.boy * input.boy)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateBmi_obesity_risk_calculator(input: Bmi_obesity_risk_calculatorInput): Bmi_obesity_risk_calculatorOutput {
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
    unit: "kg/m2",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Bmi_obesity_risk_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Bmi_obesity_risk_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "kg/m2",
  breakdownKeys: ["sonuc"],
} as const;

