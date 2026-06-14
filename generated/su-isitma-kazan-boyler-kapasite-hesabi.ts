// Auto-generated from su-isitma-kazan-boyler-kapasite-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface SuIsitmaKazanBoylerKapasiteHesabiInput {
  sicakSuIhtiyaci: number;
  kullanimSuresi: number;
  girisSuyuSicakligi: number;
  cikisSuyuSicakligi: number;
  depolamaSicakligi: number;
  isiKaybiFaktoru: number;
  talebinZirveFaktoru: number;
  kazanVerimi: number;
  enerjiBirimFiyati: number;
  yakitTuru: 'dogalgaz' | 'elektrik' | 'fuel-oil' | 'LPG';
}

export const SuIsitmaKazanBoylerKapasiteHesabiInputSchema = z.object({
  sicakSuIhtiyaci: z.number().min(0).max(100000).default(1000),
  kullanimSuresi: z.number().min(1).max(24).default(8),
  girisSuyuSicakligi: z.number().min(-10).max(30).default(10),
  cikisSuyuSicakligi: z.number().min(40).max(90).default(60),
  depolamaSicakligi: z.number().min(50).max(90).default(65),
  isiKaybiFaktoru: z.number().min(0).max(30).default(10),
  talebinZirveFaktoru: z.number().min(1).max(3).default(1.5),
  kazanVerimi: z.number().min(50).max(99).default(90),
  enerjiBirimFiyati: z.number().min(0).max(10).default(1.5),
  yakitTuru: z.enum(['dogalgaz', 'elektrik', 'fuel-oil', 'LPG']).default('dogalgaz'),
});

export interface SuIsitmaKazanBoylerKapasiteHesabiOutput {
  kazanKapasitesiKW: number;
  breakdown: {
    gunlukEnerjiIhtiyaciKWh: number;
    zirveSaatlikTalepLh: number;
    depolamaHacmiL: number;
    yillikEnerjiTuketimiKWh: number;
    yillikEnerjiMaliyetiTL: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: SuIsitmaKazanBoylerKapasiteHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.gunlukEnerjiIhtiyaciKWh = ((): number => { try { const __v = sicakSuIhtiyaci * 4.186 * (cikisSuyuSicakligi - girisSuyuSicakligi) / 3600; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.zirveSaatlikTalepLh = ((): number => { try { const __v = sicakSuIhtiyaci / kullanimSuresi * talebinZirveFaktoru; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.depolamaHacmiL = ((): number => { try { const __v = results.zirveSaatlikTalepLh * (depolamaSicakligi - girisSuyuSicakligi) / (depolamaSicakligi - cikisSuyuSicakligi) * (1 + isiKaybiFaktoru / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.kazanKapasitesiKW = ((): number => { try { const __v = gunlukEnerjiIhtiyaci_kWh / kullanimSuresi * (1 + isiKaybiFaktoru / 100) / (input.kazanVerimi / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.yillikEnerjiTuketimiKWh = ((): number => { try { const __v = gunlukEnerjiIhtiyaci_kWh * 365 / (input.kazanVerimi / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.yillikEnerjiMaliyetiTL = ((): number => { try { const __v = yillikEnerjiTuketimi_kWh * enerjiBirimFiyati; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateSuIsitmaKazanBoylerKapasiteHesabi(input: SuIsitmaKazanBoylerKapasiteHesabiInput): SuIsitmaKazanBoylerKapasiteHesabiOutput {
  const results = evaluateFormulas(input);
  const kazanKapasitesiKW = results.kazanKapasitesiKW ?? 0;
  const breakdown = {
    gunlukEnerjiIhtiyaciKWh: results.gunlukEnerjiIhtiyaciKWh,
    zirveSaatlikTalepLh: results.zirveSaatlikTalepLh,
    depolamaHacmiL: results.depolamaHacmiL,
    yillikEnerjiTuketimiKWh: results.yillikEnerjiTuketimiKWh,
    yillikEnerjiMaliyetiTL: results.yillikEnerjiMaliyetiTL,
  };

  // rule: cikisSuyuSicakligi > girisSuyuSicakligi
  // rule: depolamaSicakligi >= cikisSuyuSicakligi
  // rule: kullanimSuresi > 0
  // rule: sicakSuIhtiyaci > 0
  // rule: isiKaybiFaktoru >= 0
  // rule: talebinZirveFaktoru >= 1
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Yuksek isi kaybi; yalitim iyilestirilmeli.
  // threshold skipped (non-JS): Kazan verimi dusuk; bakim veya degisim onerilir.
  // threshold skipped (non-JS): Lejyonella riski; depolama sicakligi en az 60°C olmali.

  const dataConfidenceAdjusted = (() => { try { return dataConfidenceAdjusted; } catch { return kazanKapasitesiKW; } })();

  return {
    kazanKapasitesiKW,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi (mevsimsel talep degisimi)","Karsilastirma (farkli yakit turleri, verim senaryolari)","Detayli rapor (enerji maliyeti, geri odeme suresi)"],
  };
}
