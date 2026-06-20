// Auto-generated from fitness-freshness-hesaplama-schema.json
import * as z from 'zod';

export interface Fitness_freshness_hesaplamaInput {
  maxWeight: number;
  repCount: number;
  dataConfidence?: number;
}

export const Fitness_freshness_hesaplamaInputSchema = z.object({
  maxWeight: z.number().min(0).default(100),
  repCount: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fitness_freshness_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.maxWeight / Math.pow(input.repCount/100 + 1, 1.5) * 10 + Math.sqrt(input.maxWeight) * 2; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.maxWeight / Math.pow(input.repCount/100 + 1, 1.5) * 10 + Math.sqrt(input.maxWeight) * 2; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateFitness_freshness_hesaplama(input: Fitness_freshness_hesaplamaInput): Fitness_freshness_hesaplamaOutput {
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
    unit: "kg",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Fitness_freshness_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Fitness_freshness_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "kg",
  breakdownKeys: ["result"],
} as const;

