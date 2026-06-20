// Auto-generated from running-mesafe-hesaplama-schema.json
import * as z from 'zod';

export interface Running_mesafe_hesaplamaInput {
  lengthValue: number;
  param2: number;
  dataConfidence?: number;
}

export const Running_mesafe_hesaplamaInputSchema = z.object({
  lengthValue: z.number().min(0).default(100),
  param2: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Running_mesafe_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.lengthValue / input.param2 * 100 + Math.sqrt(input.lengthValue * input.param2) / 10; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.lengthValue / input.param2 * 100 + Math.sqrt(input.lengthValue * input.param2) / 10; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateRunning_mesafe_hesaplama(input: Running_mesafe_hesaplamaInput): Running_mesafe_hesaplamaOutput {
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


export interface Running_mesafe_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Running_mesafe_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "m",
  breakdownKeys: ["result"],
} as const;

