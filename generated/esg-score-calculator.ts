// Auto-generated from esg-score-calculator-schema.json
import * as z from 'zod';

export interface Esg_score_calculatorInput {
  cevre: number;
  sosyal: number;
  yonetisim: number;
  dataConfidence?: number;
}

export const Esg_score_calculatorInputSchema = z.object({
  cevre: z.number().min(0).max(100).default(75),
  sosyal: z.number().min(0).max(100).default(80),
  yonetisim: z.number().min(0).max(100).default(70),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Esg_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.cevre * 0.4) + (input.sosyal * 0.3) + (input.yonetisim * 0.3); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateEsg_score_calculator(input: Esg_score_calculatorInput): Esg_score_calculatorOutput {
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


export interface Esg_score_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Esg_score_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "score",
  breakdownKeys: ["sonuc"],
} as const;

