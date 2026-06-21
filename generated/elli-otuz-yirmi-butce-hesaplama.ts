// Auto-generated from elli-otuz-yirmi-butce-hesaplama-schema.json
import * as z from 'zod';

export interface Elli_otuz_yirmi_butce_hesaplamaInput {
  netGelir: number;
  dataConfidence?: number;
}

export const Elli_otuz_yirmi_butce_hesaplamaInputSchema = z.object({
  netGelir: z.number().min(0).default(30000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Elli_otuz_yirmi_butce_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.netGelir * 0.5; results["ihtiyac"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ihtiyac"] = Number.NaN; }
  try { const v = input.netGelir * 0.3; results["istek"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["istek"] = Number.NaN; }
  try { const v = input.netGelir * 0.2; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateElli_otuz_yirmi_butce_hesaplama(input: Elli_otuz_yirmi_butce_hesaplamaInput): Elli_otuz_yirmi_butce_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    ihtiyac: toNumericFormulaValue(values["ihtiyac"]),
    istek: toNumericFormulaValue(values["istek"]),
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify inputs before making financial decisions.","Consult a licensed financial advisor for personalized advice."];
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


export interface Elli_otuz_yirmi_butce_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { ihtiyac: number; istek: number; sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Elli_otuz_yirmi_butce_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["ihtiyac","istek","sonuc"],
} as const;

