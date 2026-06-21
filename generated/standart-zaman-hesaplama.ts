// Auto-generated from standart-zaman-hesaplama-schema.json
import * as z from 'zod';

export interface Standart_zaman_hesaplamaInput {
  gozlenenSure: number;
  performans: number;
  ekSure: number;
  dataConfidence?: number;
}

export const Standart_zaman_hesaplamaInputSchema = z.object({
  gozlenenSure: z.number().min(0).default(10),
  performans: z.number().min(20).max(150).default(90),
  ekSure: z.number().min(0).max(100).default(15),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Standart_zaman_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.gozlenenSure * (input.performans / 100); results["normal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normal"] = Number.NaN; }
  try { const v = (input.gozlenenSure * (input.performans / 100)) * (1 + input.ekSure / 100); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateStandart_zaman_hesaplama(input: Standart_zaman_hesaplamaInput): Standart_zaman_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Conduct regular OEE audits for improvement.","Use SMED to reduce setup times."];
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
    unit: "min",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Standart_zaman_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Standart_zaman_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "min",
  breakdownKeys: ["sonuc"],
} as const;

