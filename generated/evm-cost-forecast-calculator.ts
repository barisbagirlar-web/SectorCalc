// @ts-nocheck
// Auto-generated from evm-cost-forecast-calculator-schema.json
import * as z from 'zod';

export interface Evm_cost_forecast_calculatorInput {
  bac: number;
  ev: number;
  ac: number;
  pv: number;
  percentComplete: number;
  cpi: number;
  spi: number;
  useWeightedMethod: boolean;
}

export const Evm_cost_forecast_calculatorInputSchema = z.object({
  bac: z.number().min(0).max(1000000000).default(1000000),
  ev: z.number().min(0).max(1000000000).default(400000),
  ac: z.number().min(0).max(1000000000).default(500000),
  pv: z.number().min(0).max(1000000000).default(600000),
  percentComplete: z.number().min(0).max(100).default(40),
  cpi: z.number().min(0.01).max(10).default(0.8),
  spi: z.number().min(0.01).max(10).default(0.67),
  useWeightedMethod: z.boolean().default(false),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Evm_cost_forecast_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.bac + input.ev + input.ac; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.bac + input.ev + input.ac; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateEvm_cost_forecast_calculator(input: Evm_cost_forecast_calculatorInput): Evm_cost_forecast_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Monte Carlo simulation","Multi-project roll-up"],
  };
}


export interface Evm_cost_forecast_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
