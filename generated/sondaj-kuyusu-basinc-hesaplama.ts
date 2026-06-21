// Auto-generated from sondaj-kuyusu-basinc-hesaplama-schema.json
import * as z from 'zod';

export interface Sondaj_kuyusu_basinc_hesaplamaInput {
  dikeyDerinlik: number;
  camurYogunlugu: number;
  dataConfidence?: number;
}

export const Sondaj_kuyusu_basinc_hesaplamaInputSchema = z.object({
  dikeyDerinlik: z.number().min(0).default(3000),
  camurYogunlugu: z.number().min(0).default(1500),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sondaj_kuyusu_basinc_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.camurYogunlugu * 9.81 * input.dikeyDerinlik) / 1000000; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateSondaj_kuyusu_basinc_hesaplama(input: Sondaj_kuyusu_basinc_hesaplamaInput): Sondaj_kuyusu_basinc_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["Low SLA indicates service reliability issue.","High latency degrades user experience."];
  const suggestedActions: string[] = ["Monitor system performance regularly.","Implement redundancy for critical infrastructure."];
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
    unit: "MPa",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Sondaj_kuyusu_basinc_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Sondaj_kuyusu_basinc_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "MPa",
  breakdownKeys: ["sonuc"],
} as const;

