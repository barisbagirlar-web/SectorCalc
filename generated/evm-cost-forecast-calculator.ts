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
  dataConfidence?: number;
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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Evm_cost_forecast_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.bac * input.ev * input.ac * input.pv; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.bac * input.ev * input.ac * input.pv * ((input.percentComplete / 100) * input.cpi * input.spi); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = (input.percentComplete / 100) * input.cpi * input.spi; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateEvm_cost_forecast_calculator(input: Evm_cost_forecast_calculatorInput): Evm_cost_forecast_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
