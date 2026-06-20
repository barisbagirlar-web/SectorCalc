// Auto-generated from polyphasic-sleep-hesaplama-schema.json
import * as z from 'zod';

export interface Polyphasic_sleep_hesaplamaInput {
  stressScore: number;
  severity: number;
  dataConfidence?: number;
}

export const Polyphasic_sleep_hesaplamaInputSchema = z.object({
  stressScore: z.number().min(0).default(100),
  severity: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Polyphasic_sleep_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.stressScore * Math.exp(-input.severity / 100) + input.stressScore * input.severity / 1000; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.stressScore * Math.exp(-input.severity / 100) + input.stressScore * input.severity / 1000; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculatePolyphasic_sleep_hesaplama(input: Polyphasic_sleep_hesaplamaInput): Polyphasic_sleep_hesaplamaOutput {
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
    unit: "points",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Polyphasic_sleep_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Polyphasic_sleep_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "points",
  breakdownKeys: ["result"],
} as const;

