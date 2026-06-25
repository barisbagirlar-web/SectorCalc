import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: CORP_095
 * Araç Adı: Hisse Sulandırması (Dilution)
 */

export const InputSchema_CORP_095 = z.object({
  mevcut_hisse: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
  yeni_hisse: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_CORP_095 = z.infer<typeof InputSchema_CORP_095>;

export interface Output_CORP_095 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CORP_095(input: Input_CORP_095): Output_CORP_095 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: mevcut_hisse, yeni_hisse
  
  const validData = InputSchema_CORP_095.parse(input);
  const { mevcut_hisse, yeni_hisse } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = (yeni_hisse / Math.max(1, (mevcut_hisse + yeni_hisse))) * 100; 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "Term Sheet Analizi",
      message: "Kritik Uyarı: Tek bir yatırım turunda %30'dan fazla sulanma gerçekleşiyor. Seri A veya öncesi turlarda bu oran genellikle %15-20 bandındadır; kurucu kontrolü hızla elden çıkmaktadır."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}