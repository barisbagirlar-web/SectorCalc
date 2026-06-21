// Auto-generated from roe-dupont-analizi-hesaplama-schema.json
import * as z from 'zod';

export interface Roe_dupont_analizi_hesaplamaInput {
  netKar: number;
  satislar: number;
  varliklar: number;
  ozsermaye: number;
  dataConfidence?: number;
}

export const Roe_dupont_analizi_hesaplamaInputSchema = z.object({
  netKar: z.number().min(0).default(150000),
  satislar: z.number().min(0).default(2000000),
  varliklar: z.number().min(0).default(3000000),
  ozsermaye: z.number().min(0).default(1500000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Roe_dupont_analizi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.netKar / Math.max(1, input.satislar); results["karMarji"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["karMarji"] = Number.NaN; }
  try { const v = input.satislar / Math.max(1, input.varliklar); results["varlikDevri"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["varlikDevri"] = Number.NaN; }
  try { const v = input.varliklar / Math.max(1, input.ozsermaye); results["kaldırac"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["kaldırac"] = Number.NaN; }
  try { const v = (input.netKar / Math.max(1, input.satislar)) * (input.satislar / Math.max(1, input.varliklar)) * (input.varliklar / Math.max(1, input.ozsermaye)) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateRoe_dupont_analizi_hesaplama(input: Roe_dupont_analizi_hesaplamaInput): Roe_dupont_analizi_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
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
    unit: "%",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Roe_dupont_analizi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Roe_dupont_analizi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

