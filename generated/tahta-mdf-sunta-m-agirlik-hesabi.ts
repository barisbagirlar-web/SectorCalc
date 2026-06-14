// Auto-generated from tahta-mdf-sunta-m-agirlik-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface TahtaMdfSuntaMAgirlikHesabiInput {
  malzemeTuru: 'MDF' | 'Suntalam' | 'Kontrplak' | 'Yonga Levha';
  uzunluk: number;
  genislik: number;
  kalinlik: number;
  adet: number;
  dataConfidence: number;
}

export const TahtaMdfSuntaMAgirlikHesabiInputSchema = z.object({
  malzemeTuru: z.enum(['MDF', 'Suntalam', 'Kontrplak', 'Yonga Levha']).default('MDF'),
  uzunluk: z.number().min(1).max(6000).default(1000),
  genislik: z.number().min(1).max(3000).default(500),
  kalinlik: z.number().min(1).max(100).default(18),
  adet: z.number().min(1).max(10000).default(1),
  dataConfidence: z.number().min(0).max(100).default(100),
});

export interface TahtaMdfSuntaMAgirlikHesabiOutput {
  toplamAgirlikKg: number;
  breakdown: {
    hacimM3: number;
    birimAgirlikKg: number;
    toplamAgirlikKg: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: TahtaMdfSuntaMAgirlikHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.hacimM3 = ((): number => { try { const __v = input.uzunluk * input.genislik * kalinlik / 1e9; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.birimAgirlikKg = ((): number => { try { const __v = results.hacimM3 * (input.malzemeTuru === 'MDF' ? 750 : input.malzemeTuru === 'Suntalam' ? 650 : input.malzemeTuru === 'Kontrplak' ? 550 : 450); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamAgirlikKg = ((): number => { try { const __v = results.birimAgirlikKg * input.adet; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.toplamAgirlikKg * (input.dataConfidence / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateTahtaMdfSuntaMAgirlikHesabi(input: TahtaMdfSuntaMAgirlikHesabiInput): TahtaMdfSuntaMAgirlikHesabiOutput {
  const results = evaluateFormulas(input);
  const toplamAgirlikKg = results.toplamAgirlikKg ?? 0;
  const breakdown = {
    hacimM3: results.hacimM3,
    birimAgirlikKg: results.birimAgirlikKg,
    toplamAgirlikKg: results.toplamAgirlikKg,
  };

  // rule: uzunluk > 0
  // rule: genislik > 0
  // rule: kalinlik > 0
  // rule: adet > 0
  // rule: dataConfidence >= 0 && dataConfidence <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Kalinlik 50 mm'den fazla, agirlik yuksek olabilir.
  // threshold skipped (non-JS): Yuksek adet, toplam agirlik onemli.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return toplamAgirlikKg; } })();

  return {
    toplamAgirlikKg,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
