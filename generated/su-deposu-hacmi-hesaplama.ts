// Auto-generated from su-deposu-hacmi-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface SuDeposuHacmiHesaplamaInput {
  gunlukSuIhtiyaci: number;
  depolamaGunSayisi: number;
  guvenlikFaktoru: number;
  depoTipi: 'dikdortgen' | 'silindir';
  depoYuksekligi: number;
  depoCapi: number;
}

export const SuDeposuHacmiHesaplamaInputSchema = z.object({
  gunlukSuIhtiyaci: z.number().min(0).max(100000).default(10),
  depolamaGunSayisi: z.number().min(1).max(30).default(3),
  guvenlikFaktoru: z.number().min(1).max(2).default(1.2),
  depoTipi: z.enum(['dikdortgen', 'silindir']).default('dikdortgen'),
  depoYuksekligi: z.number().min(1).max(20).default(3),
  depoCapi: z.number().min(1).max(20).default(4),
});

export interface SuDeposuHacmiHesaplamaOutput {
  toplamHacim: number;
  breakdown: {
    netHacim: number;
    guvenlikFaktoru: number;
    depoTipi: number;
    boyutlar: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: SuDeposuHacmiHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.netHacim = ((): number => { try { const __v = input.gunlukSuIhtiyaci * input.depolamaGunSayisi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamHacim = ((): number => { try { const __v = results.netHacim * input.guvenlikFaktoru; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dikdortgenTabanAlani = ((): number => { try { const __v = results.toplamHacim / input.depoYuksekligi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.silindirTabanAlani = ((): number => { try { const __v = results.toplamHacim / input.depoYuksekligi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dikdortgenKenarUzunlugu = ((): number => { try { const __v = Math.Math.sqrt(results.dikdortgenTabanAlani); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.silindirYaricap = ((): number => { try { const __v = input.depoCapi / 2; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.silindirHacimKontrol = ((): number => { try { const __v = Math.PI * Math.Math.pow(results.silindirYaricap, 2) * input.depoYuksekligi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.sonuc = ((): number => { try { const __v = input.depoTipi == 'dikdortgen' ? { 'hacim': results.toplamHacim, 'tabanAlani': results.dikdortgenTabanAlani, 'kenarUzunlugu': results.dikdortgenKenarUzunlugu, 'yukseklik': input.depoYuksekligi } : { 'hacim': results.toplamHacim, 'cap': input.depoCapi, 'yukseklik': input.depoYuksekligi }; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateSuDeposuHacmiHesaplama(input: SuDeposuHacmiHesaplamaInput): SuDeposuHacmiHesaplamaOutput {
  const results = evaluateFormulas(input);
  const toplamHacim = results.toplamHacim ?? 0;
  const breakdown = {
    netHacim: results.netHacim,
    guvenlikFaktoru: results.guvenlikFaktoru,
    depoTipi: results.depoTipi,
    boyutlar: results.boyutlar,
  };

  // rule: gunlukSuIhtiyaci > 0
  // rule: depolamaGunSayisi >= 1
  // rule: guvenlikFaktoru >= 1
  // rule: if depoTipi == 'dikdortgen' then depoYuksekligi > 0
  // rule: if depoTipi == 'silindir' then depoCapi > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): >1000 ise 'Yuksek talep' uyarisi
  // threshold skipped (non-JS): >1.5 ise 'Asiri guvenlik' uyarisi

  const dataConfidenceAdjusted = (() => { try { return results.toplamHacim; } catch { return toplamHacim; } })();

  return {
    toplamHacim,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
