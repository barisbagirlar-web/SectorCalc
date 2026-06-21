// Auto-generated from beam-deflection-calculator-schema.json
import * as z from 'zod';

export interface Beam_deflection_calculatorInput {
  yuk: number;
  aciklik: number;
  elastisiteModulu: number;
  ataletMomenti: number;
  dataConfidence?: number;
}

export const Beam_deflection_calculatorInputSchema = z.object({
  yuk: z.number().min(0).default(15000),
  aciklik: z.number().min(0).default(4),
  elastisiteModulu: z.number().min(0).default(200000000000),
  ataletMomenti: z.number().min(0).default(0.0000083),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Beam_deflection_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.yuk * Math.pow(input.aciklik, 3)) / Math.max(0.0001, (48 * input.elastisiteModulu * input.ataletMomenti)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateBeam_deflection_calculator(input: Beam_deflection_calculatorInput): Beam_deflection_calculatorOutput {
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
    unit: "m",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Beam_deflection_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Beam_deflection_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "m",
  breakdownKeys: ["sonuc"],
} as const;

