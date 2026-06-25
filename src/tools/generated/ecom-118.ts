import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: ECOM_118
 * Araç Adı: Shopify Kârı
 */

export const InputSchema_ECOM_118 = z.object({
  satis: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  urun: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  kargo: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  platform: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
  sabit: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_ECOM_118 = z.infer<typeof InputSchema_ECOM_118>;

export interface Output_ECOM_118 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_ECOM_118(input: Input_ECOM_118): Output_ECOM_118 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: satis, urun, kargo, platform, sabit
  
  const validData = InputSchema_ECOM_118.parse(input);
  const { satis, urun, kargo, platform, sabit } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result: number = satis - urun - kargo - (satis * platform / 100) - sabit; 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "D2C (Direct to Consumer) Pazarlama",
      message: "Kritik Uyarı: Shopify gibi kendi trafiğinizi yarattığınız platformlarda en büyük gider 'Müşteri Edinim Maliyeti (CAC)'dir (Meta/Google Ads). Lütfen bu ürün için tahmini CAC değerini Net Kârdan düşmeyi unutmayın."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}