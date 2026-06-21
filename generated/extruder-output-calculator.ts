// Auto-generated from extruder-output-calculator-schema.json
import * as z from 'zod';

export interface Extruder_output_calculatorInput {
  vidaHacim: number;
  devir: number;
  eriyikYogunluk: number;
  verim: number;
  dataConfidence?: number;
}

export const Extruder_output_calculatorInputSchema = z.object({
  vidaHacim: z.number().min(0).default(100),
  devir: z.number().min(0).default(60),
  eriyikYogunluk: z.number().min(0).default(0.9),
  verim: z.number().min(0).default(85),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Extruder_output_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.vidaHacim * input.devir * input.eriyikYogunluk * (input.verim / 100) * 60) / 1000; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateExtruder_output_calculator(input: Extruder_output_calculatorInput): Extruder_output_calculatorOutput {
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
    unit: "kg/h",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Extruder_output_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Extruder_output_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "kg/h",
  breakdownKeys: ["sonuc"],
} as const;

