// @ts-nocheck
// Auto-generated from digital-twin-cost-comparator-calculator-schema.json
import * as z from 'zod';

export interface Digital_twin_cost_comparator_calculatorInput {
  twin_scope: string;
  asset_count: number;
  sensor_density: number;
  data_frequency: string;
  integration_complexity: string;
  data_quality_index: number;
  labor_rate: number;
  expected_lifespan: number;
}

export const Digital_twin_cost_comparator_calculatorInputSchema = z.object({
  twin_scope: z.string().default(''),
  asset_count: z.number().min(1).max(100000).default(100),
  sensor_density: z.number().min(0).max(100).default(5),
  data_frequency: z.string().default(''),
  integration_complexity: z.string().default(''),
  data_quality_index: z.number().min(0).max(100).default(85),
  labor_rate: z.number().min(15).max(250).default(75),
  expected_lifespan: z.number().min(1).max(30).default(10),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Digital_twin_cost_comparator_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.twin_scope + input.asset_count + input.sensor_density; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.twin_scope + input.asset_count + input.sensor_density; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateDigital_twin_cost_comparator_calculator(input: Digital_twin_cost_comparator_calculatorInput): Digital_twin_cost_comparator_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario simulation","Real-time data integration","Benchmarking against industry standards"],
  };
}


export interface Digital_twin_cost_comparator_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
