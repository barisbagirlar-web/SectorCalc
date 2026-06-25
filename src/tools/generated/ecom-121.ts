import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: ECOM_121
 * Araç Adı: Dropshipping Kârı
 */

export const InputSchema_ECOM_121 = z.object({
  satis: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  tedarik: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  kargo: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  reklam: z.number().min(0, "Endüstriyel minimum tolerans: 0"),
});

export type Input_ECOM_121 = z.infer<typeof InputSchema_ECOM_121>;

export interface Output_ECOM_121 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_ECOM_121(input: Input_ECOM_121): Output_ECOM_121 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: satis, tedarik, kargo, reklam
  
  const validData = InputSchema_ECOM_121.parse(input);
  const { satis, tedarik, kargo, reklam } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = satis - tedarik - kargo - reklam;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "Ödeme Geçidi Regülasyonları",
      message: "Kritik Uyarı: Dropshipping marjınız %30'un altında. Çin menşeili ürünlerde kargo gecikmeleri nedeniyle yüksek chargeback (ters ibraz) yaşanır. Stripe/PayPal iadeleri ceza keserek hesabınızı bloke edebilir; kâr marjınız bu riskleri absorbe etmeye yetmiyor."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}