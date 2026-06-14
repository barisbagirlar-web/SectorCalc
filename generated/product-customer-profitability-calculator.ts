// Auto-generated from product-customer-profitability-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface ProductCustomerProfitabilityCalculatorInput {
  revenuePerUnit: number;
  unitsSold: number;
  variableCostPerUnit: number;
  fixedCostAllocation: number;
  customerSpecificCosts: number;
  discountsAndAllowances: number;
  returnRate: number;
  costOfCapital: number;
  averageCollectionPeriod: number;
  dataConfidence: number;
}

export const ProductCustomerProfitabilityCalculatorInputSchema = z.object({
  revenuePerUnit: z.number().min(0).default(100),
  unitsSold: z.number().min(0).default(1000),
  variableCostPerUnit: z.number().min(0).default(60),
  fixedCostAllocation: z.number().min(0).default(20000),
  customerSpecificCosts: z.number().min(0).default(5000),
  discountsAndAllowances: z.number().min(0).default(2000),
  returnRate: z.number().min(0).max(100).default(2),
  costOfCapital: z.number().min(0).max(100).default(10),
  averageCollectionPeriod: z.number().min(0).max(365).default(30),
  dataConfidence: z.number().min(0).max(100).default(90),
});

export interface ProductCustomerProfitabilityCalculatorOutput {
  netProfit: number;
  breakdown: {
    grossRevenue: number;
    returnsCost: number;
    netRevenue: number;
    totalVariableCost: number;
    totalCost: number;
    grossProfit: number;
    profitMargin: number;
    carryingCostOfReceivables: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: ProductCustomerProfitabilityCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.grossRevenue = ((): number => { try { const __v = input.revenuePerUnit * input.unitsSold; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.returnsCost = ((): number => { try { const __v = results.grossRevenue * (input.returnRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netRevenue = ((): number => { try { const __v = results.grossRevenue - results.returnsCost - input.discountsAndAllowances; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalVariableCost = ((): number => { try { const __v = input.variableCostPerUnit * input.unitsSold; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.totalVariableCost + input.fixedCostAllocation + input.customerSpecificCosts; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.grossProfit = ((): number => { try { const __v = results.netRevenue - results.totalCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.profitMargin = ((): number => { try { const __v = (results.grossProfit / results.netRevenue) * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.carryingCostOfReceivables = ((): number => { try { const __v = (results.netRevenue / 365) * input.averageCollectionPeriod * (input.costOfCapital / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netProfit = ((): number => { try { const __v = results.grossProfit - results.carryingCostOfReceivables; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedProfit = ((): number => { try { const __v = results.netProfit * (input.dataConfidence / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateProductCustomerProfitabilityCalculator(input: ProductCustomerProfitabilityCalculatorInput): ProductCustomerProfitabilityCalculatorOutput {
  const results = evaluateFormulas(input);
  const netProfit = results.netProfit ?? 0;
  const breakdown = {
    grossRevenue: results.grossRevenue,
    returnsCost: results.returnsCost,
    netRevenue: results.netRevenue,
    totalVariableCost: results.totalVariableCost,
    totalCost: results.totalCost,
    grossProfit: results.grossProfit,
    profitMargin: results.profitMargin,
    carryingCostOfReceivables: results.carryingCostOfReceivables,
  };

  // rule: revenuePerUnit >= 0
  // rule: unitsSold >= 0
  // rule: variableCostPerUnit >= 0
  // rule: fixedCostAllocation >= 0
  // rule: customerSpecificCosts >= 0
  // rule: discountsAndAllowances >= 0
  // rule: returnRate >= 0 && returnRate <= 100
  // rule: costOfCapital >= 0 && costOfCapital <= 100
  // rule: averageCollectionPeriod >= 0 && averageCollectionPeriod <= 365
  // rule: dataConfidence >= 0 && dataConfidence <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (input.returnRate > 5) hiddenLossDrivers.push("High return rate may indicate quality issues");
  if (profitMargin < 0) hiddenLossDrivers.push("Negative profit margin - review pricing or costs");
  if (input.customerSpecificCosts > 0.2 * (input.revenuePerUnit * input.unitsSold)) hiddenLossDrivers.push("Customer-specific costs exceed 20% of revenue");

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedProfit; } catch { return netProfit; } })();

  return {
    netProfit,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Customer Comparison","Detailed Report with Charts"],
  };
}
