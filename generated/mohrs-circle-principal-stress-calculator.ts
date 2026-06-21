// Auto-generated from mohrs-circle-principal-stress-calculator-schema.json
import * as z from 'zod';

export interface Mohrs_circle_principal_stress_calculatorInput {
  sigmaX: number;
  sigmaY: number;
  tauXY: number;
  dataConfidence?: number;
}

export const Mohrs_circle_principal_stress_calculatorInputSchema = z.object({
  sigmaX: z.number().min(0).default(100000000),
  sigmaY: z.number().min(0).default(50000000),
  tauXY: z.number().min(0).default(30000000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Mohrs_circle_principal_stress_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.sigmaX + input.sigmaY) / 2; results["merkez"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["merkez"] = Number.NaN; }
  try { const v = Math.sqrt(Math.max(0, Math.pow((input.sigmaX - input.sigmaY) / 2, 2) + Math.pow(input.tauXY, 2))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateMohrs_circle_principal_stress_calculator(input: Mohrs_circle_principal_stress_calculatorInput): Mohrs_circle_principal_stress_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    merkez: toNumericFormulaValue(values["merkez"]),
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify calculations with FEA or physical testing.","Use appropriate safety factors for design."];
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
    unit: "Pa",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Mohrs_circle_principal_stress_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { merkez: number; sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Mohrs_circle_principal_stress_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "Pa",
  breakdownKeys: ["merkez","sonuc"],
} as const;

