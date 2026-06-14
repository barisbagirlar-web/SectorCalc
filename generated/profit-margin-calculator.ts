// Auto-generated from profit-margin-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface ProfitMarginCalculatorInput {
  revenue: number;
  cogs: number;
  operatingExpenses: number;
  otherIncome: number;
  taxRate: number;
  interestExpense: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const ProfitMarginCalculatorInputSchema = z.object({
  revenue: z.number().min(0).default(0),
  cogs: z.number().min(0).default(0),
  operatingExpenses: z.number().min(0).default(0),
  otherIncome: z.number().min(0).default(0),
  taxRate: z.number().min(0).max(100).default(25),
  interestExpense: z.number().min(0).default(0),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface ProfitMarginCalculatorOutput {
  netProfitMargin: number;
  breakdown: {
    grossProfit: number;
    grossProfitMargin: number;
    operatingProfit: number;
    operatingProfitMargin: number;
    preTaxProfit: number;
    netProfit: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: ProfitMarginCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.grossProfit = ((): number => { try { const __v = input.revenue - input.cogs; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.grossProfitMargin = ((): number => { try { const __v = (input.revenue - input.cogs) / input.revenue; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.operatingProfit = ((): number => { try { const __v = input.revenue - input.cogs - input.operatingExpenses; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.operatingProfitMargin = ((): number => { try { const __v = (input.revenue - input.cogs - input.operatingExpenses) / input.revenue; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.preTaxProfit = ((): number => { try { const __v = input.revenue - input.cogs - input.operatingExpenses + input.otherIncome - input.interestExpense; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netProfit = ((): number => { try { const __v = (input.revenue - input.cogs - input.operatingExpenses + input.otherIncome - input.interestExpense) * (1 - input.taxRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netProfitMargin = ((): number => { try { const __v = ((input.revenue - input.cogs - input.operatingExpenses + input.otherIncome - input.interestExpense) * (1 - input.taxRate / 100)) / input.revenue; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateProfitMarginCalculator(input: ProfitMarginCalculatorInput): ProfitMarginCalculatorOutput {
  const results = evaluateFormulas(input);
  const netProfitMargin = results.netProfitMargin ?? 0;
  const breakdown = {
    grossProfit: results.grossProfit,
    grossProfitMargin: results.grossProfitMargin,
    operatingProfit: results.operatingProfit,
    operatingProfitMargin: results.operatingProfitMargin,
    preTaxProfit: results.preTaxProfit,
    netProfit: results.netProfit,
  };

  // rule: revenue >= 0
  // rule: cogs >= 0
  // rule: operatingExpenses >= 0
  // rule: otherIncome >= 0
  // rule: taxRate >= 0 and taxRate <= 100
  // rule: interestExpense >= 0
  // rule: if revenue > 0 then cogs + operatingExpenses <= revenue + otherIncome (gross profit check)
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if grossProfitMargin < 0.2 then 'Low gross margin; review pricing or COGS'
  // threshold skipped (non-JS): if operatingProfitMargin < 0.1 then 'Operating margin below 10%; consider cost reduction'
  // threshold skipped (non-JS): if netProfitMargin < 0.05 then 'Net margin below 5%; profitability at risk'

  const dataConfidenceAdjusted = (() => { try { return results.netProfitMargin * (1 - (input.dataConfidence == 'low' ? 0.2 : input.dataConfidence == 'medium' ? 0.1 : 0)); } catch { return netProfitMargin; } })();

  return {
    netProfitMargin,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analysis (multi-period comparison)","Benchmarking against industry averages","Detailed report with variance analysis"],
  };
}
