// Auto-generated from lastik-omru-degisim-km-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface LastikOmruDegisimKmHesaplamaInput {
  lastikFiyati: number;
  ortalamaKm: number;
  lastikOmru: number;
  aracSayisi: number;
  lastikSayisi: number;
  isletmeGideri: number;
  vergiOrani: number;
}

export const LastikOmruDegisimKmHesaplamaInputSchema = z.object({
  lastikFiyati: z.number().min(100).max(10000).default(1000),
  ortalamaKm: z.number().min(1).max(1000).default(100),
  lastikOmru: z.number().min(10000).max(100000).default(50000),
  aracSayisi: z.number().min(1).max(1000).default(1),
  lastikSayisi: z.number().min(2).max(6).default(4),
  isletmeGideri: z.number().min(0).max(500).default(50),
  vergiOrani: z.number().min(0).max(50).default(18),
});

export interface LastikOmruDegisimKmHesaplamaOutput {
  kmBasiMaliyet: number;
  breakdown: {
    yillikDegisimSayisi: number;
    yillikToplamMaliyet: number;
    toplamLastikMaliyeti: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: LastikOmruDegisimKmHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.gunlukKm = ((): number => { try { const __v = input.ortalamaKm; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.gunSayisi = ((): number => { try { const __v = input.lastikOmru / results.gunlukKm; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.degisimSikligiGun = ((): number => { try { const __v = results.gunSayisi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.yillikDegisimSayisi = ((): number => { try { const __v = 365 / results.degisimSikligiGun; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.birimLastikMaliyeti = ((): number => { try { const __v = input.lastikFiyati * (1 + input.vergiOrani / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamLastikMaliyeti = ((): number => { try { const __v = results.birimLastikMaliyeti * input.lastikSayisi * input.aracSayisi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.yillikToplamMaliyet = ((): number => { try { const __v = results.toplamLastikMaliyeti * results.yillikDegisimSayisi + input.isletmeGideri * input.lastikSayisi * input.aracSayisi * results.yillikDegisimSayisi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.kmBasiMaliyet = ((): number => { try { const __v = results.yillikToplamMaliyet / (365 * results.gunlukKm * input.aracSayisi); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateLastikOmruDegisimKmHesaplama(input: LastikOmruDegisimKmHesaplamaInput): LastikOmruDegisimKmHesaplamaOutput {
  const results = evaluateFormulas(input);
  const kmBasiMaliyet = results.kmBasiMaliyet ?? 0;
  const breakdown = {
    yillikDegisimSayisi: results.yillikDegisimSayisi,
    yillikToplamMaliyet: results.yillikToplamMaliyet,
    toplamLastikMaliyeti: results.toplamLastikMaliyeti,
  };

  // rule: lastikFiyati > 0
  // rule: ortalamaKm > 0
  // rule: lastikOmru > 0
  // rule: aracSayisi > 0
  // rule: lastikSayisi >= 2
  // rule: isletmeGideri >= 0
  // rule: vergiOrani >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (input.lastikOmru < 30000) hiddenLossDrivers.push("lastikOmruKisa");
  if (input.ortalamaKm > 500) hiddenLossDrivers.push("ortalamaKmYuksek");

  const dataConfidenceAdjusted = (() => { try { return results.kmBasiMaliyet; } catch { return kmBasiMaliyet; } })();

  return {
    kmBasiMaliyet,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi","Filo karsilastirma"],
  };
}
