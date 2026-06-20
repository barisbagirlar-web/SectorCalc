// Auto-generated from tork-donusturucu-schema.json
import * as z from 'zod';

export interface Tork_donusturucuInput {
  powerOutput: number;
  dataConfidence?: number;
}

export const Tork_donusturucuInputSchema = z.object({
  powerOutput: z.number().min(0).default(100),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Tork_donusturucuInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.powerOutput * 1.0 + Math.log(input.powerOutput + 1) * 0.5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.powerOutput * 1.0 + Math.log(input.powerOutput + 1) * 0.5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateTork_donusturucu(input: Tork_donusturucuInput): Tork_donusturucuOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    result: toNumericFormulaValue(values["result"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review assumptions."];
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
    unit: "hp",
    premiumRequired: false,
    premiumFeatures: ["PDF report","Scenario comparison"],
  };
}


export interface Tork_donusturucuOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Tork_donusturucuOutputMeta = {
  primaryKey: "result",
  unit: "hp",
  breakdownKeys: ["result"],
} as const;

