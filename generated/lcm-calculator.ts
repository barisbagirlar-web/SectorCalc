// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Lcm_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.acquisition_cost + input.expected_life_years + input.annual_operating_hours; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.acquisition_cost + input.expected_life_years + input.annual_operating_hours; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateLcm_calculator(input: Lcm_calculatorInput): Lcm_calculatorOutput {
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
