// Auto-generated from von-mises-stress-calculator-schema.json
import * as z from 'zod';

export interface Von_mises_stress_calculatorInput {
  sigmaX: number;
  sigmaY: number;
  tauXY: number;
  dataConfidence?: number;
}

export const Von_mises_stress_calculatorInputSchema = z.object({
  sigmaX: z.number().min(0).default(150000000),
  sigmaY: z.number().min(0).default(50000000),
  tauXY: z.number().min(0).default(40000000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Von_mises_stress_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt(Math.max(0, input.sigmaX*input.sigmaX - input.sigmaX*input.sigmaY + input.sigmaY*input.sigmaY + 3*input.tauXY*input.tauXY)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateVon_mises_stress_calculator(input: Von_mises_stress_calculatorInput): Von_mises_stress_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
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


export interface Von_mises_stress_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Von_mises_stress_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "Pa",
  breakdownKeys: ["sonuc"],
} as const;

