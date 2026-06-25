import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: HLTH_172
 * Araç Adı: Bazal Metabolizma Hızı (BMR)
 */

export const InputSchema_HLTH_172 = z.object({
  agirlik: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  boy: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  yas: z.number().min(15, "Endüstriyel minimum tolerans: 15"),
  cinsiyet: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_HLTH_172 = z.infer<typeof InputSchema_HLTH_172>;

export interface Output_HLTH_172 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_HLTH_172(input: Input_HLTH_172): Output_HLTH_172 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: agirlik, boy, yas, cinsiyet
  
  const validData = InputSchema_HLTH_172.parse(input);
  const { agirlik, boy, yas, cinsiyet } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  // Mifflin-St Jeor Formula: 
  // Erkek (cinsiyet = 1): BMR = 10 * agirlik + 6.25 * boy - 5 * yas + 5
  // Kadın (cinsiyet = 0): BMR = 10 * agirlik + 6.25 * boy - 5 * yas - 161
  const isErkek = cinsiyet === 1;
  const result = isErkek
    ? 10 * agirlik + 6.25 * boy - 5 * yas + 5
    : 10 * agirlik + 6.25 * boy - 5 * yas - 161;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "INFO",
      source: "Klinik Beslenme",
      message: "Bilgi: Çıkan değer tamamen istirahat halindeki (Koma/Uyku) kalori ihtiyacıdır. Günlük gerçek enerji ihtiyacınızı (TDEE) bulmak için bu değeri aktivite katsayınızla (1.2 - 1.9) çarpmanız gerekir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}