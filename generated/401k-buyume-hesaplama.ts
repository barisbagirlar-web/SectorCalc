// Auto-generated from 401k-buyume-hesaplama-schema.json
import * as z from 'zod';

export interface _401k_buyume_hesaplamaInput {
  maas: number;
  katkiOrani: number;
  isverenEslesme: number;
  faiz: number;
  yil: number;
  dataConfidence?: number;
}

export const _401k_buyume_hesaplamaInputSchema = z.object({
  maas: z.number().min(0).default(100000),
  katkiOrani: z.number().min(0).default(10),
  isverenEslesme: z.number().min(0).default(5),
  faiz: z.number().min(0).default(7),
  yil: z.number().min(0).default(30),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: _401k_buyume_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.maas * ((input.katkiOrani + input.isverenEslesme) / 100); results["yillikKatki"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["yillikKatki"] = Number.NaN; }
  try { const v = (input.maas * ((input.katkiOrani + input.isverenEslesme) / 100)) * ((Math.pow(1 + input.faiz / 100, input.yil) - 1) / Math.max(0.0001, (input.faiz / 100))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculate_401k_buyume_hesaplama(input: _401k_buyume_hesaplamaInput): _401k_buyume_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review insurance coverage annually.","Consult a retirement planner for personalized strategy."];
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
    unit: "TRY",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface _401k_buyume_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const _401k_buyume_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

