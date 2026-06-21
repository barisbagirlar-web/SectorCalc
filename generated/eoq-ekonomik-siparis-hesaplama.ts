// Auto-generated from eoq-ekonomik-siparis-hesaplama-schema.json
import * as z from 'zod';

export interface Eoq_ekonomik_siparis_hesaplamaInput {
  yillikTalep: number;
  siparisMaliyeti: number;
  tasimaMaliyeti: number;
  dataConfidence?: number;
}

export const Eoq_ekonomik_siparis_hesaplamaInputSchema = z.object({
  yillikTalep: z.number().min(1).default(10000),
  siparisMaliyeti: z.number().min(0).default(100),
  tasimaMaliyeti: z.number().min(0).default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Eoq_ekonomik_siparis_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt(Math.max(0, (2 * input.yillikTalep * input.siparisMaliyeti) / Math.max(0.0001, input.tasimaMaliyeti))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateEoq_ekonomik_siparis_hesaplama(input: Eoq_ekonomik_siparis_hesaplamaInput): Eoq_ekonomik_siparis_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inventory turnover metrics monthly.","Factor in seasonality for safety stock."];
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
    unit: "units",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Eoq_ekonomik_siparis_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Eoq_ekonomik_siparis_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "units",
  breakdownKeys: ["sonuc"],
} as const;

