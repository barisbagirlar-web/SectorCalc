// Auto-generated from fabric-shrinkage-calculator-schema.json
import * as z from 'zod';

export interface Fabric_shrinkage_calculatorInput {
  dataConfidence?: number;
  hamOlcu: number;
  bitmisOlcu: number;
}

export const Fabric_shrinkage_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  hamOlcu: z.number().min(0).default(100),
  bitmisOlcu: z.number().min(0).default(96),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fabric_shrinkage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input["hamOlcu"] - input["bitmisOlcu"]) / Math.max(0.0001, input["hamOlcu"])) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateFabric_shrinkage_calculator(input: Fabric_shrinkage_calculatorInput): Fabric_shrinkage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = ["Waste in material or time indicates process improvement opportunity."];
  const suggestedActions: string[] = ["Optimize drying/cooling parameters for cycle time reduction.","Monitor defects and adjust process conditions accordingly."];
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
    unit: "%",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Fabric_shrinkage_calculatorOutput {
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

export const Fabric_shrinkage_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: [],
} as const;
