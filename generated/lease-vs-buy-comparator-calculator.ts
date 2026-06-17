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

function evaluateAllFormulas(_input: Lease_vs_buy_comparator_calculatorInput): Record<string, number> {
  return {};
}


export function calculateLease_vs_buy_comparator_calculator(input: Lease_vs_buy_comparator_calculatorInput): Lease_vs_buy_comparator_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["0"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
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
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
