// Auto-generated from kablo-kesiti-mm-secim-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface KabloKesitiMmSecimHesaplamaInput {
  akim: number;
  gerilim: number;
  kabloUzunlugu: number;
  kabloTipi: 'PVC' | 'XLPE' | 'EPR';
  tesisatSekli: 'havada' | 'boru_icinde' | 'toprak_alti';
  ortamSicakligi: number;
  izinliGerilimDusumu: number;
  fazSayisi: 'tek_faz' | 'uc_faz';
  iletkenMalzemesi: 'bakir' | 'aluminyum';
}

export const KabloKesitiMmSecimHesaplamaInputSchema = z.object({
  akim: z.number().min(0).max(10000).default(10),
  gerilim: z.number().min(0).max(100000).default(230),
  kabloUzunlugu: z.number().min(0).max(10000).default(50),
  kabloTipi: z.enum(['PVC', 'XLPE', 'EPR']).default('PVC'),
  tesisatSekli: z.enum(['havada', 'boru_icinde', 'toprak_alti']).default('havada'),
  ortamSicakligi: z.number().min(-10).max(80).default(30),
  izinliGerilimDusumu: z.number().min(0).max(10).default(3),
  fazSayisi: z.enum(['tek_faz', 'uc_faz']).default('tek_faz'),
  iletkenMalzemesi: z.enum(['bakir', 'aluminyum']).default('bakir'),
});

export interface KabloKesitiMmSecimHesaplamaOutput {
  sonKesit: number;
  breakdown: {
    gerekliKesit: number;
    standartKesit: number;
    gerilimDusumu: number;
    sicaklikDuzeltmeFaktoru: number;
    akimTasimaKapasitesi: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: KabloKesitiMmSecimHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.akimTasimaKapasitesi = ((): number => { try { const __v = input.kabloTipi == 'PVC' ? (input.tesisatSekli == 'havada' ? 0.94 : input.tesisatSekli == 'boru_icinde' ? 0.8 : 0.7) : input.kabloTipi == 'XLPE' ? (input.tesisatSekli == 'havada' ? 1.0 : input.tesisatSekli == 'boru_icinde' ? 0.9 : 0.8) : (input.tesisatSekli == 'havada' ? 0.96 : input.tesisatSekli == 'boru_icinde' ? 0.85 : 0.75); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.sicaklikDuzeltmeFaktoru = ((): number => { try { const __v = input.ortamSicakligi <= 30 ? 1.0 : input.ortamSicakligi <= 40 ? 0.9 : input.ortamSicakligi <= 50 ? 0.8 : 0.7; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.direnc = ((): number => { try { const __v = input.iletkenMalzemesi == 'bakir' ? 0.0175 : 0.0283; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.gerilimDusumu = ((): number => { try { const __v = input.fazSayisi == 'tek_faz' ? (2 * input.akim * input.kabloUzunlugu * results.direnc) / (kesit * input.gerilim) * 100 : (input.akim * input.kabloUzunlugu * results.direnc * 1.732) / (kesit * input.gerilim) * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.gerekliKesit = ((): number => { try { const __v = input.fazSayisi == 'tek_faz' ? (2 * input.akim * input.kabloUzunlugu * results.direnc * 100) / (input.izinliGerilimDusumu * input.gerilim) : (input.akim * input.kabloUzunlugu * results.direnc * 1.732 * 100) / (input.izinliGerilimDusumu * input.gerilim); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.standartKesit = ((): number => { try { const __v = results.gerekliKesit <= 1.5 ? 1.5 : results.gerekliKesit <= 2.5 ? 2.5 : results.gerekliKesit <= 4 ? 4 : results.gerekliKesit <= 6 ? 6 : results.gerekliKesit <= 10 ? 10 : results.gerekliKesit <= 16 ? 16 : results.gerekliKesit <= 25 ? 25 : results.gerekliKesit <= 35 ? 35 : results.gerekliKesit <= 50 ? 50 : results.gerekliKesit <= 70 ? 70 : results.gerekliKesit <= 95 ? 95 : results.gerekliKesit <= 120 ? 120 : results.gerekliKesit <= 150 ? 150 : results.gerekliKesit <= 185 ? 185 : results.gerekliKesit <= 240 ? 240 : 300; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.sonKesit = ((): number => { try { const __v = results.standartKesit * results.sicaklikDuzeltmeFaktoru * results.akimTasimaKapasitesi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateKabloKesitiMmSecimHesaplama(input: KabloKesitiMmSecimHesaplamaInput): KabloKesitiMmSecimHesaplamaOutput {
  const results = evaluateFormulas(input);
  const sonKesit = results.sonKesit ?? 0;
  const breakdown = {
    gerekliKesit: results.gerekliKesit,
    standartKesit: results.standartKesit,
    gerilimDusumu: results.gerilimDusumu,
    sicaklikDuzeltmeFaktoru: results.sicaklikDuzeltmeFaktoru,
    akimTasimaKapasitesi: results.akimTasimaKapasitesi,
  };

  // rule: akim > 0
  // rule: kabloUzunlugu > 0
  // rule: ortamSicakligi >= -10 && ortamSicakligi <= 80
  // rule: izinliGerilimDusumu >= 0 && izinliGerilimDusumu <= 10
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Eger gerilim dusumu > izinliGerilimDusumu ise uyari: 'Gerilim dusumu limiti asiyor, daha buyuk kesit secin.'
  // threshold skipped (non-JS): Eger ortamSicakligi > 40 ise uyari: 'Yuksek sicaklik, kablo kapasitesi dusebilir.'

  const dataConfidenceAdjusted = (() => { try { return results.sonKesit; } catch { return sonKesit; } })();

  return {
    sonKesit,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
