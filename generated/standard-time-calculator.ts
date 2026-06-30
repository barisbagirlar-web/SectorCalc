// Auto-generated from standard-time-calculator-schema.json
import * as z from 'zod';

export interface Standard_time_calculatorInput {
  dataConfidence?: number;
  gozlenenSure: number;
  performans: number;
  ekSure: number;
}

export const Standard_time_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  gozlenenSure: z.number().min(0).default(10),
  performans: z.number().min(20).max(150).default(90),
  ekSure: z.number().min(0).max(100).default(15),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Standard_time_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["gozlenenSure"] * (input["performans"] / 100); results["normal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normal"] = Number.NaN; }
  try { const v = (input["gozlenenSure"] * (input["performans"] / 100)) * (1 + input["ekSure"] / 100); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateStandard_time_calculator(input: Standard_time_calculatorInput): Standard_time_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Conduct regular OEE audits for improvement.","Use SMED to reduce setup times."];
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
    unit: "min",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Standard_time_calculatorOutput {
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

export const Standard_time_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "min",
  breakdownKeys: ["normal"],
} as const;
