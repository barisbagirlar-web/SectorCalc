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

function evaluateAllFormulas(input: Apy_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.is_continuous_compounding) ? (Math.exp(input.nominal_rate/100) - 1) : ((1 + (input.nominal_rate/100)/input.compounding_frequency)^input.compounding_frequency - 1)); results["effective_rate"] = Number.isFinite(v) ? v : 0; } catch { results["effective_rate"] = 0; }
  try { const v = input.initial_principal * (1 + (results["effective_rate"] ?? 0))^input.time_period_years; results["gross_future_value"] = Number.isFinite(v) ? v : 0; } catch { results["gross_future_value"] = 0; }
  try { const v = (1 - input.fee_percentage/100)^input.time_period_years; results["fee_adjustment"] = Number.isFinite(v) ? v : 0; } catch { results["fee_adjustment"] = 0; }
  try { const v = (results["gross_future_value"] ?? 0) * (results["fee_adjustment"] ?? 0); results["net_future_value"] = Number.isFinite(v) ? v : 0; } catch { results["net_future_value"] = 0; }
  try { const v = 1 - input.tax_rate/100; results["tax_adjustment"] = Number.isFinite(v) ? v : 0; } catch { results["tax_adjustment"] = 0; }
  try { const v = input.initial_principal + ((results["net_future_value"] ?? 0) - input.initial_principal) * (results["tax_adjustment"] ?? 0); results["after_tax_future_value"] = Number.isFinite(v) ? v : 0; } catch { results["after_tax_future_value"] = 0; }
  try { const v = (((results["after_tax_future_value"] ?? 0) / input.initial_principal)^(1/input.time_period_years) - 1) * 100; results["apy_nominal"] = Number.isFinite(v) ? v : 0; } catch { results["apy_nominal"] = 0; }
  try { const v = ((1 + (results["apy_nominal"] ?? 0)/100) / (1 + input.inflation_rate/100) - 1) * 100; results["apy_real"] = Number.isFinite(v) ? v : 0; } catch { results["apy_real"] = 0; }
  return results;
}


export function calculateApy_calculator(input: Apy_calculatorInput): Apy_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["apy_nominal"] ?? 0;
  const breakdown = {
    effective_rate: values["effective_rate"] ?? 0,
    gross_future_value: values["gross_future_value"] ?? 0,
    fee_adjustment: values["fee_adjustment"] ?? 0,
    net_future_value: values["net_future_value"] ?? 0,
    after_tax_future_value: values["after_tax_future_value"] ?? 0,
    apy_real: values["apy_real"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Fee Erosion","Tax Erosion","Inflation Erosion","Compounding Frequency Gap"];
  const suggestedActions: string[] = ["Negotiate Lower Fees","Increase Compounding Frequency","Tax-Loss Harvesting","Inflation-Protected Securities","Enable Continuous Compounding"];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
  breakdown: { effective_rate: number; gross_future_value: number; fee_adjustment: number; net_future_value: number; after_tax_future_value: number; apy_real: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
