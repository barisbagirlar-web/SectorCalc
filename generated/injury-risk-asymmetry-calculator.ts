// Auto-generated from injury-risk-asymmetry-calculator-schema.json
import * as z from 'zod';

export interface Injury_risk_asymmetry_calculatorInput {
  sagKuvvet: number;
  solKuvvet: number;
  dataConfidence?: number;
}

export const Injury_risk_asymmetry_calculatorInputSchema = z.object({
  sagKuvvet: z.number().min(0).default(500),
  solKuvvet: z.number().min(0).default(450),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Injury_risk_asymmetry_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (Math.abs(input.sagKuvvet - input.solKuvvet) / Math.max(0.0001, Math.max(input.sagKuvvet, input.solKuvvet))) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateInjury_risk_asymmetry_calculator(input: Injury_risk_asymmetry_calculatorInput): Injury_risk_asymmetry_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["High asymmetry increases injury risk.","Low H-index may indicate limited academic impact."];
  const suggestedActions: string[] = ["Balance training for injury prevention.","Use peer review to validate research quality."];
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
    unit: "%",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Injury_risk_asymmetry_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Injury_risk_asymmetry_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

