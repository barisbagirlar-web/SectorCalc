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

function evaluateAllFormulas(input: Percentage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.include_scrap_in_defect) ? (input.defective_units + input.scrap_units) : (input.defective_units)); results["effective_defects"] = Number.isFinite(v) ? v : 0; } catch { results["effective_defects"] = 0; }
  try { const v = ((results["effective_defects"] ?? 0) / input.total_units) * 100; results["defect_rate"] = Number.isFinite(v) ? v : 0; } catch { results["defect_rate"] = 0; }
  try { const v = ((input.total_units - (results["effective_defects"] ?? 0) - input.rework_units) / input.total_units) * 100; results["first_pass_yield"] = Number.isFinite(v) ? v : 0; } catch { results["first_pass_yield"] = 0; }
  try { const v = (input.scrap_units / input.total_units) * 100; results["scrap_rate"] = Number.isFinite(v) ? v : 0; } catch { results["scrap_rate"] = 0; }
  try { const v = (input.rework_units / input.total_units) * 100; results["rework_rate"] = Number.isFinite(v) ? v : 0; } catch { results["rework_rate"] = 0; }
  try { const v = input.target_yield - (results["first_pass_yield"] ?? 0); results["yield_gap"] = Number.isFinite(v) ? v : 0; } catch { results["yield_gap"] = 0; }
  try { const v = (results["defect_rate"] ?? 0) + (results["rework_rate"] ?? 0) + (results["scrap_rate"] ?? 0); results["overall_equipment_effectiveness_impact"] = Number.isFinite(v) ? v : 0; } catch { results["overall_equipment_effectiveness_impact"] = 0; }
  return results;
}


export function calculatePercentage_calculator(input: Percentage_calculatorInput): Percentage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["first_pass_yield"] ?? 0;
  const breakdown = {
    defect_rate: values["defect_rate"] ?? 0,
    scrap_rate: values["scrap_rate"] ?? 0,
    rework_rate: values["rework_rate"] ?? 0,
    yield_gap: values["yield_gap"] ?? 0,
    oee_impact: values["oee_impact"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Excessive Rework","High Scrap","Yield Gap Positive"];
  const suggestedActions: string[] = ["Reduce Defects","Minimize Rework","Scrap Reduction","Align to Target Yield"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Historical comparison","Multi-site aggregation"],
  };
}


export interface Percentage_calculatorOutput {
  totalWasteCost: number;
  breakdown: { defect_rate: number; scrap_rate: number; rework_rate: number; yield_gap: number; oee_impact: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
