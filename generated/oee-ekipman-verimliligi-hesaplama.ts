// Auto-generated from oee-ekipman-verimliligi-hesaplama-schema.json
import * as z from 'zod';

export interface Oee_ekipman_verimliligi_hesaplamaInput {
  kullanilabilirlik: number;
  performans: number;
  kalite: number;
  dataConfidence?: number;
}

export const Oee_ekipman_verimliligi_hesaplamaInputSchema = z.object({
  kullanilabilirlik: z.number().min(0).max(100).default(90),
  performans: z.number().min(0).max(100).default(85),
  kalite: z.number().min(0).max(100).default(98),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Oee_ekipman_verimliligi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.kullanilabilirlik / 100) * (input.performans / 100) * (input.kalite / 100) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateOee_ekipman_verimliligi_hesaplama(input: Oee_ekipman_verimliligi_hesaplamaInput): Oee_ekipman_verimliligi_hesaplamaOutput {
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
    unit: "%",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Oee_ekipman_verimliligi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Oee_ekipman_verimliligi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

