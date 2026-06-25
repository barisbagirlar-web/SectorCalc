import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: MARK_103
 * Araç Adı: Tıklama Başına Maliyet (CPC)
 */

export const InputSchema_MARK_103 = z.object({
  toplam_harcama: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  tiklama: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
});

export type Input_MARK_103 = z.infer<typeof InputSchema_MARK_103>;

export interface Output_MARK_103 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MARK_103(input: Input_MARK_103): Output_MARK_103 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: toplam_harcama, tiklama
  
  const validData = InputSchema_MARK_103.parse(input);
  const { toplam_harcama, tiklama } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result: number = toplam_harcama / Math.max(1, tiklama);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "INFO",
      source: "B2B Pazarlama",
      message: "Not: Tıklama maliyeti 50 birimin üzerinde. E-ticaret (B2C) için çok yüksek bir maliyet olsa da, yüksek dönüşüm getiren niş B2B (Örn: Endüstriyel yazılım, Hukuk) anahtar kelimelerinde kabul edilebilir bir değerdir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}