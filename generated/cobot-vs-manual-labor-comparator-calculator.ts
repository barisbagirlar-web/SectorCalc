// Auto-generated from cobot-vs-manual-labor-comparator-calculator-schema.json
import * as z from 'zod';

export interface Cobot_vs_manual_labor_comparator_calculatorInput {
  annual_manual_labor_cost: number;
  number_of_workers: number;
  cobot_purchase_price: number;
  cobot_annual_maintenance: number;
  cobot_lifespan_years: number;
  discount_rate: number;
  labor_productivity_factor: number;
  cobot_uptime_percent: number;
  dataConfidence?: number;
}

export const Cobot_vs_manual_labor_comparator_calculatorInputSchema = z.object({
  annual_manual_labor_cost: z.number().min(20000).max(120000).default(45000),
  number_of_workers: z.number().min(1).max(20).default(2),
  cobot_purchase_price: z.number().min(15000).max(150000).default(35000),
  cobot_annual_maintenance: z.number().min(500).max(15000).default(3000),
  cobot_lifespan_years: z.number().min(3).max(15).default(8),
  discount_rate: z.number().min(2).max(20).default(8),
  labor_productivity_factor: z.number().min(0.5).max(1).default(0.85),
  cobot_uptime_percent: z.number().min(80).max(99.9).default(95),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cobot_vs_manual_labor_comparator_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1; results["annual_exposure_hours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annual_exposure_hours"] = 0; }
  try { const v = input.number_of_workers * (input.discount_rate / 100) * 1 * input.annual_manual_labor_cost; results["direct_labor_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["direct_labor_cost"] = 0; }
  try { const v = input.number_of_workers * (input.discount_rate / 100) * 1 * input.annual_manual_labor_cost * input.cobot_lifespan_years; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCobot_vs_manual_labor_comparator_calculator(input: Cobot_vs_manual_labor_comparator_calculatorInput): Cobot_vs_manual_labor_comparator_calculatorOutput {
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario simulation","Sensitivity analysis","Custom reporting"],
  };
}


export interface Cobot_vs_manual_labor_comparator_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
