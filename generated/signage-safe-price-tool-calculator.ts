// Auto-generated from signage-safe-price-tool-calculator-schema.json
import * as z from 'zod';

export interface Signage_safe_price_tool_calculatorInput {
  material_cost: number;
  labor_hours: number;
  labor_rate: number;
  overhead_rate: number;
  complexity_factor: string;
  quality_level: string;
  quantity: number;
  waste_factor: number;
  dataConfidence?: number;
}

export const Signage_safe_price_tool_calculatorInputSchema = z.object({
  material_cost: z.number().min(0).max(100000).default(100),
  labor_hours: z.number().min(0.1).max(100).default(2.5),
  labor_rate: z.number().min(0).max(200).default(35),
  overhead_rate: z.number().min(0).max(100).default(25),
  complexity_factor: z.enum(['low', 'medium', 'high']).default('medium'),
  quality_level: z.enum(['economy', 'standard', 'premium']).default('standard'),
  quantity: z.number().min(1).max(100000).default(100),
  waste_factor: z.number().min(0).max(50).default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Signage_safe_price_tool_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.labor_hours; results["annual_exposure_hours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annual_exposure_hours"] = 0; }
  try { const v = input.quantity * (input.labor_rate / 100) * input.labor_hours * input.material_cost; results["direct_labor_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["direct_labor_cost"] = 0; }
  try { const v = input.quantity * (input.labor_rate / 100) * input.labor_hours * input.material_cost; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSignage_safe_price_tool_calculator(input: Signage_safe_price_tool_calculatorInput): Signage_safe_price_tool_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Composite model — validate each cost leg against actuals","Physical exposure factors are normalized estimates"];
  const suggestedActions: string[] = ["Reconcile labor and maintenance legs separately","Benchmark noise/vibration factors with site measurement"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Signage_safe_price_tool_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
