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
  average_claim_cost: number;
  supplier_quality_level: string;
  use_eco_cost: boolean;
  co2_per_unit: number;
  carbon_tax_rate: number;
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
  average_claim_cost: z.number().min(0).max(10000).default(50),
  supplier_quality_level: z.enum(['Premium', 'Standard', 'Economy']).default('Standard'),
  use_eco_cost: z.boolean().default(false),
  co2_per_unit: z.number().min(0).max(1000).default(10),
  carbon_tax_rate: z.number().min(0).max(1).default(0.05),
});

function evaluateAllFormulas(input: Supplier_performance_tco_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.inspection_cost_per_unit + (input.defect_rate / 1000000) * (input.purchase_price * 0.5); results["quality_cost"] = Number.isFinite(v) ? v : 0; } catch { results["quality_cost"] = 0; }
  try { const v = input.freight_cost_per_unit + (input.purchase_price * input.carrying_cost_rate / 100) * (input.lead_time_days / 365); results["logistics_cost"] = Number.isFinite(v) ? v : 0; } catch { results["logistics_cost"] = 0; }
  try { const v = (input.warranty_claim_rate / 100) * input.average_claim_cost; results["warranty_cost"] = Number.isFinite(v) ? v : 0; } catch { results["warranty_cost"] = 0; }
  try { const v = input.use_eco_cost ? (input.co2_per_unit * input.carbon_tax_rate) : 0; results["environmental_cost"] = Number.isFinite(v) ? v : 0; } catch { results["environmental_cost"] = 0; }
  try { const v = input.purchase_price + (results["quality_cost"] ?? 0) + (results["logistics_cost"] ?? 0) + (results["warranty_cost"] ?? 0) + (results["environmental_cost"] ?? 0); results["tco_per_unit"] = Number.isFinite(v) ? v : 0; } catch { results["tco_per_unit"] = 0; }
  try { const v = (results["tco_per_unit"] ?? 0) * input.annual_quantity; results["annual_tco"] = Number.isFinite(v) ? v : 0; } catch { results["annual_tco"] = 0; }
  try { const v = (results["tco_per_unit"] ?? 0) / input.purchase_price; results["tco_index"] = Number.isFinite(v) ? v : 0; } catch { results["tco_index"] = 0; }
  return results;
}


export function calculateSupplier_performance_tco_calculator(input: Supplier_performance_tco_calculatorInput): Supplier_performance_tco_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["annual_tco"] ?? 0;
  const breakdown = {
    purchaseCost: values["purchaseCost"] ?? 0,
    qualityCost: values["qualityCost"] ?? 0,
    logisticsCost: values["logisticsCost"] ?? 0,
    warrantyCost: values["warrantyCost"] ?? 0,
    environmentalCost: values["environmentalCost"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Defect Rework & Scrap","Expedited Shipping Cost","Supplier Management Overhead"];
  const suggestedActions: string[] = ["Implement Six Sigma DMAIC","Lean JIT Inventory Reduction","Root Cause Analysis (RCA)"];
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-supplier comparison","Automated alerting","Benchmarking against industry standards"],
  };
}


export interface Supplier_performance_tco_calculatorOutput {
  totalWasteCost: number;
  breakdown: { purchaseCost: number; qualityCost: number; logisticsCost: number; warrantyCost: number; environmentalCost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
