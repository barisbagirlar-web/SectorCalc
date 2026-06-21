// Auto-generated from gear-root-bending-stress-lewis-calculator-schema.json
import * as z from 'zod';

export interface Gear_root_bending_stress_lewis_calculatorInput {
  yuk: number;
  modul: number;
  genislik: number;
  formFaktoru: number;
  dataConfidence?: number;
}

export const Gear_root_bending_stress_lewis_calculatorInputSchema = z.object({
  yuk: z.number().min(0).default(5000),
  modul: z.number().min(0).default(0.005),
  genislik: z.number().min(0).default(0.04),
  formFaktoru: z.number().min(0).default(0.35),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Gear_root_bending_stress_lewis_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.yuk / Math.max(0.0001, (input.modul * input.genislik * input.formFaktoru)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateGear_root_bending_stress_lewis_calculator(input: Gear_root_bending_stress_lewis_calculatorInput): Gear_root_bending_stress_lewis_calculatorOutput {
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
    unit: "Pa",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Gear_root_bending_stress_lewis_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Gear_root_bending_stress_lewis_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "Pa",
  breakdownKeys: ["sonuc"],
} as const;

