// Auto-generated from fabric-cutting-optimizer-calculator-schema.json
import * as z from 'zod';

export interface Fabric_cutting_optimizer_calculatorInput {
  fabric_width: number;
  fabric_length: number;
  pattern_length: number;
  pattern_width: number;
  quantity: number;
  cutting_method: string;
  material_cost_per_m2: number;
  labor_rate_per_hour: number;
  dataConfidence?: number;
}

export const Fabric_cutting_optimizer_calculatorInputSchema = z.object({
  fabric_width: z.number().min(50).max(320).default(150),
  fabric_length: z.number().min(10).max(500).default(100),
  pattern_length: z.number().min(10).max(200).default(120),
  pattern_width: z.number().min(5).max(150).default(60),
  quantity: z.number().min(1).max(100000).default(500),
  cutting_method: z.enum(['single_ply', 'multi_ply', 'laser']).default('single_ply'),
  material_cost_per_m2: z.number().min(0.5).max(200).default(12.5),
  labor_rate_per_hour: z.number().min(5).max(100).default(25),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fabric_cutting_optimizer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1; results["annual_exposure_hours"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annual_exposure_hours"] = Number.NaN; }
  try { const v = input.quantity * (input.labor_rate_per_hour / 100) * 1 * input.material_cost_per_m2; results["direct_labor_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["direct_labor_cost"] = Number.NaN; }
  try { const v = input.quantity * (input.labor_rate_per_hour / 100) * 1 * input.material_cost_per_m2 * (input.fabric_width); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.fabric_width; results["factor_fabric_width"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["factor_fabric_width"] = Number.NaN; }
  return results;
}


export function calculateFabric_cutting_optimizer_calculator(input: Fabric_cutting_optimizer_calculatorInput): Fabric_cutting_optimizer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Composite model — validate each cost leg against actuals","Physical exposure factors are normalized estimates"];
  const suggestedActions: string[] = ["Reconcile labor and maintenance legs separately","Benchmark noise/vibration factors with site measurement"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-roll nesting","Real-time waste tracking"],
  };
}


export interface Fabric_cutting_optimizer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
