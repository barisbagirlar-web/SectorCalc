// Auto-generated from breeam-leed-score-calculator-schema.json
import * as z from 'zod';

export interface Breeam_leed_score_calculatorInput {
  enerji: number;
  su: number;
  malzeme: number;
  dataConfidence?: number;
}

export const Breeam_leed_score_calculatorInputSchema = z.object({
  enerji: z.number().min(0).max(100).default(70),
  su: z.number().min(0).max(100).default(60),
  malzeme: z.number().min(0).max(100).default(65),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Breeam_leed_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.enerji * 0.4) + (input.su * 0.3) + (input.malzeme * 0.3); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateBreeam_leed_score_calculator(input: Breeam_leed_score_calculatorInput): Breeam_leed_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["High environmental score may reduce operational costs.","Low ESG score may increase capital costs."];
  const suggestedActions: string[] = ["Set improvement targets for each ESG pillar.","Consider carbon offset programs for residual emissions."];
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
    unit: "score",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Breeam_leed_score_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Breeam_leed_score_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "score",
  breakdownKeys: ["sonuc"],
} as const;

