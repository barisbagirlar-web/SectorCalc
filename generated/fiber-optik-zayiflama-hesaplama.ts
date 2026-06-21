// Auto-generated from fiber-optik-zayiflama-hesaplama-schema.json
import * as z from 'zod';

export interface Fiber_optik_zayiflama_hesaplamaInput {
  uzunluk: number;
  birimKayip: number;
  ekKayip: number;
  dataConfidence?: number;
}

export const Fiber_optik_zayiflama_hesaplamaInputSchema = z.object({
  uzunluk: z.number().min(0).default(50),
  birimKayip: z.number().min(0).default(0.2),
  ekKayip: z.number().min(0).default(1.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fiber_optik_zayiflama_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.uzunluk * input.birimKayip) + input.ekKayip; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateFiber_optik_zayiflama_hesaplama(input: Fiber_optik_zayiflama_hesaplamaInput): Fiber_optik_zayiflama_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Quantum effects are only observable at microscopic scales.","These are idealized models."];
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
    unit: "dB",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Fiber_optik_zayiflama_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Fiber_optik_zayiflama_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "dB",
  breakdownKeys: ["sonuc"],
} as const;

