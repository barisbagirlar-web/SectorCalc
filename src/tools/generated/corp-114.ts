import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: CORP_114
 * Araç Adı: İşletme Marjı
 */

export const InputSchema_CORP_114 = z.object({
  favok: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  ciro: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
});

export type Input_CORP_114 = z.infer<typeof InputSchema_CORP_114>;

export interface Output_CORP_114 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CORP_114(input: Input_CORP_114): Output_CORP_114 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: favok, ciro
  
  const validData = InputSchema_CORP_114.parse(input);
  const { favok, ciro } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = (favok / Math.max(0.0001, ciro)) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (result > 40) {
    smartWarnings.push({
      severity: "INFO",
      source: "Sektörel Kıyaslama",
      message: "Not: İşletme marjı %40'ın üzerindedir. Bu seviyedeki kârlılık genellikle SaaS (Yazılım), tekel pazarlar veya dijital lisanslama iş modellerinde görülür. Fiziksel ürün veya hizmet satıyorsanız maliyet kalemlerini (COGS) atlamadığınızdan emin olun."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}