// Auto-generated from mud-annular-velocity-calculator-schema.json
import * as z from 'zod';

export interface Mud_annular_velocity_calculatorInput {
  camurDebi: number;
  kuyuCapi: number;
  matkapCapi: number;
  dataConfidence?: number;
}

export const Mud_annular_velocity_calculatorInputSchema = z.object({
  camurDebi: z.number().min(0).default(0.01),
  kuyuCapi: z.number().min(0).default(0.3),
  matkapCapi: z.number().min(0).default(0.1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Mud_annular_velocity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (4 * input.camurDebi) / Math.max(0.0001, (Math.PI * (input.kuyuCapi * input.kuyuCapi - input.matkapCapi * input.matkapCapi))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateMud_annular_velocity_calculator(input: Mud_annular_velocity_calculatorInput): Mud_annular_velocity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["Low efficiency may indicate equipment or process issues."];
  const suggestedActions: string[] = ["Calibrate all measuring equipment regularly.","Use site-specific data when available."];
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
    unit: "m/s",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Mud_annular_velocity_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Mud_annular_velocity_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "m/s",
  breakdownKeys: ["sonuc"],
} as const;

