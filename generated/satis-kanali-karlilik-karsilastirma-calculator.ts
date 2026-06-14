// Auto-generated from satis-kanali-karlilik-karsilastirma-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface SatisKanaliKarlilikKarsilastirmaCalculatorInput {
  channelName: 'online' | 'perakende' | 'toptan' | 'distributor' | 'acente';
  revenue: number;
  costOfGoodsSold: number;
  marketingCost: number;
  salesCost: number;
  logisticsCost: number;
  overheadCost: number;
  returnRate: number;
  discountRate: number;
  dataConfidence: number;
}

export const SatisKanaliKarlilikKarsilastirmaCalculatorInputSchema = z.object({
  channelName: z.enum(['online', 'perakende', 'toptan', 'distributor', 'acente']).default('online'),
  revenue: z.number().min(0).default(100000),
  costOfGoodsSold: z.number().min(0).default(60000),
  marketingCost: z.number().min(0).default(10000),
  salesCost: z.number().min(0).default(5000),
  logisticsCost: z.number().min(0).default(5000),
  overheadCost: z.number().min(0).default(5000),
  returnRate: z.number().min(0).max(100).default(5),
  discountRate: z.number().min(0).max(100).default(10),
  dataConfidence: z.number().min(0).max(100).default(90),
});

export interface SatisKanaliKarlilikKarsilastirmaCalculatorOutput {
  netProfitMargin: number;
  breakdown: {
    netRevenue: number;
    totalCost: number;
    grossProfit: number;
    netProfit: number;
    grossProfitMargin: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: SatisKanaliKarlilikKarsilastirmaCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.netRevenue = ((): number => { try { const __v = input.revenue * (1 - input.discountRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.returnCost = ((): number => { try { const __v = results.netRevenue * (input.returnRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = input.costOfGoodsSold + input.marketingCost + input.salesCost + input.logisticsCost + input.overheadCost + results.returnCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.grossProfit = ((): number => { try { const __v = results.netRevenue - input.costOfGoodsSold; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netProfit = ((): number => { try { const __v = results.netRevenue - results.totalCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.grossProfitMargin = ((): number => { try { const __v = (results.grossProfit / results.netRevenue) * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netProfitMargin = ((): number => { try { const __v = (results.netProfit / results.netRevenue) * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.adjustedNetProfitMargin = ((): number => { try { const __v = results.netProfitMargin * (input.dataConfidence / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateSatisKanaliKarlilikKarsilastirmaCalculator(input: SatisKanaliKarlilikKarsilastirmaCalculatorInput): SatisKanaliKarlilikKarsilastirmaCalculatorOutput {
  const results = evaluateFormulas(input);
  const netProfitMargin = results.netProfitMargin ?? 0;
  const breakdown = {
    netRevenue: results.netRevenue,
    totalCost: results.totalCost,
    grossProfit: results.grossProfit,
    netProfit: results.netProfit,
    grossProfitMargin: results.grossProfitMargin,
  };

  // rule: revenue >= 0
  // rule: costOfGoodsSold >= 0
  // rule: marketingCost >= 0
  // rule: salesCost >= 0
  // rule: logisticsCost >= 0
  // rule: overheadCost >= 0
  // rule: returnRate >= 0 && returnRate <= 100
  // rule: discountRate >= 0 && discountRate <= 100
  // rule: dataConfidence >= 0 && dataConfidence <= 100
  // rule: costOfGoodsSold <= revenue (brut kar negatif olmamali)
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-string): netProfitMargin
  // threshold skipped (non-string): returnRate
  // threshold skipped (non-string): discountRate

  const dataConfidenceAdjusted = (() => { try { return results.adjustedNetProfitMargin; } catch { return netProfitMargin; } })();

  return {
    netProfitMargin,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi (zaman serisi)","Kanal karsilastirma","Detayli rapor (breakdown grafikleri)"],
  };
}
