// Auto-generated from cap-rate-kira-getiri-hesaplama-schema.json
import * as z from 'zod';

export interface Cap_rate_kira_getiri_hesaplamaInput {
  yillikNetGelir: number;
  mulkDegeri: number;
  dataConfidence?: number;
}

export const Cap_rate_kira_getiri_hesaplamaInputSchema = z.object({
  yillikNetGelir: z.number().min(0).default(120000),
  mulkDegeri: z.number().min(0).default(1500000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cap_rate_kira_getiri_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.yillikNetGelir / Math.max(1, input.mulkDegeri)) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateCap_rate_kira_getiri_hesaplama(input: Cap_rate_kira_getiri_hesaplamaInput): Cap_rate_kira_getiri_hesaplamaOutput {
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
    unit: "%",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Cap_rate_kira_getiri_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Cap_rate_kira_getiri_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

