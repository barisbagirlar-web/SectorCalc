// Auto-generated from fabric-weight-calculator-schema.json
import * as z from 'zod';

export interface Fabric_weight_calculatorInput {
  en: number;
  gramaj: number;
  dataConfidence?: number;
}

export const Fabric_weight_calculatorInputSchema = z.object({
  en: z.number().min(0).default(1.5),
  gramaj: z.number().min(0).default(180),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fabric_weight_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.en * input.gramaj) / 1000; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateFabric_weight_calculator(input: Fabric_weight_calculatorInput): Fabric_weight_calculatorOutput {
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
    unit: "kg/m",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Fabric_weight_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Fabric_weight_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "kg/m",
  breakdownKeys: ["sonuc"],
} as const;

