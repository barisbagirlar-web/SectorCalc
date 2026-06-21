// Auto-generated from greywater-savings-calculator-schema.json
import * as z from 'zod';

export interface Greywater_savings_calculatorInput {
  griSuHacmi: number;
  aritmaMaliyet: number;
  sebekeFiyat: number;
  dataConfidence?: number;
}

export const Greywater_savings_calculatorInputSchema = z.object({
  griSuHacmi: z.number().min(0).default(5),
  aritmaMaliyet: z.number().min(0).default(3),
  sebekeFiyat: z.number().min(0).default(15),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Greywater_savings_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.griSuHacmi * (input.sebekeFiyat - input.aritmaMaliyet) * 365; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateGreywater_savings_calculator(input: Greywater_savings_calculatorInput): Greywater_savings_calculatorOutput {
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
    unit: "TL/year",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Greywater_savings_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Greywater_savings_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "TL/year",
  breakdownKeys: ["sonuc"],
} as const;

