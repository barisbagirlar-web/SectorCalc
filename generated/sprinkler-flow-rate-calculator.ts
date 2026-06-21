// Auto-generated from sprinkler-flow-rate-calculator-schema.json
import * as z from 'zod';

export interface Sprinkler_flow_rate_calculatorInput {
  K_Faktoru: number;
  basinc: number;
  dataConfidence?: number;
}

export const Sprinkler_flow_rate_calculatorInputSchema = z.object({
  K_Faktoru: z.number().min(0).default(80),
  basinc: z.number().min(0).default(0.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sprinkler_flow_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.K_Faktoru * Math.sqrt(Math.max(0, input.basinc)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateSprinkler_flow_rate_calculator(input: Sprinkler_flow_rate_calculatorInput): Sprinkler_flow_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["Low Q factor indicates broader frequency response."];
  const suggestedActions: string[] = ["Verify component tolerances affect circuit performance.","Use proper safety equipment for high voltage/current work."];
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
    unit: "L/min",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Sprinkler_flow_rate_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Sprinkler_flow_rate_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "L/min",
  breakdownKeys: ["sonuc"],
} as const;

