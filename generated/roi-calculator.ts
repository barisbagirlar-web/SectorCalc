// Auto-generated from roi-calculator-schema.json
import * as z from 'zod';

export interface Roi_calculatorInput {
  annual_revenue: number;
  operating_margin: number;
  total_inventory_value: number;
  inventory_carrying_cost_percent: number;
  annual_labor_cost: number;
  defect_rate_percent: number;
  cost_per_defect: number;
  annual_energy_cost: number;
  dataConfidence?: number;
}

export const Roi_calculatorInputSchema = z.object({
  annual_revenue: z.number().min(100000).max(10000000000).default(10000000),
  operating_margin: z.number().min(0).max(100).default(10),
  total_inventory_value: z.number().min(0).max(1000000000).default(2000000),
  inventory_carrying_cost_percent: z.number().min(0).max(50).default(25),
  annual_labor_cost: z.number().min(0).max(1000000000).default(3000000),
  defect_rate_percent: z.number().min(0).max(100).default(5),
  cost_per_defect: z.number().min(0).max(100000).default(500),
  annual_energy_cost: z.number().min(0).max(100000000).default(500000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Roi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.annual_revenue * (input.operating_margin / 100)) - (input.total_inventory_value * (input.inventory_carrying_cost_percent / 100)) - (input.annual_labor_cost * (input.defect_rate_percent / 100) * input.cost_per_defect) - input.annual_energy_cost) / (input.annual_revenue * (input.operating_margin / 100)) * 100; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.total_inventory_value * (input.inventory_carrying_cost_percent / 100); results["inventory_waste"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["inventory_waste"] = Number.NaN; }
  try { const v = input.annual_labor_cost * (input.defect_rate_percent / 100) * input.cost_per_defect; results["quality_waste"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["quality_waste"] = Number.NaN; }
  try { const v = input.annual_energy_cost; results["energy_waste"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["energy_waste"] = Number.NaN; }
  return results;
}


export function calculateRoi_calculator(input: Roi_calculatorInput): Roi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Expedited freight due to inventory shortages","Lost sales from quality issues"];
  const suggestedActions: string[] = ["Implement Kanban to reduce inventory by 30%","Deploy Six Sigma DMAIC to cut defect rate by 50%"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against industry standards","Multi-scenario simulation"],
  };
}


export interface Roi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
