// Auto-generated from yard-to-fit-hesaplama-schema.json
import * as z from 'zod';

export interface Yard_to_fit_hesaplamaInput {
  lengthValue: number;
  param2: number;
  dataConfidence?: number;
}

export const Yard_to_fit_hesaplamaInputSchema = z.object({
  lengthValue: z.number().min(0).default(100),
  param2: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Yard_to_fit_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.lengthValue * input.param2 / (input.lengthValue + input.param2 + 1) * 100 + Math.sqrt(Math.abs(input.lengthValue - input.param2)); results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.lengthValue * input.param2 / (input.lengthValue + input.param2 + 1) * 100 + Math.sqrt(Math.abs(input.lengthValue - input.param2)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateYard_to_fit_hesaplama(input: Yard_to_fit_hesaplamaInput): Yard_to_fit_hesaplamaOutput {
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
    unit: "m",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Yard_to_fit_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Yard_to_fit_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "m",
  breakdownKeys: ["result"],
} as const;

