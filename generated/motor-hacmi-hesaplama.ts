// Auto-generated from motor-hacmi-hesaplama-schema.json
import * as z from 'zod';

export interface Motor_hacmi_hesaplamaInput {
  powerOutput: number;
  dataConfidence?: number;
}

export const Motor_hacmi_hesaplamaInputSchema = z.object({
  powerOutput: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Motor_hacmi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.powerOutput * (1 + input.powerOutput/500) + Math.sqrt(input.powerOutput) * 5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.powerOutput * (1 + input.powerOutput/500) + Math.sqrt(input.powerOutput) * 5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateMotor_hacmi_hesaplama(input: Motor_hacmi_hesaplamaInput): Motor_hacmi_hesaplamaOutput {
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
    unit: "hp",
    premiumRequired: false,
    premiumFeatures: ["PDF report","Scenario comparison"],
  };
}


export interface Motor_hacmi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Motor_hacmi_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "hp",
  breakdownKeys: ["result"],
} as const;

