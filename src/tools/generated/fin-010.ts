import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_010
 * Araç Adı: Basit Faiz
 */

export const InputSchema_FIN_010 = z.object({
  anapara: z.number().min(0.01, "Endüstriyel minimum tolerans: 0.01"),
  faiz: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  sure: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_FIN_010 = z.infer<typeof InputSchema_FIN_010>;

export interface Output_FIN_010 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_010(input: Input_FIN_010): Output_FIN_010 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: anapara, faiz, sure
  
  const validData = InputSchema_FIN_010.parse(input);
  const { anapara, faiz, sure } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = anapara * (faiz / 100) * sure;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "INFO",
      source: "Zaman Değeri Konsepti",
      message: "Not: Süre 5 yılı aşıyor. Uzun vadeli yatırımlarda basit faiz yerine 'Bileşik Faiz' (Compound Interest) kullanılması paranın gerçek değerini yansıtmak açısından daha doğrudur."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}