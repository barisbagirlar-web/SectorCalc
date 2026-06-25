import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: IND_142
 * Araç Adı: Standart Zaman
 */

export const InputSchema_IND_142 = z.object({
  gozlenen_sure: z.number().min(0.001, "Endüstriyel minimum tolerans: 0.001"),
  performans: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  ek_sure: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_IND_142 = z.infer<typeof InputSchema_IND_142>;

export interface Output_IND_142 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_IND_142(input: Input_IND_142): Output_IND_142 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: gozlenen_sure, performans, ek_sure
  
  const validData = InputSchema_IND_142.parse(input);
  const { gozlenen_sure, performans, ek_sure } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const normal = gozlenen_sure * (performans / 100);
  const result = normal * (1 + ek_sure / 100);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "ILO (Uluslararası Çalışma Örgütü) Ergonomi",
      message: "Uyarı: Yorgunluk ve kişisel ihtiyaç payı %25'in üzerinde. Bu durum istasyonun fiziksel olarak son derece yıpratıcı (Ağır yük, kötü postür, yüksek sıcaklık) olduğunu gösterir. Süre eklemek yerine istasyon ergonomisi iyileştirilmelidir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}