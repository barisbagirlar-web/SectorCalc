// Auto-generated from traditional-vs-roth-ira-comparison-calculator-schema.json
import * as z from 'zod';

export interface Traditional_vs_roth_ira_comparison_calculatorInput {
  dataConfidence?: number;
  katki: number;
  vergiOrani: number;
  buyumeOrani: number;
  yil: number;
}

export const Traditional_vs_roth_ira_comparison_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  katki: z.number().min(0).default(15000),
  vergiOrani: z.number().min(0).default(25),
  buyumeOrani: z.number().min(0).default(7),
  yil: z.number().min(0).default(20),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Traditional_vs_roth_ira_comparison_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["katki"] * Math.pow(1 + input["buyumeOrani"] / 100, input["yil"])) * (1 - input["vergiOrani"] / 100); results["geleneksel"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["geleneksel"] = Number.NaN; }
  try { const v = (input["katki"] * (1 - input["vergiOrani"] / 100)) * Math.pow(1 + input["buyumeOrani"] / 100, input["yil"]); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateTraditional_vs_roth_ira_comparison_calculator(input: Traditional_vs_roth_ira_comparison_calculatorInput): Traditional_vs_roth_ira_comparison_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {
    "geleneksel": toNumericFormulaValue(values["geleneksel"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review insurance coverage annually.","Consult a retirement planner for personalized strategy."];
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

export interface Traditional_vs_roth_ira_comparison_calculatorOutput {
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

export const Traditional_vs_roth_ira_comparison_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["geleneksel"],
} as const;
