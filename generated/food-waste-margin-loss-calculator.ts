// @ts-nocheck
// Auto-generated from food-waste-margin-loss-calculator-schema.json
import * as z from 'zod';

export interface Food_waste_margin_loss_calculatorInput {
  total_production_kg: number;
  waste_kg: number;
  selling_price_per_kg: number;
  cost_per_kg: number;
  waste_disposal_cost_per_kg: number;
  rework_percentage: number;
  labor_hourly_rate: number;
  rework_hours_per_kg: number;
}

export const Food_waste_margin_loss_calculatorInputSchema = z.object({
  total_production_kg: z.number().min(0).max(1000000).default(10000),
  waste_kg: z.number().min(0).max(1000000).default(500),
  selling_price_per_kg: z.number().min(0.01).max(1000).default(5),
  cost_per_kg: z.number().min(0.01).max(1000).default(3.5),
  waste_disposal_cost_per_kg: z.number().min(0).max(10).default(0.15),
  rework_percentage: z.number().min(0).max(100).default(2),
  labor_hourly_rate: z.number().min(0).max(200).default(25),
  rework_hours_per_kg: z.number().min(0).max(10).default(0.05),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Food_waste_margin_loss_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.total_production_kg * input.waste_kg * input.selling_price_per_kg * input.cost_per_kg; results["normalized_product"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.total_production_kg * input.waste_kg * input.selling_price_per_kg * input.cost_per_kg * (input.waste_disposal_cost_per_kg * (input.rework_percentage / 100) * (input.labor_hourly_rate / 100) * input.rework_hours_per_kg); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.waste_disposal_cost_per_kg * (input.rework_percentage / 100) * (input.labor_hourly_rate / 100) * input.rework_hours_per_kg; results["adjustment_factor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateFood_waste_margin_loss_calculator(input: Food_waste_margin_loss_calculatorInput): Food_waste_margin_loss_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against industry standards","Root cause Pareto chart","Automated corrective action tracking"],
  };
}


export interface Food_waste_margin_loss_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
