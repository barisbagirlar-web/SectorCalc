// Auto-generated from ses-yalitimi-desibel-azaltimi-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface SesYalitimiDesibelAzaltimiHesabiInput {
  kaynakSesSeviyesi: number;
  malzemeTipi: 'mineralYun' | 'poliuretanKopuk' | 'akustikPanel' | 'kaucuk' | 'camYunu';
  malzemeKalinlik: number;
  duvarTipi: 'tekKat' | 'ciftKat' | 'kompozit';
  ortamSicaklik: number;
  dataConfidence: number;
}

export const SesYalitimiDesibelAzaltimiHesabiInputSchema = z.object({
  kaynakSesSeviyesi: z.number().min(0).max(200).default(100),
  malzemeTipi: z.enum(['mineralYun', 'poliuretanKopuk', 'akustikPanel', 'kaucuk', 'camYunu']).default('mineralYun'),
  malzemeKalinlik: z.number().min(10).max(500).default(50),
  duvarTipi: z.enum(['tekKat', 'ciftKat', 'kompozit']).default('tekKat'),
  ortamSicaklik: z.number().min(-20).max(60).default(20),
  dataConfidence: z.number().min(0).max(1).default(0.9),
});

export interface SesYalitimiDesibelAzaltimiHesabiOutput {
  sonucSesSeviyesi: number;
  breakdown: {
    desibelAzaltma: number;
    stcKatsayisi: number;
    duvarFaktoru: number;
    sicaklikDuzeltme: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: SesYalitimiDesibelAzaltimiHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.stcKatsayisi = ((): number => { try { const __v = results.stcKatsayisi = (input.malzemeTipi === 'mineralYun' ? 0.8 : input.malzemeTipi === 'poliuretanKopuk' ? 0.7 : input.malzemeTipi === 'akustikPanel' ? 0.9 : input.malzemeTipi === 'kaucuk' ? 0.6 : 0.75); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.duvarFaktoru = ((): number => { try { const __v = results.duvarFaktoru = (input.duvarTipi === 'tekKat' ? 1.0 : input.duvarTipi === 'ciftKat' ? 1.3 : 1.5); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.sicaklikDuzeltme = ((): number => { try { const __v = results.sicaklikDuzeltme = 1 + (ortamSicaklik - 20) * 0.002; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.desibelAzaltma = ((): number => { try { const __v = results.desibelAzaltma = 20 * Math.log10(malzemeKalinlik) * results.stcKatsayisi * results.duvarFaktoru * results.sicaklikDuzeltme; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.sonucSesSeviyesi = ((): number => { try { const __v = results.sonucSesSeviyesi = input.kaynakSesSeviyesi - results.desibelAzaltma; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.dataConfidenceAdjusted = results.sonucSesSeviyesi * (1 + (1 - input.dataConfidence) * 0.1); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateSesYalitimiDesibelAzaltimiHesabi(input: SesYalitimiDesibelAzaltimiHesabiInput): SesYalitimiDesibelAzaltimiHesabiOutput {
  const results = evaluateFormulas(input);
  const sonucSesSeviyesi = results.sonucSesSeviyesi ?? 0;
  const breakdown = {
    desibelAzaltma: results.desibelAzaltma,
    stcKatsayisi: results.stcKatsayisi,
    duvarFaktoru: results.duvarFaktoru,
    sicaklikDuzeltme: results.sicaklikDuzeltme,
  };

  // rule: kaynakSesSeviyesi >= 0 && kaynakSesSeviyesi <= 200
  // rule: malzemeKalinlik >= 10 && malzemeKalinlik <= 500
  // rule: ortamSicaklik >= -20 && ortamSicaklik <= 60
  // rule: dataConfidence >= 0 && dataConfidence <= 1
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Yuksek gurultu seviyesi, isitme koruma onlemleri gerekli.
  // threshold skipped (non-JS): Yalitim kalinligi cok dusuk, etkinlik azalabilir.
  // threshold skipped (non-JS): Veri guveni dusuk, sonuclar dikkatle yorumlanmali.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return sonucSesSeviyesi; } })();

  return {
    sonucSesSeviyesi,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
