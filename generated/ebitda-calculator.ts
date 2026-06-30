// Auto-generated from ebitda-calculator-schema.json
import * as z from 'zod';

export interface Ebitda_calculatorInput {
  dataConfidence?: number;
  netKar: number;
  faiz: number;
  vergi: number;
  amortisman: number;
}

export const Ebitda_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  netKar: z.number().min(0).default(150000),
  faiz: z.number().min(0).default(20000),
  vergi: z.number().min(0).default(45000),
  amortisman: z.number().min(0).default(30000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ebitda_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["netKar"] * input["faiz"] * input["vergi"] * input["amortisman"]; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input["netKar"] * input["faiz"] * input["vergi"] * input["amortisman"]; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}

export function calculateEbitda_calculator(input: Ebitda_calculatorInput): Ebitda_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown: Record<string, number> = {
    "0": toNumericFormulaValue(values["0"])
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    ["result"]: totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    unit: "units",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Ebitda_calculatorOutput {
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

export const Ebitda_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product"],
} as const;
