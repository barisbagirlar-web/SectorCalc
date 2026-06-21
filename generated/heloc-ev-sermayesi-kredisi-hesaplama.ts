// Auto-generated from heloc-ev-sermayesi-kredisi-hesaplama-schema.json
import * as z from 'zod';

export interface Heloc_ev_sermayesi_kredisi_hesaplamaInput {
  evDegeri: number;
  kalanBorc: number;
  maksOran: number;
  dataConfidence?: number;
}

export const Heloc_ev_sermayesi_kredisi_hesaplamaInputSchema = z.object({
  evDegeri: z.number().min(0).default(1500000),
  kalanBorc: z.number().min(0).default(500000),
  maksOran: z.number().min(0).max(100).default(80),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Heloc_ev_sermayesi_kredisi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.evDegeri * input.maksOran / 100) - input.kalanBorc; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateHeloc_ev_sermayesi_kredisi_hesaplama(input: Heloc_ev_sermayesi_kredisi_hesaplamaInput): Heloc_ev_sermayesi_kredisi_hesaplamaOutput {
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
    unit: "TRY",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Heloc_ev_sermayesi_kredisi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Heloc_ev_sermayesi_kredisi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

