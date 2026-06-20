// Auto-generated from active-metabolic-oran-hesaplama-schema.json
import * as z from 'zod';

export interface Active_metabolic_oran_hesaplamaInput {
  bodyWeight: number;
  dataConfidence?: number;
}

export const Active_metabolic_oran_hesaplamaInputSchema = z.object({
  bodyWeight: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Active_metabolic_oran_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.pow(input.bodyWeight / 100, 2) * 100 + Math.sqrt(input.bodyWeight) * 2; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = Math.pow(input.bodyWeight / 100, 2) * 100 + Math.sqrt(input.bodyWeight) * 2; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateActive_metabolic_oran_hesaplama(input: Active_metabolic_oran_hesaplamaInput): Active_metabolic_oran_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    result: toNumericFormulaValue(values["result"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review assumptions."];
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
    premiumFeatures: ["PDF report","Scenario comparison"],
  };
}


export interface Active_metabolic_oran_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Active_metabolic_oran_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "kg",
  breakdownKeys: ["result"],
} as const;

