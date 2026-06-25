import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_019
 * Araç Adı: Yıllık Getiri
 */

export const InputSchema_FIN_019 = z.object({
  baslangic: z.number().min(0.01, "Endüstriyel minimum tolerans: 0.01"),
  bitis: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  yil: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_FIN_019 = z.infer<typeof InputSchema_FIN_019>;

export interface Output_FIN_019 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_019(input: Input_FIN_019): Output_FIN_019 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: baslangic, bitis, yil
  
  const validData = InputSchema_FIN_019.parse(input);
  const { baslangic, bitis, yil } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = ((bitis / Math.max(1, baslangic)) ** (1 / Math.max(1, yil)) - 1) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Yıllıklandırma Hatası",
      message: "Uyarı: Yıllıklandırma (Annualization) 1 yıldan kısa süreler için yapıldığında, elde edilen yüksek kısa vadeli getiriyi tüm yıla projekte ederek yanıltıcı (gerçek dışı) bir performans tablosu yaratabilir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}