// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Fire_hydrant_flow_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.static_pressure * input.residual_pressure * (input.flow_rate_test / 100) * input.pipe_diameter; results["normalized_product"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.static_pressure * input.residual_pressure * (input.flow_rate_test / 100) * input.pipe_diameter * (input.pipe_length * input.hazen_williams_coefficient * input.elevation_difference * input.number_of_hydrants); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.pipe_length * input.hazen_williams_coefficient * input.elevation_difference * input.number_of_hydrants; results["adjustment_factor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateFire_hydrant_flow_calculator(input: Fire_hydrant_flow_calculatorInput): Fire_hydrant_flow_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-hydrant comparison","Custom threshold configuration"],
  };
}


export interface Fire_hydrant_flow_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
