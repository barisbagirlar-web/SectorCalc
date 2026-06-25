import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: ECOM_120
 * Araç Adı: eBay Ücreti
 */

export const InputSchema_ECOM_120 = z.object({
  satis: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  kategori: z.number().min(2, "Endüstriyel minimum tolerans: 2"),
  sabit: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_ECOM_120 = z.infer<typeof InputSchema_ECOM_120>;

export interface Output_ECOM_120 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_ECOM_120(input: Input_ECOM_120): Output_ECOM_120 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: satis, kategori, sabit
  
  const validData = InputSchema_ECOM_120.parse(input);
  const { satis, kategori, sabit } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = (satis * kategori / 100) + sabit;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "INFO",
      source: "Sınır Ötesi E-Ticaret",
      message: "Not: Uluslararası satış yapıyorsanız eBay, 'International Fee' (Uluslararası Satış Ücreti) olarak %1.3 - %1.6 arası ek bir komisyon ile döviz çevrim (Currency Conversion) marjı uygulayabilir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}