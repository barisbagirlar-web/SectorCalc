// Auto-generated from apy-calculator-schema.json
import * as z from 'zod';

export interface Apy_calculatorInput {
  nominal_rate: number;
  compounding_frequency: string;
  time_period_years: number;
  initial_principal: number;
  fee_percentage: number;
  inflation_rate: number;
  tax_rate: number;
  is_continuous_compounding: boolean;
  dataConfidence?: number;
}

export const Apy_calculatorInputSchema = z.object({
  nominal_rate: z.number().min(0).max(100).default(5),
  compounding_frequency: z.enum(['1', '2', '4', '12', '52', '365']).default('12'),
  time_period_years: z.number().min(0.0833).max(100).default(1),
  initial_principal: z.number().min(0).max(100000000).default(10000),
  fee_percentage: z.number().min(0).max(10).default(0.5),
  inflation_rate: z.number().min(0).max(20).default(2),
  tax_rate: z.number().min(0).max(50).default(15),
  is_continuous_compounding: z.boolean().default(false),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Apy_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.time_period_years * input.initial_principal; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.time_period_years * input.initial_principal * (1 + (input.nominal_rate / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.time_period_years * input.initial_principal * (1 + (input.nominal_rate / 100)) * ((input.fee_percentage / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = (input.fee_percentage / 100); results["factor_fee_percentage"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["factor_fee_percentage"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateApy_calculator(input: Apy_calculatorInput): Apy_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
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
    premiumRequired: false,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-period comparison","Automated report generation"],
  };
}


export interface Apy_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
