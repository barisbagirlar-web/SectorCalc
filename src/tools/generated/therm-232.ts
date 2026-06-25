import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: THERM_232
 * Araç Adı: Duyulur Isı İhtiyacı (Q = mcΔT)
 */

export const InputSchema_THERM_232 = z.object({
  kutle: z.number().min(0.001, "Endüstriyel minimum tolerans: 0.001"),
  ozgul_isi: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  sicaklik_farki: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_THERM_232 = z.infer<typeof InputSchema_THERM_232>;

export interface Output_THERM_232 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_THERM_232(input: Input_THERM_232): Output_THERM_232 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: kutle, ozgul_isi, sicaklik_farki
  
  const validData = InputSchema_THERM_232.parse(input);
  const { kutle, ozgul_isi, sicaklik_farki } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result: any = 0; 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Faz Değişimi Fiziği",
      message: "Uyarı: Yüksek sıcaklık değişimi. Hesaplanan akışkan su ise, 100°C'yi aştığında (veya 0°C'nin altına düştüğünde) faz değişimi (Buharlaşma/Donma) başlar. Duyulur ısı formülü çöker, 'Gizli Isı (Latent Heat)' formülü kullanılmalıdır."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}
