// @ts-nocheck
// Auto-generated from machine-economic-life-calculator-schema.json
import * as z from 'zod';

export interface Machine_economic_life_calculatorInput {
  purchase_price: number;
  salvage_value: number;
  useful_life_years: number;
  annual_operating_cost: number;
  operating_cost_escalation_rate: number;
  discount_rate: number;
  annual_production_units: number;
  revenue_per_unit: number;
}

export const Machine_economic_life_calculatorInputSchema = z.object({
  purchase_price: z.number().min(1000).max(10000000).default(100000),
  salvage_value: z.number().min(0).max(5000000).default(10000),
  useful_life_years: z.number().min(1).max(50).default(10),
  annual_operating_cost: z.number().min(0).max(1000000).default(15000),
  operating_cost_escalation_rate: z.number().min(0).max(20).default(3),
  discount_rate: z.number().min(0).max(30).default(8),
  annual_production_units: z.number().min(0).max(10000000).default(50000),
  revenue_per_unit: z.number().min(0).max(1000).default(5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Machine_economic_life_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.useful_life_years * input.purchase_price; results["base_cost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.useful_life_years * input.purchase_price * (1 + (input.operating_cost_escalation_rate / 100)); results["adjusted_cost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.useful_life_years * input.purchase_price * (1 + (input.operating_cost_escalation_rate / 100)) * (input.salvage_value); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.salvage_value; results["factor_salvage_value"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["factor_salvage_value"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMachine_economic_life_calculator(input: Machine_economic_life_calculatorInput): Machine_economic_life_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Monte Carlo simulation","Sensitivity analysis","Benchmarking against industry standards"],
  };
}


export interface Machine_economic_life_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
