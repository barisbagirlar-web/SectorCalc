// Auto-generated from h-indeksi-hesaplama-schema.json
import * as z from 'zod';

export interface H_indeksi_hesaplamaInput {
  atif1: number;
  atif2: number;
  atif3: number;
  atif4: number;
  atif5: number;
  dataConfidence?: number;
}

export const H_indeksi_hesaplamaInputSchema = z.object({
  atif1: z.number().min(0).default(50),
  atif2: z.number().min(0).default(30),
  atif3: z.number().min(0).default(20),
  atif4: z.number().min(0).default(15),
  atif5: z.number().min(0).default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: H_indeksi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.atif1 >= 5 && input.atif2 >= 4 && input.atif3 >= 3 && input.atif4 >= 2 && input.atif5 >= 1 ? 5 : input.atif1 >= 4 && input.atif2 >= 3 && input.atif3 >= 2 && input.atif4 >= 1 ? 4 : input.atif1 >= 3 && input.atif2 >= 2 && input.atif3 >= 1 ? 3 : input.atif1 >= 2 && input.atif2 >= 1 ? 2 : input.atif1 >= 1 ? 1 : 0; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateH_indeksi_hesaplama(input: H_indeksi_hesaplamaInput): H_indeksi_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["High asymmetry increases injury risk.","Low H-index may indicate limited academic impact."];
  const suggestedActions: string[] = ["Balance training for injury prevention.","Use peer review to validate research quality."];
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
    unit: "H-index",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface H_indeksi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const H_indeksi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "H-index",
  breakdownKeys: ["sonuc"],
} as const;

