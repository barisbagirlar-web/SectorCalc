import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: CORP_091
 * Araç Adı: Hisse Opsiyonları (ESPP)
 */

export const InputSchema_CORP_091 = z.object({
  piyasa_fiyati: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  iskonto: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
  katki: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_CORP_091 = z.infer<typeof InputSchema_CORP_091>;

export interface Output_CORP_091 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CORP_091(input: Input_CORP_091): Output_CORP_091 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: piyasa_fiyati, iskonto, katki
  
  const validData = InputSchema_CORP_091.parse(input);
  const { piyasa_fiyati, iskonto, katki } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const alimFiyati = piyasa_fiyati * (1 - iskonto / 100);
  const result = katki / Math.max(0.0001, alimFiyati);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Uluslararası Vergi Mevzuatı",
      message: "Uyarı: ESPP (Çalışan Hisse Satın Alma Planı) indirimleri %15'i aştığında, çoğu ülkede aradaki fark sermaye kazancı değil, 'Maaş Yan Hakkı' olarak değerlendirilip gelir vergisi matrahına (Bordro) eklenir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}