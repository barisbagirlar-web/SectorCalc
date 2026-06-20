// Auto-generated from motor-hesaplama-schema.json
import * as z from 'zod';

export interface Motor_hesaplamaInput {
  powerOutput: number;
  torqueValue: number;
  dataConfidence?: number;
}

export const Motor_hesaplamaInputSchema = z.object({
  powerOutput: z.number().min(0).default(100),
  torqueValue: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Motor_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.5 * input.powerOutput * input.torqueValue * input.torqueValue / 1000 + input.powerOutput * input.torqueValue / 100; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = 0.5 * input.powerOutput * input.torqueValue * input.torqueValue / 1000 + input.powerOutput * input.torqueValue / 100; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateMotor_hesaplama(input: Motor_hesaplamaInput): Motor_hesaplamaOutput {
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
    unit: "hp",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Motor_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Motor_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "hp",
  breakdownKeys: ["result"],
} as const;

