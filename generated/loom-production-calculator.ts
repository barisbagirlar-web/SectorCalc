// Auto-generated from loom-production-calculator-schema.json
import * as z from 'zod';

export interface Loom_production_calculatorInput {
  atimSayisi: number;
  durusSure: number;
  vardiyaSure: number;
  kumasSikligi: number;
  dataConfidence?: number;
}

export const Loom_production_calculatorInputSchema = z.object({
  atimSayisi: z.number().min(0).default(800),
  durusSure: z.number().min(0).default(20),
  vardiyaSure: z.number().min(0).default(480),
  kumasSikligi: z.number().min(0).default(25),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Loom_production_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.vardiyaSure - input.durusSure; results["verimliSure"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["verimliSure"] = Number.NaN; }
  try { const v = (input.atimSayisi * (input.vardiyaSure - input.durusSure)) / Math.max(0.0001, (input.kumasSikligi * 100)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateLoom_production_calculator(input: Loom_production_calculatorInput): Loom_production_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["Waste in material or time indicates process improvement opportunity."];
  const suggestedActions: string[] = ["Optimize drying/cooling parameters for cycle time reduction.","Monitor defects and adjust process conditions accordingly."];
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
    unit: "m",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Loom_production_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Loom_production_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "m",
  breakdownKeys: ["sonuc"],
} as const;

