// Auto-generated from kiralama-vs-satin-alma-karsilastiricisi-schema.json
import * as z from 'zod';

export interface Kiralama_vs_satin_alma_karsilastiricisiInput {
  initialAmount: number;
  inflationRate: number;
  dataConfidence?: number;
}

export const Kiralama_vs_satin_alma_karsilastiricisiInputSchema = z.object({
  initialAmount: z.number().min(0).default(100),
  inflationRate: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kiralama_vs_satin_alma_karsilastiricisiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.initialAmount * input.inflationRate / 100 + Math.pow(input.initialAmount - input.inflationRate, 2) / 1000; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.initialAmount * input.inflationRate / 100 + Math.pow(input.initialAmount - input.inflationRate, 2) / 1000; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateKiralama_vs_satin_alma_karsilastiricisi(input: Kiralama_vs_satin_alma_karsilastiricisiInput): Kiralama_vs_satin_alma_karsilastiricisiOutput {
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
    unit: "currency",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Kiralama_vs_satin_alma_karsilastiricisiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kiralama_vs_satin_alma_karsilastiricisiOutputMeta = {
  primaryKey: "result",
  unit: "currency",
  breakdownKeys: ["result"],
} as const;

