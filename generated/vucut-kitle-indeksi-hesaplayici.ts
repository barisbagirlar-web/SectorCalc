// Auto-generated from vucut-kitle-indeksi-hesaplayici-schema.json
import * as z from 'zod';

export interface Vucut_kitle_indeksi_hesaplayiciInput {
  height: number;
  weight: number;
  dataConfidence?: number;
}

export const Vucut_kitle_indeksi_hesaplayiciInputSchema = z.object({
  height: z.number().min(0).default(100),
  weight: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Vucut_kitle_indeksi_hesaplayiciInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.height / Math.pow(input.weight/100 + 1, 1.5) * 10 + Math.sqrt(input.height) * 2; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.height / Math.pow(input.weight/100 + 1, 1.5) * 10 + Math.sqrt(input.height) * 2; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateVucut_kitle_indeksi_hesaplayici(input: Vucut_kitle_indeksi_hesaplayiciInput): Vucut_kitle_indeksi_hesaplayiciOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    result: toNumericFormulaValue(values["result"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Consult with a professional.","Review assumptions regularly."];
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
    unit: "cm",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Vucut_kitle_indeksi_hesaplayiciOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Vucut_kitle_indeksi_hesaplayiciOutputMeta = {
  primaryKey: "result",
  unit: "cm",
  breakdownKeys: ["result"],
} as const;

