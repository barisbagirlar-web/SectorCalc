// Auto-generated from guvenlik-stogu-rop-hesaplama-schema.json
import * as z from 'zod';

export interface Guvenlik_stogu_rop_hesaplamaInput {
  ortTalep: number;
  stdSapma: number;
  tedarikSure: number;
  Z: number;
  dataConfidence?: number;
}

export const Guvenlik_stogu_rop_hesaplamaInputSchema = z.object({
  ortTalep: z.number().min(0).default(100),
  stdSapma: z.number().min(0).default(20),
  tedarikSure: z.number().min(0).default(7),
  Z: z.number().min(0).default(1.65),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Guvenlik_stogu_rop_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.Z * input.stdSapma * Math.sqrt(Math.max(0, input.tedarikSure)); results["ss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ss"] = Number.NaN; }
  try { const v = (input.ortTalep * input.tedarikSure) + (input.Z * input.stdSapma * Math.sqrt(Math.max(0, input.tedarikSure))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateGuvenlik_stogu_rop_hesaplama(input: Guvenlik_stogu_rop_hesaplamaInput): Guvenlik_stogu_rop_hesaplamaOutput {
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


export interface Guvenlik_stogu_rop_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Guvenlik_stogu_rop_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "units",
  breakdownKeys: ["sonuc"],
} as const;

