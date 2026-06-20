// Auto-generated from transformer-hesaplama-schema.json
import * as z from 'zod';

export interface Transformer_hesaplamaInput {
  resistance: number;
  voltage: number;
  dataConfidence?: number;
}

export const Transformer_hesaplamaInputSchema = z.object({
  resistance: z.number().min(0).default(100),
  voltage: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Transformer_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.resistance * input.voltage / 1000 + Math.pow(input.resistance, 2) / (input.voltage + 1); results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.resistance * input.voltage / 1000 + Math.pow(input.resistance, 2) / (input.voltage + 1); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateTransformer_hesaplama(input: Transformer_hesaplamaInput): Transformer_hesaplamaOutput {
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
    unit: "Ω",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Transformer_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Transformer_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "Ω",
  breakdownKeys: ["result"],
} as const;

