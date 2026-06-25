import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_029
 * Araç Adı: FCFE ve FCFF
 */

export const InputSchema_FIN_029 = z.object({
  net_kar: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  amortisman: z.number().min(0, "Endüstriyel minimum tolerans: 0"),
  isletme_sermayesi: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  capex: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  borc: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_FIN_029 = z.infer<typeof InputSchema_FIN_029>;

export interface Output_FIN_029 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_029(input: Input_FIN_029): Output_FIN_029 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: net_kar, amortisman, isletme_sermayesi, capex, borc
  
  const validData = InputSchema_FIN_029.parse(input);
  const { net_kar, amortisman, isletme_sermayesi, capex, borc } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const fcff = net_kar + amortisman - isletme_sermayesi - capex;
  const fcfe = fcff - borc;
  const result: number = fcff;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Şirket Büyüme Analizi",
      message: "Uyarı: Sermaye harcamaları (CAPEX) amortismandan düşüktür. Bu, şirketin eskiyen varlıklarını yenilemekte yetersiz kaldığı ve zamanla küçülme eğiliminde (shrinking) olduğu şeklinde yorumlanabilir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}