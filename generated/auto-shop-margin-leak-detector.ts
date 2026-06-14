// Auto-generated from auto-shop-margin-leak-detector-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AutoShopMarginLeakDetectorInput {
  revenue: number;
  costOfGoodsSold: number;
  laborCost: number;
  partsCost: number;
  warrantyClaims: number;
  reworkCost: number;
  idleTimeCost: number;
  inventoryHoldingCost: number;
  dataConfidence: 'low' | 'medium' | 'high';
  periodDays: number;
}

export const AutoShopMarginLeakDetectorInputSchema = z.object({
  revenue: z.number().min(0).default(100000),
  costOfGoodsSold: z.number().min(0).default(60000),
  laborCost: z.number().min(0).default(30000),
  partsCost: z.number().min(0).default(20000),
  warrantyClaims: z.number().min(0).default(5000),
  reworkCost: z.number().min(0).default(3000),
  idleTimeCost: z.number().min(0).default(2000),
  inventoryHoldingCost: z.number().min(0).default(4000),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
  periodDays: z.number().min(1).max(365).default(30),
});

export interface AutoShopMarginLeakDetectorOutput {
  annualizedLeakage: number;
  breakdown: {
    grossProfit: number;
    grossMarginPercent: number;
    totalLeakage: number;
    leakagePercent: number;
    laborCostPercent: number;
    warrantyPercent: number;
    reworkPercent: number;
    idleTimePercent: number;
    inventoryHoldingPercent: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AutoShopMarginLeakDetectorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.grossProfit = (() => { try { return input.revenue - input.costOfGoodsSold; } catch { return 0; } })();
  results.grossMarginPercent = (() => { try { return results.grossProfit / input.revenue; } catch { return 0; } })();
  results.totalLeakage = (() => { try { return input.warrantyClaims + input.reworkCost + input.idleTimeCost + input.inventoryHoldingCost; } catch { return 0; } })();
  results.leakagePercent = (() => { try { return results.totalLeakage / input.revenue; } catch { return 0; } })();
  results.laborCostPercent = (() => { try { return input.laborCost / input.revenue; } catch { return 0; } })();
  results.warrantyPercent = (() => { try { return input.warrantyClaims / input.revenue; } catch { return 0; } })();
  results.reworkPercent = (() => { try { return input.reworkCost / input.laborCost; } catch { return 0; } })();
  results.idleTimePercent = (() => { try { return input.idleTimeCost / input.laborCost; } catch { return 0; } })();
  results.inventoryHoldingPercent = (() => { try { return input.inventoryHoldingCost / input.partsCost; } catch { return 0; } })();
  results.annualizedLeakage = (() => { try { return results.totalLeakage * (365 / input.periodDays); } catch { return 0; } })();
  results.adjustedLeakage = (() => { try { return input.dataConfidence == 'low' ? results.annualizedLeakage * 1.2 : input.dataConfidence == 'medium' ? results.annualizedLeakage * 1.0 : results.annualizedLeakage * 0.9; } catch { return 0; } })();
  return results;
}

export function calculateAutoShopMarginLeakDetector(input: AutoShopMarginLeakDetectorInput): AutoShopMarginLeakDetectorOutput {
  const results = evaluateFormulas(input);
  const annualizedLeakage = results.annualizedLeakage ?? 0;
  const breakdown = {
    grossProfit: results.grossProfit,
    grossMarginPercent: results.grossMarginPercent,
    totalLeakage: results.totalLeakage,
    leakagePercent: results.leakagePercent,
    laborCostPercent: results.laborCostPercent,
    warrantyPercent: results.warrantyPercent,
    reworkPercent: results.reworkPercent,
    idleTimePercent: results.idleTimePercent,
    inventoryHoldingPercent: results.inventoryHoldingPercent,
  };

  // rule: costOfGoodsSold <= revenue
  // rule: laborCost + partsCost <= costOfGoodsSold
  // rule: warrantyClaims <= revenue
  // rule: reworkCost <= laborCost
  // rule: idleTimeCost <= laborCost
  // rule: inventoryHoldingCost <= partsCost
  // rule: periodDays > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Gross margin below 40% indicates significant leakage.
  // threshold skipped (non-JS): Labor cost ratio above 35% suggests inefficiency.
  // threshold skipped (non-JS): Warranty claims above 5% of revenue indicate quality issues.
  // threshold skipped (non-JS): Rework cost above 10% of labor cost indicates process problems.
  // threshold skipped (non-JS): Idle time above 10% of labor cost indicates scheduling issues.
  // threshold skipped (non-JS): Inventory holding cost above 20% of parts cost suggests overstocking.

  const dataConfidenceAdjusted = (() => { try { return results.adjustedLeakage; } catch { return annualizedLeakage; } })();

  return {
    annualizedLeakage,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report with Charts"],
  };
}
