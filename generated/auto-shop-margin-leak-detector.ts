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
  results.grossProfit = ((): number => { try { const __v = input.revenue - input.costOfGoodsSold; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.grossMarginPercent = ((): number => { try { const __v = results.grossProfit / input.revenue; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalLeakage = ((): number => { try { const __v = input.warrantyClaims + input.reworkCost + input.idleTimeCost + input.inventoryHoldingCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.leakagePercent = ((): number => { try { const __v = results.totalLeakage / input.revenue; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.laborCostPercent = ((): number => { try { const __v = input.laborCost / input.revenue; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.warrantyPercent = ((): number => { try { const __v = input.warrantyClaims / input.revenue; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.reworkPercent = ((): number => { try { const __v = input.reworkCost / input.laborCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.idleTimePercent = ((): number => { try { const __v = input.idleTimeCost / input.laborCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.inventoryHoldingPercent = ((): number => { try { const __v = input.inventoryHoldingCost / input.partsCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualizedLeakage = ((): number => { try { const __v = results.totalLeakage * (365 / input.periodDays); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.adjustedLeakage = ((): number => { try { const __v = input.dataConfidence == 'low' ? results.annualizedLeakage * 1.2 : input.dataConfidence == 'medium' ? results.annualizedLeakage * 1.0 : results.annualizedLeakage * 0.9; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
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
