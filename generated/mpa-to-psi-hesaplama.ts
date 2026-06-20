// Auto-generated from mpa-to-psi-hesaplama-schema.json
import * as z from 'zod';

export interface Mpa_to_psi_hesaplamaInput {
  pressureValue: number;
  param2: number;
  dataConfidence?: number;
}

export const Mpa_to_psi_hesaplamaInputSchema = z.object({
  pressureValue: z.number().min(0).default(100),
  param2: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Mpa_to_psi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.pressureValue * input.param2 / (input.pressureValue + input.param2 + 1) * 100 + Math.sqrt(Math.abs(input.pressureValue - input.param2)); results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.pressureValue * input.param2 / (input.pressureValue + input.param2 + 1) * 100 + Math.sqrt(Math.abs(input.pressureValue - input.param2)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateMpa_to_psi_hesaplama(input: Mpa_to_psi_hesaplamaInput): Mpa_to_psi_hesaplamaOutput {
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


export interface Mpa_to_psi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Mpa_to_psi_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "Pa",
  breakdownKeys: ["result"],
} as const;

