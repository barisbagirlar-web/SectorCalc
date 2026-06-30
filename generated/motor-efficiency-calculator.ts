// Auto-generated from motor-efficiency-calculator-schema.json
import * as z from 'zod';

export interface Motor_efficiency_calculatorInput {
  dataConfidence?: number;
  cikisGuc: number;
  girisGuc: number;
}

export const Motor_efficiency_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  cikisGuc: z.number().min(0).default(750),
  girisGuc: z.number().min(0).default(1000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Motor_efficiency_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["cikisGuc"] / Math.max(0.0001, input["girisGuc"])) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateMotor_efficiency_calculator(input: Motor_efficiency_calculatorInput): Motor_efficiency_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = ["High fuel/energy consumption indicates efficiency losses."];
  const suggestedActions: string[] = ["Regular maintenance improves overall equipment efficiency.","Simulate real-world driving conditions for accurate range estimates."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    ["sonuc"]: totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    unit: "%",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Motor_efficiency_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: Record<string, number>;
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
  [key: string]: unknown;
}

export const Motor_efficiency_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: [],
} as const;
