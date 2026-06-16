// Auto-generated from productivity-calculator-schema.json
import * as z from 'zod';

export interface Productivity_calculatorInput {
  total_units_produced: number;
  total_labor_hours: number;
  defect_rate: number;
  standard_productivity: number;
}

export const Productivity_calculatorInputSchema = z.object({
  total_units_produced: z.number().default(1000),
  total_labor_hours: z.number().default(100),
  defect_rate: z.number().default(5),
  standard_productivity: z.number().default(10),
});

function evaluateAllFormulas(input: Productivity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.total_units_produced * (1 - input.defect_rate / 100); results["good_units"] = Number.isFinite(v) ? v : 0; } catch { results["good_units"] = 0; }
  try { const v = (input.total_units_produced * (1 - input.defect_rate / 100)) / input.total_labor_hours; results["effective_productivity"] = Number.isFinite(v) ? v : 0; } catch { results["effective_productivity"] = 0; }
  try { const v = ((input.total_units_produced * (1 - input.defect_rate / 100)) / input.total_labor_hours / input.standard_productivity) * 100; results["efficiency"] = Number.isFinite(v) ? v : 0; } catch { results["efficiency"] = 0; }
  return results;
}


export function calculateProductivity_calculator(input: Productivity_calculatorInput): Productivity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["effective_productivity"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
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
    premiumFeatures: [],
  };
}


export interface Productivity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
