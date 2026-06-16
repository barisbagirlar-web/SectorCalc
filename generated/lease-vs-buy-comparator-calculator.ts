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
  taxRate: number;
  depreciationMethod: string;
  leaseType: string;
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
  taxRate: z.number().min(0).max(50).default(25),
  depreciationMethod: z.enum(['straight-line', 'MACRS-5yr', 'MACRS-7yr']).default('straight-line'),
  leaseType: z.enum(['operating', 'capital']).default('operating'),
});

function evaluateAllFormulas(input: Lease_vs_buy_comparator_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["npvLease"] = 0;
  results["npvBuy"] = 0;
  try { const v = depreciationRate_y * input.equipmentCost * input.taxRate; results["depreciationTaxShield"] = Number.isFinite(v) ? v : 0; } catch { results["depreciationTaxShield"] = 0; }
  try { const v = input.leaseTermMonths * input.monthlyLeasePayment; results["totalCostLease"] = Number.isFinite(v) ? v : 0; } catch { results["totalCostLease"] = 0; }
  try { const v = input.equipmentCost + (input.leaseTermMonths/12)*input.annualMaintenanceCost - input.residualValue; results["totalCostBuy"] = Number.isFinite(v) ? v : 0; } catch { results["totalCostBuy"] = 0; }
  try { const v = ((results["totalCostBuy"] ?? 0) * (1 - input.utilizationRate/100)) * 0.15; results["utilizationAdjustedCost"] = Number.isFinite(v) ? v : 0; } catch { results["utilizationAdjustedCost"] = 0; }
  try { const v = ((results["npvLease"] ?? 0) + (results["utilizationAdjustedCost"] ?? 0)) / (results["npvBuy"] ?? 0); results["primaryResult"] = Number.isFinite(v) ? v : 0; } catch { results["primaryResult"] = 0; }
  return results;
}


export function calculateLease_vs_buy_comparator_calculator(input: Lease_vs_buy_comparator_calculatorInput): Lease_vs_buy_comparator_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["leaseVsBuyRatio"] ?? 0;
  const breakdown = {
    npvLease: values["npvLease"] ?? 0,
    npvBuy: values["npvBuy"] ?? 0,
    totalCostLease: values["totalCostLease"] ?? 0,
    totalCostBuy: values["totalCostBuy"] ?? 0,
    utilizationPenalty: values["utilizationPenalty"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Maintenance Cost Escalation","Residual Value Uncertainty","Utilization Rate Variability"];
  const suggestedActions: string[] = ["Proceed with lease; negotiate lower monthly payment or include maintenance.","Consider purchase; explore financing options to reduce upfront cost.","Re-evaluate need for dedicated equipment; consider short-term rental or shared asset."];
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
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Lease_vs_buy_comparator_calculatorOutput {
  totalWasteCost: number;
  breakdown: { npvLease: number; npvBuy: number; totalCostLease: number; totalCostBuy: number; utilizationPenalty: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
