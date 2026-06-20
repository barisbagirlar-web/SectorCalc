// Auto-generated from psi-to-pascal-hesaplama-schema.json
import * as z from 'zod';

export interface Psi_to_pascal_hesaplamaInput {
  pressureValue: number;
  param2: number;
  dataConfidence?: number;
}

export const Psi_to_pascal_hesaplamaInputSchema = z.object({
  pressureValue: z.number().min(0).default(100),
  param2: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Psi_to_pascal_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.pressureValue * input.param2 / (input.pressureValue + input.param2 + 1) * 100 + Math.sqrt(Math.abs(input.pressureValue - input.param2)); results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.pressureValue * input.param2 / (input.pressureValue + input.param2 + 1) * 100 + Math.sqrt(Math.abs(input.pressureValue - input.param2)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculatePsi_to_pascal_hesaplama(input: Psi_to_pascal_hesaplamaInput): Psi_to_pascal_hesaplamaOutput {
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
    unit: "Pa",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Psi_to_pascal_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Psi_to_pascal_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "Pa",
  breakdownKeys: ["result"],
} as const;

