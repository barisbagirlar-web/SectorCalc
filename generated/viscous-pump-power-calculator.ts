// Auto-generated from viscous-pump-power-calculator-schema.json
import * as z from 'zod';

export interface Viscous_pump_power_calculatorInput {
  debi: number;
  basincDusumu: number;
  pompaVerim: number;
  dataConfidence?: number;
}

export const Viscous_pump_power_calculatorInputSchema = z.object({
  debi: z.number().min(0).default(0.005),
  basincDusumu: z.number().min(0).default(200000),
  pompaVerim: z.number().min(0).default(75),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Viscous_pump_power_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.debi * input.basincDusumu) / Math.max(0.0001, (input.pompaVerim / 100)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateViscous_pump_power_calculator(input: Viscous_pump_power_calculatorInput): Viscous_pump_power_calculatorOutput {
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
    unit: "W",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Viscous_pump_power_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Viscous_pump_power_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "W",
  breakdownKeys: ["sonuc"],
} as const;

