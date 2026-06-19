// Auto-generated from lcm-calculator-schema.json
import * as z from 'zod';

export interface Lcm_calculatorInput {
  acquisition_cost: number;
  expected_life_years: number;
  annual_operating_hours: number;
  maintenance_strategy: string;
  labor_rate: number;
  parts_cost_per_incident: number;
  downtime_cost_per_hour: number;
  energy_cost_per_kwh: number;
  dataConfidence?: number;
}

export const Lcm_calculatorInputSchema = z.object({
  acquisition_cost: z.number().min(0).max(10000000).default(100000),
  expected_life_years: z.number().min(1).max(50).default(10),
  annual_operating_hours: z.number().min(0).max(8760).default(2000),
  maintenance_strategy: z.enum(['preventive', 'predictive', 'reactive']).default('preventive'),
  labor_rate: z.number().min(0).max(500).default(50),
  parts_cost_per_incident: z.number().min(0).max(100000).default(500),
  downtime_cost_per_hour: z.number().min(0).max(100000).default(1000),
  energy_cost_per_kwh: z.number().min(0).max(1).default(0.12),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Lcm_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.expected_life_years * input.acquisition_cost; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.expected_life_years * input.acquisition_cost * (1 + (input.labor_rate / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.expected_life_years * input.acquisition_cost * (1 + (input.labor_rate / 100)) * (input.annual_operating_hours); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.annual_operating_hours; results["factor_annual_operating_hours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["factor_annual_operating_hours"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateLcm_calculator(input: Lcm_calculatorInput): Lcm_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against industry standards"],
  };
}


export interface Lcm_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
