// Auto-generated from merdiven-platform-yukseklik-erisim-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface MerdivenPlatformYukseklikErisimHesabiInput {
  merdivenTipi: 'dikMerdiven' | 'egimliMerdiven' | 'platformluMerdiven';
  platformYuksekligi: number;
  basamakYuksekligi: number;
  basamakDerinligi: number;
  korkulukVarMi: boolean;
  egimAcisi: number;
  kullaniciAgirligi: number;
  guvenlikFaktoru: number;
}

export const MerdivenPlatformYukseklikErisimHesabiInputSchema = z.object({
  merdivenTipi: z.enum(['dikMerdiven', 'egimliMerdiven', 'platformluMerdiven']).default('dikMerdiven'),
  platformYuksekligi: z.number().min(0.5).max(30).default(3),
  basamakYuksekligi: z.number().min(15).max(30).default(25),
  basamakDerinligi: z.number().min(20).max(40).default(30),
  korkulukVarMi: z.boolean().default(true),
  egimAcisi: z.number().min(30).max(60).default(45),
  kullaniciAgirligi: z.number().min(50).max(150).default(80),
  guvenlikFaktoru: z.number().min(1.2).max(2).default(1.5),
});

export interface MerdivenPlatformYukseklikErisimHesabiOutput {
  erisimUygunluk: number;
  breakdown: {
    basamakSayisi: number;
    merdivenUzunlugu: number;
    egimKontrol: number;
    yapisalYuk: number;
    toplamMaliyet: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: MerdivenPlatformYukseklikErisimHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.basamakSayisi = ((): number => { try { const __v = Math.Math.ceil(input.platformYuksekligi * 100 / input.basamakYuksekligi); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.merdivenUzunlugu = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.egimKontrol = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.yapisalYuk = ((): number => { try { const __v = input.kullaniciAgirligi * 9.81 * input.guvenlikFaktoru; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.erisimUygunluk = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamMaliyet = ((): number => { try { const __v = results.basamakSayisi * 50 + results.merdivenUzunlugu * 100 + (input.korkulukVarMi ? 200 : 0); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateMerdivenPlatformYukseklikErisimHesabi(input: MerdivenPlatformYukseklikErisimHesabiInput): MerdivenPlatformYukseklikErisimHesabiOutput {
  const results = evaluateFormulas(input);
  const erisimUygunluk = results.erisimUygunluk ?? 0;
  const breakdown = {
    basamakSayisi: results.basamakSayisi,
    merdivenUzunlugu: results.merdivenUzunlugu,
    egimKontrol: results.egimKontrol,
    yapisalYuk: results.yapisalYuk,
    toplamMaliyet: results.toplamMaliyet,
  };

  // rule: egimAcisi > 0 && egimAcisi < 90
  // rule: basamakYuksekligi + basamakDerinligi >= 45 && basamakYuksekligi + basamakDerinligi <= 70
  // rule: if (merdivenTipi == 'egimliMerdiven') then egimAcisi >= 30 && egimAcisi <= 60
  // rule: if (merdivenTipi == 'dikMerdiven') then egimAcisi == 90
  // rule: if (platformYuksekligi > 3) then korkulukVarMi == true
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): UYARI: Basamak yuksekligi onerilen maksimum degere yakin.
  // threshold skipped (non-JS): UYARI: Basamak derinligi guvenli sinirin altinda.
  // threshold skipped (non-JS): UYARI: Egim acisi yuksek, dusme riski artar.
  // threshold skipped (non-JS): UYARI: Guvenlik faktoru dusuk, yapisal risk olabilir.

  const dataConfidenceAdjusted = (() => { try { return results.erisimUygunluk; } catch { return erisimUygunluk; } })();

  return {
    erisimUygunluk,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
