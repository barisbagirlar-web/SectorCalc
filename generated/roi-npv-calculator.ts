// Auto-generated from roi-npv-calculator-schema.json
import * as z from 'zod';

export interface Roi_npv_calculatorInput {
  initial_investment: number;
  annual_cash_inflow: number;
  annual_cash_outflow: number;
  discount_rate: number;
  project_life_years: number;
  salvage_value: number;
  inflation_rate: number;
  tax_rate: number;
  dataConfidence?: number;
}

export const Roi_npv_calculatorInputSchema = z.object({
  initial_investment: z.number().min(0).max(100000000).default(100000),
  annual_cash_inflow: z.number().min(0).max(100000000).default(30000),
  annual_cash_outflow: z.number().min(0).max(100000000).default(5000),
  discount_rate: z.number().min(0).max(100).default(10),
  project_life_years: z.number().min(1).max(50).default(5),
  salvage_value: z.number().min(0).max(100000000).default(10000),
  inflation_rate: z.number().min(0).max(100).default(2),
  tax_rate: z.number().min(0).max(100).default(25),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Roi_npv_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (-input.initial_investment + (input.annual_cash_inflow - input.annual_cash_outflow) * (1 - input.tax_rate / 100) * ((1 - (1 + input.discount_rate / 100) ** (-input.project_life_years)) / (input.discount_rate / 100)) + input.salvage_value * (1 + input.inflation_rate / 100) ** (-input.project_life_years)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = (input.annual_cash_inflow - input.annual_cash_outflow) * (1 - input.tax_rate / 100); results["net_annual_cash_flow"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["net_annual_cash_flow"] = Number.NaN; }
  try { const v = (-input.initial_investment + (toNumericFormulaValue(results["net_annual_cash_flow"])) * ((1 - (1 + input.discount_rate / 100) ** (-input.project_life_years)) / (input.discount_rate / 100)) + input.salvage_value * (1 + input.inflation_rate / 100) ** (-input.project_life_years)); results["npv"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["npv"] = Number.NaN; }
  try { const v = (((toNumericFormulaValue(results["net_annual_cash_flow"])) * input.project_life_years + input.salvage_value - input.initial_investment) / input.initial_investment) * 100; results["roi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["roi"] = Number.NaN; }
  return results;
}


export function calculateRoi_npv_calculator(input: Roi_npv_calculatorInput): Roi_npv_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    net_annual_cash_flow: toNumericFormulaValue(values["net_annual_cash_flow"]),
    npv: toNumericFormulaValue(values["npv"]),
    roi: toNumericFormulaValue(values["roi"])
  };
  const hiddenLossDrivers: string[] = ["Inflation erosion of future cash flows","Tax burden reducing net benefits"];
  const suggestedActions: string[] = ["Negotiate lower equipment costs or explore leasing options","Implement lean initiatives to reduce annual operating costs"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Monte Carlo simulation","Sensitivity analysis","Multi-scenario comparison","Automated report generation"],
  };
}


export interface Roi_npv_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { net_annual_cash_flow: number; npv: number; roi: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Roi_npv_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["net_annual_cash_flow","npv","roi"],
} as const;

