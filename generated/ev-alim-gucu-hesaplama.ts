// Auto-generated from ev-alim-gucu-hesaplama-schema.json
import * as z from 'zod';

export interface Ev_alim_gucu_hesaplamaInput {
  aylikGelir: number;
  maxDTI: number;
  aylikBorc: number;
  faiz: number;
  vade: number;
  dataConfidence?: number;
}

export const Ev_alim_gucu_hesaplamaInputSchema = z.object({
  aylikGelir: z.number().min(0).default(50000),
  maxDTI: z.number().min(0).max(100).default(40),
  aylikBorc: z.number().min(0).default(5000),
  faiz: z.number().min(0).default(12),
  vade: z.number().min(1).default(120),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ev_alim_gucu_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.aylikGelir * input.maxDTI / 100) - input.aylikBorc; results["maxTaksit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["maxTaksit"] = Number.NaN; }
  try { const v = (input.aylikGelir * input.maxDTI / 100 - input.aylikBorc) * ((1 - Math.pow(1 + input.faiz / 1200, -input.vade)) / (input.faiz / 1200)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateEv_alim_gucu_hesaplama(input: Ev_alim_gucu_hesaplamaInput): Ev_alim_gucu_hesaplamaOutput {
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


export interface Ev_alim_gucu_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Ev_alim_gucu_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

