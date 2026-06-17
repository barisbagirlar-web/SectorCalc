// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Lease_vs_buy_comparator_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.equipmentCost + input.leaseTermMonths + input.monthlyLeasePayment; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.equipmentCost + input.leaseTermMonths + input.monthlyLeasePayment; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateLease_vs_buy_comparator_calculator(input: Lease_vs_buy_comparator_calculatorInput): Lease_vs_buy_comparator_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
