// Auto-generated from doviz-pozisyonu-kur-farki-riski-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface DovizPozisyonuKurFarkiRiskiHesabiInput {
  foreignCurrencyPosition: number;
  currentExchangeRate: number;
  forecastedExchangeRate: number;
  confidenceLevel: number;
  hedgeRatio: number;
}

export const DovizPozisyonuKurFarkiRiskiHesabiInputSchema = z.object({
  foreignCurrencyPosition: z.number().min(-1000000000).max(1000000000).default(0),
  currentExchangeRate: z.number().min(0.01).max(1000).default(30),
  forecastedExchangeRate: z.number().min(0.01).max(1000).default(32),
  confidenceLevel: z.number().min(0).max(100).default(95),
  hedgeRatio: z.number().min(0).max(100).default(0),
});

export interface DovizPozisyonuKurFarkiRiskiHesabiOutput {
  kurFarkiTutari: number;
  breakdown: {
    kurFarkiRiskOrani: number;
    hedgedPosition: number;
    unhedgedPosition: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: DovizPozisyonuKurFarkiRiskiHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.kurFarkiTutari = ((): number => { try { const __v = input.foreignCurrencyPosition * (input.forecastedExchangeRate - input.currentExchangeRate) * (1 - input.hedgeRatio/100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.kurFarkiRiskOrani = ((): number => { try { const __v = Math.abs(results.kurFarkiTutari) / Math.abs(input.foreignCurrencyPosition * input.currentExchangeRate); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.kurFarkiTutari * (input.confidenceLevel / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateDovizPozisyonuKurFarkiRiskiHesabi(input: DovizPozisyonuKurFarkiRiskiHesabiInput): DovizPozisyonuKurFarkiRiskiHesabiOutput {
  const results = evaluateFormulas(input);
  const kurFarkiTutari = results.kurFarkiTutari ?? 0;
  const breakdown = {
    kurFarkiRiskOrani: results.kurFarkiRiskOrani,
    hedgedPosition: results.hedgedPosition,
    unhedgedPosition: results.unhedgedPosition,
  };

  // rule: foreignCurrencyPosition must be numeric
  // rule: currentExchangeRate > 0
  // rule: forecastedExchangeRate > 0
  // rule: confidenceLevel between 0 and 100
  // rule: hedgeRatio between 0 and 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): 0.05
  // threshold skipped (non-JS): 100000

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return kurFarkiTutari; } })();

  return {
    kurFarkiTutari,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
