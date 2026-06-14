// Auto-generated from ratio-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface RatioCalculatorInput {
  currentAssets: number;
  currentLiabilities: number;
  inventory: number;
  totalDebt: number;
  totalEquity: number;
  netIncome: number;
  revenue: number;
  costOfGoodsSold: number;
  averageInventory: number;
  accountsReceivable: number;
  accountsPayable: number;
  operatingExpenses: number;
  interestExpense: number;
  taxExpense: number;
  ebitda: number;
  totalAssets: number;
  operatingCashFlow: number;
  freeCashFlow: number;
  marketPricePerShare: number;
  earningsPerShare: number;
  bookValuePerShare: number;
  dividendPerShare: number;
  sharesOutstanding: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const RatioCalculatorInputSchema = z.object({
  currentAssets: z.number().min(0).default(0),
  currentLiabilities: z.number().min(0).default(0),
  inventory: z.number().min(0).default(0),
  totalDebt: z.number().min(0).default(0),
  totalEquity: z.number().min(0).default(0),
  netIncome: z.number().default(0),
  revenue: z.number().min(0).default(0),
  costOfGoodsSold: z.number().min(0).default(0),
  averageInventory: z.number().min(0).default(0),
  accountsReceivable: z.number().min(0).default(0),
  accountsPayable: z.number().min(0).default(0),
  operatingExpenses: z.number().min(0).default(0),
  interestExpense: z.number().min(0).default(0),
  taxExpense: z.number().min(0).default(0),
  ebitda: z.number().default(0),
  totalAssets: z.number().min(0).default(0),
  operatingCashFlow: z.number().default(0),
  freeCashFlow: z.number().default(0),
  marketPricePerShare: z.number().min(0).default(0),
  earningsPerShare: z.number().default(0),
  bookValuePerShare: z.number().min(0).default(0),
  dividendPerShare: z.number().min(0).default(0),
  sharesOutstanding: z.number().min(1).default(1),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface RatioCalculatorOutput {
  currentRatio: number;
  breakdown: {
    liquidityRatios: number;
    leverageRatios: number;
    profitabilityRatios: number;
    efficiencyRatios: number;
    coverageRatios: number;
    marketValueRatios: number;
    cashFlowRatios: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: RatioCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.currentRatio = ((): number => { try { const __v = input.currentAssets / input.currentLiabilities; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.quickRatio = ((): number => { try { const __v = (input.currentAssets - input.inventory) / input.currentLiabilities; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.debtToEquity = ((): number => { try { const __v = input.totalDebt / input.totalEquity; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.debtRatio = ((): number => { try { const __v = input.totalDebt / input.totalAssets; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.equityRatio = ((): number => { try { const __v = input.totalEquity / input.totalAssets; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.grossProfitMargin = ((): number => { try { const __v = (input.revenue - input.costOfGoodsSold) / input.revenue; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.operatingProfitMargin = ((): number => { try { const __v = (input.revenue - input.costOfGoodsSold - input.operatingExpenses) / input.revenue; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netProfitMargin = ((): number => { try { const __v = input.netIncome / input.revenue; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.returnOnAssets = ((): number => { try { const __v = input.netIncome / input.totalAssets; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.returnOnEquity = ((): number => { try { const __v = input.netIncome / input.totalEquity; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.returnOnInvestedCapital = ((): number => { try { const __v = (input.netIncome + input.interestExpense * (1 - input.taxExpense / (input.netIncome + input.taxExpense))) / (input.totalDebt + input.totalEquity); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.inventoryTurnover = ((): number => { try { const __v = input.costOfGoodsSold / input.averageInventory; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.daysInventoryOutstanding = ((): number => { try { const __v = 365 / results.inventoryTurnover; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.accountsReceivableTurnover = ((): number => { try { const __v = input.revenue / input.accountsReceivable; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.daysSalesOutstanding = ((): number => { try { const __v = 365 / results.accountsReceivableTurnover; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.accountsPayableTurnover = ((): number => { try { const __v = input.costOfGoodsSold / input.accountsPayable; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.daysPayablesOutstanding = ((): number => { try { const __v = 365 / results.accountsPayableTurnover; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.cashConversionCycle = ((): number => { try { const __v = results.daysInventoryOutstanding + results.daysSalesOutstanding - results.daysPayablesOutstanding; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.timesInterestEarned = ((): number => { try { const __v = input.ebitda / input.interestExpense; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.fixedChargeCoverage = ((): number => { try { const __v = (input.ebitda + fixedCharges) / (input.interestExpense + fixedCharges); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.priceToEarnings = ((): number => { try { const __v = input.marketPricePerShare / input.earningsPerShare; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.priceToBook = ((): number => { try { const __v = input.marketPricePerShare / input.bookValuePerShare; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dividendYield = ((): number => { try { const __v = input.dividendPerShare / input.marketPricePerShare; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dividendPayoutRatio = ((): number => { try { const __v = input.dividendPerShare / input.earningsPerShare; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.operatingCashFlowRatio = ((): number => { try { const __v = input.operatingCashFlow / input.currentLiabilities; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.freeCashFlowYield = ((): number => { try { const __v = input.freeCashFlow / (input.marketPricePerShare * input.sharesOutstanding); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = primary * (input.dataConfidence === 'high' ? 1.0 : input.dataConfidence === 'medium' ? 0.9 : 0.8); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateRatioCalculator(input: RatioCalculatorInput): RatioCalculatorOutput {
  const results = evaluateFormulas(input);
  const currentRatio = results.currentRatio ?? 0;
  const breakdown = {
    liquidityRatios: results.liquidityRatios,
    leverageRatios: results.leverageRatios,
    profitabilityRatios: results.profitabilityRatios,
    efficiencyRatios: results.efficiencyRatios,
    coverageRatios: results.coverageRatios,
    marketValueRatios: results.marketValueRatios,
    cashFlowRatios: results.cashFlowRatios,
  };

  // rule: currentAssets >= 0
  // rule: currentLiabilities >= 0
  // rule: inventory >= 0
  // rule: totalDebt >= 0
  // rule: totalEquity > 0
  // rule: revenue > 0
  // rule: costOfGoodsSold >= 0
  // rule: averageInventory >= 0
  // rule: accountsReceivable >= 0
  // rule: accountsPayable >= 0
  // rule: operatingExpenses >= 0
  // rule: interestExpense >= 0
  // rule: taxExpense >= 0
  // rule: totalAssets > 0
  // rule: sharesOutstanding >= 1
  // rule: marketPricePerShare >= 0
  // rule: earningsPerShare != null
  // rule: bookValuePerShare >= 0
  // rule: dividendPerShare >= 0
  // rule: If currentLiabilities > 0 then currentAssets must be provided
  // rule: If inventory > currentAssets then warning: inventory exceeds current assets
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-string): currentRatio
  // threshold skipped (non-string): quickRatio
  // threshold skipped (non-string): debtToEquity
  // threshold skipped (non-string): profitMargin
  // threshold skipped (non-string): returnOnEquity
  // threshold skipped (non-string): inventoryTurnover
  // threshold skipped (non-string): daysSalesOutstanding
  // threshold skipped (non-string): timesInterestEarned
  // threshold skipped (non-string): priceToEarnings
  // threshold skipped (non-string): priceToBook
  // threshold skipped (non-string): dividendYield
  // threshold skipped (non-string): operatingCashFlowRatio
  // threshold skipped (non-string): freeCashFlowYield

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return currentRatio; } })();

  return {
    currentRatio,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis (historical comparison)","Benchmarking against industry averages","Detailed report with commentary","Scenario analysis (what-if)"],
  };
}
