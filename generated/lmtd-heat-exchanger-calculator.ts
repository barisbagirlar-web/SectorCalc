// Auto-generated from lmtd-heat-exchanger-calculator-schema.json
import * as z from 'zod';

export interface Lmtd_heat_exchanger_calculatorInput {
  massFlowRate: number;
  tHotIn: number;
  tHotOut: number;
  tColdIn: number;
  tColdOut: number;
  cp: number;
  uClean: number;
  rFoulingHot: number;
  rFoulingCold: number;
  deltaT: number;
  cMin: number;
  dataConfidence?: number;
}

export const Lmtd_heat_exchanger_calculatorInputSchema = z.object({
  massFlowRate: z.number().min(0).default(0),
  tHotIn: z.number().min(0).default(0),
  tHotOut: z.number().min(0).default(0),
  tColdIn: z.number().min(0).default(0),
  tColdOut: z.number().min(0).default(0),
  cp: z.number().min(0).default(0),
  uClean: z.number().min(0).default(0),
  rFoulingHot: z.number().min(0).default(0),
  rFoulingCold: z.number().min(0).default(0),
  deltaT: z.number().min(0).default(0),
  cMin: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Lmtd_heat_exchanger_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.massFlowRate * input.tHotIn * input.tHotOut * input.tColdIn; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.massFlowRate * input.tHotIn * input.tHotOut * input.tColdIn * (input.tColdOut * input.cp * input.uClean * input.rFoulingHot * input.rFoulingCold * input.deltaT * input.cMin); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.tColdOut * input.cp * input.uClean * input.rFoulingHot * input.rFoulingCold * input.deltaT * input.cMin; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateLmtd_heat_exchanger_calculator(input: Lmtd_heat_exchanger_calculatorInput): Lmtd_heat_exchanger_calculatorOutput {
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


export interface Lmtd_heat_exchanger_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Lmtd_heat_exchanger_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

