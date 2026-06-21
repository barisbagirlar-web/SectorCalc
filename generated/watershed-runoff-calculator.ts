// Auto-generated from watershed-runoff-calculator-schema.json
import * as z from 'zod';

export interface Watershed_runoff_calculatorInput {
  havzaAlani: number;
  yagis: number;
  akisKatsayisi: number;
  dataConfidence?: number;
}

export const Watershed_runoff_calculatorInputSchema = z.object({
  havzaAlani: z.number().min(0).default(100),
  yagis: z.number().min(0).default(50),
  akisKatsayisi: z.number().min(0).default(0.3),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Watershed_runoff_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.havzaAlani * 1000000 * (input.yagis / 1000) * input.akisKatsayisi; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateWatershed_runoff_calculator(input: Watershed_runoff_calculatorInput): Watershed_runoff_calculatorOutput {
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
    unit: "m3",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Watershed_runoff_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Watershed_runoff_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "m3",
  breakdownKeys: ["sonuc"],
} as const;

