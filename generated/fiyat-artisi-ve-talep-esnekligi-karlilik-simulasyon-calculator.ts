// Auto-generated from fiyat-artisi-ve-talep-esnekligi-karlilik-simulasyon-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface FiyatArtisiVeTalepEsnekligiKarlilikSimulasyonCalculatorInput {
  currentPrice: number;
  currentQuantity: number;
  priceChangePercent: number;
  priceElasticity: number;
  variableCostPerUnit: number;
  fixedCost: number;
  timePeriod: 'monthly' | 'quarterly' | 'yearly';
}

export const FiyatArtisiVeTalepEsnekligiKarlilikSimulasyonCalculatorInputSchema = z.object({
  currentPrice: z.number().min(0).default(100),
  currentQuantity: z.number().min(0).default(1000),
  priceChangePercent: z.number().min(-100).default(10),
  priceElasticity: z.number().min(-10).max(0).default(-1.5),
  variableCostPerUnit: z.number().min(0).default(60),
  fixedCost: z.number().min(0).default(20000),
  timePeriod: z.enum(['monthly', 'quarterly', 'yearly']).default('monthly'),
});

export interface FiyatArtisiVeTalepEsnekligiKarlilikSimulasyonCalculatorOutput {
  profitChange: number;
  breakdown: {
    newPrice: number;
    newQuantity: number;
    totalRevenue: number;
    totalCost: number;
    profit: number;
    profitMargin: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: FiyatArtisiVeTalepEsnekligiKarlilikSimulasyonCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.newPrice = ((): number => { try { const __v = input.currentPrice * (1 + input.priceChangePercent / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.quantityChangePercent = ((): number => { try { const __v = input.priceChangePercent * input.priceElasticity; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.newQuantity = ((): number => { try { const __v = input.currentQuantity * (1 + results.quantityChangePercent / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalRevenue = ((): number => { try { const __v = results.newPrice * results.newQuantity; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalVariableCost = ((): number => { try { const __v = results.newQuantity * input.variableCostPerUnit; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.totalVariableCost + input.fixedCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.profit = ((): number => { try { const __v = results.totalRevenue - results.totalCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.profitChange = ((): number => { try { const __v = results.profit - (input.currentPrice * input.currentQuantity - input.currentQuantity * input.variableCostPerUnit - input.fixedCost); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.profitMargin = ((): number => { try { const __v = results.profit / results.totalRevenue * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateFiyatArtisiVeTalepEsnekligiKarlilikSimulasyonCalculator(input: FiyatArtisiVeTalepEsnekligiKarlilikSimulasyonCalculatorInput): FiyatArtisiVeTalepEsnekligiKarlilikSimulasyonCalculatorOutput {
  const results = evaluateFormulas(input);
  const profitChange = results.profitChange ?? 0;
  const breakdown = {
    newPrice: results.newPrice,
    newQuantity: results.newQuantity,
    totalRevenue: results.totalRevenue,
    totalCost: results.totalCost,
    profit: results.profit,
    profitMargin: results.profitMargin,
  };

  // rule: currentPrice > 0
  // rule: currentQuantity > 0
  // rule: priceChangePercent must be between -100 and 100
  // rule: priceElasticity < 0
  // rule: variableCostPerUnit >= 0
  // rule: fixedCost >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Talep cok esnek, fiyat artisi geliri dusurebilir.
  // threshold skipped (non-JS): Talep esnek degil, fiyat artisi geliri artirabilir.
  // threshold skipped (non-JS): Kâr marji negatif, zarar ediliyor.

  const dataConfidenceAdjusted = (() => { try { return results.profit * (1 - Math.abs(input.priceElasticity) * 0.1); } catch { return profitChange; } })();

  return {
    profitChange,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi (birden cok senaryo karsilastirmasi)","Detayli rapor (grafikler ve duyarlilik analizi)"],
  };
}
