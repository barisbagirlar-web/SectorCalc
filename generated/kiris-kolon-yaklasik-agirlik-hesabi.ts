// Auto-generated from kiris-kolon-yaklasik-agirlik-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface KirisKolonYaklasikAgirlikHesabiInput {
  kirisUzunlugu: number;
  kirisGenisligi: number;
  kirisYuksekligi: number;
  kolonYuksekligi: number;
  kolonGenisligi: number;
  kolonDerinligi: number;
  betonBirimHacimAgirlik: number;
  celikBirimHacimAgirlik: number;
  donatiOraniKiris: number;
  donatiOraniKolon: number;
  kirisAdedi: number;
  kolonAdedi: number;
}

export const KirisKolonYaklasikAgirlikHesabiInputSchema = z.object({
  kirisUzunlugu: z.number().min(1).max(30).default(6),
  kirisGenisligi: z.number().min(10).max(100).default(25),
  kirisYuksekligi: z.number().min(20).max(150).default(50),
  kolonYuksekligi: z.number().min(2).max(10).default(3),
  kolonGenisligi: z.number().min(20).max(100).default(30),
  kolonDerinligi: z.number().min(20).max(100).default(30),
  betonBirimHacimAgirlik: z.number().min(20).max(30).default(25),
  celikBirimHacimAgirlik: z.number().min(70).max(80).default(78.5),
  donatiOraniKiris: z.number().min(0.5).max(4).default(1.5),
  donatiOraniKolon: z.number().min(1).max(6).default(2),
  kirisAdedi: z.number().min(1).max(1000).default(10),
  kolonAdedi: z.number().min(1).max(1000).default(10),
});

export interface KirisKolonYaklasikAgirlikHesabiOutput {
  toplamAgirlik: number;
  breakdown: {
    betonAgirlik: number;
    celikAgirlik: number;
    toplamBetonHacmi: number;
    toplamDonatiHacmi: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: KirisKolonYaklasikAgirlikHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.kirisHacmi = ((): number => { try { const __v = input.kirisAdedi * input.kirisUzunlugu * (input.kirisGenisligi/100) * (input.kirisYuksekligi/100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.kolonHacmi = ((): number => { try { const __v = input.kolonAdedi * input.kolonYuksekligi * (input.kolonGenisligi/100) * (input.kolonDerinligi/100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamBetonHacmi = ((): number => { try { const __v = results.kirisHacmi + results.kolonHacmi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.betonAgirlik = ((): number => { try { const __v = results.toplamBetonHacmi * input.betonBirimHacimAgirlik; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.kirisDonatiHacmi = ((): number => { try { const __v = results.kirisHacmi * (input.donatiOraniKiris/100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.kolonDonatiHacmi = ((): number => { try { const __v = results.kolonHacmi * (input.donatiOraniKolon/100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamDonatiHacmi = ((): number => { try { const __v = results.kirisDonatiHacmi + results.kolonDonatiHacmi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.celikAgirlik = ((): number => { try { const __v = results.toplamDonatiHacmi * input.celikBirimHacimAgirlik; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamAgirlik = ((): number => { try { const __v = results.betonAgirlik + results.celikAgirlik; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateKirisKolonYaklasikAgirlikHesabi(input: KirisKolonYaklasikAgirlikHesabiInput): KirisKolonYaklasikAgirlikHesabiOutput {
  const results = evaluateFormulas(input);
  const toplamAgirlik = results.toplamAgirlik ?? 0;
  const breakdown = {
    betonAgirlik: results.betonAgirlik,
    celikAgirlik: results.celikAgirlik,
    toplamBetonHacmi: results.toplamBetonHacmi,
    toplamDonatiHacmi: results.toplamDonatiHacmi,
  };

  // rule: kirisUzunlugu > 0
  // rule: kirisGenisligi > 0
  // rule: kirisYuksekligi > 0
  // rule: kolonYuksekligi > 0
  // rule: kolonGenisligi > 0
  // rule: kolonDerinligi > 0
  // rule: betonBirimHacimAgirlik >= 20
  // rule: celikBirimHacimAgirlik >= 70
  // rule: donatiOraniKiris >= 0.5 && donatiOraniKiris <= 4
  // rule: donatiOraniKolon >= 1 && donatiOraniKolon <= 6
  // rule: kirisAdedi > 0
  // rule: kolonAdedi > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Yuksek donati orani, maliyeti artirabilir.
  // threshold skipped (non-JS): Yuksek donati orani, maliyeti artirabilir.
  // threshold skipped (non-JS): Kiris yuksekligi acikliga gore dusuk, sehim kontrolu yapilmali.

  const dataConfidenceAdjusted = (() => { try { return results.toplamAgirlik * (1 - 0.1); } catch { return toplamAgirlik; } })();

  return {
    toplamAgirlik,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
