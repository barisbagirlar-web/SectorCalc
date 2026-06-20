// Auto-generated from scope-2-emisyon-hesaplama-schema.json
import * as z from 'zod';

export interface Scope_2_emisyon_hesaplamaInput {
  usage: number;
  rate: number;
  dataConfidence?: number;
}

export const Scope_2_emisyon_hesaplamaInputSchema = z.object({
  usage: z.number().min(0).default(100),
  rate: z.number().min(0).default(0.12),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Scope_2_emisyon_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.usage * input.rate; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.usage * input.rate; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateScope_2_emisyon_hesaplama(input: Scope_2_emisyon_hesaplamaInput): Scope_2_emisyon_hesaplamaOutput {
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
    unit: "kWh",
    premiumRequired: false,
    premiumFeatures: ["PDF report","Scenario comparison"],
  };
}


export interface Scope_2_emisyon_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Scope_2_emisyon_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "kWh",
  breakdownKeys: ["result"],
} as const;

