// Auto-generated from havza-yonetimi-akis-hesaplama-schema.json
import * as z from 'zod';

export interface Havza_yonetimi_akis_hesaplamaInput {
  havzaAlani: number;
  yagis: number;
  akisKatsayisi: number;
  dataConfidence?: number;
}

export const Havza_yonetimi_akis_hesaplamaInputSchema = z.object({
  havzaAlani: z.number().min(0).default(100),
  yagis: z.number().min(0).default(50),
  akisKatsayisi: z.number().min(0).default(0.3),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Havza_yonetimi_akis_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.havzaAlani * 1000000 * (input.yagis / 1000) * input.akisKatsayisi; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateHavza_yonetimi_akis_hesaplama(input: Havza_yonetimi_akis_hesaplamaInput): Havza_yonetimi_akis_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["High environmental score may reduce operational costs.","Low ESG score may increase capital costs."];
  const suggestedActions: string[] = ["Set improvement targets for each ESG pillar.","Consider carbon offset programs for residual emissions."];
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
    unit: "m3",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Havza_yonetimi_akis_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Havza_yonetimi_akis_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "m3",
  breakdownKeys: ["sonuc"],
} as const;

