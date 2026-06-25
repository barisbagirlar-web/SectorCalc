import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_018
 * Araç Adı: Hisse Senedi Getirisi
 */

export const InputSchema_FIN_018 = z.object({
  alis: z.number().min(0.01, "Endüstriyel minimum tolerans: 0.01"),
  satis: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  temettu: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_FIN_018 = z.infer<typeof InputSchema_FIN_018>;

export interface Output_FIN_018 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_018(input: Input_FIN_018): Output_FIN_018 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: alis, satis, temettu
  
  const validData = InputSchema_FIN_018.parse(input);
  const { alis, satis, temettu } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = ((satis - alis) + temettu) / Math.max(1, alis) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "INFO",
      source: "Portföy Analizi",
      message: "Durum: Sermaye zararı söz konusudur. Toplam getiri, alınan temettünün zararı ne kadar telafi ettiğine bağlıdır."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}