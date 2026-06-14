// Auto-generated from ofis-kirtasiye-sarfiyat-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface OfisKirtasiyeSarfiyatHesabiInput {
  calisanSayisi: number;
  kirtasiyeTuru: 'kagit' | 'kalem' | 'dosya' | 'zarf' | 'klasor' | 'postit' | 'tutkal' | 'makas' | 'zimba' | 'kartus';
  birimMaliyet: number;
  aylikTuketimOrani: number;
  stokMiktari: number;
  siparisMaliyeti: number;
  eldeBulundurmaMaliyeti: number;
  teslimSuresi: number;
  guvenlikStoguGunu: number;
  dataConfidence: 'dusuk' | 'orta' | 'yuksek';
}

export const OfisKirtasiyeSarfiyatHesabiInputSchema = z.object({
  calisanSayisi: z.number().min(1).max(10000).default(10),
  kirtasiyeTuru: z.enum(['kagit', 'kalem', 'dosya', 'zarf', 'klasor', 'postit', 'tutkal', 'makas', 'zimba', 'kartus']).default('kagit'),
  birimMaliyet: z.number().min(0.01).max(1000).default(5),
  aylikTuketimOrani: z.number().min(0).max(100).default(2),
  stokMiktari: z.number().min(0).max(100000).default(50),
  siparisMaliyeti: z.number().min(0).max(500).default(10),
  eldeBulundurmaMaliyeti: z.number().min(0).max(100).default(1),
  teslimSuresi: z.number().min(0).max(365).default(3),
  guvenlikStoguGunu: z.number().min(0).max(365).default(5),
  dataConfidence: z.enum(['dusuk', 'orta', 'yuksek']).default('orta'),
});

export interface OfisKirtasiyeSarfiyatHesabiOutput {
  toplamYillikMaliyet: number;
  breakdown: {
    yillikKirtasiyeMaliyeti: number;
    toplamStokMaliyeti: number;
    ekonomikSiparisMiktari: number;
    yenidenSiparisNoktasi: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: OfisKirtasiyeSarfiyatHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.aylikToplamTuketim = ((): number => { try { const __v = input.calisanSayisi * input.aylikTuketimOrani; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.yillikToplamTuketim = ((): number => { try { const __v = results.aylikToplamTuketim * 12; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.yillikKirtasiyeMaliyeti = ((): number => { try { const __v = results.yillikToplamTuketim * input.birimMaliyet; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.ortalamaStok = ((): number => { try { const __v = (input.stokMiktari + (input.stokMiktari - results.aylikToplamTuketim * (input.teslimSuresi / 30))) / 2; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.ekonomikSiparisMiktari = ((): number => { try { const __v = Math.Math.sqrt((2 * results.yillikToplamTuketim * input.siparisMaliyeti) / input.eldeBulundurmaMaliyeti); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.yenidenSiparisNoktasi = ((): number => { try { const __v = (results.aylikToplamTuketim / 30) * (input.teslimSuresi + guvenlikStokuGunu); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamStokMaliyeti = ((): number => { try { const __v = (results.yillikToplamTuketim / results.ekonomikSiparisMiktari) * input.siparisMaliyeti + (results.ekonomikSiparisMiktari / 2) * input.eldeBulundurmaMaliyeti; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamYillikMaliyet = ((): number => { try { const __v = results.yillikKirtasiyeMaliyeti + results.toplamStokMaliyeti; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = input.dataConfidence === 'dusuk' ? results.toplamYillikMaliyet * 1.2 : input.dataConfidence === 'yuksek' ? results.toplamYillikMaliyet * 0.9 : results.toplamYillikMaliyet; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateOfisKirtasiyeSarfiyatHesabi(input: OfisKirtasiyeSarfiyatHesabiInput): OfisKirtasiyeSarfiyatHesabiOutput {
  const results = evaluateFormulas(input);
  const toplamYillikMaliyet = results.toplamYillikMaliyet ?? 0;
  const breakdown = {
    yillikKirtasiyeMaliyeti: results.yillikKirtasiyeMaliyeti,
    toplamStokMaliyeti: results.toplamStokMaliyeti,
    ekonomikSiparisMiktari: results.ekonomikSiparisMiktari,
    yenidenSiparisNoktasi: results.yenidenSiparisNoktasi,
  };

  // rule: calisanSayisi > 0
  // rule: birimMaliyet > 0
  // rule: aylikTuketimOrani >= 0
  // rule: stokMiktari >= 0
  // rule: siparisMaliyeti >= 0
  // rule: eldeBulundurmaMaliyeti >= 0
  // rule: teslimSuresi >= 0
  // rule: guvenlikStokuGunu >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (input.stokMiktari < (input.aylikTuketimOrani * input.calisanSayisi * (input.teslimSuresi + guvenlikStokuGunu) / 30)) hiddenLossDrivers.push("stokMiktari");
  if (input.birimMaliyet > 100) hiddenLossDrivers.push("birimMaliyet");

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return toplamYillikMaliyet; } })();

  return {
    toplamYillikMaliyet,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi (gecmis verilerle karsilastirma)","Detayli rapor (grafikler, oneriler)","Karsilastirma (farkli kirtasiye turleri arasi)"],
  };
}
