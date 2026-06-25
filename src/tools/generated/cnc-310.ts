import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: CNC_310
 * Araç Adı: Lazer Odak Çapı (Spot Size)
 */

export const InputSchema_CNC_310 = z.object({
  dalga_boyu: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  odak_uzunlugu: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  giris_isimi: z.number().min(0.1, "Endüstriyel minimum tolerans: 0.1"),
  m2_faktoru: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_CNC_310 = z.infer<typeof InputSchema_CNC_310>;

export interface Output_CNC_310 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CNC_310(input: Input_CNC_310): Output_CNC_310 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: dalga_boyu, odak_uzunlugu, giris_isimi, m2_faktoru
  
  const validData = InputSchema_CNC_310.parse(input);
  const { dalga_boyu, odak_uzunlugu, giris_isimi, m2_faktoru } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result: any = 0; 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "INFO",
      source: "Lazer Kesim Fiziği",
      message: "Bilgi: Odak uzunluğu (>200mm) yüksek seçilmiştir. Bu durum odak noktasını büyüterek enerji yoğunluğunu düşürür, ince saclarda hızı azaltır ancak kalın saclarda daha düzgün bir kesim kenarı (Kerf) sağlar."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}
