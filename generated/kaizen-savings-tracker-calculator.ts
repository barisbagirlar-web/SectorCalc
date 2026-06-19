// Auto-generated from kaizen-savings-tracker-calculator-schema.json
import * as z from 'zod';

export interface Kaizen_savings_tracker_calculatorInput {
  labor_rate: number;
  operators_affected: number;
  time_saved_per_operator: number;
  shifts_per_day: number;
  operating_days_per_year: number;
  defect_rate_before: number;
  defect_rate_after: number;
  annual_production_volume: number;
  dataConfidence?: number;
}

export const Kaizen_savings_tracker_calculatorInputSchema = z.object({
  labor_rate: z.number().min(7.25).max(150).default(25),
  operators_affected: z.number().min(1).max(500).default(10),
  time_saved_per_operator: z.number().min(0).max(480).default(15),
  shifts_per_day: z.number().min(1).max(3).default(2),
  operating_days_per_year: z.number().min(200).max(365).default(250),
  defect_rate_before: z.number().min(0).max(100).default(5),
  defect_rate_after: z.number().min(0).max(100).default(2),
  annual_production_volume: z.number().min(1000).max(10000000).default(100000),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Kaizen_savings_tracker_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.labor_rate / 100) * input.operators_affected * input.time_saved_per_operator * input.shifts_per_day; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = (input.labor_rate / 100) * input.operators_affected * input.time_saved_per_operator * input.shifts_per_day * (input.operating_days_per_year * (input.defect_rate_before / 100) * (input.defect_rate_after / 100) * input.annual_production_volume); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.operating_days_per_year * (input.defect_rate_before / 100) * (input.defect_rate_after / 100) * input.annual_production_volume; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateKaizen_savings_tracker_calculator(input: Kaizen_savings_tracker_calculatorInput): Kaizen_savings_tracker_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-site comparison","Real-time dashboard","Benchmarking against industry KPIs"],
  };
}


export interface Kaizen_savings_tracker_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
