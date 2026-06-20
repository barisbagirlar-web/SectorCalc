// Auto-generated from supplier-performance-tco-calculator-schema.json
import * as z from 'zod';

export interface Supplier_performance_tco_calculatorInput {
  purchase_price: number;
  annual_quantity: number;
  defect_rate: number;
  inspection_cost_per_unit: number;
  freight_cost_per_unit: number;
  lead_time_days: number;
  carrying_cost_rate: number;
  warranty_claim_rate: number;
  dataConfidence?: number;
}

export const Supplier_performance_tco_calculatorInputSchema = z.object({
  purchase_price: z.number().min(0).max(100000).default(100),
  annual_quantity: z.number().min(1).max(10000000).default(10000),
  defect_rate: z.number().min(0).max(100000).default(500),
  inspection_cost_per_unit: z.number().min(0).max(100).default(2),
  freight_cost_per_unit: z.number().min(0).max(500).default(5),
  lead_time_days: z.number().min(1).max(365).default(30),
  carrying_cost_rate: z.number().min(0).max(100).default(25),
  warranty_claim_rate: z.number().min(0).max(100).default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Supplier_performance_tco_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.lead_time_days; results["annual_exposure_hours"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annual_exposure_hours"] = Number.NaN; }
  try { const v = 0; results["direct_labor_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["direct_labor_cost"] = Number.NaN; }
  try { const v = input.annual_quantity * (input.defect_rate / 100) * input.lead_time_days * input.purchase_price; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateSupplier_performance_tco_calculator(input: Supplier_performance_tco_calculatorInput): Supplier_performance_tco_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    annual_exposure_hours: toNumericFormulaValue(values["annual_exposure_hours"]),
    direct_labor_cost: toNumericFormulaValue(values["direct_labor_cost"])
  };
  const hiddenLossDrivers: string[] = ["Composite model — validate each cost leg against actuals","Physical exposure factors are normalized estimates","Direct labor cost is set to 0 because no labor-related inputs are available in this tool"];
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
    unit: "USD",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-supplier comparison","Automated alerting","Benchmarking against industry standards"],
  };
}


export interface Supplier_performance_tco_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { annual_exposure_hours: number; direct_labor_cost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Supplier_performance_tco_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["annual_exposure_hours","direct_labor_cost"],
} as const;

