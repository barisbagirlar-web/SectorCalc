// Auto-generated from yalitim-malzemesi-m-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface YalitimMalzemesiMHesaplamaInput {
  yalitimAlani: number;
  malzemeKalinlik: number;
  isilIletkenlik: number;
  sicaklikFarki: number;
  calismaSaati: number;
  enerjiBirimFiyat: number;
  malzemeBirimFiyat: number;
  projeOmru: number;
  iskontoOrani: number;
}

export const YalitimMalzemesiMHesaplamaInputSchema = z.object({
  yalitimAlani: z.number().min(0).default(100),
  malzemeKalinlik: z.number().min(0).default(50),
  isilIletkenlik: z.number().min(0.01).max(1).default(0.035),
  sicaklikFarki: z.number().min(0).default(20),
  calismaSaati: z.number().min(0).max(24).default(24),
  enerjiBirimFiyat: z.number().min(0).default(1.5),
  malzemeBirimFiyat: z.number().min(0).default(100),
  projeOmru: z.number().min(1).max(50).default(20),
  iskontoOrani: z.number().min(0).max(100).default(10),
});

export interface YalitimMalzemesiMHesaplamaOutput {
  npv: number;
  breakdown: {
    isilDirenc: number;
    isilGecisKatsayisi: number;
    isikaybi: number;
    yillikEnerjiKaybi: number;
    yillikEnerjiMaliyeti: number;
    toplamMalzemeMaliyeti: number;
    yillikNetTasarruf: number;
    geriOdemeSuresi: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: YalitimMalzemesiMHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.isilDirenc = ((): number => { try { const __v = malzemeKalinlik / 1000 / input.isilIletkenlik; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.isilGecisKatsayisi = ((): number => { try { const __v = 1 / results.isilDirenc; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.isikaybi = ((): number => { try { const __v = input.yalitimAlani * results.isilGecisKatsayisi * input.sicaklikFarki; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.yillikEnerjiKaybi = ((): number => { try { const __v = results.isikaybi * input.calismaSaati * 365 / 1000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.yillikEnerjiMaliyeti = ((): number => { try { const __v = results.yillikEnerjiKaybi * input.enerjiBirimFiyat; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamMalzemeMaliyeti = ((): number => { try { const __v = input.yalitimAlani * input.malzemeBirimFiyat; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.yillikNetTasarruf = ((): number => { try { const __v = results.yillikEnerjiMaliyeti; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.npv = ((): number => { try { const __v = -results.toplamMalzemeMaliyeti + results.yillikNetTasarruf * ((1 - (1 + input.iskontoOrani/100)^(-input.projeOmru)) / (input.iskontoOrani/100)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.geriOdemeSuresi = ((): number => { try { const __v = results.toplamMalzemeMaliyeti / results.yillikNetTasarruf; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateYalitimMalzemesiMHesaplama(input: YalitimMalzemesiMHesaplamaInput): YalitimMalzemesiMHesaplamaOutput {
  const results = evaluateFormulas(input);
  const npv = results.npv ?? 0;
  const breakdown = {
    isilDirenc: results.isilDirenc,
    isilGecisKatsayisi: results.isilGecisKatsayisi,
    isikaybi: results.isikaybi,
    yillikEnerjiKaybi: results.yillikEnerjiKaybi,
    yillikEnerjiMaliyeti: results.yillikEnerjiMaliyeti,
    toplamMalzemeMaliyeti: results.toplamMalzemeMaliyeti,
    yillikNetTasarruf: results.yillikNetTasarruf,
    geriOdemeSuresi: results.geriOdemeSuresi,
  };

  // rule: isilIletkenlik > 0
  // rule: malzemeKalinlik > 0
  // rule: sicaklikFarki >= 0
  // rule: calismaSaati >= 0 && calismaSaati <= 24
  // rule: enerjiBirimFiyat >= 0
  // rule: malzemeBirimFiyat >= 0
  // rule: projeOmru >= 1
  // rule: iskontoOrani >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if isilIletkenlik > 0.1 then 'Yuksek isil iletkenlik, dusuk yalitim performansi'
  // threshold skipped (non-JS): if sicaklikFarki > 30 then 'Yuksek sicaklik farki, enerji tasarrufu potansiyeli yuksek'

  const dataConfidenceAdjusted = (() => { try { return results.npv * 0.9; } catch { return npv; } })();

  return {
    npv,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi","Karsilastirma (farkli malzemeler)","Detayli rapor"],
  };
}
