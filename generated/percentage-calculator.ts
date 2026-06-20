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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Percentage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.total_units * input.defective_units * input.rework_units * input.scrap_units; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.total_units * input.defective_units * input.rework_units * input.scrap_units * ((input.target_yield / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = (input.target_yield / 100); results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculatePercentage_calculator(input: Percentage_calculatorInput): Percentage_calculatorOutput {
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
