// Auto-generated from muda-waste-cost-calculator-schema.json
import * as z from 'zod';

export interface Muda_waste_cost_calculatorInput {
  material_cost_per_unit: number;
  labor_cost_per_hour: number;
  overhead_rate: number;
  defect_rate: number;
  rework_time_per_unit: number;
  scrap_rate: number;
  waiting_time_per_unit: number;
  excess_motion_cost_per_unit: number;
  dataConfidence?: number;
}

export const Muda_waste_cost_calculatorInputSchema = z.object({
  material_cost_per_unit: z.number().min(0).max(10000).default(0.5),
  labor_cost_per_hour: z.number().min(0).max(500).default(25),
  overhead_rate: z.number().min(0).max(500).default(150),
  defect_rate: z.number().min(0).max(100).default(5),
  rework_time_per_unit: z.number().min(0).max(10).default(0.25),
  scrap_rate: z.number().min(0).max(100).default(2),
  waiting_time_per_unit: z.number().min(0).max(10).default(0.1),
  excess_motion_cost_per_unit: z.number().min(0).max(100).default(0.05),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Muda_waste_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.material_cost_per_unit * input.labor_cost_per_hour * (input.overhead_rate / 100) * (input.defect_rate / 100); results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.material_cost_per_unit * input.labor_cost_per_hour * (input.overhead_rate / 100) * (input.defect_rate / 100) * (input.rework_time_per_unit * (input.scrap_rate / 100) * input.waiting_time_per_unit * input.excess_motion_cost_per_unit); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.rework_time_per_unit * (input.scrap_rate / 100) * input.waiting_time_per_unit * input.excess_motion_cost_per_unit; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMuda_waste_cost_calculator(input: Muda_waste_cost_calculatorInput): Muda_waste_cost_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-site comparison","Custom threshold configuration"],
  };
}


export interface Muda_waste_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
