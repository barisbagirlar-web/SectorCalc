// Auto-generated from worm-gear-efficiency-calculator-schema.json
import * as z from 'zod';

export interface Worm_gear_efficiency_calculatorInput {
  helisAcisi: number;
  suratmeAcisi: number;
  dataConfidence?: number;
}

export const Worm_gear_efficiency_calculatorInputSchema = z.object({
  helisAcisi: z.number().min(0).default(0.35),
  suratmeAcisi: z.number().min(0).default(0.15),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Worm_gear_efficiency_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.tan(input.helisAcisi) / Math.max(0.0001, Math.tan(input.helisAcisi + input.suratmeAcisi)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateWorm_gear_efficiency_calculator(input: Worm_gear_efficiency_calculatorInput): Worm_gear_efficiency_calculatorOutput {
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
    unit: "efficiency",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Worm_gear_efficiency_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Worm_gear_efficiency_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "efficiency",
  breakdownKeys: ["sonuc"],
} as const;

