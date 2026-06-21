// Auto-generated from sigorta-prim-yasam-hesaplama-schema.json
import * as z from 'zod';

export interface Sigorta_prim_yasam_hesaplamaInput {
  beklenenHasar: number;
  giderYuklemesi: number;
  karMarji: number;
  dataConfidence?: number;
}

export const Sigorta_prim_yasam_hesaplamaInputSchema = z.object({
  beklenenHasar: z.number().min(0).default(1000),
  giderYuklemesi: z.number().min(0).default(30),
  karMarji: z.number().min(0).default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sigorta_prim_yasam_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.beklenenHasar / Math.max(0.0001, (1 - (input.giderYuklemesi / 100) - (input.karMarji / 100))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateSigorta_prim_yasam_hesaplama(input: Sigorta_prim_yasam_hesaplamaInput): Sigorta_prim_yasam_hesaplamaOutput {
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
    unit: "TL",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Sigorta_prim_yasam_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Sigorta_prim_yasam_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TL",
  breakdownKeys: ["sonuc"],
} as const;

