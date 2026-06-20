// Auto-generated from ksi-to-psi-hesaplama-schema.json
import * as z from 'zod';

export interface Ksi_to_psi_hesaplamaInput {
  pressureValue: number;
  dataConfidence?: number;
}

export const Ksi_to_psi_hesaplamaInputSchema = z.object({
  pressureValue: z.number().min(0).default(100),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ksi_to_psi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.pressureValue * 1.0 + Math.log(input.pressureValue + 1) * 0.5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.pressureValue * 1.0 + Math.log(input.pressureValue + 1) * 0.5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateKsi_to_psi_hesaplama(input: Ksi_to_psi_hesaplamaInput): Ksi_to_psi_hesaplamaOutput {
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
    unit: "Pa",
    premiumRequired: false,
    premiumFeatures: ["PDF report","Scenario comparison"],
  };
}


export interface Ksi_to_psi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Ksi_to_psi_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "Pa",
  breakdownKeys: ["result"],
} as const;

