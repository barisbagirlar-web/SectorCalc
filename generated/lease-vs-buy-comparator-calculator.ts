// Auto-generated from lease-vs-buy-comparator-calculator-schema.json
import * as z from 'zod';

export interface Lease_vs_buy_comparator_calculatorInput {
  equipmentCost: number;
  leaseTermMonths: number;
  monthlyLeasePayment: number;
  residualValue: number;
  annualMaintenanceCost: number;
  leaseMaintenanceIncluded: boolean;
  discountRate: number;
  utilizationRate: number;
  dataConfidence?: number;
}

export const Lease_vs_buy_comparator_calculatorInputSchema = z.object({
  equipmentCost: z.number().min(1000).max(10000000).default(100000),
  leaseTermMonths: z.number().min(12).max(120).default(36),
  monthlyLeasePayment: z.number().min(100).max(500000).default(2800),
  residualValue: z.number().min(0).max(5000000).default(20000),
  annualMaintenanceCost: z.number().min(0).max(500000).default(5000),
  leaseMaintenanceIncluded: z.boolean().default(true),
  discountRate: z.number().min(0).max(30).default(8),
  utilizationRate: z.number().min(0).max(100).default(85),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Lease_vs_buy_comparator_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.leaseMaintenanceIncluded * input.equipmentCost; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.leaseMaintenanceIncluded * input.equipmentCost * (1 + (input.discountRate / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.leaseMaintenanceIncluded * input.equipmentCost * (1 + (input.discountRate / 100)) * (input.leaseTermMonths); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.leaseTermMonths; results["factor_leaseTermMonths"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["factor_leaseTermMonths"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateLease_vs_buy_comparator_calculator(input: Lease_vs_buy_comparator_calculatorInput): Lease_vs_buy_comparator_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
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
    premiumFeatures: [],
  };
}


export interface Lease_vs_buy_comparator_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
