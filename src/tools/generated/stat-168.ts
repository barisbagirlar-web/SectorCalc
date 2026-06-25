import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: STAT_168
 * Araç Adı: Örneklem Büyüklüğü
 */

export const InputSchema_STAT_168 = z.object({
  z_degeri: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  std_sapma: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  hata_payi: z.number().min(0.0001, "Endüstriyel minimum tolerans: 0.0001"),
});

export type Input_STAT_168 = z.infer<typeof InputSchema_STAT_168>;

export interface Output_STAT_168 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_STAT_168(input: Input_STAT_168): Output_STAT_168 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: z_degeri, std_sapma, hata_payi
  
  const validData = InputSchema_STAT_168.parse(input);
  const { z_degeri, std_sapma, hata_payi } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result: number = Math.pow((z_degeri * std_sapma) / Math.max(0.0001, hata_payi), 2);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Saha Araştırması Maliyeti",
      message: "Uyarı: Hata payını %2'nin altına düşürdünüz. Gereken örneklem büyüklüğü (n) eksponansiyel olarak artacaktır. Anket veya kalite kontrol süreçlerinde bu kadar büyük bir örneklem toplamak ciddi zaman ve saha maliyeti yaratır."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}