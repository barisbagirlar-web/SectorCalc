// Auto-generated from phq-9-calculator-schema.json
import * as z from 'zod';

export interface Phq_9_calculatorInput {
  operating_pressure: number;
  fluid_density: number;
  flow_rate: number;
  pipe_diameter: number;
  efficiency_factor: number;
  dataConfidence?: number;
}

export const Phq_9_calculatorInputSchema = z.object({
  operating_pressure: z.number().default(100000),
  fluid_density: z.number().default(1000),
  flow_rate: z.number().default(0.01),
  pipe_diameter: z.number().default(0.1),
  efficiency_factor: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Phq_9_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.operating_pressure / (input.fluid_density * 9.81); results["pressure_head"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pressure_head"] = Number.NaN; }
  try { const v = (input.flow_rate / (3.14159 * (input.pipe_diameter/2)**2))**2 / (2 * 9.81); results["velocity_head"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["velocity_head"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["pressure_head"])) + (toNumericFormulaValue(results["velocity_head"])); results["total_head"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total_head"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["total_head"])) / input.efficiency_factor; results["adjusted_head"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjusted_head"] = Number.NaN; }
  return results;
}


export function calculatePhq_9_calculator(input: Phq_9_calculatorInput): Phq_9_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["adjusted_head"]);
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


export interface Phq_9_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
