// Auto-generated from fire-hydrant-flow-calculator-schema.json
import * as z from 'zod';

export interface Fire_hydrant_flow_calculatorInput {
  static_pressure: number;
  residual_pressure: number;
  flow_rate_test: number;
  pipe_diameter: number;
  pipe_length: number;
  hazen_williams_coefficient: number;
  elevation_difference: number;
  number_of_hydrants: number;
  dataConfidence?: number;
}

export const Fire_hydrant_flow_calculatorInputSchema = z.object({
  static_pressure: z.number().min(0).max(200).default(60),
  residual_pressure: z.number().min(0).max(200).default(40),
  flow_rate_test: z.number().min(0).max(5000).default(500),
  pipe_diameter: z.number().min(2).max(24).default(6),
  pipe_length: z.number().min(0).max(10000).default(500),
  hazen_williams_coefficient: z.number().min(60).max(150).default(120),
  elevation_difference: z.number().min(-200).max(200).default(0),
  number_of_hydrants: z.number().min(1).max(10).default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fire_hydrant_flow_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.static_pressure * input.residual_pressure * (input.flow_rate_test / 100) * input.pipe_diameter; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.static_pressure * input.residual_pressure * (input.flow_rate_test / 100) * input.pipe_diameter * (input.pipe_length * input.hazen_williams_coefficient * input.elevation_difference * input.number_of_hydrants); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.pipe_length * input.hazen_williams_coefficient * input.elevation_difference * input.number_of_hydrants; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateFire_hydrant_flow_calculator(input: Fire_hydrant_flow_calculatorInput): Fire_hydrant_flow_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    normalized_product: toNumericFormulaValue(values["normalized_product"]),
    adjustment_factor: toNumericFormulaValue(values["adjustment_factor"])
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
    unit: "USD",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-hydrant comparison","Custom threshold configuration"],
  };
}


export interface Fire_hydrant_flow_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Fire_hydrant_flow_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

