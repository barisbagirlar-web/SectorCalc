// Auto-generated from cash-flow-gap-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface CashFlowGapCalculatorInput {
  accountsReceivable: number;
  accountsPayable: number;
  inventory: number;
  costOfGoodsSold: number;
  netSales: number;
  operatingExpenses: number;
  daysInPeriod: number;
  dataConfidence: number;
}

export const CashFlowGapCalculatorInputSchema = z.object({
  accountsReceivable: z.number().min(0).default(0),
  accountsPayable: z.number().min(0).default(0),
  inventory: z.number().min(0).default(0),
  costOfGoodsSold: z.number().min(0).default(0),
  netSales: z.number().min(0).default(0),
  operatingExpenses: z.number().min(0).default(0),
  daysInPeriod: z.number().min(1).max(365).default(365),
  dataConfidence: z.number().min(0).max(100).default(100),
});

export interface CashFlowGapCalculatorOutput {
  cashFlowGap: number;
  breakdown: {
    daysSalesOutstanding: number;
    daysInventoryOutstanding: number;
    daysPayablesOutstanding: number;
    cashConversionCycle: number;
    cashFlowGapRatio: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: CashFlowGapCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.daysSalesOutstanding = (() => { try { return input.accountsReceivable / (input.netSales / input.daysInPeriod); } catch { return 0; } })();
  results.daysInventoryOutstanding = (() => { try { return input.inventory / (input.costOfGoodsSold / input.daysInPeriod); } catch { return 0; } })();
  results.daysPayablesOutstanding = (() => { try { return input.accountsPayable / (input.costOfGoodsSold / input.daysInPeriod); } catch { return 0; } })();
  results.cashConversionCycle = (() => { try { return results.daysSalesOutstanding + results.daysInventoryOutstanding - results.daysPayablesOutstanding; } catch { return 0; } })();
  results.cashFlowGap = (() => { try { return results.cashConversionCycle * (input.costOfGoodsSold + input.operatingExpenses) / input.daysInPeriod; } catch { return 0; } })();
  results.cashFlowGapRatio = (() => { try { return results.cashFlowGap / input.netSales; } catch { return 0; } })();
  results.dataConfidenceAdjusted = (() => { try { return results.cashFlowGap * (input.dataConfidence / 100); } catch { return 0; } })();
  return results;
}

export function calculateCashFlowGapCalculator(input: CashFlowGapCalculatorInput): CashFlowGapCalculatorOutput {
  const results = evaluateFormulas(input);
  const cashFlowGap = results.cashFlowGap ?? 0;
  const breakdown = {
    daysSalesOutstanding: results.daysSalesOutstanding,
    daysInventoryOutstanding: results.daysInventoryOutstanding,
    daysPayablesOutstanding: results.daysPayablesOutstanding,
    cashConversionCycle: results.cashConversionCycle,
    cashFlowGapRatio: results.cashFlowGapRatio,
  };

  // rule: costOfGoodsSold >= 0
  // rule: netSales >= 0
  // rule: operatingExpenses >= 0
  // rule: accountsReceivable >= 0
  // rule: accountsPayable >= 0
  // rule: inventory >= 0
  // rule: daysInPeriod >= 1 and daysInPeriod <= 365
  // rule: dataConfidence >= 0 and dataConfidence <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-string): cashConversionCycle
  // threshold skipped (non-string): cashFlowGapRatio

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return cashFlowGap; } })();

  return {
    cashFlowGap,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis (historical comparison)","Benchmarking against industry standards","Detailed report with breakdown and recommendations"],
  };
}
