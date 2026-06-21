// Auto-generated from mooring-line-load-calculator-schema.json
import * as z from 'zod';

export interface Mooring_line_load_calculatorInput {
  halatCapi: number;
  malzemeKatsayisi: number;
  guvenlikFaktoru: number;
  dataConfidence?: number;
}

export const Mooring_line_load_calculatorInputSchema = z.object({
  halatCapi: z.number().min(0).default(20),
  malzemeKatsayisi: z.number().min(0).default(800),
  guvenlikFaktoru: z.number().min(0).default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Mooring_line_load_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (Math.PI * Math.pow(input.halatCapi / 2, 2) * input.malzemeKatsayisi) / 1000; results["kopmaYuku"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["kopmaYuku"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["kopmaYuku"])) / Math.max(0.0001, input.guvenlikFaktoru); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateMooring_line_load_calculator(input: Mooring_line_load_calculatorInput): Mooring_line_load_calculatorOutput {
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
    unit: "kN",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Mooring_line_load_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Mooring_line_load_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "kN",
  breakdownKeys: ["sonuc"],
} as const;

