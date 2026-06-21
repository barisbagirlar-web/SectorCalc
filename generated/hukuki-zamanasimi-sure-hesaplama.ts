// Auto-generated from hukuki-zamanasimi-sure-hesaplama-schema.json
import * as z from 'zod';

export interface Hukuki_zamanasimi_sure_hesaplamaInput {
  olayTarihi: number;
  yasalSure: number;
  kesintiDurumu: number;
  dataConfidence?: number;
}

export const Hukuki_zamanasimi_sure_hesaplamaInputSchema = z.object({
  olayTarihi: z.number().min(0).default(2020),
  yasalSure: z.number().min(0).default(10),
  kesintiDurumu: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hukuki_zamanasimi_sure_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.kesintiDurumu === 1 ? input.olayTarihi : input.olayTarihi + input.yasalSure) ? 1 : 0); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateHukuki_zamanasimi_sure_hesaplama(input: Hukuki_zamanasimi_sure_hesaplamaInput): Hukuki_zamanasimi_sure_hesaplamaOutput {
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
    unit: "year",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Hukuki_zamanasimi_sure_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Hukuki_zamanasimi_sure_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "year",
  breakdownKeys: ["sonuc"],
} as const;

