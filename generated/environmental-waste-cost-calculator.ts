// Auto-generated from environmental-waste-cost-calculator-schema.json
import * as z from 'zod';

export interface Environmental_waste_cost_calculatorInput {
  waste_type: string;
  waste_volume_kg: number;
  disposal_cost_per_kg: number;
  transport_distance_km: number;
  transport_cost_per_km: number;
  labor_hours_per_ton: number;
  labor_rate_per_hour: number;
  recycling_revenue_per_kg: number;
  dataConfidence?: number;
}

export const Environmental_waste_cost_calculatorInputSchema = z.object({
  waste_type: z.enum(['mixed_solid', 'hazardous', 'organic', 'recyclable', 'e_waste']).default('mixed_solid'),
  waste_volume_kg: z.number().min(0).max(1000000).default(1000),
  disposal_cost_per_kg: z.number().min(0).max(10).default(0.15),
  transport_distance_km: z.number().min(0).max(5000).default(50),
  transport_cost_per_km: z.number().min(0).max(100).default(2.5),
  labor_hours_per_ton: z.number().min(0).max(50).default(2),
  labor_rate_per_hour: z.number().min(0).max(200).default(25),
  recycling_revenue_per_kg: z.number().min(0).max(5).default(0.05),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Environmental_waste_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.waste_volume_kg * input.disposal_cost_per_kg * input.transport_distance_km * input.transport_cost_per_km; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.waste_volume_kg * input.disposal_cost_per_kg * input.transport_distance_km * input.transport_cost_per_km * (input.labor_hours_per_ton * (input.labor_rate_per_hour / 100) * input.recycling_revenue_per_kg); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.labor_hours_per_ton * (input.labor_rate_per_hour / 100) * input.recycling_revenue_per_kg; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateEnvironmental_waste_cost_calculator(input: Environmental_waste_cost_calculatorInput): Environmental_waste_cost_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against industry standards","Multi-site comparison"],
  };
}


export interface Environmental_waste_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
