// Auto-generated from dis-cephe-kaplama-hesaplama-schema.json
import * as z from 'zod';

export interface Dis_cephe_kaplama_hesaplamaInput {
  alan: number;
  panelEn: number;
  panelBoy: number;
  fire: number;
  dataConfidence?: number;
}

export const Dis_cephe_kaplama_hesaplamaInputSchema = z.object({
  alan: z.number().min(0).default(100),
  panelEn: z.number().min(0).default(0.3),
  panelBoy: z.number().min(0).default(3),
  fire: z.number().min(0).default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Dis_cephe_kaplama_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.ceil((input.alan * (1 + input.fire / 100)) / Math.max(0.0001, (input.panelEn * input.panelBoy))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateDis_cephe_kaplama_hesaplama(input: Dis_cephe_kaplama_hesaplamaInput): Dis_cephe_kaplama_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Order 5-10% extra material for waste.","Verify local building codes before purchasing."];
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
    unit: "panels",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Dis_cephe_kaplama_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Dis_cephe_kaplama_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "panels",
  breakdownKeys: ["sonuc"],
} as const;

