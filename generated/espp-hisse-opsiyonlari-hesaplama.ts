// Auto-generated from espp-hisse-opsiyonlari-hesaplama-schema.json
import * as z from 'zod';

export interface Espp_hisse_opsiyonlari_hesaplamaInput {
  piyasaFiyati: number;
  iskonto: number;
  katki: number;
  dataConfidence?: number;
}

export const Espp_hisse_opsiyonlari_hesaplamaInputSchema = z.object({
  piyasaFiyati: z.number().min(0).default(100),
  iskonto: z.number().min(0).max(100).default(15),
  katki: z.number().min(0).default(1000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Espp_hisse_opsiyonlari_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.piyasaFiyati * (1 - input.iskonto / 100); results["alimFiyati"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["alimFiyati"] = Number.NaN; }
  try { const v = input.katki / Math.max(0.0001, (input.piyasaFiyati * (1 - input.iskonto / 100))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateEspp_hisse_opsiyonlari_hesaplama(input: Espp_hisse_opsiyonlari_hesaplamaInput): Espp_hisse_opsiyonlari_hesaplamaOutput {
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


export interface Espp_hisse_opsiyonlari_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Espp_hisse_opsiyonlari_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "shares",
  breakdownKeys: ["sonuc"],
} as const;

