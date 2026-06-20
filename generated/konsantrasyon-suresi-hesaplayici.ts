// Auto-generated from konsantrasyon-suresi-hesaplayici-schema.json
import * as z from 'zod';

export interface Konsantrasyon_suresi_hesaplayiciInput {
  timeValue: number;
  frequency: number;
  dataConfidence?: number;
}

export const Konsantrasyon_suresi_hesaplayiciInputSchema = z.object({
  timeValue: z.number().min(0).default(100),
  frequency: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Konsantrasyon_suresi_hesaplayiciInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.timeValue * Math.exp(-input.frequency / 100) + input.timeValue * input.frequency / 1000; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.timeValue * Math.exp(-input.frequency / 100) + input.timeValue * input.frequency / 1000; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateKonsantrasyon_suresi_hesaplayici(input: Konsantrasyon_suresi_hesaplayiciInput): Konsantrasyon_suresi_hesaplayiciOutput {
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
    unit: "min",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Konsantrasyon_suresi_hesaplayiciOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Konsantrasyon_suresi_hesaplayiciOutputMeta = {
  primaryKey: "result",
  unit: "min",
  breakdownKeys: ["result"],
} as const;

