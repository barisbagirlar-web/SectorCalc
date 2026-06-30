// Auto-generated from interference-fit-contact-pressure-calculator-schema.json
import * as z from 'zod';

export interface Interference_fit_contact_pressure_calculatorInput {
  dataConfidence?: number;
  girisim: number;
  cap: number;
  E1: number;
  E2: number;
}

export const Interference_fit_contact_pressure_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  girisim: z.number().min(0).default(0.00005),
  cap: z.number().min(0).default(0.05),
  E1: z.number().min(0).default(200000000000),
  E2: z.number().min(0).default(200000000000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Interference_fit_contact_pressure_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["girisim"] / Math.max(0.0001, (input["cap"] * (1 / Math.max(0.0001, input["E1"]) + 1 / Math.max(0.0001, input["E2"])))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateInterference_fit_contact_pressure_calculator(input: Interference_fit_contact_pressure_calculatorInput): Interference_fit_contact_pressure_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify calculations with FEA or physical testing.","Use appropriate safety factors for design."];
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
    unit: "Pa",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Interference_fit_contact_pressure_calculatorOutput {
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

export const Interference_fit_contact_pressure_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "Pa",
  breakdownKeys: [],
} as const;
