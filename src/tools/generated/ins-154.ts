import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: INS_154
 * Araç Adı: Engellilik Sigortası (Disability)
 */

export const InputSchema_INS_154 = z.object({
  aylik_gelir: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  odeme_yuzdesi: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
});

export type Input_INS_154 = z.infer<typeof InputSchema_INS_154>;

export interface Output_INS_154 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_INS_154(input: Input_INS_154): Output_INS_154 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: aylik_gelir, odeme_yuzdesi
  
  const validData = InputSchema_INS_154.parse(input);
  const { aylik_gelir, odeme_yuzdesi } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result: number = aylik_gelir * (odeme_yuzdesi / 100);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "INFO",
      source: "Sosyal Güvenlik Hukuku",
      message: "Bilgi: Çıkan ödeme genellikle vergiden muaftır. Eğer mevcut vergi diliminiz yüksekse, %60'lık bir engellilik ödemesi bile elinize geçen net maaşa eşit olabilir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}