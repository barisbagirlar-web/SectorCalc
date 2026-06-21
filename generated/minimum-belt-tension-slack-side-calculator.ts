// Auto-generated from minimum-belt-tension-slack-side-calculator-schema.json
import * as z from 'zod';

export interface Minimum_belt_tension_slack_side_calculatorInput {
  guc: number;
  hiz: number;
  sarilmaAcisi: number;
  suratme: number;
  dataConfidence?: number;
}

export const Minimum_belt_tension_slack_side_calculatorInputSchema = z.object({
  guc: z.number().min(0).default(5000),
  hiz: z.number().min(0).default(10),
  sarilmaAcisi: z.number().min(0).default(2.8),
  suratme: z.number().min(0).default(0.3),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Minimum_belt_tension_slack_side_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.exp(input.suratme * input.sarilmaAcisi); results["F1_F2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["F1_F2"] = Number.NaN; }
  try { const v = input.guc / Math.max(0.0001, (input.hiz * (Math.exp(input.suratme * input.sarilmaAcisi) - 1))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateMinimum_belt_tension_slack_side_calculator(input: Minimum_belt_tension_slack_side_calculatorInput): Minimum_belt_tension_slack_side_calculatorOutput {
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
    unit: "N",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Minimum_belt_tension_slack_side_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Minimum_belt_tension_slack_side_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "N",
  breakdownKeys: ["sonuc"],
} as const;

