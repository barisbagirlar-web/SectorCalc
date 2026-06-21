// Auto-generated from kasnak-kayis-gerilimi-hesaplama-schema.json
import * as z from 'zod';

export interface Kasnak_kayis_gerilimi_hesaplamaInput {
  guc: number;
  hiz: number;
  sarilmaAcisi: number;
  suratme: number;
  dataConfidence?: number;
}

export const Kasnak_kayis_gerilimi_hesaplamaInputSchema = z.object({
  guc: z.number().min(0).default(5000),
  hiz: z.number().min(0).default(10),
  sarilmaAcisi: z.number().min(0).default(2.8),
  suratme: z.number().min(0).default(0.3),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kasnak_kayis_gerilimi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.exp(0.3 * 2.8); results["F1_F2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["F1_F2"] = Number.NaN; }
  try { const v = 5000 / Math.max(0.0001, (10 * (Math.exp(0.3 * 2.8) - 1))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateKasnak_kayis_gerilimi_hesaplama(input: Kasnak_kayis_gerilimi_hesaplamaInput): Kasnak_kayis_gerilimi_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify calculations with FEA or physical testing.","Use appropriate safety factors for design."];
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
    unit: "N",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Kasnak_kayis_gerilimi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kasnak_kayis_gerilimi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "N",
  breakdownKeys: ["sonuc"],
} as const;

