// Auto-generated from ira-rmd-asgari-dagitim-hesaplama-schema.json
import * as z from 'zod';

export interface Ira_rmd_asgari_dagitim_hesaplamaInput {
  bakiye: number;
  yasamBeklentisi: number;
  dataConfidence?: number;
}

export const Ira_rmd_asgari_dagitim_hesaplamaInputSchema = z.object({
  bakiye: z.number().min(0).default(1000000),
  yasamBeklentisi: z.number().min(1).default(25),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ira_rmd_asgari_dagitim_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.bakiye / Math.max(1, input.yasamBeklentisi); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateIra_rmd_asgari_dagitim_hesaplama(input: Ira_rmd_asgari_dagitim_hesaplamaInput): Ira_rmd_asgari_dagitim_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review insurance coverage annually.","Consult a retirement planner for personalized strategy."];
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
    unit: "TRY",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Ira_rmd_asgari_dagitim_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Ira_rmd_asgari_dagitim_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

