// Auto-generated from vucut-yag-yuzdesi-hesaplama-schema.json
import * as z from 'zod';

export interface Vucut_yag_yuzdesi_hesaplamaInput {
  boy: number;
  bel: number;
  boyun: number;
  dataConfidence?: number;
}

export const Vucut_yag_yuzdesi_hesaplamaInputSchema = z.object({
  boy: z.number().min(0).default(175),
  bel: z.number().min(0).default(85),
  boyun: z.number().min(0).default(38),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Vucut_yag_yuzdesi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 495 / Math.max(0.0001, (1.0324 - 0.19077 * Math.log(Math.max(1, input.bel - input.boyun)) / Math.log(10) + 0.15456 * Math.log(Math.max(1, input.boy)) / Math.log(10))) - 450; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateVucut_yag_yuzdesi_hesaplama(input: Vucut_yag_yuzdesi_hesaplamaInput): Vucut_yag_yuzdesi_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Consult a healthcare professional before starting any diet or exercise program.","Individual results may vary."];
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


export interface Vucut_yag_yuzdesi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Vucut_yag_yuzdesi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

