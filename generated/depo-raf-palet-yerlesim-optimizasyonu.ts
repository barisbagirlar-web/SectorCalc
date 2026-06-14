// Auto-generated from depo-raf-palet-yerlesim-optimizasyonu-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface DepoRafPaletYerlesimOptimizasyonuInput {
  depoGenislik: number;
  depoDerinlik: number;
  depoYukseklik: number;
  rafGenislik: number;
  rafDerinlik: number;
  rafYukseklik: number;
  rafKatlari: number;
  koridorGenislik: number;
  paletBoyu: number;
  paletEni: number;
  paletYuksekligi: number;
  blokSayisiX: number;
  blokSayisiY: number;
  siraSayisi: number;
  dolulukOrani: number;
  dataConfidence: number;
}

export const DepoRafPaletYerlesimOptimizasyonuInputSchema = z.object({
  depoGenislik: z.number().min(10).max(200).default(50),
  depoDerinlik: z.number().min(20).max(300).default(80),
  depoYukseklik: z.number().min(4).max(30).default(12),
  rafGenislik: z.number().min(1).max(4).default(2.4),
  rafDerinlik: z.number().min(0.8).max(2).default(1.2),
  rafYukseklik: z.number().min(1).max(3).default(1.5),
  rafKatlari: z.number().min(1).max(10).default(4),
  koridorGenislik: z.number().min(2).max(6).default(3.5),
  paletBoyu: z.number().min(0.8).max(1.5).default(1.2),
  paletEni: z.number().min(0.8).max(1.2).default(1),
  paletYuksekligi: z.number().min(0.5).max(2).default(1.2),
  blokSayisiX: z.number().min(1).max(10).default(2),
  blokSayisiY: z.number().min(1).max(10).default(3),
  siraSayisi: z.number().min(1).max(5).default(2),
  dolulukOrani: z.number().min(0).max(100).default(85),
  dataConfidence: z.number().min(50).max(100).default(90),
});

export interface DepoRafPaletYerlesimOptimizasyonuOutput {
  kullanilanPalet: number;
  breakdown: {
    toplamRafAlani: number;
    toplamPaletKapasitesi: number;
    alanKullanimOrani: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: DepoRafPaletYerlesimOptimizasyonuInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.blokGenislik = ((): number => { try { const __v = input.rafGenislik * input.siraSayisi + (input.siraSayisi - 1) * 0.1; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.blokDerinlik = ((): number => { try { const __v = input.rafDerinlik; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamRafAlani = ((): number => { try { const __v = input.blokSayisiX * input.blokSayisiY * results.blokGenislik * results.blokDerinlik * input.rafKatlari; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamPaletKapasitesi = ((): number => { try { const __v = results.toplamRafAlani / (input.paletBoyu * input.paletEni); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.kullanilanPalet = ((): number => { try { const __v = results.toplamPaletKapasitesi * input.dolulukOrani / 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.alanKullanimOrani = ((): number => { try { const __v = results.toplamRafAlani / (input.depoGenislik * input.depoDerinlik) * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.kullanilanPalet * input.dataConfidence / 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateDepoRafPaletYerlesimOptimizasyonu(input: DepoRafPaletYerlesimOptimizasyonuInput): DepoRafPaletYerlesimOptimizasyonuOutput {
  const results = evaluateFormulas(input);
  const kullanilanPalet = results.kullanilanPalet ?? 0;
  const breakdown = {
    toplamRafAlani: results.toplamRafAlani,
    toplamPaletKapasitesi: results.toplamPaletKapasitesi,
    alanKullanimOrani: results.alanKullanimOrani,
  };

  // rule: depoYukseklik >= rafYukseklik * rafKatlari + 0.5
  // rule: koridorGenislik >= 2.5
  // rule: dolulukOrani >= 0 && dolulukOrani <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Dusuk doluluk orani, alan optimizasyonu gerekli
  // threshold skipped (non-JS): Yuksek doluluk, darbogaz riski

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return kullanilanPalet; } })();

  return {
    kullanilanPalet,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi","Karsilastirmali senaryolar","Detayli maliyet analizi"],
  };
}
