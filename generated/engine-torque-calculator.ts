// Auto-generated from engine-torque-calculator-schema.json
import * as z from 'zod';

export interface Engine_torque_calculatorInput {
  dataConfidence?: number;
  guc: number;
  devir: number;
}

export const Engine_torque_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  guc: z.number().min(0).default(100),
  devir: z.number().min(0).default(3000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Engine_torque_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["guc"] * 9550) / Math.max(0.0001, input["devir"]); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateEngine_torque_calculator(input: Engine_torque_calculatorInput): Engine_torque_calculatorOutput {
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
    unit: "N.m",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Engine_torque_calculatorOutput {
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

export const Engine_torque_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "N.m",
  breakdownKeys: [],
} as const;
