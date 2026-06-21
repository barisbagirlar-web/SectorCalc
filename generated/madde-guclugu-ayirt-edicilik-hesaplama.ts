// Auto-generated from madde-guclugu-ayirt-edicilik-hesaplama-schema.json
import * as z from 'zod';

export interface Madde_guclugu_ayirt_edicilik_hesaplamaInput {
  dogruCevap: number;
  toplamOgrenci: number;
  ustGrupDogru: number;
  altGrupDogru: number;
  grupBoyutu: number;
  dataConfidence?: number;
}

export const Madde_guclugu_ayirt_edicilik_hesaplamaInputSchema = z.object({
  dogruCevap: z.number().min(0).default(40),
  toplamOgrenci: z.number().min(0).default(100),
  ustGrupDogru: z.number().min(0).default(25),
  altGrupDogru: z.number().min(0).default(5),
  grupBoyutu: z.number().min(0).default(27),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Madde_guclugu_ayirt_edicilik_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 40 / Math.max(1, 100); results["p"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["p"] = Number.NaN; }
  try { const v = (25 - 5) / Math.max(1, 27); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateMadde_guclugu_ayirt_edicilik_hesaplama(input: Madde_guclugu_ayirt_edicilik_hesaplamaInput): Madde_guclugu_ayirt_edicilik_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    p: toNumericFormulaValue(values["p"]),
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
    unit: "r-value",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Madde_guclugu_ayirt_edicilik_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { p: number; sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Madde_guclugu_ayirt_edicilik_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "r-value",
  breakdownKeys: ["p","sonuc"],
} as const;

