// Auto-generated from kira-satin-alma-karsilastirma-hesaplama-schema.json
import * as z from 'zod';

export interface Kira_satin_alma_karsilastirma_hesaplamaInput {
  evFiyati: number;
  yillikKira: number;
  dataConfidence?: number;
}

export const Kira_satin_alma_karsilastirma_hesaplamaInputSchema = z.object({
  evFiyati: z.number().min(0).default(2000000),
  yillikKira: z.number().min(0).default(120000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kira_satin_alma_karsilastirma_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.evFiyati / Math.max(1, input.yillikKira); results["oran"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["oran"] = Number.NaN; }
  try { const v = input.evFiyati / Math.max(1, input.yillikKira); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateKira_satin_alma_karsilastirma_hesaplama(input: Kira_satin_alma_karsilastirma_hesaplamaInput): Kira_satin_alma_karsilastirma_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify all property data with official documents.","Consult a mortgage broker for personalized rates."];
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
    unit: "ratio",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Kira_satin_alma_karsilastirma_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kira_satin_alma_karsilastirma_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "ratio",
  breakdownKeys: ["sonuc"],
} as const;

