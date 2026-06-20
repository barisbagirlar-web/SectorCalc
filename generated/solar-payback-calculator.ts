// Auto-generated from solar-payback-calculator-schema.json
import * as z from 'zod';

export interface Solar_payback_calculatorInput {
  system_cost: number;
  annual_production_kwh: number;
  electricity_price_per_kwh: number;
  annual_maintenance_cost: number;
  tax_credit_percent: number;
  degradation_rate: number;
  escalation_rate: number;
  dataConfidence?: number;
}

export const Solar_payback_calculatorInputSchema = z.object({
  system_cost: z.number().default(10000),
  annual_production_kwh: z.number().default(5000),
  electricity_price_per_kwh: z.number().default(0.12),
  annual_maintenance_cost: z.number().default(200),
  tax_credit_percent: z.number().default(26),
  degradation_rate: z.number().default(0.005),
  escalation_rate: z.number().default(0.03),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Solar_payback_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.system_cost * (1 - input.tax_credit_percent / 100); results["net_system_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["net_system_cost"] = Number.NaN; }
  try { const v = input.annual_production_kwh * input.electricity_price_per_kwh - input.annual_maintenance_cost; results["first_year_savings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["first_year_savings"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["net_system_cost"])) / (toNumericFormulaValue(results["first_year_savings"])); results["simple_payback_years"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["simple_payback_years"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["first_year_savings"])) / (toNumericFormulaValue(results["net_system_cost"]))) * 100; results["annual_return_percent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annual_return_percent"] = Number.NaN; }
  return results;
}


export function calculateSolar_payback_calculator(input: Solar_payback_calculatorInput): Solar_payback_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["simple_payback_years"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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
    premiumFeatures: [],
  };
}


export interface Solar_payback_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
