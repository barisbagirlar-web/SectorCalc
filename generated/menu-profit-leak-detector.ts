// Auto-generated from menu-profit-leak-detector-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface MenuProfitLeakDetectorInput {
  totalRevenue: number;
  totalCostOfGoodsSold: number;
  totalLaborCost: number;
  totalOverheadCost: number;
  totalWasteCost: number;
  totalTheftCost: number;
  totalDiscountsGiven: number;
  totalMenuPriceErrors: number;
  analysisPeriodDays: number;
  dataConfidence: number;
}

export const MenuProfitLeakDetectorInputSchema = z.object({
  totalRevenue: z.number().min(0).default(100000),
  totalCostOfGoodsSold: z.number().min(0).default(60000),
  totalLaborCost: z.number().min(0).default(20000),
  totalOverheadCost: z.number().min(0).default(10000),
  totalWasteCost: z.number().min(0).default(5000),
  totalTheftCost: z.number().min(0).default(2000),
  totalDiscountsGiven: z.number().min(0).default(3000),
  totalMenuPriceErrors: z.number().min(0).default(1000),
  analysisPeriodDays: z.number().min(1).max(365).default(30),
  dataConfidence: z.number().min(0).max(100).default(90),
});

export interface MenuProfitLeakDetectorOutput {
  netProfit: number;
  breakdown: {
    grossProfit: number;
    totalLeak: number;
    profitMargin: number;
    leakRatio: number;
    dailyLeak: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: MenuProfitLeakDetectorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalCost = ((): number => { try { const __v = input.totalCostOfGoodsSold + input.totalLaborCost + input.totalOverheadCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.grossProfit = ((): number => { try { const __v = input.totalRevenue - results.totalCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalLeak = ((): number => { try { const __v = input.totalWasteCost + input.totalTheftCost + input.totalDiscountsGiven + input.totalMenuPriceErrors; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netProfit = ((): number => { try { const __v = results.grossProfit - results.totalLeak; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.profitMargin = ((): number => { try { const __v = (results.netProfit / input.totalRevenue) * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.leakRatio = ((): number => { try { const __v = (results.totalLeak / input.totalRevenue) * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.wasteRatio = ((): number => { try { const __v = input.totalWasteCost / input.totalRevenue; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.theftRatio = ((): number => { try { const __v = input.totalTheftCost / input.totalRevenue; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.discountRatio = ((): number => { try { const __v = input.totalDiscountsGiven / input.totalRevenue; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.priceErrorRatio = ((): number => { try { const __v = input.totalMenuPriceErrors / input.totalRevenue; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dailyLeak = ((): number => { try { const __v = results.totalLeak / input.analysisPeriodDays; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedLeak = ((): number => { try { const __v = results.totalLeak * (1 + (100 - input.dataConfidence) / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateMenuProfitLeakDetector(input: MenuProfitLeakDetectorInput): MenuProfitLeakDetectorOutput {
  const results = evaluateFormulas(input);
  const netProfit = results.netProfit ?? 0;
  const breakdown = {
    grossProfit: results.grossProfit,
    totalLeak: results.totalLeak,
    profitMargin: results.profitMargin,
    leakRatio: results.leakRatio,
    dailyLeak: results.dailyLeak,
  };

  // rule: totalRevenue >= 0
  // rule: totalCostOfGoodsSold >= 0
  // rule: totalLaborCost >= 0
  // rule: totalOverheadCost >= 0
  // rule: totalWasteCost >= 0
  // rule: totalTheftCost >= 0
  // rule: totalDiscountsGiven >= 0
  // rule: totalMenuPriceErrors >= 0
  // rule: analysisPeriodDays >= 1
  // rule: dataConfidence >= 0 and dataConfidence <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): 0.05
  // threshold skipped (non-JS): 0.02
  // threshold skipped (non-JS): 0.03
  // threshold skipped (non-JS): 0.01

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedLeak; } catch { return netProfit; } })();

  return {
    netProfit,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report"],
  };
}
