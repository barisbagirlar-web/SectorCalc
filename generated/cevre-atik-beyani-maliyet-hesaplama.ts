// Auto-generated from cevre-atik-beyani-maliyet-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface CevreAtikBeyaniMaliyetHesaplamaInput {
  atikMiktari: number;
  atikKodu: '17 01 01 (Beton)' | '17 01 02 (Tugla)' | '17 01 03 (Kiremit)' | '17 02 01 (Ahsap)' | '17 02 02 (Cam)' | '17 02 03 (Plastik)' | '17 03 01 (Asfalt)' | '17 04 01 (Bakir)' | '17 04 02 (Aluminyum)' | '17 04 03 (Kursun)' | '17 04 04 (Cinko)' | '17 04 05 (Demir)' | '17 04 06 (Kalay)' | '17 04 07 (Karisik metaller)' | '17 05 03 (Toprak)' | '17 05 04 (Tas)' | '17 06 01 (Yalitim malzemeleri)' | '17 08 01 (Alci)' | '17 09 01 (Karisik insaat atigi)';
  bertarafYontemi: 'Duzenli Depolama' | 'Yakma' | 'Geri Donusum' | 'Kompost' | 'Diger';
  birimBertarafMaliyeti: number;
  nakliyeMesafesi: number;
  birimNakliyeMaliyeti: number;
  beyanUcreti: number;
  cezaOlasiligi: number;
  cezaMiktari: number;
  dataConfidence: number;
}

export const CevreAtikBeyaniMaliyetHesaplamaInputSchema = z.object({
  atikMiktari: z.number().min(0).max(1000000).default(100),
  atikKodu: z.enum(['17 01 01 (Beton)', '17 01 02 (Tugla)', '17 01 03 (Kiremit)', '17 02 01 (Ahsap)', '17 02 02 (Cam)', '17 02 03 (Plastik)', '17 03 01 (Asfalt)', '17 04 01 (Bakir)', '17 04 02 (Aluminyum)', '17 04 03 (Kursun)', '17 04 04 (Cinko)', '17 04 05 (Demir)', '17 04 06 (Kalay)', '17 04 07 (Karisik metaller)', '17 05 03 (Toprak)', '17 05 04 (Tas)', '17 06 01 (Yalitim malzemeleri)', '17 08 01 (Alci)', '17 09 01 (Karisik insaat atigi)']).default('17 01 01'),
  bertarafYontemi: z.enum(['Duzenli Depolama', 'Yakma', 'Geri Donusum', 'Kompost', 'Diger']).default('Duzenli Depolama'),
  birimBertarafMaliyeti: z.number().min(0).max(10000).default(500),
  nakliyeMesafesi: z.number().min(0).max(1000).default(50),
  birimNakliyeMaliyeti: z.number().min(0).max(100).default(2),
  beyanUcreti: z.number().min(0).max(100000).default(1000),
  cezaOlasiligi: z.number().min(0).max(100).default(5),
  cezaMiktari: z.number().min(0).max(10000000).default(50000),
  dataConfidence: z.number().min(0).max(1).default(0.9),
});

export interface CevreAtikBeyaniMaliyetHesaplamaOutput {
  toplamMaliyet: number;
  breakdown: {
    nakliyeMaliyeti: number;
    bertarafMaliyeti: number;
    beyanUcreti: number;
    beklenenCezaMaliyeti: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: CevreAtikBeyaniMaliyetHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.nakliyeMaliyeti = (() => { try { return input.atikMiktari * input.nakliyeMesafesi * input.birimNakliyeMaliyeti; } catch { return 0; } })();
  results.bertarafMaliyeti = (() => { try { return input.atikMiktari * input.birimBertarafMaliyeti; } catch { return 0; } })();
  results.beklenenCezaMaliyeti = (() => { try { return input.cezaOlasiligi / 100 * input.cezaMiktari; } catch { return 0; } })();
  results.toplamMaliyet = (() => { try { return results.nakliyeMaliyeti + results.bertarafMaliyeti + input.beyanUcreti + results.beklenenCezaMaliyeti; } catch { return 0; } })();
  results.dataConfidenceAdjusted = (() => { try { return results.toplamMaliyet / input.dataConfidence; } catch { return 0; } })();
  return results;
}

export function calculateCevreAtikBeyaniMaliyetHesaplama(input: CevreAtikBeyaniMaliyetHesaplamaInput): CevreAtikBeyaniMaliyetHesaplamaOutput {
  const results = evaluateFormulas(input);
  const toplamMaliyet = results.toplamMaliyet ?? 0;
  const breakdown = {
    nakliyeMaliyeti: results.nakliyeMaliyeti,
    bertarafMaliyeti: results.bertarafMaliyeti,
    beyanUcreti: results.beyanUcreti,
    beklenenCezaMaliyeti: results.beklenenCezaMaliyeti,
  };

  // rule: atikMiktari > 0
  // rule: birimBertarafMaliyeti > 0
  // rule: nakliyeMesafesi >= 0
  // rule: birimNakliyeMaliyeti >= 0
  // rule: beyanUcreti >= 0
  // rule: cezaOlasiligi >= 0 && cezaOlasiligi <= 100
  // rule: cezaMiktari >= 0
  // rule: dataConfidence >= 0 && dataConfidence <= 1
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Yuksek maliyet uyarisi
  // threshold skipped (non-JS): Yuksek ceza riski uyarisi
  // threshold skipped (non-JS): Dusuk veri guveni uyarisi

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return toplamMaliyet; } })();

  return {
    toplamMaliyet,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi (gecmis yillarla karsilastirma)","Detayli rapor (alt kirilimlar ve grafikler)","Karsilastirma (farkli bertaraf yontemleri senaryolari)"],
  };
}
