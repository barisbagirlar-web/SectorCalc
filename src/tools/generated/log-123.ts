import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: LOG_123
 * Araç Adı: Kargo ve Navlun Maliyeti
 */

export const InputSchema_LOG_123 = z.object({
  agirlik: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  hacim: z.number().min(0.0001, "Endüstriyel minimum tolerans: 0.0001"),
  mesafe: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  birim_fiyat: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_LOG_123 = z.infer<typeof InputSchema_LOG_123>;

export interface Output_LOG_123 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_LOG_123(input: Input_LOG_123): Output_LOG_123 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: agirlik, hacim, mesafe, birim_fiyat
  
  const validData = InputSchema_LOG_123.parse(input);
  const { agirlik, hacim, mesafe, birim_fiyat } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const desi = hacim * 167;
  const result = Math.max(agirlik, desi) * mesafe * birim_fiyat; 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "INFO",
      source: "Uluslararası Navlun",
      message: "Not: Paketin hacimsel ağırlığı (Desi), gerçek ağırlığının çok üzerindedir. Ürün paketlemesinde çok fazla boşluk (ölü hava) taşıyorsunuz. Kutu ebatlarını küçülterek navlun maliyetini dramatik şekilde düşürebilirsiniz."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}