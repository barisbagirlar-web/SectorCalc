// Auto-generated from mil-tasarimi-asme-hesaplama-schema.json
import * as z from 'zod';

export interface Mil_tasarimi_asme_hesaplamaInput {
  moment: number;
  tork: number;
  akmaGerilmesi: number;
  dataConfidence?: number;
}

export const Mil_tasarimi_asme_hesaplamaInputSchema = z.object({
  moment: z.number().min(0).default(500),
  tork: z.number().min(0).default(1000),
  akmaGerilmesi: z.number().min(0).default(300000000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Mil_tasarimi_asme_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.pow((16 / (Math.PI * 300e6)) * Math.sqrt(Math.max(0, 500*500 + 0.75*1000*1000)), 1/3); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateMil_tasarimi_asme_hesaplama(input: Mil_tasarimi_asme_hesaplamaInput): Mil_tasarimi_asme_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify calculations with FEA or physical testing.","Use appropriate safety factors for design."];
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
    unit: "m",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Mil_tasarimi_asme_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Mil_tasarimi_asme_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "m",
  breakdownKeys: ["sonuc"],
} as const;

