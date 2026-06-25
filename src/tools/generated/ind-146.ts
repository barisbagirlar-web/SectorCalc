import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: IND_146
 * Araç Adı: Kalibrasyon Sapma (Drift)
 */

export const InputSchema_IND_146 = z.object({
  son_hata: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  onceki_hata: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  gecen_sure: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
});

export type Input_IND_146 = z.infer<typeof InputSchema_IND_146>;

export interface Output_IND_146 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_IND_146(input: Input_IND_146): Output_IND_146 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: son_hata, onceki_hata, gecen_sure
  
  const validData = InputSchema_IND_146.parse(input);
  const { son_hata, onceki_hata, gecen_sure } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = (son_hata - onceki_hata) / Math.max(1, gecen_sure);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "INFO",
      source: "ISO 17025 Laboratuvar Standartları",
      message: "Bilgi: Sapma hızı pozitif bir eğilim (sürekli artış) gösteriyorsa, cihazın periyodik kalibrasyon aralığı (frekansı) sıklaştırılmalı veya sensör komponentleri değiştirilmelidir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}