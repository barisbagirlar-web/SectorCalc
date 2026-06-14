// Auto-generated from isitma-sogutma-yuku-kcal-kw-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface IsitmaSogutmaYukuKcalKwHesabiInput {
  hacim: number;
  sicaklikFarki: number;
  isiGecirgenlikKatsayisi: number;
  yuzeyAlani: number;
  kullaniciSayisi: number;
  aydinlatmaGucu: number;
  ekipmanGucu: number;
  havaDegisimSayisi: number;
  disHavaSicakligi: number;
  icHavaSicakligi: number;
  calismaSuresi: number;
  gunSayisi: number;
  elektrikBirimFiyati: number;
  kaynakTipi: 'dogalgaz' | 'elektrik' | 'komur' | 'fuel-oil' | 'jeotermal';
  verim: number;
}

export const IsitmaSogutmaYukuKcalKwHesabiInputSchema = z.object({
  hacim: z.number().min(1).max(100000).default(100),
  sicaklikFarki: z.number().min(0).max(100).default(20),
  isiGecirgenlikKatsayisi: z.number().min(0.1).max(10).default(1.5),
  yuzeyAlani: z.number().min(0).max(10000).default(50),
  kullaniciSayisi: z.number().min(0).max(1000).default(10),
  aydinlatmaGucu: z.number().min(0).max(100000).default(500),
  ekipmanGucu: z.number().min(0).max(100000).default(1000),
  havaDegisimSayisi: z.number().min(0).max(10).default(1),
  disHavaSicakligi: z.number().min(-20).max(50).default(35),
  icHavaSicakligi: z.number().min(10).max(40).default(24),
  calismaSuresi: z.number().min(0).max(24).default(8),
  gunSayisi: z.number().min(1).max(365).default(365),
  elektrikBirimFiyati: z.number().min(0).max(10).default(1.5),
  kaynakTipi: z.enum(['dogalgaz', 'elektrik', 'komur', 'fuel-oil', 'jeotermal']).default('dogalgaz'),
  verim: z.number().min(0).max(100).default(90),
});

export interface IsitmaSogutmaYukuKcalKwHesabiOutput {
  toplamIsiYukuKw: number;
  breakdown: {
    iletimIsiYuku: number;
    kullaniciIsiKazanci: number;
    aydinlatmaIsiKazanci: number;
    ekipmanIsiKazanci: number;
    havalandirmaIsiYuku: number;
    toplamIsiYukuKcal: number;
    yillikEnerjiTuketimiKwh: number;
    yillikEnerjiMaliyeti: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: IsitmaSogutmaYukuKcalKwHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.iletimIsiYuku = ((): number => { try { const __v = input.isiGecirgenlikKatsayisi * input.yuzeyAlani * input.sicaklikFarki; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.kullaniciIsiKazanci = ((): number => { try { const __v = input.kullaniciSayisi * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.aydinlatmaIsiKazanci = ((): number => { try { const __v = input.aydinlatmaGucu; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.ekipmanIsiKazanci = ((): number => { try { const __v = input.ekipmanGucu; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.havalandirmaIsiYuku = ((): number => { try { const __v = input.hacim * input.havaDegisimSayisi * 0.33 * (input.disHavaSicakligi - input.icHavaSicakligi); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamIsiYuku = ((): number => { try { const __v = results.iletimIsiYuku + results.kullaniciIsiKazanci + results.aydinlatmaIsiKazanci + results.ekipmanIsiKazanci + results.havalandirmaIsiYuku; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamIsiYukuKcal = ((): number => { try { const __v = results.toplamIsiYuku * 0.859845; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamIsiYukuKw = ((): number => { try { const __v = results.toplamIsiYuku / 1000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.yillikEnerjiTuketimiKwh = ((): number => { try { const __v = results.toplamIsiYukuKw * input.calismaSuresi * input.gunSayisi / input.verim * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.yillikEnerjiMaliyeti = ((): number => { try { const __v = results.yillikEnerjiTuketimiKwh * input.elektrikBirimFiyati; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateIsitmaSogutmaYukuKcalKwHesabi(input: IsitmaSogutmaYukuKcalKwHesabiInput): IsitmaSogutmaYukuKcalKwHesabiOutput {
  const results = evaluateFormulas(input);
  const toplamIsiYukuKw = results.toplamIsiYukuKw ?? 0;
  const breakdown = {
    iletimIsiYuku: results.iletimIsiYuku,
    kullaniciIsiKazanci: results.kullaniciIsiKazanci,
    aydinlatmaIsiKazanci: results.aydinlatmaIsiKazanci,
    ekipmanIsiKazanci: results.ekipmanIsiKazanci,
    havalandirmaIsiYuku: results.havalandirmaIsiYuku,
    toplamIsiYukuKcal: results.toplamIsiYukuKcal,
    yillikEnerjiTuketimiKwh: results.yillikEnerjiTuketimiKwh,
    yillikEnerjiMaliyeti: results.yillikEnerjiMaliyeti,
  };

  // rule: hacim > 0
  // rule: sicaklikFarki >= 0
  // rule: isiGecirgenlikKatsayisi > 0
  // rule: yuzeyAlani >= 0
  // rule: kullaniciSayisi >= 0
  // rule: aydinlatmaGucu >= 0
  // rule: ekipmanGucu >= 0
  // rule: havaDegisimSayisi >= 0
  // rule: calismaSuresi >= 0 && calismaSuresi <= 24
  // rule: gunSayisi >= 1 && gunSayisi <= 365
  // rule: elektrikBirimFiyati >= 0
  // rule: verim > 0 && verim <= 100
  // rule: Eger kaynakTipi == 'elektrik' ise verim <= 100
  // rule: Eger kaynakTipi == 'dogalgaz' ise verim <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (toplamIsiYuku > 100000) hiddenLossDrivers.push("yuksekYuk");
  if (input.verim < 70) hiddenLossDrivers.push("dusukVerim");
  if (yillikEnerjiMaliyeti > 50000) hiddenLossDrivers.push("yuksekMaliyet");

  const dataConfidenceAdjusted = (() => { try { return results.toplamIsiYukuKw; } catch { return toplamIsiYukuKw; } })();

  return {
    toplamIsiYukuKw,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
