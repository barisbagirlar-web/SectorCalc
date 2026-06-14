// Auto-generated from kaynakli-baglanti-kose-kut-mukavemet-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface KaynakliBaglantiKoseKutMukavemetHesabiInput {
  kaynakTipi: 'Kose Kaynagi' | 'Kut Kaynagi';
  kaynakBoyu: number;
  kaynakKalinligi: number;
  malzemeAkmaDayanimi: number;
  guvenlikKatsayisi: number;
  uygulananKuvvet: number;
  yuklemeTipi: 'Cekme' | 'Kesme' | 'Egme';
}

export const KaynakliBaglantiKoseKutMukavemetHesabiInputSchema = z.object({
  kaynakTipi: z.enum(['Kose Kaynagi', 'Kut Kaynagi']).default('Kose Kaynagi'),
  kaynakBoyu: z.number().min(10).max(1000).default(100),
  kaynakKalinligi: z.number().min(1).max(50).default(5),
  malzemeAkmaDayanimi: z.number().min(100).max(1000).default(235),
  guvenlikKatsayisi: z.number().min(1).max(4).default(1.5),
  uygulananKuvvet: z.number().min(100).max(1000000).default(10000),
  yuklemeTipi: z.enum(['Cekme', 'Kesme', 'Egme']).default('Cekme'),
});

export interface KaynakliBaglantiKoseKutMukavemetHesabiOutput {
  mukavemetOrani: number;
  breakdown: {
    izinVerilenGerilme: number;
    gerilme: number;
    durum: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: KaynakliBaglantiKoseKutMukavemetHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.izinVerilenGerilme = ((): number => { try { const __v = input.malzemeAkmaDayanimi / input.guvenlikKatsayisi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.gerilme = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.mukavemetOrani = ((): number => { try { const __v = results.izinVerilenGerilme / results.gerilme; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.durum = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateKaynakliBaglantiKoseKutMukavemetHesabi(input: KaynakliBaglantiKoseKutMukavemetHesabiInput): KaynakliBaglantiKoseKutMukavemetHesabiOutput {
  const results = evaluateFormulas(input);
  const mukavemetOrani = results.mukavemetOrani ?? 0;
  const breakdown = {
    izinVerilenGerilme: results.izinVerilenGerilme,
    gerilme: results.gerilme,
    durum: results.durum,
  };

  // rule: kaynakBoyu > 0
  // rule: kaynakKalinligi > 0
  // rule: malzemeAkmaDayanimi > 0
  // rule: guvenlikKatsayisi >= 1.0
  // rule: uygulananKuvvet > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Guvenlik katsayisi dusuk, tasarim riskli olabilir.
  // threshold skipped (non-JS): Kaynak kalinligi cok ince, yetersiz mukavemet riski.

  const dataConfidenceAdjusted = (() => { try { return results.mukavemetOrani; } catch { return mukavemetOrani; } })();

  return {
    mukavemetOrani,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analizi","Detayli Rapor"],
  };
}
