// Auto-generated from weld-heat-input-calculator-schema.json
import * as z from 'zod';

export interface Weld_heat_input_calculatorInput {
  dataConfidence?: number;
  akim: number;
  gerilim: number;
  ilerlemeHiz: number;
  verim: number;
}

export const Weld_heat_input_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  akim: z.number().min(0).default(200),
  gerilim: z.number().min(0).default(25),
  ilerlemeHiz: z.number().min(0).default(5),
  verim: z.number().min(0).default(0.8),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Weld_heat_input_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["akim"] * input["gerilim"] * input["verim"]) / Math.max(0.0001, input["ilerlemeHiz"]); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateWeld_heat_input_calculator(input: Weld_heat_input_calculatorInput): Weld_heat_input_calculatorOutput {
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
    unit: "J/mm",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Weld_heat_input_calculatorOutput {
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

export const Weld_heat_input_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "J/mm",
  breakdownKeys: [],
} as const;
