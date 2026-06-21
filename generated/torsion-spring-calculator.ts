// Auto-generated from torsion-spring-calculator-schema.json
import * as z from 'zod';

export interface Torsion_spring_calculatorInput {
  moment: number;
  yayKatsayisi: number;
  dataConfidence?: number;
}

export const Torsion_spring_calculatorInputSchema = z.object({
  moment: z.number().min(0).default(50),
  yayKatsayisi: z.number().min(0).default(100),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Torsion_spring_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.moment / Math.max(0.0001, input.yayKatsayisi); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateTorsion_spring_calculator(input: Torsion_spring_calculatorInput): Torsion_spring_calculatorOutput {
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
    unit: "rad",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Torsion_spring_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Torsion_spring_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "rad",
  breakdownKeys: ["sonuc"],
} as const;

