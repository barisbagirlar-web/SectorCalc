// Auto-generated from ters-kinematik-2d-kol-hesaplama-schema.json
import * as z from 'zod';

export interface Ters_kinematik_2d_kol_hesaplamaInput {
  hedefX: number;
  hedefY: number;
  kol1Uzunluk: number;
  kol2Uzunluk: number;
  dataConfidence?: number;
}

export const Ters_kinematik_2d_kol_hesaplamaInputSchema = z.object({
  hedefX: z.number().min(0).default(0.5),
  hedefY: z.number().min(0).default(0.5),
  kol1Uzunluk: z.number().min(0).default(0.4),
  kol2Uzunluk: z.number().min(0).default(0.3),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ters_kinematik_2d_kol_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.acos(Math.max(-1, Math.min(1, (0.5*0.5 + 0.5*0.5 - 0.4*0.4 - 0.3*0.3) / Math.max(0.0001, (2 * 0.4 * 0.3))))); results["aci2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["aci2"] = Number.NaN; }
  try { const v = Math.atan2(0.5, 0.5) - Math.atan2(0.3*Math.sin(Math.acos(Math.max(-1, Math.min(1, (0.5*0.5 + 0.5*0.5 - 0.4*0.4 - 0.3*0.3) / Math.max(0.0001, (2 * 0.4 * 0.3)))))), 0.4 + 0.3*Math.cos(Math.acos(Math.max(-1, Math.min(1, (0.5*0.5 + 0.5*0.5 - 0.4*0.4 - 0.3*0.3) / Math.max(0.0001, (2 * 0.4 * 0.3))))))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateTers_kinematik_2d_kol_hesaplama(input: Ters_kinematik_2d_kol_hesaplamaInput): Ters_kinematik_2d_kol_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    aci2: toNumericFormulaValue(values["aci2"]),
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
    unit: "rad",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Ters_kinematik_2d_kol_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { aci2: number; sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Ters_kinematik_2d_kol_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "rad",
  breakdownKeys: ["aci2","sonuc"],
} as const;

