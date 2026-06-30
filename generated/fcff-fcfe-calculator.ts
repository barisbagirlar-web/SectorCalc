// Auto-generated from fcff-fcfe-calculator-schema.json
import * as z from 'zod';

export interface Fcff_fcfe_calculatorInput {
  dataConfidence?: number;
  netKar: number;
  amortisman: number;
  isletmeSermayesi: number;
  capex: number;
  borc: number;
}

export const Fcff_fcfe_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  netKar: z.number().min(0).default(150000),
  amortisman: z.number().min(0).default(30000),
  isletmeSermayesi: z.number().min(0).default(10000),
  capex: z.number().min(0).default(40000),
  borc: z.number().min(0).default(20000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fcff_fcfe_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["netKar"] + input["amortisman"] - input["isletmeSermayesi"] - input["capex"]; results["fcff"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fcff"] = Number.NaN; }
  try { const v = input["netKar"] + input["amortisman"] - input["isletmeSermayesi"] - input["capex"] + input["borc"]; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateFcff_fcfe_calculator(input: Fcff_fcfe_calculatorInput): Fcff_fcfe_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {
    "fcff": toNumericFormulaValue(values["fcff"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify inputs before making financial decisions.","Consult a licensed financial advisor for personalized advice."];
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
    unit: "USD",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Fcff_fcfe_calculatorOutput {
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

export const Fcff_fcfe_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["fcff"],
} as const;
