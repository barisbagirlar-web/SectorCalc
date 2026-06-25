import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: HLTH_178
 * Araç Adı: Hedef Kalp Atış Hızı (Karvonen)
 */

export const InputSchema_HLTH_178 = z.object({
  yas: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  dinlenik_nabiz: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  hedef_yogunluk: z.number().min(30, "Endüstriyel minimum tolerans: 30"),
});

export type Input_HLTH_178 = z.infer<typeof InputSchema_HLTH_178>;

export interface Output_HLTH_178 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_HLTH_178(input: Input_HLTH_178): Output_HLTH_178 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: yas, dinlenik_nabiz, hedef_yogunluk
  
  const validData = InputSchema_HLTH_178.parse(input);
  const { yas, dinlenik_nabiz, hedef_yogunluk } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const maxNabiz = 220 - yas;
  const result = ((maxNabiz - dinlenik_nabiz) * (hedef_yogunluk / 100)) + dinlenik_nabiz;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Spor Fizyolojisi",
      message: "Uyarı: %85 ve üzeri yoğunluk 'Anaerobik Eşik' bölgesidir. Laktik asit birikimi hızlanır ve bu bölgede antrenman süresi sürdürülebilir değildir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}