import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_031
 * Araç Adı: Fiyat/Kazanç (P/E) Oranı
 */

export const InputSchema_FIN_031 = z.object({
  hisse_fiyati: z.number().min(0.01, "Endüstriyel minimum tolerans: 0.01"),
  hisse_basi_kar: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_FIN_031 = z.infer<typeof InputSchema_FIN_031>;

export interface Output_FIN_031 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_031(input: Input_FIN_031): Output_FIN_031 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: hisse_fiyati, hisse_basi_kar
  
  const validData = InputSchema_FIN_031.parse(input);
  const { hisse_fiyati, hisse_basi_kar } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = hisse_fiyati / Math.max(0.0001, hisse_basi_kar); 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (result > 50) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Değer Değerleme Standartları",
      message: "Uyarı: P/E oranı 50'nin üzerinde. Şirket ciddi bir primle işlem görüyor olabilir (Aşırı değerleme) veya kârında geçici bir çöküş yaşanmış olabilir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}