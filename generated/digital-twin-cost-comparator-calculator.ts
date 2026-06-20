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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Digital_twin_cost_comparator_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.asset_count * input.sensor_density * input.data_quality_index * (input.labor_rate / 100); results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.asset_count * input.sensor_density * input.data_quality_index * (input.labor_rate / 100) * (input.expected_lifespan); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.expected_lifespan; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateDigital_twin_cost_comparator_calculator(input: Digital_twin_cost_comparator_calculatorInput): Digital_twin_cost_comparator_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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
