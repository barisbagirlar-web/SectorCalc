// Auto-generated from indicated-horsepower-calculator-schema.json
import * as z from 'zod';

export interface Indicated_horsepower_calculatorInput {
  dataConfidence?: number;
  basinc: number;
  strok: number;
  alan: number;
  devir: number;
}

export const Indicated_horsepower_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  basinc: z.number().min(0).default(1000000),
  strok: z.number().min(0).default(0.1),
  alan: z.number().min(0).default(0.01),
  devir: z.number().min(0).default(3000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Indicated_horsepower_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["basinc"] * input["strok"] * input["alan"] * input["devir"]) / 60000; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateIndicated_horsepower_calculator(input: Indicated_horsepower_calculatorInput): Indicated_horsepower_calculatorOutput {
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
    unit: "kW",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Indicated_horsepower_calculatorOutput {
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

export const Indicated_horsepower_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "kW",
  breakdownKeys: [],
} as const;
