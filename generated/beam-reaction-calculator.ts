// Auto-generated from beam-reaction-calculator-schema.json
import * as z from 'zod';

export interface Beam_reaction_calculatorInput {
  dataConfidence?: number;
  yuk: number;
  uzunluk: number;
  yukKonum: number;
}

export const Beam_reaction_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  yuk: z.number().min(0).default(10000),
  uzunluk: z.number().min(0).default(6),
  yukKonum: z.number().min(0).default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Beam_reaction_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["yuk"] * Math.max(0, (input["uzunluk"] - input["yukKonum"])) / Math.max(0.0001, input["uzunluk"]); results["RA"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["RA"] = Number.NaN; }
  try { const v = input["yuk"] - input["yuk"] * Math.max(0, (input["uzunluk"] - input["yukKonum"])) / Math.max(0.0001, input["uzunluk"]); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateBeam_reaction_calculator(input: Beam_reaction_calculatorInput): Beam_reaction_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {
    "RA": toNumericFormulaValue(values["RA"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Quantum effects are only observable at microscopic scales.","These are idealized models."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    ["sonuc"]: totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    unit: "N",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Beam_reaction_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: Record<string, number>;
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
  [key: string]: unknown;
}

export const Beam_reaction_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "N",
  breakdownKeys: ["RA"],
} as const;
