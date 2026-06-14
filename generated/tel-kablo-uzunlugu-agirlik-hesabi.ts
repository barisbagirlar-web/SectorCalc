// Auto-generated from tel-kablo-uzunlugu-agirlik-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface TelKabloUzunluguAgirlikHesabiInput {
  kabloTipi: 'NYM' | 'NYY' | 'YVV' | 'H05VV-F' | 'H07RN-F';
  kesitAlani: number;
  uzunluk: number;
  malzeme: 'Bakir' | 'Aluminyum';
  birimFiyat: number;
}

export const TelKabloUzunluguAgirlikHesabiInputSchema = z.object({
  kabloTipi: z.enum(['NYM', 'NYY', 'YVV', 'H05VV-F', 'H07RN-F']).default('NYM'),
  kesitAlani: z.number().min(0.5).max(240).default(2.5),
  uzunluk: z.number().min(1).max(10000).default(100),
  malzeme: z.enum(['Bakir', 'Aluminyum']).default('Bakir'),
  birimFiyat: z.number().min(0).max(1000).default(100),
});

export interface TelKabloUzunluguAgirlikHesabiOutput {
  toplamMaliyet: number;
  breakdown: {
    agirlik: number;
    toplamMaliyet: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: TelKabloUzunluguAgirlikHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.agirlik = ((): number => { try { const __v = input.uzunluk * input.kesitAlani * (input.malzeme === 'Bakir' ? 8.96 : 2.70) / 1000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamMaliyet = ((): number => { try { const __v = results.agirlik * input.birimFiyat; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateTelKabloUzunluguAgirlikHesabi(input: TelKabloUzunluguAgirlikHesabiInput): TelKabloUzunluguAgirlikHesabiOutput {
  const results = evaluateFormulas(input);
  const toplamMaliyet = results.toplamMaliyet ?? 0;
  const breakdown = {
    agirlik: results.agirlik,
    toplamMaliyet: results.toplamMaliyet,
  };

  // rule: kesitAlani > 0
  // rule: uzunluk > 0
  // rule: birimFiyat >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Yuksek agirlik, tasima maliyetlerini artirabilir.
  // threshold skipped (non-JS): Yuksek maliyet, butce asimi riski.

  const dataConfidenceAdjusted = (() => { try { return results.toplamMaliyet; } catch { return toplamMaliyet; } })();

  return {
    toplamMaliyet,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
