// Auto-generated from spring-force-hookes-law-calculator-schema.json
import * as z from 'zod';

export interface Spring_force_hookes_law_calculatorInput {
  dataConfidence?: number;
  yayKatsayisi: number;
  deplasman: number;
}

export const Spring_force_hookes_law_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  yayKatsayisi: z.number().min(0).default(500),
  deplasman: z.number().min(0).default(0.1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Spring_force_hookes_law_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["yayKatsayisi"] * input["deplasman"]; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateSpring_force_hookes_law_calculator(input: Spring_force_hookes_law_calculatorInput): Spring_force_hookes_law_calculatorOutput {
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
    unit: "N",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Spring_force_hookes_law_calculatorOutput {
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

export const Spring_force_hookes_law_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "N",
  breakdownKeys: [],
} as const;
