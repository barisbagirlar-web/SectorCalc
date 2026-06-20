// Auto-generated from sustainability-hesaplama-schema.json
import * as z from 'zod';

export interface Sustainability_hesaplamaInput {
  consumptionAmount: number;
  dataConfidence?: number;
}

export const Sustainability_hesaplamaInputSchema = z.object({
  consumptionAmount: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sustainability_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.consumptionAmount * (1 + input.consumptionAmount/500) + Math.sqrt(input.consumptionAmount) * 5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.consumptionAmount * (1 + input.consumptionAmount/500) + Math.sqrt(input.consumptionAmount) * 5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateSustainability_hesaplama(input: Sustainability_hesaplamaInput): Sustainability_hesaplamaOutput {
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


export interface Sustainability_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Sustainability_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "kWh",
  breakdownKeys: ["result"],
} as const;

