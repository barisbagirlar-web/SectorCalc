// Auto-generated from rsu-calculator-schema.json
import * as z from 'zod';

export interface Rsu_calculatorInput {
  hisseSayisi: number;
  hakKazanma: number;
  vergi: number;
  dataConfidence?: number;
}

export const Rsu_calculatorInputSchema = z.object({
  hisseSayisi: z.number().min(0).default(1000),
  hakKazanma: z.number().min(0).max(100).default(25),
  vergi: z.number().min(0).max(100).default(25),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Rsu_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.hisseSayisi * input.hakKazanma / 100) * (1 - input.vergi / 100); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateRsu_calculator(input: Rsu_calculatorInput): Rsu_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify financial projections with actual data.","Review assumptions quarterly."];
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
    unit: "shares",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Rsu_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Rsu_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "shares",
  breakdownKeys: ["sonuc"],
} as const;

