// Auto-generated from engineering-strain-calculator-schema.json
import * as z from 'zod';

export interface Engineering_strain_calculatorInput {
  ilkBoy: number;
  sonBoy: number;
  dataConfidence?: number;
}

export const Engineering_strain_calculatorInputSchema = z.object({
  ilkBoy: z.number().min(0).default(1),
  sonBoy: z.number().min(0).default(1.002),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Engineering_strain_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.sonBoy - input.ilkBoy) / Math.max(0.0001, input.ilkBoy); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateEngineering_strain_calculator(input: Engineering_strain_calculatorInput): Engineering_strain_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify calculations with FEA or physical testing.","Use appropriate safety factors for design."];
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
    unit: "strain",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Engineering_strain_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Engineering_strain_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "strain",
  breakdownKeys: ["sonuc"],
} as const;

