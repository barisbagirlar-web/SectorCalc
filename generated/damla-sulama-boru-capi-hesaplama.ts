// Auto-generated from damla-sulama-boru-capi-hesaplama-schema.json
import * as z from 'zod';

export interface Damla_sulama_boru_capi_hesaplamaInput {
  damaticiDebi: number;
  damaticiSayisi: number;
  maxHiz: number;
  dataConfidence?: number;
}

export const Damla_sulama_boru_capi_hesaplamaInputSchema = z.object({
  damaticiDebi: z.number().min(0).default(4),
  damaticiSayisi: z.number().min(0).default(500),
  maxHiz: z.number().min(0).default(1.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Damla_sulama_boru_capi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (4 * 500) / 3600000; results["toplamDebi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["toplamDebi"] = Number.NaN; }
  try { const v = Math.sqrt(Math.max(0, (4 * ((4 * 500) / 3600000)) / Math.max(0.0001, (Math.PI * 1.5)))) * 1000; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateDamla_sulama_boru_capi_hesaplama(input: Damla_sulama_boru_capi_hesaplamaInput): Damla_sulama_boru_capi_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["Low efficiency may indicate equipment or process issues."];
  const suggestedActions: string[] = ["Calibrate all measuring equipment regularly.","Use site-specific data when available."];
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
    unit: "mm",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Damla_sulama_boru_capi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Damla_sulama_boru_capi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "mm",
  breakdownKeys: ["sonuc"],
} as const;

