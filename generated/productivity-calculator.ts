// Auto-generated from productivity-calculator-schema.json
import * as z from 'zod';

export interface Productivity_calculatorInput {
  total_units_produced: number;
  total_labor_hours: number;
  defect_rate: number;
  standard_productivity: number;
  dataConfidence?: number;
}

export const Productivity_calculatorInputSchema = z.object({
  total_units_produced: z.number().default(1000),
  total_labor_hours: z.number().default(100),
  defect_rate: z.number().default(5),
  standard_productivity: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Productivity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.total_units_produced * (1 - input.defect_rate / 100); results["good_units"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["good_units"] = 0; }
  try { const v = (input.total_units_produced * (1 - input.defect_rate / 100)) / input.total_labor_hours; results["effective_productivity"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effective_productivity"] = 0; }
  try { const v = ((input.total_units_produced * (1 - input.defect_rate / 100)) / input.total_labor_hours / input.standard_productivity) * 100; results["efficiency"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["efficiency"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateProductivity_calculator(input: Productivity_calculatorInput): Productivity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["effective_productivity"]);
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


export interface Productivity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
