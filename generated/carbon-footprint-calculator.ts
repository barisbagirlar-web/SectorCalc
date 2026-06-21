// Auto-generated from carbon-footprint-calculator-schema.json
import * as z from 'zod';

export interface Carbon_footprint_calculatorInput {
  fuelData: number;
  fuelEF: number;
  fugitiveEmissions: number;
  electricity: number;
  gridEF: number;
  recEF: number;
  scope3Activities: number;
  scope3EF: number;
  revenue: number;
  uncertaintyActivities: number;
  efErrors: number;
  dataConfidence?: number;
}

export const Carbon_footprint_calculatorInputSchema = z.object({
  fuelData: z.number().min(0).default(0),
  fuelEF: z.number().min(0).default(0),
  fugitiveEmissions: z.number().min(0).default(0),
  electricity: z.number().min(0).default(0),
  gridEF: z.number().min(0).default(0),
  recEF: z.number().min(0).default(0),
  scope3Activities: z.number().min(0).default(0),
  scope3EF: z.number().min(0).default(0),
  revenue: z.number().min(0).default(0),
  uncertaintyActivities: z.number().min(0).default(0),
  efErrors: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Carbon_footprint_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fuelData * input.revenue; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["base_cost"] = Number.NaN; }
  try { const v = input.fuelData * input.revenue; results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjusted_cost"] = Number.NaN; }
  try { const v = input.fuelData * input.revenue * 1 * (input.fuelEF * input.fugitiveEmissions * input.electricity * input.gridEF); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.fuelEF; results["factor_fuelEF"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["factor_fuelEF"] = Number.NaN; }
  try { const v = input.fugitiveEmissions; results["factor_fugitiveEmissions"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["factor_fugitiveEmissions"] = Number.NaN; }
  try { const v = input.electricity; results["factor_electricity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["factor_electricity"] = Number.NaN; }
  try { const v = input.gridEF; results["factor_gridEF"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["factor_gridEF"] = Number.NaN; }
  return results;
}


export function calculateCarbon_footprint_calculator(input: Carbon_footprint_calculatorInput): Carbon_footprint_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    base_cost: toNumericFormulaValue(values["base_cost"]),
    adjusted_cost: toNumericFormulaValue(values["adjusted_cost"]),
    factor_fuelEF: toNumericFormulaValue(values["factor_fuelEF"]),
    factor_fugitiveEmissions: toNumericFormulaValue(values["factor_fugitiveEmissions"]),
    factor_electricity: toNumericFormulaValue(values["factor_electricity"]),
    factor_gridEF: toNumericFormulaValue(values["factor_gridEF"])
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
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
    unit: "USD",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Verdict report"],
  };
}


export interface Carbon_footprint_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { base_cost: number; adjusted_cost: number; factor_fuelEF: number; factor_fugitiveEmissions: number; factor_electricity: number; factor_gridEF: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Carbon_footprint_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["base_cost","adjusted_cost","factor_fuelEF","factor_fugitiveEmissions","factor_electricity","factor_gridEF"],
} as const;

