// @ts-nocheck
// Auto-generated from percentage-calculator-schema.json
import * as z from 'zod';

export interface Percentage_calculatorInput {
  total_units: number;
  defective_units: number;
  rework_units: number;
  scrap_units: number;
  target_yield: number;
  process_type: string;
  include_scrap_in_defect: boolean;
}

export const Percentage_calculatorInputSchema = z.object({
  total_units: z.number().min(1).max(1000000).default(1000),
  defective_units: z.number().min(0).max(1000000).default(50),
  rework_units: z.number().min(0).max(1000000).default(20),
  scrap_units: z.number().min(0).max(1000000).default(10),
  target_yield: z.number().min(0).max(100).default(99),
  process_type: z.enum(['manufacturing', 'service', 'logistics', 'software']).default('manufacturing'),
  include_scrap_in_defect: z.boolean().default(true),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Percentage_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.total_units * input.defective_units * input.rework_units * input.scrap_units; results["normalized_product"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.total_units * input.defective_units * input.rework_units * input.scrap_units * ((input.target_yield / 100)); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = (input.target_yield / 100); results["adjustment_factor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePercentage_calculator(input: Percentage_calculatorInput): Percentage_calculatorOutput {
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
    premiumRequired: false,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Historical comparison","Multi-site aggregation"],
  };
}


export interface Percentage_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
