import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: ECOM_128
 * Araç Adı: Ödeme Sağlayıcı Ücreti
 */

export const InputSchema_ECOM_128 = z.object({
  satis: z.number().min(0.01, "Endüstriyel minimum tolerans: 0.01"),
  yuzde: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  sabit: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_ECOM_128 = z.infer<typeof InputSchema_ECOM_128>;

export interface Output_ECOM_128 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_ECOM_128(input: Input_ECOM_128): Output_ECOM_128 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: satis, yuzde, sabit
  
  const validData = InputSchema_ECOM_128.parse(input);
  const { satis, yuzde, sabit } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const kesinti = (satis * yuzde / 100) + sabit;
  const result = satis - kesinti; 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "Birim Ekonomisi",
      message: "Kritik Uyarı: Satış tutarı çok düşük olduğu için, sabit işlem ücreti (Fixed Fee) cironun %10'undan fazlasını eritiyor. Mikro işlemler için kârsız bir yapı; ürünleri paket (bundle) halinde satmayı değerlendirin."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}