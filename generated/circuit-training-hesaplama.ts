// Auto-generated from circuit-training-hesaplama-schema.json
import * as z from 'zod';

export interface Circuit_training_hesaplamaInput {
  maxWeight: number;
  repCount: number;
  dataConfidence?: number;
}

export const Circuit_training_hesaplamaInputSchema = z.object({
  maxWeight: z.number().min(0).default(100),
  repCount: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Circuit_training_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.maxWeight * input.repCount / 1000 + Math.pow(input.maxWeight, 2) / (input.repCount + 1); results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.maxWeight * input.repCount / 1000 + Math.pow(input.maxWeight, 2) / (input.repCount + 1); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateCircuit_training_hesaplama(input: Circuit_training_hesaplamaInput): Circuit_training_hesaplamaOutput {
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


export interface Circuit_training_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Circuit_training_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "kg",
  breakdownKeys: ["result"],
} as const;

