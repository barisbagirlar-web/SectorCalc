// Auto-generated from water-footprint-calculator-schema.json
import * as z from 'zod';

export interface Water_footprint_calculatorInput {
  uretimHacmi: number;
  tuketilenSu: number;
  dataConfidence?: number;
}

export const Water_footprint_calculatorInputSchema = z.object({
  uretimHacmi: z.number().min(0).default(5000),
  tuketilenSu: z.number().min(0).default(15000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Water_footprint_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.tuketilenSu / Math.max(0.0001, input.uretimHacmi); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateWater_footprint_calculator(input: Water_footprint_calculatorInput): Water_footprint_calculatorOutput {
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
    unit: "m3/ton",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Water_footprint_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Water_footprint_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "m3/ton",
  breakdownKeys: ["sonuc"],
} as const;

