// Auto-generated from spring-design-calculator-schema.json
import * as z from 'zod';

export interface Spring_design_calculatorInput {
  wireDiameter: number;
  meanCoilDiameter: number;
  activeCoils: number;
  force: number;
  shearModulus: number;
  density: number;
  dataConfidence?: number;
}

export const Spring_design_calculatorInputSchema = z.object({
  wireDiameter: z.number().min(0).default(0),
  meanCoilDiameter: z.number().min(0).default(0),
  activeCoils: z.number().min(0).default(0),
  force: z.number().min(0).default(0),
  shearModulus: z.number().min(0).default(0),
  density: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Spring_design_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.wireDiameter * input.meanCoilDiameter * input.activeCoils * input.force; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.wireDiameter * input.meanCoilDiameter * input.activeCoils * input.force * (input.shearModulus * input.density); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.shearModulus * input.density; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateSpring_design_calculator(input: Spring_design_calculatorInput): Spring_design_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    normalized_product: toNumericFormulaValue(values["normalized_product"]),
    adjustment_factor: toNumericFormulaValue(values["adjustment_factor"])
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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
    unit: "units",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Verdict report"],
  };
}


export interface Spring_design_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Spring_design_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

