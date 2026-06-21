// Auto-generated from drill-string-torque-calculator-schema.json
import * as z from 'zod';

export interface Drill_string_torque_calculatorInput {
  matkapCapi: number;
  kayaDayanim: number;
  kesiciKatsayi: number;
  dataConfidence?: number;
}

export const Drill_string_torque_calculatorInputSchema = z.object({
  matkapCapi: z.number().min(0).default(0.2),
  kayaDayanim: z.number().min(0).default(100),
  kesiciKatsayi: z.number().min(0).default(0.3),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Drill_string_torque_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (Math.PI * Math.pow(input.matkapCapi, 3) * input.kayaDayanim * 1000000 * input.kesiciKatsayi) / 12; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateDrill_string_torque_calculator(input: Drill_string_torque_calculatorInput): Drill_string_torque_calculatorOutput {
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
    unit: "N.m",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Drill_string_torque_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Drill_string_torque_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "N.m",
  breakdownKeys: ["sonuc"],
} as const;

