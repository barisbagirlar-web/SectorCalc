// Auto-generated from su-debisi-litre-dakika-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface SuDebisiLitreDakikaHesaplamaInput {
  boruCapi: number;
  akisHizi: number;
  akisTipi: 'laminar' | 'turbulent';
  sicaklik: number;
}

export const SuDebisiLitreDakikaHesaplamaInputSchema = z.object({
  boruCapi: z.number().min(1).max(1000).default(50),
  akisHizi: z.number().min(0.1).max(10).default(1.5),
  akisTipi: z.enum(['laminar', 'turbulent']).default('turbulent'),
  sicaklik: z.number().min(0).max(100).default(20),
});

export interface SuDebisiLitreDakikaHesaplamaOutput {
  debiLdakika: number;
  breakdown: {
    kesitAlaniM2: number;
    debiM3s: number;
    reynoldsSayisi: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: SuDebisiLitreDakikaHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.kesitAlani = ((): number => { try { const __v = pi * (input.boruCapi / 1000 / 2)^2; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.debiM3s = ((): number => { try { const __v = results.kesitAlani * input.akisHizi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.debiLdakika = ((): number => { try { const __v = results.debiM3s * 1000 * 60; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.reynoldsSayisi = ((): number => { try { const __v = (1000 * input.akisHizi * (input.boruCapi/1000)) / (0.001002 * (1 + 0.0337*input.sicaklik + 0.000221*input.sicaklik^2)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.akisTipiKontrol = ((): number => { try { const __v = results.reynoldsSayisi < 2000 ? 'laminar' : 'turbulent'; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateSuDebisiLitreDakikaHesaplama(input: SuDebisiLitreDakikaHesaplamaInput): SuDebisiLitreDakikaHesaplamaOutput {
  const results = evaluateFormulas(input);
  const debiLdakika = results.debiLdakika ?? 0;
  const breakdown = {
    kesitAlaniM2: results.kesitAlaniM2,
    debiM3s: results.debiM3s,
    reynoldsSayisi: results.reynoldsSayisi,
  };

  // rule: boruCapi > 0
  // rule: akisHizi > 0
  // rule: sicaklik >= 0 && sicaklik <= 100
  // rule: if (akisTipi == 'laminar') then akisHizi < 2.0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Yuksek akis hizi: erozyon riski artar.
  // threshold skipped (non-JS): Kucuk boru capi: tikanma riski.

  const dataConfidenceAdjusted = (() => { try { return results.debiLdakika * (1 - 0.05); } catch { return debiLdakika; } })();

  return {
    debiLdakika,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma (farkli senaryolar)","Detayli rapor (basinc dusumu, pompa gucu)"],
  };
}
